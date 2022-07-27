import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'

@Injectable()
export class DBConfigService implements TypeOrmOptionsFactory {
  private readonly config: ConfigService

  constructor (configService: ConfigService) {
    this.config = configService
  }

  public createTypeOrmOptions (): TypeOrmModuleOptions {
    return {
      type: 'mariadb',
      host: this.config.get<string>('DATABASE_HOST', '127.0.0.1'),
      port: this.config.get<number>('DATABASE_PORT', 3306),
      username: this.config.get<string>('DATABASE_USER', 'parkingspace'),
      password: this.config.get<string>('DATABASE_PASSWD', ''),
      database: this.config.get<string>('DATABASE_SCHEMA', 'parkingspace'),
      autoLoadEntities: true
    }
  }
}
