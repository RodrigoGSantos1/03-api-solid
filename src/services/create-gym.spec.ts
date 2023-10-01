import { expect, describe, it, beforeEach } from 'vitest'
import { InMenoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repositoory'
import { CreateGymService } from './create-gym'

let gymsRepository: InMenoryGymsRepository
let sut: CreateGymService

describe('Register Service', () => {
  beforeEach(() => {
    gymsRepository = new InMenoryGymsRepository()
    sut = new CreateGymService(gymsRepository)
  })

  it('should de able to register', async () => {
    const { gym } = await sut.execute({
      title: 'Teste Gym',
      description: null,
      phone: null,
      latitude: -23.6265292,
      longitude: -46.4489193,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
