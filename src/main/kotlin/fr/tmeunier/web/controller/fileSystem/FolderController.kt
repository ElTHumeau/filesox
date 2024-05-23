package fr.tmeunier.web.controller.fileSystem

import fr.tmeunier.config.S3Config
import fr.tmeunier.domaine.models.S3File
import fr.tmeunier.domaine.requests.DownloadRequest
import fr.tmeunier.domaine.requests.Folder
import fr.tmeunier.domaine.requests.FolderMoveRequest
import fr.tmeunier.domaine.requests.GetPathRequest
import fr.tmeunier.domaine.services.filesSystem.FolderSystemService
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import java.io.File

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

    suspend fun move(call: ApplicationCall) {
        val request = call.receive<FolderMoveRequest>()
        S3Config.makeClient()?.let { FolderSystemService.move(it, request.path, request.newPath) }
        call.respond(HttpStatusCode.OK)
    }

    suspend fun deleteFolder(call: ApplicationCall) {
        val request = call.receive<Folder>()
        S3Config.makeClient()?.let { FolderSystemService.deleteFolder(it, request.path) }
        call.respond(HttpStatusCode.OK)
    }

    suspend fun download(call: ApplicationCall) {
        val request = call.receive<DownloadRequest>()
        val fileInCache = File(".cache/media/${request.path}")

        if (!fileInCache.exists()) {
            S3Config.makeClient()
                ?.let { it1 -> FolderSystemService.downloadFileMultipart(it1, "${request.path}", ".cache/media/${request.path}") }
            call.respondFile(File(".cache/media/${request.path}"))
        } else {
            call.respondFile(fileInCache)
        }
    }
}