package fr.tmeunier.domaine.repositories

import aws.smithy.kotlin.runtime.util.type
import fr.tmeunier.config.Database
import fr.tmeunier.domaine.models.S3File
import fr.tmeunier.domaine.models.S3Folder
import fr.tmeunier.domaine.models.S3Response
import fr.tmeunier.domaine.models.Storage
import fr.tmeunier.domaine.services.filesSystem.StorageService
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.SqlExpressionBuilder.isNull
import org.jetbrains.exposed.sql.javatime.datetime
import org.jetbrains.exposed.sql.transactions.transaction
import java.util.UUID

object StorageRepository {

    private val database = Database.getConnexion()

    object Storages : Table() {
        val id = uuid("id")
        val name = varchar("name", length = 255).nullable()
        val path = varchar("path", length = 255)
        val size = varchar("size", 10).nullable()
        val type = varchar("type", length = 20)
        val parent = varchar("parent", length = 255).nullable()
        val icon = varchar("icon", length = 255).nullable()
        val updatedAt = datetime("updated_at")

        override val primaryKey = PrimaryKey(id)
    }

    init {
        transaction(database) {
            SchemaUtils.create(Storages)
        }
    }

    fun findAllByPath(path: String?): S3Response {
        val folders = mutableListOf<S3Folder>()
        val files = mutableListOf<S3File>()

        transaction(database) {
            val rows = Storages.select {
                if (path != "null") {
                    Storages.parent eq path
                } else {
                    Storages.parent.isNull()
                }
            }

            rows.forEach { row ->
                when (row[Storages.type]) {
                    "folder" -> folders.add(
                        S3Folder(
                            id = row[Storages.id],
                            path = row[Storages.path],
                            parent = row[Storages.parent]
                        )
                    )
                    else -> files.add(
                        S3File(
                            id = row[Storages.id],
                            path = row[Storages.path],
                            name = row[Storages.name],
                            parent = row[Storages.parent],
                            size = row[Storages.size],
                            icon = row[Storages.icon]
                        )
                    )
                }
            }
        }

        return S3Response(folders, files)
    }

    fun findAllByFolder(folder: String): List<Storage> {
        return transaction(database) {
            val resultRows = Storages
                .select { Storages.path like "%$folder%" }

            // Mapping des résultats en objets Storage
            resultRows.map { row ->
                Storage(
                    id = row[Storages.id],
                    path = row[Storages.path],
                    type = row[Storages.type],
                    updatedAt = row[Storages.updatedAt].toString(),
                    name = row[Storages.name],
                    size = row[Storages.size]
                )
            }
        }
    }

    fun create(path: String, type: String, name: String?, size: String?, parent: String?, icon: String?): UUID {
        return transaction(database) {
            Storages.insert {
                it[id] = UUID.randomUUID()
                it[Storages.name] = name
                it[Storages.path] = path
                it[Storages.size] = size
                it[Storages.type] = type
                it[Storages.icon] = icon
                it[Storages.parent] = parent
                it[updatedAt] = java.time.LocalDateTime.now()
            } get Storages.id
        }
    }

    fun moveById(id: UUID, newPath: String, isParent: Boolean = false) {
        val parent = StorageService.getParentPath(newPath, isParent)

        transaction(database) {
            Storages.update({ Storages.id eq id }) {
                it[Storages.path] = newPath
                it[Storages.parent] = parent
                it[updatedAt] = java.time.LocalDateTime.now()
            }
        }
    }

    fun delete(id: UUID) {
        transaction(database) {
            Storages.deleteWhere { Storages.id eq id }
        }
    }
}