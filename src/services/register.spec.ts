import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterService } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let usersRepository: InMemoryUsersRepository
let sut: RegisterService

describe('Register Service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterService(usersRepository)
  })

  it('should de able to register', async () => {
    const { user } = await sut.execute({
      name: 'Test User',
      email: 'test2@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'Test User',
      email: 'test2@example.com',
      password: '123456',
    })

    const isPasswordCorectHashed = await compare('123456', user.password_hash)

    expect(isPasswordCorectHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'test2@example.com'

    await sut.execute({
      name: 'Test User',
      email,
      password: '123456',
    })

    await expect(() =>
      sut.execute({
        name: 'Test User',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
