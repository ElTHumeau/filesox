package fr.tmeunier.web.controller.admin

import fr.tmeunier.domaine.models.UsersResponse
import fr.tmeunier.domaine.repositories.PermissionRepository
import fr.tmeunier.domaine.repositories.UserRepository
import fr.tmeunier.domaine.repositories.UsersPermissionsRepository
import fr.tmeunier.domaine.requests.AdminUserRequest
import fr.tmeunier.domaine.services.PaginationService
import fr.tmeunier.domaine.services.utils.formatDate
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import org.jetbrains.exposed.sql.selectAll


object AdminUserController {

    suspend fun getAll(call: ApplicationCall) {
        val page = call.parameters["page"]?.toInt() ?: 1

        val response =  PaginationService().paginate(page, 10, { UserRepository.Users.selectAll() }) { row ->
            UsersResponse(
                id = row[UserRepository.Users.id],
                name = row[UserRepository.Users.name],
                email = row[UserRepository.Users.email],
                createdAt = formatDate(row[UserRepository.Users.createdAt]),
                filePath = row[UserRepository.Users.filePath],
                permissions = UsersPermissionsRepository.findUserPermissions(row[UserRepository.Users.id])
            )
        }

        return call.respond(HttpStatusCode.OK, response)
    }

    suspend fun getAllPermissions(call: ApplicationCall) {
        val permissions = PermissionRepository.findAll()
        return call.respond(HttpStatusCode.OK, permissions)
    }

    suspend fun create(call: ApplicationCall) {
        val request = call.receive<AdminUserRequest>()

        val newUser = UserRepository.create(request.name, request.email, request.password!!, request.filePath)
        request.permissions.let { UsersPermissionsRepository.create(newUser, request.permissions.toList()) }

        return call.respond(HttpStatusCode.Created, newUser)
    }

    suspend fun update(call: ApplicationCall) {
        val request = call.receive<AdminUserRequest>()
        val id = call.parameters["id"]?.toInt() ?: return call.respond(HttpStatusCode.BadRequest)

        val updatedUser = UserRepository.update(id, request.name, request.email, request.layout)
        println(request.permissions.toList())
        request.permissions.let { UsersPermissionsRepository.sync(id, request.permissions.toList()) }

        return call.respond(HttpStatusCode.OK, updatedUser)
    }

    suspend fun delete(call: ApplicationCall) {
        val id = call.parameters["id"]?.toInt() ?: return call.respond(HttpStatusCode.BadRequest)

        UsersPermissionsRepository.delete(id)
        UserRepository.delete(id)

        return call.respond(HttpStatusCode.OK)
    }
}