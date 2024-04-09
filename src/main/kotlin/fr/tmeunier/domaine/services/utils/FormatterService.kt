package fr.tmeunier.domaine.services.utils

import java.time.LocalDateTime
import java.time.format.DateTimeFormatter


private fun defaultFormat(): DateTimeFormatter {
    return DateTimeFormatter.ofPattern("dd/MM/yyyy")
}

fun formatDate(date: LocalDateTime): String {
    return date.format(defaultFormat())
}