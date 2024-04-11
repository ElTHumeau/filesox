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