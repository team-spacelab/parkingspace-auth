import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class DeleteUserDto {
  @IsString()
  @ApiProperty()
  public readonly password: string
}
