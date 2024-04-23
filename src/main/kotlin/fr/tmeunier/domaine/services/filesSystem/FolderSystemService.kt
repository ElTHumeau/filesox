package fr.tmeunier.domaine.services.filesSystem

import aws.sdk.kotlin.runtime.auth.credentials.StaticCredentialsProvider
import aws.sdk.kotlin.services.s3.S3Client
import aws.sdk.kotlin.services.s3.model.DeleteObjectRequest
import aws.sdk.kotlin.services.s3.model.PutObjectRequest
import aws.sdk.kotlin.services.s3.paginators.listObjectsV2Paginated
import aws.smithy.kotlin.runtime.net.url.Url
import fr.tmeunier.domaine.models.S3File
import fr.tmeunier.domaine.models.S3Folder
import java.text.StringCharacterIterator

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

    suspend fun deleteFolder(folder: String) {
        client.deleteObject(DeleteObjectRequest {
            bucket = bucketName
            key = "$folder/"
        })
    }

    suspend fun listFoldersAndFiles(currentPath: String): Pair<List<S3Folder>, List<S3File>> {
        val folders = mutableListOf<S3Folder>()
        val files = mutableListOf<S3File>()

        client.listObjectsV2Paginated {
            bucket = bucketName
            delimiter = "/"
            prefix = currentPath
            maxKeys = 1000
        }.collect { res ->
            println("Received response: $res")

            res.commonPrefixes?.filter { it.prefix != null && it.prefix != currentPath }?.forEach {
                folders.add(S3Folder(it.prefix!!))
            }

            res.contents?.filter { it.key != null && it.key != currentPath }?.forEach { content ->
                if (content.key!!.endsWith("/")) {
                    folders.add(S3Folder(content.key!!))
                } else {
                    files.add(
                        S3File(
                            content.key!!,
                            content.size!!.toHumanReadableValue(),
                            "https://s3.lfremaux.fr/$bucketName/${content.key}"
                        )
                    )
                }
            }

            println("Folders: $folders")
            println("Files: $files")
        }

        return Pair(folders, files)
    }
}

fun Long.toHumanReadableValue(): String {
    var bytes = this
    if (-1000 < bytes && bytes < 1000) {
        return "${bytes}B";
    }
    val ci = StringCharacterIterator("kMGTPE");
    while (bytes <= -999_950 || bytes >= 999_950) {
        bytes /= 1000
        ci.next()
    }
    return String.format("%.2f %cB", bytes / 1000.0, ci.current())
}