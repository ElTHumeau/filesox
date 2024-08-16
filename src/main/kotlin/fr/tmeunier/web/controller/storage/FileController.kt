package fr.tmeunier.web.controller.storage

import fr.tmeunier.config.S3Config
import fr.tmeunier.domaine.requests.GetPathImageRequest
import fr.tmeunier.domaine.services.filesSystem.FolderSystemService
import fr.tmeunier.domaine.services.filesSystem.StorageService
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import java.io.File

object FileController {

    suspend fun image(call: ApplicationCall) {
        val request = call.receive<GetPathImageRequest>()
        val path = request.path + "." + StorageService.getExtension(request.type)
        val localPathCache = ".cache/images/${path}"

        val fileInCache = File(localPathCache)

        println(fileInCache.exists())

        if (!fileInCache.exists()) {
            S3Config.makeClient()
                ?.let { it1 ->
                    FolderSystemService.downloadFileMultipart(
                        it1,
                        path,
                        localPathCache
                    )
                }
            call.respondFile(File(localPathCache))
        } else {
            call.respondFile(fileInCache)
        }
    }
}