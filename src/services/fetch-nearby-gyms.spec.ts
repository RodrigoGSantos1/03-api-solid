import { expect, describe, it, beforeEach } from 'vitest'
import { InMenoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repositoory'
import { FetchNearbyGymsService } from './fetch-nearby-gyms'

let gymsRepository: InMenoryGymsRepository
let sut: FetchNearbyGymsService

describe('Fetch Nearby Gyms Service', () => {
  beforeEach(async () => {
    gymsRepository = new InMenoryGymsRepository()
    sut = new FetchNearbyGymsService(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: null,
      phone: null,
      latitude: -23.6265292,
      longitude: -46.4489193,
    })

    await gymsRepository.create({
      title: 'Far Gym',
      description: null,
      phone: null,
      latitude: -24.3313393,
      longitude: -54.9733082,
    })

    const { gyms } = await sut.execute({
      userLatitude: -23.6265292,
      userLongitude: -46.4489193,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
