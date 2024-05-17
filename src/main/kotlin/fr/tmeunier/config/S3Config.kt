package fr.tmeunier.config

import aws.sdk.kotlin.runtime.auth.credentials.StaticCredentialsProvider
import aws.sdk.kotlin.services.s3.S3Client
import aws.smithy.kotlin.runtime.net.url.Url

object S3Config {

    const val endpoint = "https://s3.lfremaux.fr"
    const val bucketName = "filetransfer-tmeunier"
    const val accessKey = "filetransfer-tmeunier"
    const val secretKey = "3JNqy4b4ZunaZynBUZY3ZXT2JDHg4ogFKnd5j77B"


    fun makeClient(): S3Client? = runCatching {
        S3Client.builder().apply {
            config.apply {
                region = "eu-west-1"
                endpointUrl = Url.parse(endpoint)
                forcePathStyle = true
                credentialsProvider = StaticCredentialsProvider.Builder().apply {
                    accessKeyId = accessKey
                    secretAccessKey = secretKey
                }.build()
            }
        }.build()
    }.getOrNull()

}