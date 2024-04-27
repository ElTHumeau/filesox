package fr.tmeunier.domaine.models

import kotlinx.serialization.Serializable

@Serializable
data class S3Folder(
    val name: String,
)

@Serializable
data class S3File(
    val name: String,
    val size: String,
    val icon: String,
    val image : String,
)

@Serializable
data class S3Response(
    val folders: List<S3Folder>,
    val files: List<S3File>,
)