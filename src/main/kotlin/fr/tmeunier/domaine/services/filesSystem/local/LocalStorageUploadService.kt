package fr.tmeunier.domaine.services.filesSystem.local

import io.ktor.http.content.*
import java.io.File
import java.nio.file.Files
import java.nio.file.Paths
import java.util.*

object LocalStorageUploadService {

    private val uploads = mutableMapOf<String, MutableList<File>>()
    private val uploadDir = Paths.get("storages").toFile()

    fun initMultipart(path: String): String {
        val id = UUID.randomUUID().toString()
        uploads[id] = mutableListOf()

        return id
    }

    fun uploadMultipart(id: String, part: PartData.FileItem): Boolean {
        val uploadList = uploads[id] ?: return false
        val fileName = part.originalFileName ?: "unnamed-${System.currentTimeMillis()}"
        val file = File("$uploadDir$fileName")

        part.streamProvider().use { input ->
            file.outputStream().buffered().use { output ->
                input.copyTo(output)
            }
        }

        uploadList.add(file)

        return true
    }

    fun closeMultiPart(id: String): List<String>? {
        val uploadList = uploads[id] ?: return null

        val fileNames = uploadList.map { it.name }
        uploads.remove(id)

        return fileNames
    }
}