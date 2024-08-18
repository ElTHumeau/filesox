package fr.tmeunier.domaine.models

import fr.tmeunier.domaine.services.serializer.UUIDSerializer
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import java.time.LocalDateTime
import java.util.*


data class User(
    val id: Int,
    val name: String,
    val email: String,
    val password: String,
    val filePath: UUID?,
    val layout: Boolean,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)

@Serializable
data class UsersResponse(
    val id: Int = 0,
    val name: String,
    val email: String,
    @SerialName("created_at") val createdAt: String,
    @SerialName("file_path") val filePath: String?,
    val permissions: List<String> = emptyList()
)

@Serializable
data class UserWidthPermissionResponse(
    val id: Int,
    val name: String,
    val email: String,
    @Serializable(with = UUIDSerializer::class)
    @SerialName("file_path") val filePath: UUID?,
    val permissions: List<String> = emptyList()
)

data class RefreshToken(val id: Int, val token: String, val userId: Int, val expiredAt: LocalDateTime)

@Serializable
data class RefreshTokenResponse(
    val token: String,
    @SerialName("refresh_token") val refreshToken: String
)