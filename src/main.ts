import { BadRequestException, ValidationPipe, VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app/app.module'
import { HttpExceptionFilter } from './app/exception.filter'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import { Response } from 'express'
import { Logger } from './app/logger.service'

async function bootstrap () {
  const app = await NestFactory.create(AppModule, {
    logger: new Logger()
  })

  const config = new DocumentBuilder()
    .setTitle('AuthServer@ParkingSpace')
    .setDescription('Authorization & Authentification')
    .setVersion('v1')
    .build()

  app.useGlobalPipes(new ValidationPipe({
    always: true,
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
    exceptionFactory: (errors) =>
      new BadRequestException(
        'VALIDATION_FAILED: ' +
        errors
          .map((v) => Object.values(v.constraints))
          .flat().join('\n'))
  }))

  app.useGlobalFilters(new HttpExceptionFilter())
  app.setGlobalPrefix('api/auth')

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1'
  })

  app.use(cookieParser())
  app.use(morgan((tokens, req, res) =>
    JSON.stringify({
      type: 'ACCESS_LOG',
      method: tokens.method(req, res),
      path: tokens.url(req, res),
      return: tokens.status(req, res),
      userAgent: tokens['user-agent'](req, res),
      time: tokens['response-time'](req, res),
      date: tokens.date(req, res, 'iso'),
      locals: (res as Response).locals
    })))

  const docs = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/auth/_docs', app, docs)

  await app.listen(3000)
}

bootstrap()
