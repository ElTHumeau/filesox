package fr.tmeunier.domaine.repositories

import fr.tmeunier.config.Database
import fr.tmeunier.domaine.repositories.FolderRepository.Folders
import fr.tmeunier.domaine.response.S3File
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.javatime.datetime
import org.jetbrains.exposed.sql.transactions.transaction
import java.util.UUID

object FileRepository {

    private val database = Database.getConnexion()

    object Files : Table() {

        val id = uuid("id")
        val name = varchar("name", length = 255)
        val size = varchar("size", 10)
        val icon = varchar("icon", length = 255)
        val parentId = (uuid("parent_id") references FolderRepository.Folders.id).nullable()
        val updatedAt = datetime("updated_at")

        override val primaryKey = PrimaryKey(id)
    }

    init {
        transaction(database) {
            SchemaUtils.create(Files)
        }
    }

    fun findById(id: UUID): S3File? {
        return transaction(database) {
            Files.select { Files.id eq id }.map {
                S3File(
                    it[Files.id],
                    it[Files.name],
                    it[Files.parentId],
                    it[Files.size],
                    it[Files.icon]
                )
            }.firstOrNull()
        }
    }

    fun findAllByParentId(uuid: String): MutableList<S3File> {
        val files = mutableListOf<S3File>()

        transaction(database) {
            val query = if (uuid != "null") {
                Files.select { Files.parentId eq UUID.fromString(uuid) }
            } else {
                Files.select { Files.parentId.isNull() }
            }

           query.forEach {
                files.add(
                    S3File(
                        it[Files.id],
                        it[Files.name],
                        it[Files.parentId],
                        it[Files.size],
                        it[Files.icon]
                    )
                )
            }
        }

        return files
    }

    fun create (name: String, size: String, icon: String, parentId: UUID?): UUID {
        return transaction(database) {
            Files.insert {
                it[id] = UUID.randomUUID()
                it[Files.name] = name
                it[Files.size] = size
                it[Files.icon] = icon
                it[Files.parentId] = parentId
                it[Files.updatedAt] = java.time.LocalDateTime.now()
            }
        } get Files.id
    }

    fun update (id: UUID, name: String, parentId: UUID?) {
        transaction(database) {
            Files.update({ Files.id eq id }) {
                it[Files.name] = name
                it[Files.parentId] = parentId
                it[Files.updatedAt] = java.time.LocalDateTime.now()
            }
        }
    }

    fun move (id: UUID, parentId: UUID) {
        transaction(database) {
            Files.update({ Files.id eq id }) {
                it[Files.parentId] = parentId
                it[Files.updatedAt] = java.time.LocalDateTime.now()
            }
        }
    }

    fun delete(id: UUID) {
        transaction(database) {
            Files.deleteWhere { Files.id eq id }
        }
    }

    fun deleteByParentId (parentId: UUID) {
        transaction(database) {
            Files.deleteWhere { Files.parentId eq parentId }
        }
    }
}