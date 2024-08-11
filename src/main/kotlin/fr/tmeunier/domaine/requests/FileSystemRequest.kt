package fr.tmeunier.domaine.requests

import fr.tmeunier.domaine.services.serializer.UUIDSerializer
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import java.util.UUID

@Serializable
data class Folder(
    @Serializable(with = UUIDSerializer::class)
    val id: UUID,
    val path: String
)

@Serializable
data class FolderCreateRequest(
    val path: String,
    val parent: String?
)

@Serializable
data class FolderMoveRequest(
    @Serializable(with = UUIDSerializer::class)
    val id: UUID,
    val path: String,
    @SerialName("new_path") val newPath: String
)

@Serializable
data class GetPathRequest(
    val path: String?
)

@Serializable
data class DownloadRequest(
    val path: String,
    @SerialName("is_folder") val isFolder: Boolean = false
)

// --- Uploads
@Serializable
data class InitialUpload(
    val filename: String,
    @SerialName("total_chunks") val totalChunks: Int
)

@Serializable
data class CompletedUpload(
    val filename: String,
    @SerialName("upload_id") val uploadId: String,
)