import { Body, Controller, Post } from '@nestjs/common'
import { ResponseBody } from 'src/interface/ResponseBody'
import { LoginBodyDto } from './dto/LoginBody.dto'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  private readonly usersService: UsersService

  constructor (usersService: UsersService) {
    this.usersService = usersService
  }

  @Post('@login')
  public async userLogin (@Body() body: LoginBodyDto): Promise<ResponseBody<{ token: string }>> {
    const token = await this.usersService.userLogin(body.id, body.password)

    return {
      success: true,
      data: {
        token
      }
    }
  }
}
