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

    suspend fun createFolder(client: S3Client, nameObject: String) {
        client.putObject(PutObjectRequest {
            bucket = S3Config.bucketName
            key = "$nameObject/"
        })
    }

    suspend fun deleteFolder(client: S3Client, prefixBucket: String) {
        client.listObjectsV2Paginated {
            bucket = S3Config.bucketName
            prefix = prefixBucket
            maxKeys = 1000
        }.collect { res ->
            res.contents?.forEach {
                if (it.key != prefixBucket && it.key!!.endsWith("/")) {
                    deleteFolder(client, it.key!!)
                } else {
                    client.deleteObject(DeleteObjectRequest {
                        bucket = S3Config.bucketName
                        key = it.key!!
                    })
                }
            }
        }

        client.deleteObject(DeleteObjectRequest {
            bucket = S3Config.bucketName
            key = prefixBucket
        })
    }

    suspend fun move(client: S3Client, path: String, newPath: String) {
        client.copyObject(CopyObjectRequest {
            bucket = S3Config.bucketName
            key = newPath
            copySource = S3Config.bucketName + "/" + path
        })

        client.deleteObject(DeleteObjectRequest {
            bucket = S3Config.bucketName
            key = path
        })
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
                    val icon = StorageService.getIconForFile(content.key!!)
                    files.add(
                        S3File(
                            content.key!!,
                            content.size!!.toHumanReadableValue(),
                            icon,
                            if (icon == "file") "/images/${content.key!!}" else null
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

    suspend fun downloadFolder(client: S3Client, remotePath: String, localPath: String) {

        client.listObjectsV2Paginated {
            bucket = S3Config.bucketName
            delimiter = "/"
            prefix = remotePath
            maxKeys = 1000
        }.collect { res ->
            res.contents?.forEach { s3Object ->
                val key = s3Object.key!!
                val localFilePath = Paths.get(localPath, key.removePrefix(remotePath))

                if (key !== remotePath && key.endsWith("/")) {
                    if (!Files.exists(localFilePath)) {
                        Files.createDirectories(localFilePath)
                    }
                } else {
                    downloadFileMultipart(client, key, localFilePath.toString())
                }
            }
        }
    }
}

