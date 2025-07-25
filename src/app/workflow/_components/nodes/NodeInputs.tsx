import { cn } from "@/lib/utils";
import { TaskParam } from "@/types/task";
import { Handle, Position, useEdges, useReactFlow } from "@xyflow/react";
import React from "react";
import NodeParamField from "./NodeParamField";
import { ColorForHandle } from "./common";
import useFlowValidation from "@/components/hooks/useFlowValidation";

export function NodeInputs({ children }: { children: React.ReactNode }) {
   return <div className="flex flex-col divide-y gap-2">{children}</div>;
}

export function NodeInput({
   input,
   nodeId,
}: {
   input: TaskParam;
   nodeId: string;
}) {
   const { invalidInputs } = useFlowValidation();

   const hasErrors = invalidInputs
      .find(node => node.nodeId === nodeId)
      ?.inputs.find(invalidInput => invalidInput === input.name);

   const edges = useEdges();
   const isConnected = edges.some(
      edge => edge.target === nodeId && edge.targetHandle === input.name
   );
   return (
      <div
         className={cn(
            "flex justify-start relative rounded-b-sm p-3 bg-secondary w-full",
            hasErrors && "bg-destructive/30"
         )}
      >
         <NodeParamField param={input} nodeId={nodeId} disabled={isConnected} />
         {!input.hideHandle && (
            <Handle
               isConnectable={!isConnected}
               className={cn(
                  "!bg-muted-foreground !border-background !border-2 !-left-2 !w-4 !h-4",
                  ColorForHandle[input.type]
               )}
               id={input.name}
               type="target"
               position={Position.Left}
            ></Handle>
         )}
      </div>
   );
}
