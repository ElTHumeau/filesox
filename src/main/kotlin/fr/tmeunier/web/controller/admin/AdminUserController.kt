package fr.tmeunier.web.controller.admin

import fr.tmeunier.domaine.repositories.PermissionRepository
import fr.tmeunier.domaine.repositories.UserRepository
import fr.tmeunier.domaine.repositories.UsersPermissionsRepository
import fr.tmeunier.domaine.requests.AdminUserRequest
import fr.tmeunier.domaine.requests.UserRegisterRequest
import fr.tmeunier.domaine.services.PaginationService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import fr.tmeunier.domaine.repositories.UserRepository.Users as Users1

class AdminUserController {
    private val repository = UserRepository()

    fun getAll(): Map<String, Any> {
        return PaginationService().paginate(1, Users1)
    }

    suspend fun getAllPermissions(call: ApplicationCall) {
        val permissions = PermissionRepository().findAll()
        return call.respond(HttpStatusCode.OK, permissions)
    }

    suspend fun create(call: ApplicationCall) {
        val request = call.receive<AdminUserRequest>()

        val newUser = repository.create(request.name, request.email, request.password!!, request.filePath)
        request.permissions?.let { UsersPermissionsRepository().create(newUser, request.permissions.toList()) }

        return call.respond(HttpStatusCode.Created, newUser)
    }

    suspend fun update(call: ApplicationCall) {
        val request = call.receive<AdminUserRequest>()
        val id = call.parameters["id"]?.toInt() ?: return call.respond(HttpStatusCode.BadRequest)

        val updatedUser = repository.update(id, request.name, request.email)
        request.permissions?.let { UsersPermissionsRepository().sync(id, request.permissions.toList()) }

        return call.respond(HttpStatusCode.OK, updatedUser)
    }

    suspend fun delete(call: ApplicationCall) {
        val id = call.parameters["id"]?.toInt() ?: return call.respond(HttpStatusCode.BadRequest)

        UsersPermissionsRepository().delete(id)
        repository.delete(id)

        return call.respond(HttpStatusCode.OK)
    }
}