package fr.tmeunier.web.routes

import aws.sdk.kotlin.services.s3.model.S3Exception
import fr.tmeunier.config.S3Config
import fr.tmeunier.domaine.requests.CompletedUpload
import fr.tmeunier.domaine.requests.DownloadRequest
import fr.tmeunier.domaine.requests.GetPathRequest
import fr.tmeunier.domaine.requests.InitialUpload
import fr.tmeunier.domaine.services.filesSystem.FolderSystemService
import fr.tmeunier.web.controller.fileSystem.FolderController
import io.ktor.http.*
import io.ktor.http.content.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.coroutines.runBlocking
import java.io.File

fun Route.folderRoutes() {

    route("/folders") {
        post {
            FolderController.listFoldersAndFiles(call)
        }

        post("/create") {
            FolderController.createFolder(call)
        }

        post("/move") {
            FolderController.move(call)
        }

        post("/delete") {
            FolderController.deleteFolder(call)
        }

        post("/download") {
            FolderController.download(call)
        }

        route("/upload") {
            post("/init") {
                val request = call.receive<InitialUpload>()
                //val totalChunks = params["totalChunks"]?.toIntOrNull()

                if (request.filename != null) {
                    val uploadId = S3Config.makeClient()?.let {
                        FolderSystemService.initiateMultipartUpload(it, request.filename)
                    }

                    if (uploadId != null) {
                        call.respond(HttpStatusCode.OK, mapOf("uploadId" to uploadId))
                    } else {
                        call.respond(HttpStatusCode.InternalServerError, "Failed to initiate upload")
                    }
                } else {
                    call.respond(HttpStatusCode.BadRequest, "Invalid parameters")
                }
            }

            post {
                val multipart = call.receiveMultipart()
                var uploadId: String? = null
                var chunkNumber: Int? = null
                var totalChunks: Int? = null
                var originalFileName: String? = null
                var fileBytes: ByteArray? = null

                multipart.forEachPart { part ->
                    when (part) {
                        is PartData.FormItem -> {
                            when (part.name) {
                                "uploadId" -> uploadId = part.value
                                "chunkNumber" -> chunkNumber = part.value.toIntOrNull()
                                "totalChunks" -> totalChunks = part.value.toIntOrNull()
                            }
                        }

                        is PartData.FileItem -> {
                            originalFileName = part.originalFileName
                            fileBytes = part.streamProvider().readBytes()
                        }

                        else -> {}
                    }
                    part.dispose()
                }

                if (uploadId != null && chunkNumber != null && totalChunks != null && originalFileName != null && fileBytes != null) {
                    val key = "$originalFileName-$uploadId-$chunkNumber"

                    runBlocking {
                        try {
                            S3Config.makeClient()?.let {
                                FolderSystemService.uploadMultipart(it, key, uploadId, chunkNumber!!, fileBytes, totalChunks!!)
                            }
                            call.respond(HttpStatusCode.OK, "Chunk $chunkNumber uploaded successfully")
                        } catch (e: S3Exception) {
                            call.respond(HttpStatusCode.BadRequest, "Error uploading chunk ${e.message}")
                        }
                    }
                } else {
                    call.respond(HttpStatusCode.BadRequest, "Invalid upload data")
                }
            }

            post("/complete") {
                val request = call.receive<CompletedUpload>()

                if (request.uploadId != null && request.filename != null) {
                    runBlocking {
                        try {
                            S3Config.makeClient()?.let {
                                FolderSystemService.completeMultipartUpload(it, request.filename, request.uploadId!!)
                            }
                            call.respond(HttpStatusCode.OK, "Upload completed successfully")
                        } catch (e: S3Exception) {
                            call.respond(HttpStatusCode.BadRequest, "Error completing upload ${e.message}")
                        }
                    }
                } else {
                    call.respond(HttpStatusCode.BadRequest, "Invalid parameters")
                }
            }
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