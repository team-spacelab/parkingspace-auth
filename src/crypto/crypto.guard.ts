import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common'
import { Response } from 'express'

@Injectable()
export class ServerGuard implements CanActivate {
  public canActivate (context: ExecutionContext) {
    const response = context.switchToHttp().getResponse<Response>()
    if (!response.locals.isVerfiedServer) {
      throw new ForbiddenException('SERVER_NOT_VERIFIED')
    }

    return true
  }
}

@Injectable()
export class ClientGuard implements CanActivate {
  public canActivate (context: ExecutionContext) {
    const response = context.switchToHttp().getResponse<Response>()
    if (response.locals.userId === undefined) {
      throw new UnauthorizedException('CLIENT_NOT_LOGINED')
    }

    return true
  }
}
