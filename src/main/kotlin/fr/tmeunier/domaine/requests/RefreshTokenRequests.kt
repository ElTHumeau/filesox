package fr.tmeunier.domaine.requests

import kotlinx.serialization.Serializable

@Serializable
data class RefreshTokenRequests (
    val refreshToken: String,
)