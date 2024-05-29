package fr.tmeunier.core.permissions

class UnauthorizedAccessException(val denyReasons: MutableList<String>) : Exception()