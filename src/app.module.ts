import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CryptoModule, DBConfigService, HealthModule, LoggerModule, ResolveTokenMiddleware } from 'parkingspace-commons'
import { CarModule } from './cars/cars.module'
import { UsersModule } from './users/users.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useClass: DBConfigService
    }),
    CryptoModule,
    HealthModule,
    UsersModule,
    LoggerModule,
    CarModule
  ]
})
export class AppModule implements NestModule {
  public configure (consumer: MiddlewareConsumer) {
    consumer
      .apply(ResolveTokenMiddleware)
      .forRoutes('/')
  }
}
