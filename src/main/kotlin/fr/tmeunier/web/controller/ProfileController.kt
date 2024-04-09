package fr.tmeunier.web.controller

import fr.tmeunier.config.Security
import fr.tmeunier.domaine.models.LogsResponses
import fr.tmeunier.domaine.repositories.LogRepository
import fr.tmeunier.domaine.repositories.UserRepository
import fr.tmeunier.domaine.requests.UserUpdatePasswordRequest
import fr.tmeunier.domaine.requests.UserUpdateRequest
import fr.tmeunier.domaine.services.PaginationService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*

class ProfileController {

    suspend fun getLogs(call: ApplicationCall) {
        val userId = Security.getUserId()
        val respond = PaginationService().paginate(1, 10, { LogRepository().findAllByUser(userId) }) { row ->
            LogsResponses(
                row[LogRepository.Logs.id],
                row[LogRepository.Logs.action],
                row[LogRepository.Logs.subject],
            )
        }

        return call.respond(HttpStatusCode.OK, respond)
    }

    suspend fun update(call: ApplicationCall) {
        val request = call.receive<UserUpdateRequest>()
        val userId = Security.getUserId()

        UserRepository().update(userId, request.name, request.email)

        return call.respond(HttpStatusCode.OK)
    }

    suspend fun updatePassword(call: ApplicationCall) {
        val request = call.receive<UserUpdatePasswordRequest>()
        val userId = Security.getUserId()

        if (request.password != request.confirmPassword) return call.respond(HttpStatusCode.BadRequest)

        UserRepository().updatePassword(userId, request.password)

        return call.respond(HttpStatusCode.OK)
    }
}