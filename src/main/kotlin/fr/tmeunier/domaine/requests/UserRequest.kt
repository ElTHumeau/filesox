package fr.tmeunier.domaine.requests

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

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
    @SerialName("file_path") val filePath: String,
    val layout: Boolean?,
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
