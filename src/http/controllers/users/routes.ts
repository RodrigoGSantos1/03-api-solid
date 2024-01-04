import { FastifyInstance } from 'fastify'
import { register } from './register'
import { authenticate } from './authenticate'
import { profile } from './profile'
import { verifyJWT } from '../../middlewares/verify-jwt'

export async function usersRoutes(app: FastifyInstance) {
  // Public Routes
  app.post('/users', register)
  app.post('/sessions', authenticate)

  // Private Routes
  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
