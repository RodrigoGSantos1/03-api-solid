import { expect, describe, it } from 'vitest'
import { RegisterService } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

describe('Register Service', () => {
  it('should de able to register', async () => {
    const userRepository = new InMemoryUsersRepository()
    const registerService = new RegisterService(userRepository)

    const { user } = await registerService.execute({
      name: 'Test User',
      email: 'test2@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const userRepository = new InMemoryUsersRepository()
    const registerService = new RegisterService(userRepository)

    const { user } = await registerService.execute({
      name: 'Test User',
      email: 'test2@example.com',
      password: '123456',
    })

    const isPasswordCorectHashed = await compare('123456', user.password_hash)

    expect(isPasswordCorectHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const userRepository = new InMemoryUsersRepository()
    const registerService = new RegisterService(userRepository)

    const email = 'test2@example.com'

    await registerService.execute({
      name: 'Test User',
      email,
      password: '123456',
    })

    await expect(() =>
      registerService.execute({
        name: 'Test User',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
