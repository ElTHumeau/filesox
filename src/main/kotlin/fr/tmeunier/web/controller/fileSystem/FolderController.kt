package fr.tmeunier.web.controller.fileSystem

import fr.tmeunier.domaine.requests.Folder
import fr.tmeunier.domaine.requests.GetPathRequest
import fr.tmeunier.domaine.services.filesSystem.FolderSystemService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*

object FolderController {

    suspend fun listFoldersAndFiles(call: ApplicationCall) {
        val request = call.receive<GetPathRequest>()

        val data = FolderSystemService.listFoldersAndFiles(request.path ?: "")
        call.respond(HttpStatusCode.OK, data)
    }

    suspend fun createFolder(call: ApplicationCall) {
        val request = call.receive<Folder>()
        FolderSystemService.createFolder(request.path)
        call.respond(HttpStatusCode.Created)
    }

    suspend fun deleteFolder(call: ApplicationCall) {
        val request = call.receive<Folder>()
        FolderSystemService.deleteFolder(request.path)
        call.respond(HttpStatusCode.OK)
    }
}