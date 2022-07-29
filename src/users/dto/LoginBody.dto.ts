import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class LoginBodyDto {
  @IsString()
  @ApiProperty()
  public readonly login: string

  @IsString()
  @ApiProperty()
  public readonly password: string
}
