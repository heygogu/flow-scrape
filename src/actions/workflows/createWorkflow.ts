"use server"

import prisma from "@/lib/db";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { createWorkflowSchema, createWorkflowSchemaType } from "@/schema/workflow";
import { AppNode } from "@/types/appNode";
import { TaskType } from "@/types/task";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { Edge } from "@xyflow/react";
import { redirect } from "next/navigation";


export async function CreateWorkflow(form: createWorkflowSchemaType) {
    const { success, data } = createWorkflowSchema.safeParse(form);
    if (!success) {
        throw new Error("invalid form data");
    }

    const { userId } = auth();
    if (!userId) {
        throw new Error("Unauthenticated")
    }

    const initialFlow: {
        nodes: AppNode[], edges: Edge[]
    } = {
        nodes: [],
        edges: []
    }

    initialFlow.nodes.push(CreateFlowNode(TaskType.LAUNCH_BROWSER))

    if (data.description) {
        data.description = data.description.trim();
    }
    const result = await prisma.workflow.create({
        data: {
            userId,
            status: WorkflowStatus.DRAFT,
            definition: "{}",
            ...data
        }
    })

    if (!result) {
        throw new Error("Failded to create workflow")
    }

    redirect(`/workflow/editor/${result.id}`)
}