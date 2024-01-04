import { GetUserMetricsService } from '../get-user-metricts'
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'

export function makeGetUserMetricsService() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const useCase = new GetUserMetricsService(checkInsRepository)

  return useCase
}
