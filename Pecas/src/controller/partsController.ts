import { partsRepository } from "../repository/partsRepository";
import { FastifyReply, FastifyRequest } from "fastify";

export const partsController = {
    fetchAllParts: async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            const response = await partsRepository.fetchAllParts();

            return reply.send({
                success: true,
                data: response,
            });
        } catch (error) {
            console.error("Erro na controller peças", error);
            reply.status(500).send({
                error: 'Erro interno ao processar a requisição',
                message: error || 'Erro desconhecido'
            });
        }
    },

    aircraftParts: async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            const { name, partNumber, amount, supplier,maintenanceId} = request.body as {
                name: string;
                partNumber: string;
                amount: number;
                supplier: string;
                maintenanceId: string;
            };

            if (!maintenanceId) {
                return reply.status(400).send({ error: 'Id aeronave é obrigatório.' });
            }

            const response = await partsRepository.saveParts(
                name,
                partNumber,
                amount,
                supplier,
                maintenanceId
            );

            if (response) {
                return reply.status(200).send({
                    success: true
                });
            }
        } catch (error) {
            console.error("Erro na controller peças", error);
            reply.status(500).send({
                error: 'Erro interno ao processar a requisição',
                message: error || 'Erro desconhecido'
            });
        }
    }
};