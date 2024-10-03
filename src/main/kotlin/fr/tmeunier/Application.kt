package fr.tmeunier

import fr.tmeunier.config.Database
import fr.tmeunier.config.configureHTTP
import fr.tmeunier.domaine.jobs.ShareJob
import fr.tmeunier.domaine.services.filesSystem.FileSystemServiceFactory
import fr.tmeunier.web.routes.configurationRoute
import io.github.cdimascio.dotenv.dotenv
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*

val dotenv = dotenv {}

fun main() {
    Database.init()

    // Type Storage "S3" or "LOCAL"
    FileSystemServiceFactory.initialize(dotenv["STORAGE"])

    //db
    ShareJob.initJob()

    embeddedServer(Netty, port = 8080, host = "0.0.0.0", module = Application::module)
        .start(wait = true)
}

fun Application.module() {
    configureHTTP()
    configurationRoute()
}
