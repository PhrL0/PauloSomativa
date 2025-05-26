import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const aeronaveRepository = {

    saveAeronave: async(model: string,manufacturer: string,flightHours: string,serialNumber: number): Promise<any>=>{
        try{
            const result = await prisma.aircraft.create({
                data:{
                   model:model,
                   manufacturer:manufacturer,
                   flightHours:flightHours,
                   serialNumber:serialNumber
                }
            });

            return result;
        } catch(err){
            console.error("Erro aos cadastrar aeronave", err);
        }
    },
    fetchAllAircrafts: async():Promise<any[]>=>{
        const result = await prisma.aircraft.findMany({
          include: {
            maintenances: true
          }
        });
        return result
        
    }
}