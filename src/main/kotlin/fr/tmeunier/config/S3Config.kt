package fr.tmeunier.config

import aws.sdk.kotlin.runtime.auth.credentials.StaticCredentialsProvider
import aws.sdk.kotlin.services.s3.S3Client
import aws.smithy.kotlin.runtime.net.url.Url
import io.github.cdimascio.dotenv.Dotenv
import io.github.cdimascio.dotenv.dotenv

object S3Config {
    val bucketName: String

    private val dotenv: Dotenv = dotenv {
        directory = "."
        filename = ".env"
        ignoreIfMalformed = true
        ignoreIfMissing = true
    }

    private val aws_endpoint = dotenv["AWS_URL"] ?: "http://localhost:9000"
    private val aws_region = dotenv["AWS_REGION"] ?: "eu-west-1"
    private val aws_access_key = dotenv["AWS_ACCESS_KEY_ID"] ?: ""
    private val aws_secret_key = dotenv["AWS_SECRET_ACCESS_KEY"] ?: ""

    init {
        bucketName = dotenv["AWS_BUCKET_NAME"] ?: "http://localhost:9000"
    }

    fun makeClient(): S3Client? = runCatching {
        S3Client.builder().apply {
            config.apply {
                region = aws_region
                endpointUrl = Url.parse(aws_endpoint)
                forcePathStyle = true
                credentialsProvider = StaticCredentialsProvider.Builder().apply {
                    accessKeyId = aws_access_key
                    secretAccessKey = aws_secret_key
                }.build()
            }
        }.build()
    }.getOrNull()

}