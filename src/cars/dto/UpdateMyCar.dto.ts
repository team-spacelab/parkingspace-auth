import { ApiProperty } from '@nestjs/swagger'
import { IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import { CarType } from 'parkingspace-commons'

export class UpdateMyCarDto {
  @IsString()
  @MinLength(2)
  @MaxLength(10)
  @IsOptional()
  @ApiProperty()
  public readonly alias?: string

  @IsString()
  @IsOptional()
  @ApiProperty()
  @IsIn([CarType.LIGHTCAR, CarType.COMPACTCAR, CarType.SUBCOMPACTCAR, CarType.MIDSIZECAR, CarType.SEMILARGECAR, CarType.LARGECAR])
  public readonly type?: keyof typeof CarType
}
