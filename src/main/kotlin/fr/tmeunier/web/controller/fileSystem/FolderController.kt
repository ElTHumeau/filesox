package fr.tmeunier.web.controller.fileSystem

import fr.tmeunier.config.S3Config
import fr.tmeunier.domaine.models.S3File
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

        val data = S3Config.makeClient()?.let { FolderSystemService.listFoldersAndFiles(it, request.path ?: "") }

        if (data != null) {
            call.respond(data)
        } else {
            call.respond(HttpStatusCode.NotFound)
        }
    }

    suspend fun createFolder(call: ApplicationCall) {
        val request = call.receive<Folder>()
        S3Config.makeClient()?.let { FolderSystemService.createFolder(it, request.path) }
        call.respond(HttpStatusCode.Created)
    }

    suspend fun deleteFolder(call: ApplicationCall) {
        val request = call.receive<Folder>()
        S3Config.makeClient()?.let { FolderSystemService.deleteFolder(it, request.path) }
        call.respond(HttpStatusCode.OK)
    }
}