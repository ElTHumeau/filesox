package fr.tmeunier.domaine.services

import fr.tmeunier.config.Database
import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import kotlin.math.ceil
import fr.tmeunier.domaine.models.PaginationModel
import kotlin.reflect.full.memberProperties

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

        // on recupere le model pour serialiser les données et il porte le meme nom que la table sans le s
        val modelName = table.tableName.substring(0, table.tableName.length - 1)

        val data =  transaction(db = database) {
            table.selectAll().limit(perPage, offset.toLong())
                .map {
                    val model = Class.forName("fr.tmeunier.domaine.models.${modelName.capitalize()}").kotlin
                    val constructor = model.constructors.first()
                    val properties = model.memberProperties
                    val args = properties.map { it.getter.call(it, it.name) }.toTypedArray()
                    constructor.call(*args)
            }
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