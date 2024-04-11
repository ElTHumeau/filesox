package fr.tmeunier.domaine.services

import io.ktor.http.*
import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import kotlin.math.ceil

class PaginationService {

    @Serializable
    data class PaginationResponse<T>(
        val data: List<T>,
        val total: Int,
        val totalPages: Int,
        val currentPage: Int,
        val perPage: Int,
        val from: Int,
        val to: Int
    )

    fun <R> paginate(page: Int, perPage: Int, query: () -> Query, mapper: (ResultRow) -> R): PaginationResponse<R> {
        val total = transaction { query().count() }

        val data = transaction {
            query()
                .limit(perPage, offset = ((page - 1) * perPage).toLong())
                .map { mapper(it) }
        }

        val totalPages = ceil(total.toDouble() / perPage).toInt()

        return PaginationResponse(
            data,
            total.toInt(),
            totalPages,
            page,
            perPage,
            from = ((page - 1) * perPage) + 1,
            to = ((page - 1) * perPage) + data.size
        )
    }
}