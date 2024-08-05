package fr.tmeunier.domaine.models

import java.util.UUID

data class Storage(
    val id: UUID,
    val path: String,
    val type: String,
    val updatedAt: String,
    val name: String?,
    val size: String?,
)