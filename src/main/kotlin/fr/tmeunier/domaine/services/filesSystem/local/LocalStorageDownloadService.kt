package fr.tmeunier.domaine.services.filesSystem.local

import fr.tmeunier.domaine.repositories.FileRepository
import fr.tmeunier.domaine.repositories.FolderRepository
import fr.tmeunier.domaine.response.S3Folder
import fr.tmeunier.domaine.services.filesSystem.service.StorageService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.buffer
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.withContext
import java.io.ByteArrayOutputStream
import java.io.File
import java.nio.file.Files
import java.nio.file.Paths
import java.nio.file.StandardCopyOption
import java.util.*
import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream

object LocalStorageDownloadService {
    suspend fun copyToCache(path: String, cachePath: String) {
        withContext(Dispatchers.IO) {
            val sourceFile = Paths.get("storages/uploads/$path")
            val cacheFile = Paths.get(cachePath)

            Files.createDirectories(cacheFile.parent)
            Files.copy(sourceFile, cacheFile, StandardCopyOption.REPLACE_EXISTING)
        }
    }

    suspend fun downloadFileMultipart(call: ApplicationCall, id: String, file: String) {
        val filename = id + "." + StorageService.getExtension(file)
        val localFile = File("storages/uploads/$filename")

        if (!localFile.exists()) {
            call.respond(HttpStatusCode.NotFound, "Unable to find file")
            return
        }

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
            flow {
                localFile.inputStream().buffered(8192).use { input ->
                    val bytes = ByteArray(8192)
                    var bytesRead: Int
                    while (input.read(bytes).also { bytesRead = it } != -1) {
                        emit(bytes.copyOf(bytesRead))
                    }
                }
            }.buffer(100).collect { dataPart ->
                withContext(Dispatchers.IO) {
                    write(dataPart)
                    flush()
                }
            }
        }
    }

    suspend fun downloadFolderMultipart(call: ApplicationCall, id: UUID) {
        val rootFolder = FolderRepository.findById(id) ?: run {
            call.respond(HttpStatusCode.NotFound, "Unable to find folder")
            return
        }

        val zipFilename = "toto.zip"
        val baseStoragePath = "storages/uploads/"

        val byteArrayOutputStream = ByteArrayOutputStream()
        ZipOutputStream(byteArrayOutputStream).use { zipOutputStream ->

            suspend fun addFolderToZip(folder: S3Folder, parentPath: String = "") {
                val folderPath = if (parentPath.isEmpty()) "${folder.path}/" else "$parentPath${folder.path}/"
                val files = FileRepository.findAllByParentId(folder.id.toString())

                files.forEach { file ->
                    val zipEntry = ZipEntry("$folderPath${file.name}")
                    val localFile = File("$baseStoragePath${file.id}.${StorageService.getExtension(file.name)}")

                    if (localFile.exists()) {
                        zipEntry.size = localFile.length()
                        zipOutputStream.putNextEntry(zipEntry)

                        withContext(Dispatchers.IO) {
                            localFile.inputStream().use { input ->
                                input.copyTo(zipOutputStream, 8192)
                            }
                        }

                        zipOutputStream.closeEntry()
                    }
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