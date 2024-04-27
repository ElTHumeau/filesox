package fr.tmeunier.domaine.services.filesSystem

import aws.sdk.kotlin.runtime.auth.credentials.StaticCredentialsProvider
import aws.sdk.kotlin.services.s3.S3Client
import aws.sdk.kotlin.services.s3.model.DeleteObjectRequest
import aws.sdk.kotlin.services.s3.model.GetObjectRequest
import aws.sdk.kotlin.services.s3.model.ListObjectsV2Request
import aws.sdk.kotlin.services.s3.model.PutObjectRequest
import aws.sdk.kotlin.services.s3.paginators.listObjectsV2Paginated
import aws.smithy.kotlin.runtime.content.toFlow
import aws.smithy.kotlin.runtime.net.url.Url
import fr.tmeunier.domaine.models.S3File
import fr.tmeunier.domaine.models.S3Folder
import fr.tmeunier.domaine.models.S3Response
import fr.tmeunier.domaine.services.filesSystem.StorageService.toHumanReadableValue
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.cancellable
import kotlinx.coroutines.withContext
import java.nio.file.Files
import java.nio.file.Paths

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

    suspend fun createFolder(path: String) {
        client.putObject(PutObjectRequest {
            bucket = bucketName
            key = "$path/"
        })
    }

    suspend fun deleteFolder(data: String) {
        val folderName = data.substringAfterLast('/')
        val isFile = folderName.contains(".")

        if (isFile) {
            client.deleteObject(DeleteObjectRequest {
                bucket = bucketName
                key = "$data/"
            })
        } else {
            // Delete the folder itself
            client.deleteObject(DeleteObjectRequest {
                bucket = bucketName
                key = "$data/"
            })
        }
    }

    suspend fun listFoldersAndFiles(currentPath: String): S3Response{
        val folders = mutableListOf<S3Folder>()
        val files = mutableListOf<S3File>()

        client.listObjectsV2Paginated {
            bucket = bucketName
            delimiter = "/"
            prefix = currentPath
            maxKeys = 1000
        }.collect { res ->
            res.commonPrefixes?.filter { it.prefix != null && it.prefix != currentPath }?.forEach {
                folders.add(S3Folder(it.prefix!!.replace("/", "")))
            }

            res.contents?.filter { it.key != null && it.key != currentPath }?.forEach { content ->
                if (content.key!!.endsWith("/")) {
                    folders.add(S3Folder(content.key!!.replace("/", "")))
                } else {
                    files.add(
                        S3File(
                            content.key!!,
                            content.size!!.toHumanReadableValue(),
                            StorageService.getIconForFile(content.key!!),
                            "/images/${content.key!!}"
                        )
                    )
                }
            }
        }

        return S3Response(folders, files)
    }

    suspend fun downloadFileMultipart(remotePath: String, localPath: String) {
        client.getObject(GetObjectRequest {
            key = remotePath
            bucket = bucketName
        }) {
            println(Paths.get(localPath).parent)
            Files.createDirectories(Paths.get(localPath).parent)

            val writer = withContext(Dispatchers.IO) {
                Paths.get(localPath).toFile().outputStream()
            }

            withContext(Dispatchers.IO) {
                it.body?.toFlow(65_536)?.cancellable()?.collect { dataPart ->
                    withContext(Dispatchers.IO) { writer.write(dataPart) }
                }
            }

            writer.close()
        }
    }
}

