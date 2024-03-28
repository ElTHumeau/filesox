package fr.tmeunier.domaine.services

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import java.time.Instant
import java.util.*

class AuthentificatorService
{
    private val TOKEN_DURATION_MS = 5 * 60 * 1000
    private val REFRESH_TOKEN_DURATION_MS = 60 * 60 * 24 * 7 * 1000

    val refreshTokenRepository = RefreshTokenRepository()

    fun createJwtToken(user: User): String {
        return JWT.create()
            .withSubject(user.id.toString())
            .withClaim("name", user.name)
            .withClaim("email", user.email)
            .withIssuer("cdn.tmeunier.fr")
            .withExpiresAt(Date(System.currentTimeMillis() + TOKEN_DURATION_MS))
            .sign(Algorithm.HMAC256("IAmSecret"))
    }

    fun createRefreshToken(userId: Int): String {
        return refreshTokenRepository.create(userId, REFRESH_TOKEN_DURATION_MS)
    }

    fun updateRefreshToken(refreshToken: String): String {
        return refreshTokenRepository.update(refreshToken, REFRESH_TOKEN_DURATION_MS)
    }

    fun refreshTokenIsValid(expiresAt: Instant): Boolean {
        return Date(System.currentTimeMillis() + TOKEN_DURATION_MS) < Date.from(expiresAt)
    }
}