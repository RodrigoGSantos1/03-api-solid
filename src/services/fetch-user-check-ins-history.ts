import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface fetchUserCheckInsHistoryServiceRequest {
  userId: string
  page: number
}

interface fetchUserCheckInsHistoryServiceResponse {
  checkIns: CheckIn[]
}

export class FetchUserCheckInsHistoryService {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
    page,
  }: fetchUserCheckInsHistoryServiceRequest): Promise<fetchUserCheckInsHistoryServiceResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page,
    )

    return {
      checkIns,
    }
  }
}
