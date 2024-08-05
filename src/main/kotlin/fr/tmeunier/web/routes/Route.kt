package fr.tmeunier.web.routes

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import fr.tmeunier.config.Security
import fr.tmeunier.web.routes.admin.adminLogRouting
import fr.tmeunier.web.routes.admin.adminRouting
import fr.tmeunier.web.routes.admin.adminUserRouting
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.util.*
import roleBased
import withRole

val RolesKey = AttributeKey<Set<String>>("roles")

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

            roleBased {
                extractRoles { principal ->
                    (principal as JWTPrincipal).payload.claims?.get("roles")?.asList(String::class.java)?.toSet()
                        ?: emptySet()
                }
            }
        }
    }

    routing {
        authRouting()

        authenticate("jwt") {
            folderRoutes()
            profileRouting()

            get("/hello-word") {
                val requiredRoles = call.attributes.getOrNull(RolesKey)
                call.respondText("Route - Required Roles: $requiredRoles")
                call.respond(mapOf("hello" to Security.getUserId()))
            }

            route("/"){

                withRole(Security.ADMIN){
                    adminUserRouting()
                    adminLogRouting()
                    adminRouting()
                }
            }
        }
    }
}
