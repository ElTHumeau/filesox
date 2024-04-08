package fr.tmeunier.domaine.services

import fr.tmeunier.domaine.repositories.LogRepository

class LogService
{
    companion object {
        const val ACTION_CREATE = "create"
        const val ACTION_UPDATE = "update"
        const val ACTION_DELETE = "delete"
        const val ACTION_RESTORE = "restore"
        const val ACTION_LOGIN = "login"
    }

    suspend fun add(user: Int, action: String, subject: String): Int {
        return LogRepository().create(user, action, subject)
    }
}