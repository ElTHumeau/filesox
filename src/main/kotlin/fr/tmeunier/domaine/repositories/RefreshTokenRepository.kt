package fr.tmeunier.domaine.repositories

import fr.tmeunier.config.Database
import fr.tmeunier.domaine.models.RefreshToken
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.javatime.datetime
import org.jetbrains.exposed.sql.javatime.timestamp
import java.sql.Timestamp
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.*

object RefreshTokenRepository {

    private val database = Database.getConnexion()

    object RefreshToken : Table("refresh_token") {
        val id: Column<Int> = integer("id").autoIncrement()
        val refreshToken: Column<String> = varchar("refresh_token", length = 255)
        val userId: Column<Int> = (integer("user_id") references UserRepository.Users.id)
        val expiredAt = datetime("expired_at")

        override val primaryKey = PrimaryKey(id)
    }

    init {
        transaction(database) {
            SchemaUtils.create(RefreshToken)
        }
    }

    suspend fun findByUserId(userId: Int): fr.tmeunier.domaine.models.RefreshToken? {
        return transaction(database) {
            RefreshToken.select { RefreshToken.userId eq userId }
                .map { RefreshToken(it[RefreshToken.id], it[RefreshToken.refreshToken], it[RefreshToken.userId], it[RefreshToken.expiredAt])}
                .singleOrNull()
        }
    }

    suspend fun findByToken(token: String): fr.tmeunier.domaine.models.RefreshToken? {
        return transaction(database) {
            RefreshToken.select { RefreshToken.refreshToken eq token }
                .map { RefreshToken(it[RefreshToken.id], it[RefreshToken.refreshToken], it[RefreshToken.userId], it[RefreshToken.expiredAt])}
                .singleOrNull()
        }
    }

    suspend fun create(userId: Int, duration: Long): String {
        val rt = UUID.randomUUID().toString()

         transaction(database) {
            RefreshToken.insert {
                it[RefreshToken.refreshToken] = rt
                it[RefreshToken.userId] = userId
                it[RefreshToken.expiredAt] = LocalDateTime.now().plusMinutes(duration)
            }
        }

        return rt
    }

    suspend fun update(token: String, duration: Long): String {
        return transaction(database) {
            RefreshToken.update({ RefreshToken.refreshToken eq token }) {
                it[RefreshToken.expiredAt] = LocalDateTime.now().plusSeconds(duration)
            }
            token
        }
    }

    suspend fun delete(token: String) {
        transaction(database) {
            RefreshToken.deleteWhere { RefreshToken.refreshToken eq token }
        }
    }
}