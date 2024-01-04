import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeCheckInService } from '@/services/factories/make-check-in-service'

export async function create(req: FastifyRequest, res: FastifyReply) {
    const createChechInParamsSchema = z.object({
        gymId: z.string().uuid(),
    })

    const createCheckInBodySchema = z.object({
        latitude: z.number().refine(value => {
            return Math.abs(value) <= 90
        }),
        longitude: z.number().refine(value => {
            return Math.abs(value) <= 180
        })
    })

    const { gymId } = createChechInParamsSchema.parse(req.params)
    const { latitude, longitude } = createCheckInBodySchema.parse(req.body)

    const checkInService = makeCheckInService()

    await checkInService.execute({
        gymId,
        userId: req.user.sub,
        userLatitude: latitude,
        userLongitude: longitude
    })

    return res.status(201).send()
}
