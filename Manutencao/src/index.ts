import Fastify from 'fastify'
import cors from '@fastify/cors'
import { maintenanceRouter } from './routes/aeronaveRouter'
const fastify = Fastify({ logger: true })

fastify.register(cors, {
  origin: true, 
})

fastify.register(maintenanceRouter)

async function start() {
  try {
    await fastify.listen({ port: 3000 })
    console.log('🚀 HTTP rodando em http://localhost:3000')

  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()