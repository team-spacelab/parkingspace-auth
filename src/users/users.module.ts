import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CryptoModule } from 'src/crypto/crypto.module'
import { UsersController } from './users.controller'
import { Users } from './users.entity'
import { UsersService } from './users.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    CryptoModule
  ],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
