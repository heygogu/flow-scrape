"use server"
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server"

export async function GetWorkflowsForUser() {
    const { userId } = auth();
    if (!userId) {
        throw new Error("unauthorized")
    }

    return prisma.workflow.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "asc"
        }
    })
}