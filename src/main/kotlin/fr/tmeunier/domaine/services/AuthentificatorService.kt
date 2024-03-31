package fr.tmeunier.domaine.services

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import fr.tmeunier.domaine.models.User
import fr.tmeunier.domaine.repositories.RefreshTokenRepository
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneId
import java.util.*

class AuthentificatorService
{
    private val TOKEN_DURATION_MS: Long = 5 * 60 * 1000
    private val REFRESH_TOKEN_DURATION_MS: Long = 60 * 60 * 24 * 7 * 1000

    private val repository = RefreshTokenRepository()

    fun createJwtToken(user: User): String {
        return JWT.create()
            .withSubject(user.id.toString())
            .withClaim("name", user.name)
            .withClaim("email", user.email)
            .withIssuer("cdn.tmeunier.fr")
            .withExpiresAt(Date(System.currentTimeMillis() + TOKEN_DURATION_MS))
            .sign(Algorithm.HMAC256("IAmSecret"))
    }

    suspend fun createRefreshToken(userId: Int): String {
        return repository.create(userId, REFRESH_TOKEN_DURATION_MS)
    }

    suspend fun updateRefreshToken(refreshToken: String): String {
        return repository.update(refreshToken, REFRESH_TOKEN_DURATION_MS)
    }

    fun refreshTokenIsValid(expiresAt: LocalDateTime): Boolean {
        return System.currentTimeMillis() < expiresAt.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()
    }
}