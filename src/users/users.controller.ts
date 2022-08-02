import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common'
import { Response } from 'express'
import { ClientGuard } from 'src/crypto/crypto.guard'
import { ResponseBody } from 'src/interface/ResponseBody'
import { CurrentUserDto } from './dto/CurrentUser.dto'
import { LoginBodyDto } from './dto/LoginBody.dto'
import { SignupBodyDto } from './dto/SignupBody.dto'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  private readonly usersService: UsersService

  constructor (usersService: UsersService) {
    this.usersService = usersService
  }

  @Post('@login')
  public async userLogin (@Body() body: LoginBodyDto): Promise<ResponseBody<{ token: string }>> {
    const token = await this.usersService.userLogin(body.login, body.password)

    return {
      success: true,
      data: {
        token
      }
    }
  }

  @Post()
  public async userSignup (@Body() body: SignupBodyDto): Promise<ResponseBody> {
    await this.usersService.userSignup(body)

    return {
      success: true
    }
  }

  @Get('@me')
  @UseGuards(ClientGuard)
  public async getCurrentUser (@Res({ passthrough: true }) res: Response): Promise<ResponseBody<CurrentUserDto>> {
    const data = await this.usersService.getCurrentUserInfo(res.locals.userId)

    return {
      success: true,
      data
    }
  }
}
