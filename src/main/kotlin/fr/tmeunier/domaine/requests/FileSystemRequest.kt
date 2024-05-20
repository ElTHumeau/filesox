package fr.tmeunier.domaine.requests

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class Folder(
    val path: String
)

@Serializable
data class FolderMoveRequest(
    val path: String,
    @SerialName("new_path") val newPath: String
)

@Serializable
data class GetPathRequest(
    val path: String? = ""
)

@Serializable
data class DownloadRequest(
    val path: String,
    @SerialName("is_folder") val isFolder: Boolean = false
)