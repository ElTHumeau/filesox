package fr.tmeunier.domaine.services.filesSystem.s3

import aws.sdk.kotlin.services.s3.S3Client
import aws.sdk.kotlin.services.s3.model.GetObjectRequest
import aws.smithy.kotlin.runtime.content.toFlow
import fr.tmeunier.config.S3Config
import fr.tmeunier.domaine.repositories.FileRepository
import fr.tmeunier.domaine.repositories.FolderRepository
import fr.tmeunier.domaine.response.S3Folder
import fr.tmeunier.domaine.services.filesSystem.StorageService
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

    suspend fun downloadFile(call: ApplicationCall, client: S3Client, id: String, file: String) {
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

    suspend fun downloadFolder(call: ApplicationCall, client: S3Client, id: UUID) {
        val rootFolder = FolderRepository.findById(id) ?: run {
            call.respond(HttpStatusCode.NotFound, "Unable to find folder")
            return
        }

        val zipFilename = "${rootFolder.path}.zip"

        call.response.header(
            HttpHeaders.ContentDisposition,
            ContentDisposition.Attachment.withParameter(
                ContentDisposition.Parameters.FileName, zipFilename
            ).toString()
        )
        call.response.header(HttpHeaders.CacheControl, "no-cache, no-store, must-revalidate")
        call.response.header(HttpHeaders.Pragma, "no-cache")
        call.response.header(HttpHeaders.Expires, "0")

        call.respondOutputStream(ContentType.Application.Zip) {
            coroutineScope {
                val channel = Channel<ByteArray>(Channel.UNLIMITED)
                val zipJob = launch {
                    val byteArrayOutputStream = ByteArrayOutputStream()
                    val zipOutputStream = ZipOutputStream(byteArrayOutputStream)
                    zipOutputStream.setLevel(Deflater.NO_COMPRESSION) // Désactive la compression pour les gros fichiers

                    suspend fun addFolderToZip(folder: S3Folder, parentPath: String = "") {
                        val folderPath = if (parentPath.isEmpty()) folder.path + "/" else "$parentPath${folder.path}/"
                        val files = FileRepository.findAllByParentId(folder.id.toString())

                        files.forEach { file ->
                            val zipEntry = ZipEntry("$folderPath${file.name}")
                            zipEntry.size = file.size.toLong() // Définit la taille du fichier à l'avance
                            zipOutputStream.putNextEntry(zipEntry)

                            client.getObject(GetObjectRequest {
                                key = file.id.toString() + "." + StorageService.getExtension(file.name)
                                bucket = S3Config.bucketName
                            }) { response ->
                                response.body?.toFlow(8192)?.buffer(100)?.collect { dataPart ->
                                    withContext(Dispatchers.IO) {
                                        zipOutputStream.write(dataPart)
                                        zipOutputStream.flush()
                                    }
                                }
                            }

                            zipOutputStream.closeEntry()

                            // Vide le buffer après chaque fichier
                            if (byteArrayOutputStream.size() > 0) {
                                channel.send(byteArrayOutputStream.toByteArray())
                                byteArrayOutputStream.reset()
                            }
                        }

                        val subFolders = FolderRepository.findByIdOrParentId(folder.id.toString())
                        subFolders.forEach { subFolder ->
                            addFolderToZip(subFolder, folderPath)
                        }
                    }

                    addFolderToZip(rootFolder)
                    zipOutputStream.close()

                    if (byteArrayOutputStream.size() > 0) {
                        channel.send(byteArrayOutputStream.toByteArray())
                    }
                    channel.close()
                }

                val writeJob = launch {
                    for (chunk in channel) {
                        withContext(Dispatchers.IO) {
                            write(chunk)
                            flush()
                        }
                    }
                }

                zipJob.join()
                writeJob.join()
            }
        }
    }
}