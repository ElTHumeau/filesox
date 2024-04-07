package fr.tmeunier.domaine.models

data class PaginationModel<T>(
    val page: Int,
    val perPage: Int,
    val total: Int,
    val totalPages: Int,
    val data: List<T>
)