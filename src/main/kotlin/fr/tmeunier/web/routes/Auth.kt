package fr.tmeunier.web.routes

import io.ktor.server.routing.*

fun Route.authRouting() {
    route("/auth") {
        post("/login") {
            // Handle login
        }
        post("/register") {
            // Handle register
        }

        post("/refresh") {
            // Handle logout
        }

        post("/logout") {
            // Handle refresh
        }
    }
}