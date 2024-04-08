package fr.tmeunier.domaine.repositories

import fr.tmeunier.config.Database
import fr.tmeunier.config.Security
import fr.tmeunier.domaine.models.User
import fr.tmeunier.domaine.models.UserPaginationResponse
import fr.tmeunier.domaine.models.UsersResponse
import fr.tmeunier.domaine.services.HashService
import fr.tmeunier.domaine.services.LogService
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.javatime.datetime
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.LocalDateTime
import kotlin.math.ceil

class UserRepository {

    private val database = Database.getConnexion()

    object Users : Table() {
        val id: Column<Int> = integer("id").autoIncrement()
        val name: Column<String> = varchar("name", length = 255)
        val email: Column<String> = varchar("email", length = 255)
        val filePath: Column<String> = varchar("file_path", length = 255)
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

    suspend fun create(name: String, email: String, password: String, filePath: String? = null): Int {
        LogService().add(Security.getUserId(), LogService.ACTION_CREATE, "${name} created")

        return transaction(database) {
            Users.insert {
                it[Users.name] = name
                it[Users.email] = email
                it[Users.filePath] = filePath ?: "./$name"
                it[Users.password] = HashService().hashPassword(password)
                it[Users.createdAt] = LocalDateTime.now()
                it[Users.updatedAt] = LocalDateTime.now()
            } get Users.id
        }
    }

    suspend fun update(id: Int, name: String, email: String): Int {
        LogService().add(Security.getUserId(), LogService.ACTION_UPDATE, "${name} updated")

        return transaction(database) {
            Users.update({ Users.id eq id }) {
                it[Users.name] = name
                it[Users.email] = email
                it[Users.updatedAt] = LocalDateTime.now()
            }
        }
    }

    suspend fun updatePassword(id: Int, password: String): Int {
        LogService().add(Security.getUserId(), LogService.ACTION_UPDATE, "updated account")

        return transaction(database) {
            Users.update({ Users.id eq id }) {
                it[Users.password] = HashService().hashPassword(password)
                it[Users.updatedAt] = LocalDateTime.now()
            }
        }
    }

    suspend fun delete(id: Int) {
        LogService().add(Security.getUserId(), LogService.ACTION_DELETE, "updated account")

        transaction(database) {
            Users.deleteWhere { Users.id eq id }
        }
    }

    suspend fun findByEmail(email: String): User? {
        return transaction(database) {
            Users.select { Users.email eq email }
                .map { User(it[Users.id], it[Users.name], it[Users.email], it[Users.password], it[Users.filePath], it[Users.createdAt], it[Users.updatedAt]) }
                .singleOrNull()
        }
    }

    suspend fun findById(id: Int): User? {
        return transaction(database) {
            Users.select { Users.id eq id }
                .map { User(it[Users.id], it[Users.name], it[Users.email], it[Users.password], it[Users.filePath], it[Users.createdAt], it[Users.updatedAt]) }
                .singleOrNull()
        }
    }
}