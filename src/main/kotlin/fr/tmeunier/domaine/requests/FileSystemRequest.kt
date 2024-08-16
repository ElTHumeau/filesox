package fr.tmeunier.domaine.requests

import fr.tmeunier.domaine.services.serializer.UUIDSerializer
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import org.h2.util.DateTimeUtils
import java.util.UUID

// --- Storage
@Serializable
data class GetStorageByPathRequest(
    val path : String
)

@Serializable
data class UpdateStorageRequest(
    @Serializable(with = UUIDSerializer::class)
    val id: UUID,
    val name: String,
    @SerialName("new_name") val newName: String,
    @Serializable(with = UUIDSerializer::class)
    @SerialName("parent_id") val parentId: UUID?
)

@Serializable
data class MoveStorageRequest(
    @Serializable(with = UUIDSerializer::class)
    val id: UUID,
    val path: String,
    @SerialName("new_path") val newPath: String,
    @SerialName("is_folder") val isFolder: Boolean = false
)

@Serializable
data class DeleteStorageRequest(
    @Serializable(with = UUIDSerializer::class)
    val id: UUID,
    @SerialName("is_folder") val isFolder: Boolean = false
)

// -- Folders

@Serializable
data class Folder(
    @Serializable(with = UUIDSerializer::class)
    val id: UUID,
    val path: String
)

@Serializable
data class FolderCreateRequest(
    val path: String,
    @Serializable(with = UUIDSerializer::class)
    @SerialName("parent_id") val parentId: UUID?
)

@Serializable
data class DownloadRequest(
    val path: String,
    @SerialName("is_folder") val isFolder: Boolean = false
)

// --- Uploads
@Serializable
data class InitialUploadRequest(
    val name: String,
    val size: Long,
    val type: String,
    @SerialName("last_modified") val lastModified: Long,
    @SerialName("web_relative_path") val webRelativePath: String?,
    @Serializable(with = UUIDSerializer::class)
    @SerialName("parent_id") val parentId: UUID?,
    @SerialName("total_chunks") val totalChunks: Int
)

@Serializable
data class CompletedUpload(
    val filename: String,
    @SerialName("upload_id") val uploadId: String,
)