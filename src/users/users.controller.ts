import { Body, Controller, Delete, Get, Patch, Post, Res, UseGuards } from '@nestjs/common'
import { Response } from 'express'
import { ClientGuard, ResponseBody } from 'parkingspace-commons'
import { CurrentUserDto } from './dto/CurrentUser.dto'
import { DeleteUserDto } from './dto/DeleteUser.dto'
import { LoginBodyDto } from './dto/LoginBody.dto'
import { SignupBodyDto } from './dto/SignupBody.dto'
import { UpdateUserDto } from './dto/UpdateUser.dto'
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
      success: true,
      data: undefined
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

  @Patch('@me')
  @UseGuards(ClientGuard)
  public async patchCurrentUser (@Res({ passthrough: true }) res: Response, @Body() body: UpdateUserDto): Promise<ResponseBody> {
    await this.usersService.updateCurrentUserInfo(res.locals.userId, body)

    return {
      success: true,
      data: undefined
    }
  }

  @Delete('@me')
  @UseGuards(ClientGuard)
  public async deleteCurrentUser (@Res({ passthrough: true }) res: Response, @Body() body: DeleteUserDto): Promise<ResponseBody> {
    await this.usersService.deleteCurrentUser(res.locals.userId, body)

    return {
      success: true,
      data: undefined
    }
  }

  @Post('@me/@restore')
  @UseGuards(ClientGuard)
  public async restoreCurrentUser (@Res({ passthrough: true }) res: Response): Promise<ResponseBody> {
    await this.usersService.restoreCurrentUser(res.locals.userId)

    return {
      success: true,
      data: undefined
    }
  }
}
