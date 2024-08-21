package fr.tmeunier.web.routes.admin

import fr.tmeunier.config.Security
import fr.tmeunier.domaine.response.AdminSharesResponse
import fr.tmeunier.web.controller.admin.AdminLogController
import fr.tmeunier.web.controller.admin.AdminShareController
import io.ktor.server.application.*
import io.ktor.server.routing.*
import withRole

fun Route.adminShareRouting()
{
    route("admin")
    {
       withRole(Security.ADMIN) {
           get("/shares")
           {
               return@get AdminShareController.findAll(call)
           }

           post("/shares/delete}")
           {
               return@post AdminShareController.delete(call)
           }
       }
    }
}