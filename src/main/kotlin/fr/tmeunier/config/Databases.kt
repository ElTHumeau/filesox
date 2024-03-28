package fr.tmeunier.config

import org.jetbrains.exposed.sql.Database

object Database {
    private lateinit var connexion: Database;

    fun init(host: String, database: String, user: String, password: String) {
        connexion =  Database.connect("jdbc:mariadb://${host}:3306/${database}","org.mariadb.jdbc.Driver", user,password)
    }

    fun connexion(): Database {
        return connexion
    }
}

