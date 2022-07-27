import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CryptoService } from 'src/crypto/crypto.service'
import { Repository } from 'typeorm'
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
}
