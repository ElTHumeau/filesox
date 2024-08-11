package fr.tmeunier.domaine.services.filesSystem

import aws.sdk.kotlin.services.s3.S3Client
import aws.sdk.kotlin.services.s3.createMultipartUpload
import aws.sdk.kotlin.services.s3.express.sigV4S3Express
import aws.sdk.kotlin.services.s3.model.*
import aws.sdk.kotlin.services.s3.paginators.listObjectsV2Paginated
import aws.smithy.kotlin.runtime.content.ByteStream
import aws.smithy.kotlin.runtime.content.toFlow
import fr.tmeunier.config.S3Config
import fr.tmeunier.domaine.models.*
import fr.tmeunier.domaine.repositories.StorageRepository
import fr.tmeunier.domaine.services.filesSystem.StorageService.toHumanReadableValue
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.cancellable
import java.nio.file.Files
import java.nio.file.Paths

object FolderSystemService {

    val uploads = mutableMapOf<String, MutableList<CompletedPart>>()

    suspend fun createFolder(client: S3Client, nameObject: String) {
        try {
            client.putObject(PutObjectRequest {
                bucket = S3Config.bucketName
                key = "$nameObject/"
            })
        } catch (e: S3Exception) {
            println("Error creating folder: ${e.message}")
        }
    }

    suspend fun deleteFolder(client: S3Client, prefixBucket: String) {
        try {
            val objects = mutableListOf<S3Resource>()

            StorageRepository.findAllByFolder(prefixBucket).forEach {
                objects.add(S3Resource(it.path, "storage", it.name, null, it.id, null, null))
            }

            objects.asReversed().forEach { it ->
                StorageRepository.delete(it.id!!)

                client.deleteObject(DeleteObjectRequest {
                    bucket = S3Config.bucketName
                    key = it.path
                })
            }
        } catch (e: Exception) {
            println("Error deleting folder ${e.message}")
        }
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

    suspend fun listAll(client: S3Client, path: String ): List<S3Resource> {
        return listAllRecursive(client, "")
    }

    private suspend fun listAllRecursive(client: S3Client, path: String): List<S3Resource> {
        val storages = mutableListOf<S3Resource>()

        client.listObjectsV2Paginated {
            bucket = S3Config.bucketName
            prefix = path
            delimiter = "/"
        }.collect { res ->
            res.commonPrefixes?.forEach { commonPrefix ->
                if (commonPrefix.prefix != null && commonPrefix.prefix != path) {
                    val folderName = commonPrefix.prefix!!.removeSuffix("/").split('/').last()
                    storages.add(
                        S3Resource(
                            path = commonPrefix.prefix!!,
                            type = "folder",
                            name = commonPrefix.prefix!!.split('/').last(),
                            parent = StorageService.getParentPath(commonPrefix.prefix!!, true),
                            icon = null,
                            size = null,
                            id = null
                        )
                    )

                    storages.addAll(listAllRecursive(client, commonPrefix.prefix!!))
                }
            }

            res.contents
                ?.filter { it.key != null && it.key != path }
                ?.forEach { content ->
                    if (content.key!!.endsWith("/")) {
                        storages.add(
                            S3Resource(
                                path = content.key!!,
                                type = "folder",
                                name = content.key!!.split('/').last(),
                                parent = StorageService.getParentPath(content.key!!, true),
                                icon = null,
                                size = null,
                                id = null
                            )
                        )
                    } else {
                        storages.add(
                            S3Resource(
                                path = content.key!!,
                                type = "storage",
                                name = content.key!!.split('/').last(),
                                parent = StorageService.getParentPath(content.key!!, false),
                                icon = StorageService.getIconForFile(content.key!!),
                                size = content.size?.toHumanReadableValue(),
                                id = null
                            )
                        )
                    }
                }
        }

        return storages.reversed()
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

    suspend fun initiateMultipartUpload(client: S3Client, key: String): String? {
        val multipartRes = client.createMultipartUpload {
            checksumAlgorithm = ChecksumAlgorithm.Sha256
            bucket = S3Config.bucketName
            this.key = key
        }

        uploads[multipartRes.uploadId!!] = mutableListOf()

        return multipartRes.uploadId
    }

    suspend fun uploadMultipart(
        client: S3Client, key: String, uploadId: String?, chunkNumber: Int, fileBytes: ByteArray?, totalChunks: Int
    ): String? {
        try {
            val part = client.uploadPart(UploadPartRequest {
                bucket = S3Config.bucketName
                this.key = key
                this.uploadId = uploadId
                partNumber = chunkNumber
                body = ByteStream.fromBytes(fileBytes!!)
            }).let {
                CompletedPart {
                    checksumSha256 = it.checksumSha256
                    partNumber = chunkNumber
                    eTag = it.eTag
                }
            }

            uploads[uploadId!!]?.add(part)

        } catch (e: S3Exception) {
            println("Error uploading file: ${e.message}")
        }

        return uploadId
    }

    suspend fun completeMultipartUpload(client: S3Client, remotePath: String, uplId: String?) {
        client.completeMultipartUpload(CompleteMultipartUploadRequest {
            bucket = S3Config.bucketName
            this.key = remotePath
            this.uploadId = uplId
            multipartUpload = CompletedMultipartUpload {
                parts = uploads[uplId!!]
                bucket = S3Config.bucketName
                key = remotePath
                uploadId = uplId
            }
        }).also { uploads.remove(uplId) }
    }
}