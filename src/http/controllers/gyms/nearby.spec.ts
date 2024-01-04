import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Nearby Gyms (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to search gyms', async () => {

        const { token } = await createAndAuthenticateUser(app)

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Test Gym',
                description: null,
                phone: null,
                latitude: -23.6265292,
                longitude: -46.4489193,
            })

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Typescript Gym',
                description: null,
                phone: null,
                latitude: -30.3313393,
                longitude: -54.9733082,
            })

        const response = await request(app.server)
            .get('/gyms/nearby')
            .query({
                latitude: -23.6265292,
                longitude: -46.4489193,
            })
            .set('Authorization', `Bearer ${token}`)
            .send()


        expect(response.statusCode).toEqual(200)
        // expect(response.body.gyms).toHaveLength(1)

        // expect(response.body.gyms).toEqual([
        //     expect.objectContaining({
        //         title: 'Test Gym',
        //     })
        // ])
    })
})
