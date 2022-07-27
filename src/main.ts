import { ValidationPipe, VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter } from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app/app.module'
import { HttpExceptionFilter } from './app/exception.filter'

async function bootstrap () {
  const adapter = new FastifyAdapter({ logger: true })
  const app = await NestFactory.create(AppModule, adapter, { })
  const config = new DocumentBuilder()
    .setTitle('AuthServer@ParkingSpace')
    .setDescription('Authorization & Authentification')
    .setVersion('v1')
    .build()

  app.useGlobalPipes(new ValidationPipe({
    always: true,
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true
  }))

  app.useGlobalFilters(new HttpExceptionFilter())
  app.setGlobalPrefix('api/auth')

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1'
  })

  const docs = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/auth/_docs', app, docs)

  await app.listen(3000, '0.0.0.0')
}

bootstrap()
