package fr.tmeunier.domaine.services.filesSystem

import java.text.StringCharacterIterator

object StorageService {

    fun getIconForFile(fileName: String): String {
        return when {
            fileName.endsWith(".pdf") -> "pdf"
            fileName.endsWith(".doc") || fileName.endsWith(".docx") || fileName.endsWith(".odt")-> "doc"
            fileName.endsWith(".xls") || fileName.endsWith(".xlsx") -> "excel"
            fileName.endsWith(".ppt") || fileName.endsWith(".pptx") -> "ppt"
            fileName.endsWith(".txt") -> "txt"
            fileName.endsWith(".zip") -> "zip"
            fileName.endsWith(".rar") -> "rar"
            fileName.endsWith(".tar") -> "tar"
            fileName.endsWith(".gz") -> "gzip"
            fileName.endsWith(".php") -> "php"
            fileName.endsWith(".html") -> "html"
            fileName.endsWith(".css") -> "css"
            fileName.endsWith(".sql") -> "sql"
            fileName.endsWith(".js") -> "js"
            fileName.endsWith(".json") -> "json"
            fileName.endsWith(".ps") -> "ps"
            fileName.endsWith(".bin") -> "bin"
            fileName.endsWith(".exe") -> "exe"
            fileName.endsWith(".iso") -> "iso"
            fileName.endsWith(".mp3") || fileName.endsWith(".wav") -> "audio"
            fileName.endsWith(".mp4") || fileName.endsWith(".avi") || fileName.endsWith(".mkv") -> "video"
            else -> "file"
        }
    }

    fun Long.toHumanReadableValue(): String {
        var bytes = this
        if (-1000 < bytes && bytes < 1000) {
            return "${bytes}B";
        }
        val ci = StringCharacterIterator("kMGTPE");
        while (bytes <= -999_950 || bytes >= 999_950) {
            bytes /= 1000
            ci.next()
        }
        return String.format("%.2f %cB", bytes / 1000.0, ci.current())
    }
}