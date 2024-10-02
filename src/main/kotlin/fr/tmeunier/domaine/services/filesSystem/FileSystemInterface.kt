package fr.tmeunier.domaine.services.filesSystem

import io.ktor.http.content.*

interface FileSystemInterface
{
    suspend fun delete(path: String)

    suspend fun download(path: String): ByteArray?

    suspend fun downloadMultipart(path: String, id: String): ByteArray?

    suspend fun initMultipart(path: String): String?

    suspend fun uploadMultipart(key: String, uploadId: String?, chunkNumber: Int, fileBytes: ByteArray?, totalChunks: Int): String?

    suspend fun closeMultiPart(remotePath: String, uplId: String?)
}