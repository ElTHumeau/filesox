package fr.tmeunier.web.routes.admin

import fr.tmeunier.web.controller.admin.AdminUserController
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.adminUserRouting()
{
    route("/admin")
    {
        get("/users")
        {
            val users = AdminUserController().getAll()
            call.respond(users)
        }

        post("/create")
        {
            return@post AdminUserController().create(call)
        }

        put("/update/{id}")
        {
            return@put AdminUserController().update(call)
        }

        delete("/delete/{id}")
        {
            return@delete AdminUserController().delete(call)
        }
    }
}