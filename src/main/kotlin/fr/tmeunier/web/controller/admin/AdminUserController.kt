package fr.tmeunier.web.controller.admin

import fr.tmeunier.domaine.models.PaginationModel
import fr.tmeunier.domaine.models.User
import fr.tmeunier.domaine.repositories.UserRepository
import fr.tmeunier.domaine.requests.UserRegisterRequest
import fr.tmeunier.domaine.services.PaginationService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import org.jetbrains.exposed.sql.ResultRow
import fr.tmeunier.domaine.repositories.UserRepository.Users as Users1

class AdminUserController {
    private val repository = UserRepository()

    fun getAll(): Map<String, Any> {
        return PaginationService().paginate(1, Users1)
    }
    suspend fun create(call: ApplicationCall) {
        val request = call.receive<UserRegisterRequest>()

        val newUser = repository.create(
            request.name,
            request.email,
            request.password
        )

        return call.respond(HttpStatusCode.Created, newUser)
    }

    suspend fun update(call: ApplicationCall) {
        val request = call.receive<UserRegisterRequest>()
        val id = call.parameters["id"]?.toInt() ?: return call.respond(HttpStatusCode.BadRequest)

        val updatedUser = repository.update(
            id,
            request.name,
            request.email,
        )

        return call.respond(HttpStatusCode.OK, updatedUser)
    }

    suspend fun delete(call: ApplicationCall) {
        val id = call.parameters["id"]?.toInt() ?: return call.respond(HttpStatusCode.BadRequest)

        repository.delete(id)

        return call.respond(HttpStatusCode.OK)
    }
}