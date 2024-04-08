package fr.tmeunier.domaine.models

import fr.tmeunier.domaine.services.PaginationModel
import kotlinx.serialization.Serializable
import java.time.LocalDateTime

data class User(
    val id: Int,
    val name: String,
    val email: String,
    val password: String,
    val filePath: String,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)

@Serializable
data class UsersResponse(
    val id: Int = 0,
    val name: String = "",
    val email: String = "",
) : PaginationModel {

    override fun toMap(): Map<String, Any> = mapOf(
        "id" to id,
        "name" to name,
        "email" to email,
    )
}

data class RefreshToken(val id: Int, val token: String, val userId: Int, val expiredAt: LocalDateTime)

@Serializable
data class RefreshTokenResponse(val token: String, val refreshToken: String)