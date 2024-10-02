package fr.tmeunier.domaine.services.filesSystem.provider

import aws.sdk.kotlin.services.s3.model.DeleteObjectRequest
import fr.tmeunier.config.S3Config
import fr.tmeunier.domaine.services.filesSystem.FileSystemInterface
import fr.tmeunier.domaine.services.filesSystem.s3.S3UploadService

object S3StorageProvider: FileSystemInterface {

    override suspend fun delete(path: String) {
        val client = S3Config.makeClient()

        client?.deleteObject(DeleteObjectRequest {
            bucket = S3Config.bucketName
            key = path
        })
    }

    override suspend fun download(path: String): ByteArray? {
        TODO("Not yet implemented")
    }

    override suspend fun downloadMultipart(path: String, id: String): ByteArray? {
        TODO("Not yet implemented")
    }

    override suspend fun initMultipart(path: String): String? {
       return S3Config.makeClient()?.let {
           S3UploadService.initiateMultipartUpload(it, path)
       }
    }

    override suspend fun uploadMultipart(key: String, uploadId: String?, chunkNumber: Int, fileBytes: ByteArray?, totalChunks: Int): String? {
        return S3Config.makeClient()?.let {
            S3UploadService.uploadMultipart(it, key, uploadId, chunkNumber, fileBytes, totalChunks)
        }
    }

    override suspend fun closeMultiPart(remotePath: String, uplId: String?) {
      S3Config.makeClient()?.let {
          S3UploadService.completeMultipartUpload(it, remotePath, uplId)
      }
    }
}