import { cn } from '@/lib/utils';
import { TaskParam } from '@/types/task';
import { Handle, Position } from '@xyflow/react';
import React from 'react';
import NodeParamField from './NodeParamField';

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
   return (
      <div className="flex justify-start relative rounded-b-sm p-3 bg-secondary w-full">
         <NodeParamField param={input} nodeId={nodeId} />
         {!input.hideHandle && (
            <Handle
               className={cn(
                  '!bg-muted-foreground !border-background !border-2 !-left-2 !w-4 !h-4'
               )}
               id={input.name}
               type="target"
               position={Position.Left}
            ></Handle>
         )}
      </div>
   );
}
