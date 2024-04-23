package fr.tmeunier.web.controller.fileSystem

import fr.tmeunier.domaine.requests.Folder
import fr.tmeunier.domaine.requests.FolderMoveRequest
import fr.tmeunier.domaine.services.filesSystem.FolderSystemService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*

object FolderController
{

    suspend fun listFoldersAndFiles(call: ApplicationCall)
    {
        val path = call.receiveText()

        if (path.isNotEmpty()) {
            val data = FolderSystemService.listFoldersAndFiles(path)
            call.respond(HttpStatusCode.OK, data)
        } else {
            call.respond(HttpStatusCode.BadRequest, "Invalid path")
        }
    }

    suspend fun createFolder(call: ApplicationCall)
    {
        val request = call.receive<Folder>()
        FolderSystemService.createFolder(request.path)
        call.respond(HttpStatusCode.Created)
    }

    suspend fun deleteFolder(call: ApplicationCall)
    {
        val request = call.receive<Folder>()
        FolderSystemService.deleteFolder(request.path)
        call.respond(HttpStatusCode.OK)
    }
}