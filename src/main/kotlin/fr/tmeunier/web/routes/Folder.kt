package fr.tmeunier.web.routes

import fr.tmeunier.domaine.services.filesSystem.FolderSystemService
import fr.tmeunier.web.controller.fileSystem.FolderController
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.io.File

fun Route.folderRoutes() {

    route("/folders") {
        post {
            FolderController.listFoldersAndFiles(call)
        }

        post("/create") {
            FolderController.createFolder(call)
        }

        post("/delete") {
            FolderController.deleteFolder(call)
        }
    }

    route("/images") {

        get("/{fileName}") {
            val fileName =
                call.parameters["fileName"] ?: return@get call.respond(HttpStatusCode.BadRequest, "Key is required")

            val fileInCache = File(".cache/images/$fileName")

            if (!fileInCache.exists()) {
                FolderSystemService.downloadFileMultipart(fileName, ".cache/images/$fileName")
                call.respondFile(File(".cache/images/$fileName"))
            } else {
                call.respondFile(fileInCache)
            }
        }
    }
}