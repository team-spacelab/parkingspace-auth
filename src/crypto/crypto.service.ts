import { ForbiddenException, Injectable, InternalServerErrorException, NotAcceptableException, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import { Users, UserStatus } from 'src/users/users.entity'
import shajs from 'sha.js'

@Injectable()
export class CryptoService {
  private readonly jwtService: JwtService
  private readonly SERVER_TOKEN: string

  constructor (jwtService: JwtService, configService: ConfigService) {
    this.jwtService = jwtService
    this.SERVER_TOKEN = configService.get<string>('SERVER_TOKEN', 'youshallnotpass')
  }

  /** generate client token with provided user entity */
  public generateClientToken (user: Users): string {
    if ([UserStatus.BLOCKED, UserStatus.DELETED].includes(user.status)) {
      throw new ForbiddenException('USER_STATUS_NOT_ALLOWED_TO_GENERATE_CLIENT_TOKEN')
    }

    return this.jwtService.sign({ sub: user.id })
  }

  /** verify client token and returns client user id (if malformed, throw an error) */
  public verifyClientToken (token: string): number {
    try {
      const payload = this.jwtService.verify(token) as { sub?: unknown }

      if (typeof payload?.sub !== 'number') {
        throw new NotAcceptableException('TOKEN_MALFORMED')
      }

      return payload.sub
    } catch (e) {
      if (e instanceof JsonWebTokenError) {
        throw new NotAcceptableException('TOKEN_MALFORMED')
      }

      if (e instanceof TokenExpiredError) {
        throw new UnauthorizedException('TOKEN_EXPIRED')
      }

      throw new InternalServerErrorException('JWT_SERVICE_ERROR')
    }
  }

  /** verify server token and returns result (true: acceptable / false: unauthorized) */
  public verifyServerToken (token: string): boolean {
    return token === this.SERVER_TOKEN
  }

  /** verify user password and returns result (true: valied password, false: invalied password) */
  public verifyUserPassword (password: string, user: Users): boolean {
    const hashedPassword =
      shajs('sha512')
        .update(user.salt + password)
        .digest('hex')

    return hashedPassword === user.password
  }

  /** generate new salt string */
  public generateSalt (): string {
    return new Array(4)
      .fill(1)
      .map(() => String.fromCharCode(Math.floor(Math.random() * 11139) + 44032))
      .join('')
  }

  /** sha512 hash with provided password & salt */
  public hashUserPassword (password: string, salt: string): string {
    return shajs('sha512').update(salt + password).digest('hex')
  }
}
