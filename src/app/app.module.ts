import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ResolveTokenMiddleware } from 'src/crypto/crypto.middleware'
import { CryptoModule } from 'src/crypto/crypto.module'
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
