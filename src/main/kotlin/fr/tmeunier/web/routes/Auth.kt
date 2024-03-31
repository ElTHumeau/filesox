package fr.tmeunier.web.routes

import fr.tmeunier.web.controller.AuthController
import io.ktor.server.application.*
import io.ktor.server.routing.*

fun Route.authRouting() {

    route("/auth") {
        post("/login") {
            return@post AuthController().login(call)
        }

        post("/register") {
            return@post AuthController().register(call)
        }

        post("/refresh") {
           return@post AuthController().refresh(call)
        }

        post("/logout") {
            return@post AuthController().logout(call)
        }
    }
}