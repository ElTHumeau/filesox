package fr.tmeunier

import fr.tmeunier.config.Database
import fr.tmeunier.config.configureHTTP
import fr.tmeunier.config.configureSecurity
import fr.tmeunier.web.routes.configurationRoute
import io.ktor.client.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*

fun main() {
    Database.init("127.0.0.1", "tmeunier-cdn", "tmeunier-cdn", "tmeunier-cdn")

    embeddedServer(Netty, port = 8080, host = "0.0.0.0", module = Application::module)
        .start(wait = true)
}

fun Application.module() {
    configureSecurity()
    configureHTTP()
    configurationRoute()
}
