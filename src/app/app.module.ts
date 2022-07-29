import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ResolveTokenMiddleware } from 'src/crypto/crypto.middleware'
import { CryptoModule } from 'src/crypto/crypto.module'
import { HealthModule } from 'src/health/health.module'
import { UsersModule } from 'src/users/users.module'
import { DBConfigService } from './dbconfig.service'

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
    UsersModule
  ]
})
export class AppModule implements NestModule {
  public configure (consumer: MiddlewareConsumer) {
    consumer
      .apply(ResolveTokenMiddleware)
      .forRoutes('/')
  }
}
