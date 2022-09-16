import { Injectable, NotAcceptableException, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CryptoService, Users, UserStatus } from 'parkingspace-commons'
import { Repository } from 'typeorm'
import { CurrentUserDto } from './dto/CurrentUser.dto'
import { DeleteUserDto } from './dto/DeleteUser.dto'
import { SignupBodyDto } from './dto/SignupBody.dto'
import { UpdateUserDto } from './dto/UpdateUser.dto'

@Injectable()
export class UsersService {
  private readonly cryptoService: CryptoService
  private readonly users: Repository<Users>

  constructor (cryptoService: CryptoService, @InjectRepository(Users) users) {
    this.cryptoService = cryptoService
    this.users = users
  }

  public async userLogin (login: string, password: string): Promise<string> {
    const user = await this.users.findOne({
      where: { login },
      select: { id: true, password: true, salt: true, status: true }
    })
    if (!user) throw new UnauthorizedException('USER_NOT_FOUND_OR_PASSWORD_INVALID')

    const result = this.cryptoService.verifyUserPassword(password, user)
    if (!result) throw new UnauthorizedException('USER_NOT_FOUND_OR_PASSWORD_INVALID')

    return this.cryptoService.generateClientToken(user)
  }

  public async userSignup (body: SignupBodyDto) {
    const user = await this.users.findOneBy({ login: body.login })
    if (user) throw new NotAcceptableException('USER_ALREADY_REGISTERD')

    if (!body.password.match(/\d/) || !body.password.match(/[a-z]/i)) {
      throw new NotAcceptableException('PASSWORD_TOO_WEAK')
    }

    const salt = this.cryptoService.generateSalt()
    const password = this.cryptoService.hashUserPassword(body.password, salt)

    await this.users.insert({
      ...body,
      password,
      salt
    })
  }

  public async getCurrentUserInfo (userId: number): Promise<CurrentUserDto> {
    const user = await this.users.findOne({
      where: {
        id: userId
      },
      select: {
        id: true,
        login: true,
        point: true,
        nickname: true,
        isVerified: true,
        birthday: true,
        phone: true,
        realname: true,
        status: true
      }
    })
    if (!user) throw new NotFoundException('USER_NOT_FOUND')

    return {
      id: userId,
      login: user.login,
      point: user.point,
      nickname: user.nickname,
      isVerified: user.isVerified,
      birthday: user.birthday ? (user.birthday.getMonth() + 1).toFixed(2) + user.birthday.getDate().toFixed(2) : undefined,
      phone: user.phone,
      realname: user.realname,
      status: UserStatus[user.status] as keyof typeof UserStatus
    }
  }

  public async updateCurrentUserInfo (userId: number, userInfo: UpdateUserDto): Promise<void> {
    const user = await this.users.findOne({
      select: {
        password: true,
        salt: true
      },
      where: {
        id: userId
      }
    })
    if (!user) throw new NotFoundException('USER_NOT_FOUND')

    let password: undefined | string
    let salt: undefined | string

    if (userInfo.newPassword) {
      if (!this.cryptoService.verifyUserPassword(userInfo.oldPassword!, user)) {
        throw new NotAcceptableException('INVALIED_OLD_PASSWORD')
      }

      if (!userInfo.newPassword.match(/\d/) || !userInfo.newPassword.match(/[a-z]/i)) {
        throw new NotAcceptableException('PASSWORD_TOO_WEAK')
      }

      salt = this.cryptoService.generateSalt()
      password = this.cryptoService.hashUserPassword(userInfo.newPassword, salt)
    }

    await this.users.update({ id: user.id }, {
      ...(userInfo.birthday === undefined ? {} : { birthday: userInfo.birthday }),
      ...(userInfo.nickname === undefined ? {} : { nickname: userInfo.nickname }),
      ...(userInfo.realname === undefined ? {} : { realname: userInfo.realname }),
      ...(userInfo.phone === undefined ? {} : { phone: userInfo.phone }),
      ...(userInfo.newPassword === undefined ? {} : { password, salt })
    })
  }

  public async deleteCurrentUser (userId: number, data: DeleteUserDto): Promise<void> {
    const user = await this.users.findOne({
      select: {
        password: true,
        salt: true
      },
      where: {
        id: userId
      }
    })
    if (!user) throw new NotFoundException('USER_NOT_FOUND')

    if (!this.cryptoService.verifyUserPassword(data.password, user)) {
      throw new NotAcceptableException('PASSWORD_INVALID')
    }

    await this.users.update({ id: userId }, {
      status: UserStatus.PENDING_DELETE,
      deleteAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    })
  }

  public async restoreCurrentUser (userId: number): Promise<void> {
    const user = await this.users.findOneBy({ id: userId })
    if (!user) throw new NotFoundException('USER_NOT_FOUND')

    await this.users.update({ id: userId }, {
      status: UserStatus.ENABLED
    })
  }
}
