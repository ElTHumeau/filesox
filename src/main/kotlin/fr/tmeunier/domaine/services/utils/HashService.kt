package fr.tmeunier.domaine.services.utils

import at.favre.lib.crypto.bcrypt.BCrypt

object HashService {
    fun hashPassword(password: String): String {
        return  BCrypt.withDefaults().hashToString(12, password.toCharArray())
    }

    fun hashVerify(password: String, hash: String): Boolean {
        return BCrypt.verifyer().verify(password.toCharArray(), hash.toByteArray()).verified
    }
}