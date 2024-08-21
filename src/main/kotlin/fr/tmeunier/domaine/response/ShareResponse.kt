package fr.tmeunier.domaine.response

import fr.tmeunier.domaine.services.serializer.UUIDSerializer
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import java.util.*

@Serializable
data class AdminSharesResponse(
    @Serializable(with = UUIDSerializer::class)
    val id: UUID,
    val path: String,
    val username: String,
    @SerialName("expired_at") val expiredAt: String,
    @SerialName("created_at") val createdAt: String
)

@Serializable
data class ShareShowResponse(
    @Serializable(with = UUIDSerializer::class)
    val id: UUID,
    @SerialName("expired_at") val expiredAt: String,
    @SerialName("created_at") val createdAt: String
)

@Serializable
data class ProfileSharesResponse(
    @Serializable(with = UUIDSerializer::class)
    val id: UUID,
    val path: String,
    @SerialName("expired_at") val expiredAt: String,
    @SerialName("created_at") val createdAt: String
)