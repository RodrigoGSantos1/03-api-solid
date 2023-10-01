import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInService } from './check-in'
import { InMenoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repositoory'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMenoryGymsRepository
let sut: CheckInService

describe('Check-in Service', () => {
  beforeEach(async () => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMenoryGymsRepository()
    sut = new CheckInService(inMemoryCheckInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'Teste Gym',
      description: '',
      phone: '',
      latitude: -23.6265292,
      longitude: -46.4489193,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.6265292,
      userLongitude: -46.4489193,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 8, 30, 22, 44, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.6265292,
      userLongitude: -46.4489193,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -23.6265292,
        userLongitude: -46.4489193,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should not be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2023, 8, 30, 22, 44, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.6265292,
      userLongitude: -46.4489193,
    })

    vi.setSystemTime(new Date(2023, 9, 2, 22, 44, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.6265292,
      userLongitude: -46.4489193,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'Teste Gym 2',
      description: '',
      phone: '',
      latitude: new Decimal(-23.6169129),
      longitude: new Decimal(-46.5998953),
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -23.6265292,
        userLongitude: -46.4489193,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
