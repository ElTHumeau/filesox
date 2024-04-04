package fr.tmeunier.web.routes

import fr.tmeunier.web.controller.ProfileController
import io.ktor.server.application.*
import io.ktor.server.routing.*

fun Route.profileRouting()
{
    route("/profile")
    {

        post("/update")
        {
            return@post ProfileController().update(call)
        }

        post("/update/password")
        {
            return@post ProfileController().updatePassword(call)
        }
    }
}