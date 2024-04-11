package fr.tmeunier.web.routes

import fr.tmeunier.web.controller.fileSystem.FolderController
import io.ktor.server.application.*
import io.ktor.server.routing.*

fun Route.folderRoutes() {

    route("/folder") {
        post("/create") {
            FolderController.createFolder(call)
        }

        post("/update") {
            FolderController.updateFolder(call)
        }

        post("/move") {
            FolderController.moveFolder(call)
        }

        post("/delete") {
           FolderController.deleteFolder(call)
        }
    }
}