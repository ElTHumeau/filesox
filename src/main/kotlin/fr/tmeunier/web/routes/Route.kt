package fr.tmeunier.web.routes

import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Application.configurationRoute() {
    install(ContentNegotiation) {
        json()
    }

    routing {
        authRouting()

        authenticate("jwt") {
            get("/hello-word") {
                call.respond(mapOf("hello" to "world"))
            }
        }
    }
}
