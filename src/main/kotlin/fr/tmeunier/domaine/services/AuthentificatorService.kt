package fr.tmeunier.domaine.services

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import fr.tmeunier.config.Security
import fr.tmeunier.domaine.models.User
import fr.tmeunier.domaine.repositories.RefreshTokenRepository
import java.time.LocalDateTime
import java.time.ZoneId

class AuthentificatorService
{
    private val TOKEN_DURATION_MS: Long = 5 * 60 * 1000
    private val REFRESH_TOKEN_DURATION_MS: Long = 60 * 60 * 24 * 7 * 1000


    fun createJwtToken(user: User): String {
        return JWT.create()
            .withSubject(user.id.toString())
            .withClaim("id", user.id)
            .withClaim("name", user.name)
            .withClaim("email", user.email)
            .withAudience(Security.jwtAudience)
            .withIssuer(Security.jwtIssuer)
            .withExpiresAt(LocalDateTime.now().plusMinutes(TOKEN_DURATION_MS).atZone(ZoneId.systemDefault()).toInstant())
            .sign(Algorithm.HMAC256(Security.jwtSecret))
    }

    suspend fun createRefreshToken(userId: Int): String {
        return RefreshTokenRepository.create(userId, REFRESH_TOKEN_DURATION_MS)
    }

    suspend fun updateRefreshToken(refreshToken: String): String {
        return RefreshTokenRepository.update(refreshToken, REFRESH_TOKEN_DURATION_MS)
    }

    fun refreshTokenIsValid(expiresAt: LocalDateTime): Boolean {
        return System.currentTimeMillis() < expiresAt.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()
    }
}