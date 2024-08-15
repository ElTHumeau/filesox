package fr.tmeunier.domaine.services.filesSystem.local

import java.nio.file.Files
import java.nio.file.Paths

object FolderFileStorageService {

    fun create(name: String) {
       Files.createDirectories(Paths.get(name))
    }
}