package fr.tmeunier.web.routes

import fr.tmeunier.config.S3Config
import fr.tmeunier.domaine.requests.DownloadRequest
import fr.tmeunier.domaine.requests.GetPathRequest
import fr.tmeunier.domaine.services.filesSystem.FolderSystemService
import fr.tmeunier.web.controller.fileSystem.FolderController
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
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

        post("/download") {
            FolderController.download(call)
        }
    }

    route("/images") {

        post {
            val request =  call.receive<GetPathRequest>()

            val fileInCache = File(".cache/${request.path}")

            if (!fileInCache.exists()) {
                S3Config.makeClient()
                    ?.let { it1 -> FolderSystemService.downloadFileMultipart(it1, request.path!!, ".cache/${request.path}") }
                call.respondFile(File(".cache/${request.path}"))
            } else {
                call.respondFile(fileInCache)
            }
        }
    }
}