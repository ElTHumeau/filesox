package fr.tmeunier.domaine.repositories

import fr.tmeunier.config.Database
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.javatime.datetime
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.LocalDateTime

class LogRepository
{
    private val database = Database.getConnexion()

    object Logs : Table()
    {
        val id: Column<Int> = integer("id").autoIncrement()
        val userId: Column<Int> = integer("user_id").references(UserRepository.Users.id)
        val action: Column<String> = varchar("action", length = 255)
        val subject: Column<String> = varchar("subject", length = 255)
        val createdAt: Column<LocalDateTime> = datetime("created_at")

        override val primaryKey = PrimaryKey(id)
    }

    init {
        transaction(database) {
            SchemaUtils.create(Logs)
        }
    }

    fun findAll(): Query {
        return transaction(database) {
            Logs.innerJoin(UserRepository.Users)
                .selectAll()
        }
    }

    fun findAllByUser(user: Int): Query {
        return transaction(database) {
            Logs.innerJoin(UserRepository.Users)
                .select { Logs.userId eq user }
        }
    }

    suspend fun create(user: Int, action: String, subject: String): Int {
        return transaction(database) {
            Logs.insert {
                it[Logs.userId] = user
                it[Logs.action] = action
                it[Logs.subject] = subject
                it[Logs.createdAt] = LocalDateTime.now()
            } get Logs.id
        }
    }
}