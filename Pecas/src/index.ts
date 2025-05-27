import Fastify from 'fastify'
import cors from '@fastify/cors'
import { partsRouter } from './routes/partsRouter'
const fastify = Fastify({ logger: true })

fastify.register(cors, {
  origin: true, 
})

fastify.register(partsRouter)

async function start() {
  try {
    await fastify.listen({ port: 3001, host:'0.0.0.0'})
    console.log('🚀 HTTP rodando em http://localhost:3000')

  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()