package fr.tmeunier.domaine.services.utils

import java.time.LocalDateTime
import java.time.format.DateTimeFormatter


private fun defaultFormat(): DateTimeFormatter {
    return DateTimeFormatter.ofPattern("dd/MM/yyyy")
}

fun formatDate(date: LocalDateTime, format: String? = null): String {
    val formatter = if (format == null) defaultFormat() else DateTimeFormatter.ofPattern(format)
    return date.format(formatter)
}