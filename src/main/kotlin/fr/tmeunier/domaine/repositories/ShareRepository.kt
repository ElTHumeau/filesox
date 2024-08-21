package fr.tmeunier.domaine.repositories

import fr.tmeunier.config.Database
import fr.tmeunier.domaine.response.ShareShowResponse
import fr.tmeunier.domaine.services.utils.HashService
import fr.tmeunier.domaine.services.utils.formatDate

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.javatime.datetime
import org.jetbrains.exposed.sql.transactions.transaction
import java.util.*

object ShareRepository {

    private val database = Database.getConnexion()

    object Shares : Table("shares") {
        val id = uuid("id")
        val storageId = uuid("storage_id")
        val type = varchar("type", length = 255)
        val userId = integer("user_id").references(UserRepository.Users.id)
        val password = varchar("password", length = 255).nullable()
        val expiredAt = datetime("expired_at")
        val createdAt = datetime("created_at")

        override val primaryKey = PrimaryKey(id)
    }

    init {
        transaction(database) {
            SchemaUtils.create(Shares)
        }
    }

    fun findAll(): Query {
        return transaction(database) {
            Shares.innerJoin(UserRepository.Users)
                .selectAll()
                .orderBy(Shares.createdAt to SortOrder.DESC)
        }
    }

    fun findAllByUser(user: Int): Query {
        return transaction(database) {
            Shares.innerJoin(UserRepository.Users)
                .select { Shares.userId eq user }
                .orderBy(Shares.createdAt to SortOrder.DESC)
        }
    }

    fun findAllById(id: UUID): List<ShareShowResponse> {
        return transaction(database) {
            Shares.select { Shares.storageId eq id }
                .map {
                    ShareShowResponse(
                        id = it[Shares.id],
                        expiredAt = formatDate(it[Shares.expiredAt], "dd/MM/yyyy HH:mm"),
                        createdAt = it[Shares.createdAt].toString()
                    )
                }
        }
    }

    fun create(storageId: UUID, type: String, userId: Int, password: String?, expiredAt: java.time.LocalDateTime) {
        transaction(database) {
            Shares.insert {
                it[Shares.id] = UUID.randomUUID()
                it[Shares.storageId] = storageId
                it[Shares.type] = type
                it[Shares.userId] = userId
                it[Shares.password] = password?.let { HashService.hashPassword(password) }
                it[Shares.expiredAt] = expiredAt
                it[createdAt] = java.time.LocalDateTime.now()
            }
        }
    }

    fun delete(id: UUID) {
        transaction(database) {
            Shares.deleteWhere { Shares.id eq id }
        }
    }
}