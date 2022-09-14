import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Cars, CarStatus, CarType } from 'parkingspace-commons'
import { Repository } from 'typeorm'
import { CreateMyCarDto } from './dto/CreateMyCar.dto'
import { UpdateMyCarDto } from './dto/UpdateMyCar.dto'

export class CarService {
  private readonly cars: Repository<Cars>

  constructor (@InjectRepository(Cars) cars) {
    this.cars = cars
  }

  public async getMyCar (userId: number) {
    return this.cars.findBy({ userId })
  }

  public async createMyCar (userId: number, body: CreateMyCarDto) {
    const { generatedMaps } = await this.cars.insert({
      ...body,
      userId,
      type: CarType[body.type]
    })

    return generatedMaps[0] as Cars
  }

  public async updateMyCar (userId: number, carId: number, body: UpdateMyCarDto) {
    const car = await this.cars.findOneBy({ id: carId })
    if (!car) {
      throw new NotFoundException('CAR_ID_NOT_FOUND')
    }

    if (car.userId !== userId) {
      throw new ForbiddenException('NOT_ALLOW_TO_DELETE')
    }

    const { generatedMaps } = await this.cars.update({ id: carId }, {
      ...(body.alias !== undefined ? { alias: body.alias } : {}),
      ...(body.type !== undefined ? { type: CarType[body.type] as unknown as CarType } : {})
    })

    return generatedMaps[0] as Cars
  }

  public async deleteMyCar (userId: number, carId: number) {
    const car = await this.cars.findOneBy({ id: carId })
    if (!car) {
      throw new NotFoundException('CAR_ID_NOT_FOUND')
    }

    if (car.userId !== userId) {
      throw new ForbiddenException('NOT_ALLOW_TO_DELETE')
    }

    await this.cars.update({ id: carId }, {
      status: CarStatus.DELETED
    })
  }
}
