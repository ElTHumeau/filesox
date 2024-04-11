package fr.tmeunier.web.controller.admin

import fr.tmeunier.domaine.models.LogsResponses
import fr.tmeunier.domaine.repositories.LogRepository
import fr.tmeunier.domaine.repositories.UserRepository
import fr.tmeunier.domaine.services.PaginationService
import fr.tmeunier.domaine.services.utils.formatDate
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*

object AdminLogController  {

    suspend fun getAll(call: ApplicationCall) {
        val response = PaginationService().paginate(1, 10, { LogRepository.findAll() }) { row ->
            LogsResponses(
                row[LogRepository.Logs.id],
                row[LogRepository.Logs.action],
                row[LogRepository.Logs.subject],
                formatDate(row[LogRepository.Logs.createdAt]),
                row[UserRepository.Users.name],
            )
        }

         return call.respond(HttpStatusCode.OK, response)
    }
}