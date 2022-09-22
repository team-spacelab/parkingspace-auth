import { ApiProperty } from '@nestjs/swagger'
import { IsIn, IsString, Length, MaxLength, MinLength } from 'class-validator'
import { CarType } from 'parkingspace-commons'

export class CreateMyCarDto {
  @IsString()
  @MinLength(2)
  @MaxLength(10)
  @ApiProperty()
  public readonly alias: string

  @IsString()
  @Length(7, 16)
  @ApiProperty()
  public readonly number: string

  @IsString()
  @IsIn([CarType[CarType.LIGHTCAR], CarType[CarType.COMPACTCAR], CarType[CarType.SUBCOMPACTCAR], CarType[CarType.MIDSIZECAR], CarType[CarType.SEMILARGECAR], CarType[CarType.LARGECAR]])
  @ApiProperty()
  public readonly type: keyof typeof CarType
}
