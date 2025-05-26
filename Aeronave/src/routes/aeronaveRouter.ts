import fastify,{FastifyInstance} from "fastify";
import { aeronaveController } from "../controller/aeronaveController";


export async function aeronaveRouter(fastify: FastifyInstance) {
    fastify.get('/getAero', aeronaveController.fetchAllAircrafts)
    fastify.post('/postAero', aeronaveController.aircraftRegistration)
}