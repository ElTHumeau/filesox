package fr.tmeunier.domaine.services.filesSystem.s3

import aws.sdk.kotlin.services.s3.S3Client
import aws.sdk.kotlin.services.s3.model.CopyObjectRequest
import aws.sdk.kotlin.services.s3.model.DeleteObjectRequest
import aws.sdk.kotlin.services.s3.paginators.listObjectsV2Paginated
import fr.tmeunier.config.S3Config
import fr.tmeunier.domaine.models.S3Folder
import fr.tmeunier.domaine.repositories.FileRepository
import fr.tmeunier.domaine.repositories.FolderRepository
import fr.tmeunier.domaine.services.filesSystem.StorageService
import fr.tmeunier.domaine.services.filesSystem.StorageService.toHumanReadableValue
import java.util.*

object SyncS3ToDatabaseService {

    suspend fun syncS3(client: S3Client, path: String, parentId: UUID?) {
        listAllRecursive(client, "", parentId)
    }

    private suspend fun listAllRecursive(client: S3Client, path: String, parentId: UUID?) {
        val storages = mutableListOf<S3Folder>()

        client.listObjectsV2Paginated {
            bucket = S3Config.bucketName
            prefix = path
            delimiter = "/"
        }.collect { res ->
            res.commonPrefixes?.forEach { commonPrefix ->
                if (commonPrefix.prefix != null && commonPrefix.prefix != path) {
                    val uuid = FolderRepository.create(commonPrefix.prefix!!, parentId)
                    storages.add(S3Folder(commonPrefix.prefix!!))
                    listAllRecursive(client, commonPrefix.prefix!!, uuid)
                }
            }

            res.contents
                ?.filter { it.key != null && it.key != path }
                ?.forEach { content ->
                    if (content.key!!.endsWith("/")) {
                        FolderRepository.create(content.key!!, parentId)
                    } else {
                        val fileUUID = FileRepository.create(
                            name = content.key!!.split('/').last(),
                            size = content.size!!.toHumanReadableValue(),
                            icon = StorageService.getIconForFile(content.key!!),
                            parentId = parentId
                        )

                        client.copyObject(CopyObjectRequest {
                            bucket = S3Config.bucketName
                            key = fileUUID.toString()
                            copySource = S3Config.bucketName + "/" + content.key!!.split('/').last()
                        })

                        client.deleteObject(DeleteObjectRequest {
                            bucket = S3Config.bucketName
                            key = content.key!!.split('/').last()
                        })
                    }
                }
        }

        storages.reversed().forEach { it ->
            client.deleteObject(DeleteObjectRequest {
                bucket = S3Config.bucketName
                key = it.path
            })
        }
    }
}