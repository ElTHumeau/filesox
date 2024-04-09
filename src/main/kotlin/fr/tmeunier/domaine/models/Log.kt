package fr.tmeunier.domaine.models

import kotlinx.serialization.Serializable

@Serializable
data class LogsResponses(
    val id: Int,
    val action: String,
    val subject: String,
    val createdAt: String,
    val username: String? = null,
)
