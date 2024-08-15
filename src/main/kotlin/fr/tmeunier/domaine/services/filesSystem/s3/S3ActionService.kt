package fr.tmeunier.domaine.services.filesSystem.s3

import aws.sdk.kotlin.services.s3.S3Client
import aws.sdk.kotlin.services.s3.model.DeleteObjectRequest
import fr.tmeunier.config.S3Config

object S3ActionService {

    suspend fun delete(client: S3Client, path: String) {
        client.deleteObject(DeleteObjectRequest {
            bucket = S3Config.bucketName
            key = path
        })
    }
}