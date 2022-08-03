import { LoggerService } from '@nestjs/common'

export class Logger implements LoggerService {
  log (message: any, ...optionalParams: any[]) {
    if (process.env.DEBUG === undefined) return
    console.log(JSON.stringify({
      type: 'NESTJS_LOG',
      message,
      extra: optionalParams
    }))
  }

  error (message: any, ...optionalParams: any[]) {
    console.log(JSON.stringify({
      type: 'ERROR_LOG',
      message,
      extra: optionalParams
    }))
  }

  warn (message: any, ...optionalParams: any[]) {
    console.log(JSON.stringify({
      type: 'WARNING_LOG',
      message,
      extra: optionalParams
    }))
  }

  debug? (message: any, ...optionalParams: any[]) {
    if (process.env.DEBUG === undefined) return
    console.log(JSON.stringify({
      type: 'NESTJS_DEBUG_LOG',
      message,
      extra: optionalParams
    }))
  }

  verbose? (message: any, ...optionalParams: any[]) {
    if (process.env.DEBUG === undefined) return
    console.log(JSON.stringify({
      type: 'NESTJS_VERBOSE_LOG',
      message,
      extra: optionalParams
    }))
  }
}
