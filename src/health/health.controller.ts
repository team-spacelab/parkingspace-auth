import { Controller, Get } from '@nestjs/common'
import { ResponseBody } from 'src/interface/ResponseBody'

@Controller('health')
export class HealthController {
  @Get()
  public healthCheck (): ResponseBody {
    return {
      success: true
    }
  }
}
