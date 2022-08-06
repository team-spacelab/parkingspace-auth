import { IsString } from 'class-validator'

export class DeleteUserDto {
  @IsString()
  public readonly password: string
}
