package fr.tmeunier.web.routes.admin

import fr.tmeunier.config.S3Config
import fr.tmeunier.config.Security
import fr.tmeunier.domaine.services.filesSystem.s3.SyncS3ToDatabaseService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import withRole

fun Route.adminRouting() {
    route("admin") {

        withRole(Security.ADMIN) {
            get("/sync-s3") {
                try {
                    S3Config.makeClient()?.let {
                        SyncS3ToDatabaseService.syncS3(it, "", null)
                    }

                    call.respond(HttpStatusCode.OK)
                } catch (e: Exception) {
                    call.respond(HttpStatusCode.InternalServerError, e.message ?: "An error occurred")
                }
            }
        }
    }
}