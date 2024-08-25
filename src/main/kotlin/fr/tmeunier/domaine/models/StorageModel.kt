package fr.tmeunier.domaine.models

import java.util.UUID

data class FolderModel(
    val id: UUID,
    val path: String,
)