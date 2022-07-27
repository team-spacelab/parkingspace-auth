import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class LoginBodyDto {
  @IsString()
  @ApiProperty()
  public readonly id: string

  @IsString()
  @ApiProperty()
  public readonly password: string
}
