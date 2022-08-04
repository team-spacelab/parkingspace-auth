import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CryptoModule, Users } from 'parkingspace-commons'
import { UsersController } from './users.controller'
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
