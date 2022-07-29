import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

/* eslint-disable no-unused-vars */

export enum UserStatus {
  ENABLED,
  BLOCKED,
  PENDING_DELETE,
  DELETED
}

/* eslint-enable no-unused-vars */

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn({ name: 'users_id' })
  public readonly id: number

  @Column({ name: 'users_login' })
  public readonly login: string

  @Column({ name: 'users_nickname' })
  public readonly nickname: string

  @Column({ name: 'users_password' })
  public readonly password: string

  @Column({ name: 'users_salt' })
  public readonly salt: string

  @Column({ name: 'users_phone' })
  public readonly phone?: string

  @Column({ name: 'users_isverified' })
  public readonly isVerified: boolean

  @Column({ name: 'users_realname' })
  public readonly realname?: string

  @Column({ name: 'users_birth', type: 'date' })
  public readonly birthday?: Date

  @Column({ name: 'users_status' })
  public readonly status: UserStatus

  @Column({ name: 'users_createdat', type: 'timestamp' })
  public readonly createdAt: Date
}
