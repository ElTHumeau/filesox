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
    private val JWT_ACCESS_TOKEN_EXPIRATION_TIME: Long = 2 // access token refreshed every 2 mins
    private val JWT_REFRESH_TOKEN_EXPIRATION_TIME: Long = 60 * 16 // maximum session lifetime of 16h

    fun createJwtToken(user: User): String {
        return JWT.create()
            .withSubject(user.id.toString())
            .withClaim("id", user.id)
            .withClaim("name", user.name)
            .withClaim("email", user.email)
            .withClaim("file_path", user.filePath)
            .withClaim("layout", user.layout)
            .withAudience(Security.jwtAudience)
            .withIssuer(Security.jwtIssuer)
            .withExpiresAt(LocalDateTime.now().plusMinutes(JWT_ACCESS_TOKEN_EXPIRATION_TIME).atZone(ZoneId.systemDefault()).toInstant())
            .sign(Algorithm.HMAC256(Security.jwtSecret))
    }

    suspend fun createRefreshToken(userId: Int): String {
        return RefreshTokenRepository.create(userId, JWT_REFRESH_TOKEN_EXPIRATION_TIME)
    }

    suspend fun updateRefreshToken(refreshToken: String): String {
        return RefreshTokenRepository.update(refreshToken, JWT_REFRESH_TOKEN_EXPIRATION_TIME)
    }

    fun refreshTokenIsValid(expiresAt: LocalDateTime): Boolean {
        return System.currentTimeMillis() < expiresAt.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()
    }
}