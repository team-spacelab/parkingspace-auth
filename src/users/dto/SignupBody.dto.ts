import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export class SignupBodyDto {
  @IsString()
  @MinLength(5)
  @MaxLength(30)
  @ApiProperty()
  public readonly login: string

  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(15)
  @ApiProperty()
  public readonly nickname?: string

  @IsString()
  @MinLength(8)
  @ApiProperty()
  public readonly password: string
}
