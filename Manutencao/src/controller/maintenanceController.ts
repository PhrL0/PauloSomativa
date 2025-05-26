import { maintenanceRepository } from "../repository/maintenanceRepository";
import { FastifyReply, FastifyRequest } from "fastify";

export const maintenanceController = {
    fetchAllAircrafts: async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            const response = await maintenanceRepository.fetchAllMaintenance();

            return reply.send({
                success: true,
                data: response,
            });
        } catch (error) {
            console.error("Erro na controller manutenção", error);
            reply.status(500).send({
                error: 'Erro interno ao processar a requisição',
                message: error || 'Erro desconhecido'
            });
        }
    },

    aircraftRegistration: async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            const { aircraftId, serviceType, description, openedAt} = request.body as {
                aircraftId: string;
                serviceType: string;
                description: string;
                openedAt: string;
            };

            if (!aircraftId) {
                return reply.status(400).send({ error: 'Id aeronave é obrigatório.' });
            }

            const response = await maintenanceRepository.saveMaintenance(
                aircraftId,
                serviceType,
                description,
                openedAt,
            );

            if (response) {
                return reply.status(200).send({
                    success: true
                });
            }
        } catch (error) {
            console.error("Erro na controller manutenção", error);
            reply.status(500).send({
                error: 'Erro interno ao processar a requisição',
                message: error || 'Erro desconhecido'
            });
        }
    }
};