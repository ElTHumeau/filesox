package fr.tmeunier.config

import org.jetbrains.exposed.sql.Database

object Database {
     private lateinit var connexion: Database;

    fun init(host: String, database: String, user: String, password: String) {
        connexion =  Database.connect(
            url = "jdbc:mariadb://${host}:3306/${database}",
            driver = "org.mariadb.jdbc.Driver",
            user = user,
            password = password
        )
    }

    fun getConnexion(): Database {
        if (!::connexion.isInitialized) {
            throw IllegalStateException("Database connexion has not been initialized")
        }

        return connexion
    }
}

