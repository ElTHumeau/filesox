package fr.tmeunier.domaine.services.filesSystem.s3

import aws.sdk.kotlin.services.s3.S3Client
import aws.sdk.kotlin.services.s3.model.GetObjectRequest
import aws.smithy.kotlin.runtime.content.toFlow
import fr.tmeunier.config.S3Config
import fr.tmeunier.domaine.repositories.FileRepository
import fr.tmeunier.domaine.repositories.FolderRepository
import fr.tmeunier.domaine.response.S3Folder
import fr.tmeunier.domaine.services.filesSystem.StorageService
import fr.tmeunier.domaine.services.filesSystem.StorageService.toHumanReadableValue
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.flow.buffer
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.io.ByteArrayOutputStream
import java.util.UUID
import java.util.zip.Deflater
import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream

object S3DownloadService {

    suspend fun downloadFileMultipart(call: ApplicationCall, client: S3Client, id: String, file: String) {
        val filename = id + "." + StorageService.getExtension(file)

        call.response.header(
            HttpHeaders.ContentDisposition,
            ContentDisposition.Attachment.withParameter(
                ContentDisposition.Parameters.FileName, filename
            ).toString()
        )
        call.response.header(HttpHeaders.CacheControl, "no-cache, no-store, must-revalidate")
        call.response.header(HttpHeaders.Pragma, "no-cache")
        call.response.header(HttpHeaders.Expires, "0")

        call.respondOutputStream(ContentType.Application.OctetStream) {
            client.getObject(GetObjectRequest {
                key = filename
                bucket = S3Config.bucketName
            }) { response ->
                response.body?.toFlow(8192)?.buffer(100)?.collect { dataPart ->
                    withContext(Dispatchers.IO) {
                        write(dataPart)
                        flush()
                    }
                }
            }
        }
    }

    suspend fun downloadFolderMultipart(call: ApplicationCall, client: S3Client, id: UUID) {
        val rootFolder = FolderRepository.findById(id) ?: run {
            call.respond(HttpStatusCode.NotFound, "Unable to find folder")
            return
        }

        val zipFilename = "toto.zip"

        val byteArrayOutputStream = ByteArrayOutputStream()
        ZipOutputStream(byteArrayOutputStream).use { zipOutputStream ->
            suspend fun addFolderToZip(folder: S3Folder, parentPath: String = "") {
                val folderPath = if (parentPath.isEmpty()) "${folder.path}/" else "$parentPath${folder.path}/"
                val files = FileRepository.findAllByParentId(folder.id.toString())

                files.forEach { file ->
                    val zipEntry = ZipEntry("$folderPath${file.name}")
                    val parsedSize = StorageService.parseFileSize(file.size)

                    if (parsedSize >= 0) {
                        zipEntry.size = parsedSize
                    }

                    zipOutputStream.putNextEntry(zipEntry)

                    client.getObject(GetObjectRequest {
                        key = file.id.toString() + "." + StorageService.getExtension(file.name)
                        bucket = S3Config.bucketName
                    }) { response ->
                        response.body?.toFlow(8192)?.buffer(100)?.collect { dataPart ->
                            withContext(Dispatchers.IO) {
                                zipOutputStream.write(dataPart)
                            }
                        }
                    }

                    zipOutputStream.closeEntry()
                }

                val subFolders = FolderRepository.findByIdOrParentId(folder.id.toString())
                subFolders.forEach { subFolder ->
                    addFolderToZip(subFolder, folderPath)
                }
            }

            addFolderToZip(rootFolder)
        }

        val zipBytes = byteArrayOutputStream.toByteArray()

        call.response.header(
            HttpHeaders.ContentDisposition,
            ContentDisposition.Attachment.withParameter(ContentDisposition.Parameters.FileName, zipFilename).toString()
        )
        call.respondBytes(zipBytes, ContentType.Application.Zip)
    }
}