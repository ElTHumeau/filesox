package fr.tmeunier.domaine.requests

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class RefreshTokenRequests (
    @SerialName("refresh_token") val refreshToken: String,
)