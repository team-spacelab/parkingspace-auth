import { Injectable, NotAcceptableException, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CryptoService } from 'src/crypto/crypto.service'
import { Repository } from 'typeorm'
import { CurrentUserDto } from './dto/CurrentUser.dto'
import { SignupBodyDto } from './dto/SignupBody.dto'
import { UpdateUserDto } from './dto/UpdateUser.dto'
import { Users } from './users.entity'

@Injectable()
export class UsersService {
  private readonly cryptoService: CryptoService
  private readonly users: Repository<Users>

  constructor (cryptoService: CryptoService, @InjectRepository(Users) users) {
    this.cryptoService = cryptoService
    this.users = users
  }

  public async userLogin (login: string, password: string): Promise<string> {
    const user = await this.users.findOneBy({ login })
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
    const user = await this.users.findOneBy({ id: userId })
    if (!user) throw new NotFoundException('USER_NOT_FOUND')

    return {
      id: userId,
      login: user.login,
      point: user.point,
      nickname: user.nickname,
      isVerified: user.isVerified,
      birthday: user.birthday ? (user.birthday.getMonth() + 1).toFixed(2) + user.birthday.getDate().toFixed(2) : undefined,
      phone: user.phone,
      realname: user.realname
    }
  }

  public async updateCurrentUserInfo (userId: number, userInfo: UpdateUserDto): Promise<void> {
    const user = await this.users.findOneBy({ id: userId })
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
      ...(userInfo.newPassword === undefined ? {} : { password, salt })
    })
  }
}
