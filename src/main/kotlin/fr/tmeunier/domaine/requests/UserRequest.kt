package fr.tmeunier.domaine.requests

import fr.tmeunier.domaine.services.serializer.UUIDSerializer
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import java.util.UUID

@Serializable
data class UserRequest(
    val id: Int,
    val name: String,
    val email: String,
    val password: String
)

@Serializable
data class UserLoginRequest(
    val email: String,
    val password: String
)

@Serializable
data class UserRegisterRequest(
    val name: String,
    val email: String,
    val password: String,
    @SerialName("file_path") val filePath: String? = null,
    val permissions: Array<Int>? = null
)

@Serializable
data class AdminUserRequest(
    val id: Int? = null,
    val name: String,
    val email: String,
    @Serializable(with = UUIDSerializer::class)
    @SerialName("file_path") val filePath: UUID? = null,
    val layout: Boolean? = false,
    val permissions: Array<Int>,
    val password: String? = null
)

@Serializable
data class UserUpdateRequest(
    val name: String,
    val email: String,
    val layout: Boolean?
)

@Serializable
data class UserUpdatePasswordRequest(
    val password: String,
    @SerialName("confirm_password") val confirmPassword: String,
)
