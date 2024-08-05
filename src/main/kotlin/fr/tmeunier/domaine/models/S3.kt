package fr.tmeunier.domaine.models

import kotlinx.serialization.Serializable
import java.util.UUID

@Serializable
data class S3Folder(
    val name: String,
)

data class S3Resource(
    val path: String,
    val type: String,
    val name: String?,
    val parent: String?,
    val id: UUID?,
    val icon: String?,
    val size: String?,
)

@Serializable
data class S3File(
    val name: String,
    val size: String,
    val icon: String,
    val image : String? = null,
)

@Serializable
data class S3Response(
    val folders: List<S3Folder>,
    val files: List<S3File>,
)