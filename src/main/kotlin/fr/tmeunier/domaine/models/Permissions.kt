package fr.tmeunier.domaine.models

import kotlinx.serialization.Serializable

@Serializable
data class Permission(
    val id: Int,
    val name: String
)
