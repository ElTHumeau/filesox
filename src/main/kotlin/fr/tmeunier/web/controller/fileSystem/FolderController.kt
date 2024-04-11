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
    suspend fun createFolder(call: ApplicationCall)
    {
        val request = call.receive<Folder>()
        FolderSystemService.createFolder(request.path)
        call.respond(HttpStatusCode.Created)
    }

    suspend fun updateFolder(call: ApplicationCall)
    {
        val request = call.receive<FolderMoveRequest>()
        FolderSystemService.renameFolder(request.path, request.newPath)
        call.respond(HttpStatusCode.OK)
    }

    suspend fun moveFolder(call: ApplicationCall)
    {
        val request = call.receive<FolderMoveRequest>()
        FolderSystemService.moveFolder(request.path, request.newPath)
        call.respond(HttpStatusCode.OK)
    }

    suspend fun deleteFolder(call: ApplicationCall)
    {
        val request = call.receive<Folder>()
        FolderSystemService.deleteFolder(request.path)
        call.respond(HttpStatusCode.OK)
    }
}