package fr.tmeunier.domaine.services.filesSystem

import aws.sdk.kotlin.runtime.auth.credentials.StaticCredentialsProvider
import aws.sdk.kotlin.services.s3.S3Client
import aws.sdk.kotlin.services.s3.model.CopyObjectRequest
import aws.sdk.kotlin.services.s3.model.DeleteObjectRequest
import aws.sdk.kotlin.services.s3.model.PutObjectRequest
import aws.sdk.kotlin.services.s3.model.S3Exception
import aws.smithy.kotlin.runtime.net.url.Url

object FolderSystemService {

    private const val bucketName = "filetransfer-tmeunier"

    val client = S3Client.builder().apply {
        config.apply {
            region = "eu-west-1"
            endpointUrl = Url.parse("https://s3.lfremaux.fr")
            forcePathStyle = true
            credentialsProvider = StaticCredentialsProvider.Builder().apply {
                accessKeyId = "filetransfer-tmeunier"
                secretAccessKey = "3JNqy4b4ZunaZynBUZY3ZXT2JDHg4ogFKnd5j77B"
            }.build()
        }
    }.build()


    suspend fun listFolder(path: String) {}

    suspend fun createFolder(path: String) {
        client.putObject(PutObjectRequest {
            bucket = bucketName
            key = "$path/"
        })
    }

    suspend fun renameFolder(path: String, newName: String) {
        try {
            val sourceKey = if (path.endsWith("/")) path else "$path/"
            val destinationKey = if (newName.endsWith("/")) newName else "$newName/"

            client.copyObject(CopyObjectRequest {
                bucket = bucketName
                key = destinationKey
                copySource = sourceKey
            })
        } catch (e: S3Exception) {
            println("Une erreur s'est produite lors de la copie de l'objet : ${e.message}")
        }
    }

    suspend fun moveFolder(path: String, destinationPath: String) {
        client.copyObject(CopyObjectRequest {
            bucket = bucketName
            key = "$destinationPath/"
            copySource = "$bucketName/$path/"
        })

        deleteFolder(path)
    }

    suspend fun downloadFolder(path: String) {
        //
    }

    suspend fun deleteFolder(folder: String) {
        client.deleteObject(DeleteObjectRequest {
            bucket = bucketName
            key = "$folder/"
        })
    }
}