package fr.tmeunier.domaine.services

import fr.tmeunier.config.Database
import fr.tmeunier.domaine.models.UsersResponse
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import kotlin.math.ceil

interface PaginationModel {
    fun toMap(): Map<String, Any>
}

class PaginationService
{

    private val database = Database.getConnexion()

    fun paginate(page: Int = 1, table: Table): Map<String, Any> {
        val total = transaction(database) {
            table.selectAll().count()
        }

        val offset = (page - 1) * 10
        val perPage = 10
        val totalPages = ceil(total.toDouble() / perPage).toInt()

        val data = transaction(database) {
            table.selectAll().limit(perPage, offset.toLong()).map {}
        }

        return mapOf(
            "page" to page,
            "perPage" to perPage,
            "total" to total,
            "totalPages" to totalPages,
            "data" to data
        )
    }
}