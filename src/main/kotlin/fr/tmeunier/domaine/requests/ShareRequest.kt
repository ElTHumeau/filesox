package fr.tmeunier.domaine.requests

import fr.tmeunier.domaine.services.serializer.UUIDSerializer
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import java.util.UUID

@Serializable
data class DeleteShareRequest(
    @Serializable(with = UUIDSerializer::class)
    val id: UUID
)

@Serializable
data class CreateShareRequest(
    @Serializable(with = UUIDSerializer::class)
    @SerialName("storage_id") val storageId: UUID,
    val type: String,
    val password: String?,
    val duration: Int,
    @SerialName("type_duration") val typeDuration: String
)

@Serializable
data class CheckPasswordShareRequest(
    val password: String
)