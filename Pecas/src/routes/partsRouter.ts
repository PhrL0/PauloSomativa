import fastify,{FastifyInstance} from "fastify";
import { partsController } from "../controller/partsController";


export async function partsRouter(fastify: FastifyInstance) {
    fastify.get('/getPeca', partsController.fetchAllParts)
    fastify.post('/postPeca', partsController.aircraftParts)
}