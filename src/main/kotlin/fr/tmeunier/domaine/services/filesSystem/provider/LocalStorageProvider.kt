package fr.tmeunier.domaine.services.filesSystem.provider

import fr.tmeunier.domaine.services.filesSystem.FileSystemInterface
import fr.tmeunier.domaine.services.filesSystem.local.LocalStorageUploadService
import java.nio.file.Paths

class LocalStorageProvider: FileSystemInterface {

    override suspend fun delete(path: String) {
        val file = Paths.get(path).toFile()

        if (file.exists()) {
            file.delete()
        }
    }

    override suspend fun download(path: String): ByteArray? {
        TODO("Not yet implemented")
    }

    override suspend fun downloadMultipart(path: String, id: String): ByteArray? {
        TODO("Not yet implemented")
    }

    override suspend fun initMultipart(path: String): String {
        return LocalStorageUploadService.initMultipart(path)
    }

    override suspend fun uploadMultipart(
        key: String,
        uploadId: String?,
        chunkNumber: Int,
        fileBytes: ByteArray?,
        totalChunks: Int
    ): String? {
        LocalStorageUploadService.uploadMultipart(
            key,
            uploadId,
            chunkNumber,
            fileBytes,
            totalChunks
        )
    }

    override suspend fun closeMultiPart(remotePath: String, uplId: String?) {
        LocalStorageUploadService.closeMultiPart(uplId!!)
    }


}