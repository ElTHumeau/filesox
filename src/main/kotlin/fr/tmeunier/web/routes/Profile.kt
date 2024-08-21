package fr.tmeunier.web.routes

import fr.tmeunier.web.controller.profile.ProfileController
import fr.tmeunier.web.controller.profile.ProfileShareController
import io.ktor.server.application.*
import io.ktor.server.routing.*

fun Route.profileRouting()
{
    route("/profile")
    {
        // Profile
        get {
            return@get ProfileController.getProfile(call)
        }

        post("/update")
        {
            return@post ProfileController.update(call)
        }

        post("/update/password")
        {
            return@post ProfileController.updatePassword(call)
        }

        //Logs
        get("/logs") {
            return@get ProfileController.getLogs(call)
        }

        // Shares
        route("/shares")
        {
            get {
                return@get ProfileShareController.getShares(call)
            }

            post("/delete")
            {
                return@post ProfileShareController.delete(call)
            }
        }
    }
}