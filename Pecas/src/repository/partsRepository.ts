import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const partsRepository = {

    saveParts: async(name: string,partNumber: string,amount: number,supplier: string,maintenanceId: string): Promise<any>=>{
        try{
            const result = await prisma.$executeRawUnsafe(`
              INSERT INTO Component (id, name, partNumber, amount, supplier, maintenanceId)
              VALUES (UUID(), ?, ?, ?, ?, ?)
            `, name, partNumber, amount, supplier, maintenanceId);


            return result;
        } catch(err){
            console.error("Erro aos cadastrar peças", err);
        }
    },
    fetchAllParts: async():Promise<any[]>=>{
        return await prisma.$queryRawUnsafe(`SELECT * FROM Component`);
    }
}