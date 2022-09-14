import { Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common'
import { Cars, ResponseBody } from 'parkingspace-commons'
import { CarService } from './cars.service'
import { CreateMyCarDto } from './dto/CreateMyCar.dto'
import { UpdateMyCarDto } from './dto/UpdateMyCar.dto'

@Controller('cars')
export class CarController {
  private readonly carService: CarService

  constructor (carService: CarService) {
    this.carService = carService
  }

  @Get('@me')
  public async getMyCars (@Res({ passthrough: true }) res): Promise<ResponseBody<{ cars: Cars[] }>> {
    const cars = await this.carService.getMyCar(res.locals.userId)

    return {
      success: true,
      data: {
        cars
      }
    }
  }

  @Post('@me')
  public async createMyCar (@Res({ passthrough: true }) res, @Body() body: CreateMyCarDto): Promise<ResponseBody<{ car: Cars }>> {
    const car = await this.carService.createMyCar(res.locals.userId, body)

    return {
      success: true,
      data: {
        car
      }
    }
  }

  @Put(':carId')
  public async updateMyCar (@Res({ passthrough: true }) res, @Param('carId') carId: number, @Body() body: UpdateMyCarDto): Promise<ResponseBody<{ car: Cars }>> {
    const car = await this.carService.updateMyCar(res.locals.userId, carId, body)

    return {
      success: true,
      data: {
        car
      }
    }
  }

  @Delete(':carId')
  public async deleteMyCar (@Res({ passthrough: true }) res, @Param('carId') carId: number): Promise<ResponseBody> {
    await this.carService.deleteMyCar(res.locals.userId, carId)

    return {
      success: true
    }
  }
}
