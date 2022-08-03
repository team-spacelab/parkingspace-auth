import { ApiProperty } from '@nestjs/swagger'
import { IsNumberString, IsOptional, IsPhoneNumber, IsString, Length, MaxLength, MinLength } from 'class-validator'

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(15)
  @ApiProperty()
  public readonly nickname?: string

  @IsString()
  @IsOptional()
  @Length(11)
  @IsPhoneNumber('KR')
  @ApiProperty()
  public readonly phone?: string

  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(20)
  @ApiProperty()
  public readonly realname?: string

  @IsString()
  @IsOptional()
  @Length(6)
  @IsNumberString()
  @ApiProperty()
  public readonly birthday?: string

  @IsString()
  @IsOptional()
  @MinLength(8)
  @ApiProperty()
  public readonly oldPassword?: string

  @IsString()
  @IsOptional()
  @MinLength(8)
  @ApiProperty()
  public readonly newPassword?: string
}
