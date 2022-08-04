import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { setupCommons } from 'parkingspace-commons'

async function bootstrap () {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true
  })

  setupCommons(app, 'auth')

  const config = new DocumentBuilder()
    .setTitle('AuthServer@ParkingSpace')
    .setDescription('Authorization & Authentification')
    .setVersion('v1')
    .build()

  const docs = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/auth/_docs', app, docs)

  await app.listen(3000)
}

bootstrap()
