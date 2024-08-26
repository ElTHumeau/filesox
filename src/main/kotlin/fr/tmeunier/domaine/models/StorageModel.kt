package fr.tmeunier.domaine.models

import java.util.UUID

data class FolderModel(
    val id: UUID,
    val path: String,
)

data class ShareModel(
    val id: UUID,
    val storageId: UUID,
    val type: String,
    val password: String?,
    val expiredAt: java.time.LocalDateTime,
)