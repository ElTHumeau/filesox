package fr.tmeunier.web.routes.admin

import fr.tmeunier.config.S3Config
import fr.tmeunier.config.Security
import fr.tmeunier.domaine.repositories.StorageRepository
import fr.tmeunier.domaine.services.filesSystem.FolderSystemService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import withRole

fun Route.adminRouting() {
    route("admin") {
        withRole(Security.ADMIN) {
            get("/sync-s3") {
                val storageS3 =  S3Config.makeClient()?.let {
                    FolderSystemService.listAll(it, "")
                }

                if (storageS3 != null) {
                    storageS3.forEach {
                        StorageRepository.create(it.path, it.type, it.name, it.size,  it.parent, it.icon)
                    }

                    call.respond(HttpStatusCode.OK, "S3 synced")
                } else {
                    call.respond(HttpStatusCode.InternalServerError, "Failed to sync s3")
                }
            }
        }
    }
}