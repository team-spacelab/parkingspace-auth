import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Cars } from 'parkingspace-commons'
import { CarController } from './cars.controller'
import { CarService } from './cars.service'

@Module({
  imports: [TypeOrmModule.forFeature([Cars])],
  providers: [CarService],
  controllers: [CarController]
})
export class CarModule {}
