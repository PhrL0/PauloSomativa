import { aeronaveRepository } from "../repository/aeronaveRepository";
import { FastifyReply, FastifyRequest } from "fastify";

export const aeronaveController = {
    fetchAllAircrafts: async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            const response = await aeronaveRepository.fetchAllAircrafts();

            return reply.send({
                success: true,
                data: response,
            });
        } catch (error) {
            console.error("Erro na controller aeronave", error);
            reply.status(500).send({
                error: 'Erro interno ao processar a requisição',
                message: error || 'Erro desconhecido'
            });
        }
    },

    aircraftRegistration: async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            const { model, manufacturer, flightHours, serialNumber} = request.body as {
                model: string;
                manufacturer: string;
                flightHours: string;
                serialNumber: number;
            };

            if (!serialNumber) {
                return reply.status(400).send({ error: 'Número de serial é obrigatório.' });
            }

            const response = await aeronaveRepository.saveAeronave(
                model,
                manufacturer,
                flightHours,
                serialNumber,
            );

            if (response) {
                return reply.status(200).send({
                    success: true
                });
            }
        } catch (error) {
            console.error("Erro na controller aeronave", error);
            reply.status(500).send({
                error: 'Erro interno ao processar a requisição',
                message: error || 'Erro desconhecido'
            });
        }
    }
};