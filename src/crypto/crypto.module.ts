import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { CryptoService } from './crypto.service'

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('SESSION_SECRET', 'youshallnotpass'),
        signOptions: {
          expiresIn: '30 days',
          algorithm: 'HS512',
          issuer: 'AuthServer@ParkingSpace'
        },
        verifyOptions: {
          algorithms: ['HS512'],
          issuer: 'AuthServer@ParkingSpace'
        }
      })
    }),
    ConfigModule
  ],
  providers: [CryptoService],
  exports: [CryptoService]
})
export class CryptoModule {}
