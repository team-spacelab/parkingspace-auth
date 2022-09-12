import { UserStatus } from 'parkingspace-commons'

export class CurrentUserDto {
  id: number
  login: string
  nickname?: string
  phone?: string
  isVerified: boolean
  realname?: string
  birthday?: string
  point: number
  status: keyof typeof UserStatus
}
