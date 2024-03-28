package fr.tmeunier.domaine.repositories

import fr.tmeunier.config.Database
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.javatime.datetime
import java.time.LocalDateTime

class RefreshTokenRepository {

    private val database = Database.connexion()

    object RefreshToken : Table() {
        val id: Column<Int> = integer("id").autoIncrement()
        val token: Column<String> = varchar("token", length = 255)
        val expiredAt: Column<LocalDateTime> = datetime("expired_at")

        override val primaryKey = PrimaryKey(id)
    }

    init {
        transaction(database) {
            SchemaUtils.create(RefreshToken)
        }
    }

    suspend fun create(userId: Int, duration: Long): String {
        return transaction(database) {
            val token = (0..255).map { (('a'..'z') + ('A'..'Z') + ('0'..'9')).random() }.joinToString("")
            RefreshToken.insert {
                it[RefreshToken.token] = token
                it[RefreshToken.expiredAt] = LocalDateTime.now().plusSeconds(duration)
            }
            token
        }
    }

    suspend fun delete(token: String) {
        transaction(database) {
            RefreshToken.deleteWhere { RefreshToken.token eq token }
        }
    }


}