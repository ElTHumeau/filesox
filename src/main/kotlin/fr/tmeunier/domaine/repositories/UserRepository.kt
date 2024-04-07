package fr.tmeunier.domaine.repositories

import fr.tmeunier.config.Database
import fr.tmeunier.domaine.models.User
import fr.tmeunier.domaine.services.HashService
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.javatime.datetime
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.LocalDateTime

class UserRepository {

    private val database = Database.getConnexion()

    object Users : Table() {
        val id: Column<Int> = integer("id").autoIncrement()
        val name: Column<String> = varchar("name", length = 255)
        val email: Column<String> = varchar("email", length = 255)
        val password: Column<String> = varchar("password", length = 255)
        val createdAt: Column<LocalDateTime> = datetime("created_at")
        val updatedAt: Column<LocalDateTime> = datetime("updated_at")

        override val primaryKey = PrimaryKey(id)
    }

    init {
        transaction(database) {
            SchemaUtils.create(Users)
        }
    }

    suspend fun getAll(): List<User> {
        return transaction(database) {
            Users.selectAll()
                .map { User(it[Users.id], it[Users.name], it[Users.email], it[Users.password], it[Users.createdAt], it[Users.updatedAt]) }
        }
    }

    suspend fun create(name: String, email: String, password: String): Int {
        return transaction(database) {
            Users.insert {
                it[Users.name] = name
                it[Users.email] = email
                it[Users.password] = HashService().hashPassword(password)
                it[Users.createdAt] = LocalDateTime.now()
                it[Users.updatedAt] = LocalDateTime.now()
            } get Users.id
        }
    }

    suspend fun update(id: Int, name: String, email: String): Int {
        return transaction(database) {
            Users.update({ Users.id eq id }) {
                it[Users.name] = name
                it[Users.email] = email
                it[Users.updatedAt] = LocalDateTime.now()
            }
        }
    }

    suspend fun updatePassword(id: Int, password: String): Int {
        return transaction(database) {
            Users.update({ Users.id eq id }) {
                it[Users.password] = HashService().hashPassword(password)
                it[Users.updatedAt] = LocalDateTime.now()
            }
        }
    }

    suspend fun delete(id: Int) {
        transaction(database) {
            Users.deleteWhere { Users.id eq id }
        }
    }

    suspend fun findByEmail(email: String): User? {
        return transaction(database) {
            Users.select { Users.email eq email }
                .map { User(it[Users.id], it[Users.name], it[Users.email], it[Users.password], it[Users.createdAt], it[Users.updatedAt]) }
                .singleOrNull()
        }
    }

    suspend fun findById(id: Int): User? {
        return transaction(database) {
            Users.select { Users.id eq id }
                .map { User(it[Users.id], it[Users.name], it[Users.email], it[Users.password], it[Users.createdAt], it[Users.updatedAt]) }
                .singleOrNull()
        }
    }
}