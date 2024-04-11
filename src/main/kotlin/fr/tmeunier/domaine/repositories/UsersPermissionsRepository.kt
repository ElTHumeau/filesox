package fr.tmeunier.domaine.repositories

import fr.tmeunier.config.Database
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.transaction

object UsersPermissionsRepository
{
    private val database = Database.getConnexion()

    object UsersPermissions : Table("users_permissions") {
        val id: Column<Int> = integer("id").autoIncrement()
        val userId: Column<Int> = integer("user_id")
        val permissionId: Column<Int> = integer("permission_id")

        override val primaryKey = PrimaryKey(id)
    }

    init {
        transaction(database) {
            SchemaUtils.create(UsersPermissions)
        }
    }

     fun create(userId: Int, permissionsId: List<Int>) {
        transaction(database) {
            UsersPermissions.batchInsert(permissionsId) { permissionId ->
                this[UsersPermissions.userId] = userId
                this[UsersPermissions.permissionId] = permissionId
            }
        }
    }

    fun sync(userId: Int, permissionsId: List<Int>) {
        transaction(database) {
            UsersPermissions.deleteWhere { UsersPermissions.userId eq userId }
            create(userId, permissionsId)
        }
    }

    fun delete(userId: Int) {
        transaction(database) {
            UsersPermissions.deleteWhere { UsersPermissions.userId eq userId }
        }
    }
}