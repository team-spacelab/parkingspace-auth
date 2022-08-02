import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { CryptoService } from './crypto.service'

@Injectable()
export class ResolveTokenMiddleware implements NestMiddleware {
  private readonly cryptoService: CryptoService

  constructor (cryptoService: CryptoService) {
    this.cryptoService = cryptoService
  }

  public use (req: Request, res: Response, next: NextFunction) {
    const { SESSION_TOKEN: sessionToken } = req.cookies

    if (sessionToken) {
      res.locals.userId =
        this.cryptoService.verifyClientToken(sessionToken)
    }

    const { authorization } = req.headers
    if (!authorization) return next()

    const [type, token] = authorization.split(' ')
    if (!token) return next()

    if (type.toLowerCase() === 'token') {
      res.locals.isVerfiedServer =
        this.cryptoService.verifyServerToken(token)
    }

    next()
  }
}
