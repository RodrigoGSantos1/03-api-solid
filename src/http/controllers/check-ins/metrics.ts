import { FastifyReply, FastifyRequest } from 'fastify'
import { makeGetUserMetricsService } from '@/services/factories/make-get-user-metricts-service'

export async function metrics(req: FastifyRequest, res: FastifyReply) {
    const getUserMetricsService = makeGetUserMetricsService()

    const { checkInsCount } = await getUserMetricsService.execute({
        userId: req.user.sub,
    })

    return res.status(200).send({
        checkInsCount
    })
}