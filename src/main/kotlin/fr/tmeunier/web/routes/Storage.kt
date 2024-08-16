package fr.tmeunier.web.routes

import aws.sdk.kotlin.services.s3.model.S3Exception
import fr.tmeunier.config.S3Config
import fr.tmeunier.domaine.repositories.FileRepository
import fr.tmeunier.domaine.repositories.FolderRepository
import fr.tmeunier.domaine.requests.CompletedUpload
import fr.tmeunier.domaine.requests.InitialUploadRequest
import fr.tmeunier.domaine.response.UploadCompleteResponse
import fr.tmeunier.domaine.services.filesSystem.FolderSystemService
import fr.tmeunier.domaine.services.filesSystem.StorageService
import fr.tmeunier.web.controller.storage.FolderController
import fr.tmeunier.web.controller.storage.StorageController
import io.ktor.http.*
import io.ktor.http.content.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.coroutines.runBlocking
import java.util.*

fun Route.storageRoute() {

    route("/storages") {
        post {
            StorageController.listFoldersAndFiles(call)
        }

        post("/update") {
            StorageController.update(call)
        }

        post("/move") {
            StorageController.move(call)
        }

        post("/delete") {
            StorageController.delete(call)
        }
    }

    route("/folders") {
        post("/create") {
            FolderController.create(call)
        }
    }

    route("/files") {
        post("/download") {
            FolderController.download(call)
        }

        route("/upload") {
            post("/init") {
                val request = call.receive<InitialUploadRequest>()

                // Create folder if it doesn't exist
                val parentId = if (request.webRelativePath === "") {
                    request.parentId
                } else {
                    request.webRelativePath?.let { it1 -> createFolderUploadFile(it1, request.parentId) }
                }

                val uuid = FileRepository.create(request, parentId)
                val filename = uuid.toString() + '.' + StorageService.getExtension(request.type)

                val uploadId = S3Config.makeClient()?.let {
                    FolderSystemService.initiateMultipartUpload(it, filename)
                }

                if (uploadId != null) {
                    call.respond(HttpStatusCode.OK, UploadCompleteResponse(uploadId, filename))
                } else {
                    call.respond(HttpStatusCode.InternalServerError, "Failed to initiate upload")
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
                    val key = "$originalFileName"

                    runBlocking {
                        try {
                            S3Config.makeClient()?.let {
                                FolderSystemService.uploadMultipart(
                                    it,
                                    key,
                                    uploadId,
                                    chunkNumber!!,
                                    fileBytes,
                                    totalChunks!!
                                )
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
                                FolderSystemService.completeMultipartUpload(it, request.filename, request.uploadId)
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
            /*val request = call.receive<GetPathRequest>()

            val fileInCache = File(".cache/images/${request.path}")

            println(fileInCache.exists())

            if (!fileInCache.exists()) {
                S3Config.makeClient()
                    ?.let { it1 ->
                        FolderSystemService.downloadFileMultipart(
                            it1,
                            request.path!!,
                            ".cache/images/${request.path}"
                        )
                    }
                call.respondFile(File(".cache/images/${request.path}"))
            } else {
                call.respondFile(fileInCache)
            }*/
        }
    }
}

fun createFolderUploadFile(path: String, parentId: UUID?): UUID {
    val folderPathRequest = path.substringBeforeLast("/") + '/'
    val folderParent = parentId?.let { FolderRepository.findById(it) }
    val folderParentPath = if (folderParent !== null) folderParent.path else ""
    val folder = FolderRepository.findByPath(folderParentPath + folderPathRequest)

    return if (folder == null) {
        val folderPath = (folderParent?.path ?: "") + folderPathRequest
        FolderRepository.create(folderPath, parentId ?: folderParent?.id)
    } else {
        folder.id
    }
}