import { NodeProps } from "@xyflow/react";
import React, { memo } from "react";
import NodeCard from "@/app/workflow/_components/nodes/NodeCard";
import NodeHeader from "./NodeHeader";
import { AppNodeData } from "@/types/appNode";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { NodeInput, NodeInputs } from "./NodeInputs";
import { NodeOutput, NodeOutputs } from "./NodeOutputs";
import { Badge } from "@/components/ui/badge";

const NodeComponent = memo((props: NodeProps) => {
   const nodeData = props.data as AppNodeData;
   const task = TaskRegistry[nodeData.type];

   return (
      <NodeCard isSelected={!!props.selected} nodeId={props.id}>
         <NodeHeader taskType={nodeData.type} nodeId={props.id} />
         <NodeInputs>
            {task.inputs.map(input => (
               <NodeInput key={input.name} input={input} nodeId={props.id} />
            ))}
         </NodeInputs>
         <NodeOutputs>
            {task.outputs.map(output => (
               <NodeOutput key={output.name} output={output} />
            ))}
         </NodeOutputs>
      </NodeCard>
   );
});

export default NodeComponent;

NodeComponent.displayName = "NodeComponent";
