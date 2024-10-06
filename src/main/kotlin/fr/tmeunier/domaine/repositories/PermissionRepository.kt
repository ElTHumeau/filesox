package fr.tmeunier.domaine.repositories

import fr.tmeunier.config.Database
import fr.tmeunier.config.Database.dbQuery
import fr.tmeunier.domaine.models.Permission
import org.jetbrains.exposed.sql.Column
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction

object PermissionRepository {
    private val database = Database.getConnexion()

    object Permissions : Table("permissions") {
        val id: Column<Int> = integer("id").autoIncrement()
        val name: Column<String> = varchar("name", length = 255)

        override val primaryKey = PrimaryKey(id)
    }

    fun insertInitialPermissions() {
        val permissionsToInsert = listOf(
            "Administration",
            "Create file or folder",
            "Delete file or folder",
            "Download",
            "Edit file",
            "Share files",
            "Rename file or folder"
        )

        transaction(database) {
           permissionsToInsert.forEach { permission ->
                Permissions.insert {
                    it[name] = permission
                }
            }
        }
    }

    suspend fun findAll(): List<Permission> = dbQuery {
        Permissions.selectAll().map {
            Permission(
                id = it[Permissions.id],
                name = it[Permissions.name]
            )
        }
    }
}