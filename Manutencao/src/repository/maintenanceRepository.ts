import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const maintenanceRepository = {

    saveMaintenance: async(aircraftId: string,serviceType: string,description: string,openedAt: string): Promise<any>=>{
        try{
            const result = await prisma.maintenance.create({
                data:{
                   aircraftId:aircraftId,
                   serviceType:serviceType,
                   description:description,
                   openedAt:openedAt
                }
            });

            return result;
        } catch(err){
            console.error("Erro aos cadastrar manutenção", err);
        }
    },
    fetchAllMaintenance: async():Promise<any[]>=>{
        return await prisma.maintenance.findMany();
    }
}