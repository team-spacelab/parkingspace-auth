import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Response } from 'express'

@Injectable()
export class ServerGuard implements CanActivate {
  public canActivate (context: ExecutionContext) {
    const response = context.switchToHttp().getResponse<Response>()

    return !!response.locals.isVerfiedServer
  }
}

@Injectable()
export class ClientGuard implements CanActivate {
  public canActivate (context: ExecutionContext) {
    const response = context.switchToHttp().getResponse<Response>()

    return response.locals.userId !== undefined
  }
}
