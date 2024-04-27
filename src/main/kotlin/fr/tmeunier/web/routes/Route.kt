package fr.tmeunier.web.routes

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import fr.tmeunier.config.Security
import fr.tmeunier.domaine.services.filesSystem.FolderSystemService
import fr.tmeunier.web.routes.admin.adminLogRouting
import fr.tmeunier.web.routes.admin.adminUserRouting
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.io.File

fun Application.configurationRoute() {
    install(ContentNegotiation) {
        json()
    }

    authentication {
        jwt("jwt") {
            realm = Security.jwtRealm
            verifier(
                JWT
                    .require(Algorithm.HMAC256(Security.jwtSecret))
                    .withAudience(Security.jwtAudience)
                    .withIssuer(Security.jwtIssuer)
                    .build()
            )
            validate { credential ->
                Security.customValidator(credential)
            }
        }
    }

    routing {
        authRouting()

        authenticate("jwt") {
            folderRoutes()
            profileRouting()
            adminUserRouting()
            adminLogRouting()

            get("/hello-word") {
                call.respond(mapOf("hello" to  Security.getUserId()))
            }
        }
    }
}
