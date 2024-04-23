package fr.tmeunier.web.routes

import fr.tmeunier.web.controller.fileSystem.FolderController
import io.ktor.server.application.*
import io.ktor.server.routing.*

fun Route.folderRoutes() {

    route("/folders") {
        get {
            FolderController.listFoldersAndFiles(call)
        }

        post("/create") {
            FolderController.createFolder(call)
        }

        post("/delete") {
           FolderController.deleteFolder(call)
        }
    }
}