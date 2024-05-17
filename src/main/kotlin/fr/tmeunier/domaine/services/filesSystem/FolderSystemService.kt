package fr.tmeunier.domaine.services.filesSystem

import aws.sdk.kotlin.services.s3.S3Client
import aws.sdk.kotlin.services.s3.model.*
import aws.sdk.kotlin.services.s3.paginators.listObjectsV2Paginated
import aws.smithy.kotlin.runtime.content.toFlow
import fr.tmeunier.config.S3Config
import fr.tmeunier.domaine.models.S3File
import fr.tmeunier.domaine.models.S3Folder
import fr.tmeunier.domaine.models.S3Response
import fr.tmeunier.domaine.services.filesSystem.StorageService.toHumanReadableValue
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.cancellable
import java.nio.file.Files
import java.nio.file.Paths

object FolderSystemService {


    suspend fun createFolder(client: S3Client, path: String) {
        client.putObject(PutObjectRequest {
            bucket = S3Config.bucketName
            key = "$path/"
        })
    }

    suspend fun deleteFolder(client: S3Client, data: String) {
        val folderName = data.substringAfterLast('/')
        val isFile = folderName.contains(".")

        if (isFile) {
            client.deleteObject(DeleteObjectRequest {
                bucket = S3Config.bucketName
                key = data
            })
        } else {
            // Delete the folder itself
            client.deleteObject(DeleteObjectRequest {
                bucket = S3Config.bucketName
                key = "$data/"
            })
        }
    }

    suspend fun listFoldersAndFiles(client: S3Client, currentPath: String): S3Response {
        val folders = mutableListOf<S3Folder>()
        val files = mutableListOf<S3File>()

        val path = if (currentPath == "./") "" else currentPath

        client.listObjectsV2Paginated {
            bucket = S3Config.bucketName
            delimiter = "/"
            prefix = path
            maxKeys = 1000
        }.collect { res ->
            res.commonPrefixes?.filter { it.prefix != null && it.prefix != path }?.forEach {
                folders.add(S3Folder(it.prefix!!))
            }

            res.contents?.filter { it.key != null && it.key != path }?.forEach { content ->
                if (content.key!!.endsWith("/")) {
                    folders.add(S3Folder(content.key!!))
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

    suspend fun downloadFileMultipart(client: S3Client, remotePath: String, localPath: String) {
        client.getObject(GetObjectRequest {
            key = remotePath
            bucket = S3Config.bucketName
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

