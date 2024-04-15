package fr.tmeunier.domaine.repositories

import fr.tmeunier.config.Database
import fr.tmeunier.domaine.models.UserWidthPermissionResponse
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.transaction

object UsersPermissionsRepository {
    private val database = Database.getConnexion()

    object UsersPermissions : Table("users_permissions") {
        val id: Column<Int> = integer("id").autoIncrement()
        val userId: Column<Int> = integer("user_id").references(UserRepository.Users.id)
        val permissionId: Column<Int> = integer("permission_id").references(PermissionRepository.Permissions.id)

        override val primaryKey = PrimaryKey(id)
    }

    init {
        transaction(database) {
            SchemaUtils.create(UsersPermissions)
        }
    }

    // je voudrai récupérer les nom des persmission d'un utilisateur
    fun findUserWithPermissions(userId: Int): UserWidthPermissionResponse {
        return transaction(database) {
            val user = UserRepository.Users.select { UserRepository.Users.id eq userId }.single()
            val permissions = UsersPermissions.join(
                PermissionRepository.Permissions,
                JoinType.INNER,
                additionalConstraint = { UsersPermissions.permissionId eq PermissionRepository.Permissions.id }
            )
                .select { UsersPermissions.userId eq userId }
                .map {
                    it[PermissionRepository.Permissions.name]
                }

            UserWidthPermissionResponse(
                user[UserRepository.Users.id],
                user[UserRepository.Users.name],
                user[UserRepository.Users.email],
                user[UserRepository.Users.filePath],
                permissions
            )
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