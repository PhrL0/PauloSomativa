import fastify,{FastifyInstance} from "fastify";
import { maintenanceController } from "../controller/maintenanceController";


export async function maintenanceRouter(fastify: FastifyInstance) {
    fastify.get('/getManu', maintenanceController.fetchAllAircrafts)
    fastify.post('/postManu', maintenanceController.aircraftRegistration)
}