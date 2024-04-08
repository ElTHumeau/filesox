package fr.tmeunier.domaine.requests

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
    val filePath: String? = null,
    val permissions: Array<Int>? = null
)

@Serializable
data class AdminUserRequest(
    val name: String,
    val email: String,
    val filePath: String,
    val permissions: Array<Int>,
    val password: String? = null
)

@Serializable
data class UserUpdateRequest(
    val name: String,
    val email: String
)

@Serializable
data class UserUpdatePasswordRequest(
    val password: String,
    val confirmPassword: String,
)
