package fr.tmeunier.web.routes.admin

import fr.tmeunier.web.controller.admin.AdminLogController
import io.ktor.server.application.*
import io.ktor.server.routing.*

fun Route.adminLogRouting()
{
    route("/admin")
    {
        get("/logs")
        {
            return@get AdminLogController().getAll(call)
        }
    }
}