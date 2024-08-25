package fr.tmeunier.domaine.services.filesSystem.s3

import aws.sdk.kotlin.services.s3.S3Client
import aws.sdk.kotlin.services.s3.model.GetObjectRequest
import aws.smithy.kotlin.runtime.content.toFlow
import fr.tmeunier.config.S3Config
import fr.tmeunier.domaine.models.FolderModel
import fr.tmeunier.domaine.repositories.FileRepository
import fr.tmeunier.domaine.repositories.FolderRepository
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

    suspend fun downloadFolder(call: ApplicationCall, client: S3Client, id: UUID, file: String) {
        val rootFolder = FolderRepository.findById(id) ?: run {
            call.respond(HttpStatusCode.NotFound, "Dossier non trouvé")
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
                    val buffer = ByteArray(8192)
                    val byteArrayOutputStream = ByteArrayOutputStream()
                    val zipOutputStream = ZipOutputStream(byteArrayOutputStream)

                    suspend fun addFolderToZip(folder: FolderModel, parentPath: String = "") {
                        val folderPath = if (parentPath.isEmpty()) folder.path + "/" else "$parentPath${folder.path}/"

                        val files = FileRepository.findAllByParentId(folder.id.toString())

                        files.forEach { file ->
                            val zipEntry = ZipEntry("$folderPath${file.name}")
                            zipOutputStream.putNextEntry(zipEntry)

                            val getObjectRequest = GetObjectRequest.builder()
                                .bucket(S3Config.bucketName)
                                .key(file.id)
                                .build()

                            client.getObject(getObjectRequest) { response ->
                                response.body?.use { inputStream ->
                                    var bytesRead: Int
                                    while (inputStream.read(buffer).also { bytesRead = it } != -1) {
                                        zipOutputStream.write(buffer, 0, bytesRead)

                                        if (byteArrayOutputStream.size() > 1024 * 1024) { // 1MB buffer
                                            channel.send(byteArrayOutputStream.toByteArray())
                                            byteArrayOutputStream.reset()
                                        }
                                    }
                                }
                            }
                            zipOutputStream.closeEntry()
                        }

                        val subFolders = dataService.getSubFolders(folder.id)
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