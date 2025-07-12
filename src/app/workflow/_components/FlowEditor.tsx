"use client";
import { Workflow } from "@prisma/client";
import {
   addEdge,
   Background,
   BackgroundVariant,
   Connection,
   Controls,
   Edge,
   getOutgoers,
   ReactFlow,
   useEdgesState,
   useNodesState,
   useReactFlow,
} from "@xyflow/react";
import React, { useCallback, useEffect, useRef } from "react";
import "@xyflow/react/dist/style.css";
import NodeComponent from "./nodes/NodeComponent";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { TaskType } from "@/types/task";
import { AppNode } from "@/types/appNode";
import DeletableEdge from "./edges/DeletableEdge";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { toast } from "sonner";

const nodeTypes = {
   FlowScrapeNode: NodeComponent,
};

const edgeTypes = {
   default: DeletableEdge,
};

const snapGrid: [number, number] = [50, 50];
const fitViewOptions = { padding: 1 };

function FlowEditor({ workflow }: { workflow: Workflow }) {
   const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
   const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
   const { setViewport, updateNodeData, screenToFlowPosition } = useReactFlow();
   const nodesRef = useRef(nodes);
   nodesRef.current = nodes;
   useEffect(() => {
      try {
         const flow = JSON.parse(workflow.definition);
         if (!flow) return;
         setNodes(flow.nodes || []);
         setEdges(flow.edges || []);

         if (!flow.viewport) {
            return;
         }

         const { x = 0, y = 0, zoom = 1 } = flow.viewport;
         setViewport({ x, y, zoom });
      } catch (error) {}
   }, [setEdges, setNodes, workflow.definition, setViewport]);

   const onDragOver = useCallback((event: React.DragEvent) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
   }, []);

   const onDrop = useCallback(
      (event: React.DragEvent) => {
         event.preventDefault();
         const taskType = event.dataTransfer.getData("application/reactflow");
         if (typeof taskType === undefined || !taskType) return;

         const position = screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
         });
         const newNode = CreateFlowNode(taskType as TaskType, position);
         setNodes(nds => nds.concat(newNode));
      },
      [screenToFlowPosition, setNodes]
   );

   const onConnect = useCallback(
      (connection: Connection) => {
         setEdges(eds => addEdge({ ...connection, animated: true }, eds));
         if (!connection.targetHandle) return;
         //remove input values if present on connection

         const currentNodes = nodesRef.current;
         const node = currentNodes.find(nd => nd.id === connection.target);
         if (!node) return;

         const nodeInputs = node.data.inputs;

         updateNodeData(node.id, {
            inputs: {
               ...nodeInputs,
               [connection.targetHandle]: "",
            },
         });
      },
      [setEdges, updateNodeData]
   );

   const isValidConnection = useCallback(
      (connection: Edge | Connection) => {
         // no self connection
         if (connection.source === connection.target) {
            return false;
         }

         //same taskParam type connection
         const source = nodes.find(node => node.id === connection.source);
         const target = nodes.find(node => node.id === connection.target);
         if (!source || !target) {
            toast.error("Source or Target not found", { id: "not-found" });
            return false;
         }

         const sourceTask = TaskRegistry[source?.data.type];
         const targetTask = TaskRegistry[target?.data.type];

         const output = sourceTask.outputs.find(
            o => o.name === connection.sourceHandle
         );

         const input = targetTask.inputs.find(
            o => o.name === connection.targetHandle
         );

         if (input?.type !== output?.type) {
            toast.info("Invalid connection: type mismatch", {
               id: "type-mismatch",
            });
            return false;
         }

         //detecting the cycle

         const hasCycle = (node: AppNode, visited = new Set()) => {
            if (visited.has(node.id)) return false;

            visited.add(node.id);

            for (const outgoer of getOutgoers(node, nodes, edges)) {
               if (outgoer.id === connection.source) return true;
               if (hasCycle(outgoer, visited)) return true;
            }
         };

         const detectedCycle = hasCycle(target);
         if (detectedCycle)
            toast.info("Invalid connection: cycles not allowed ", {
               id: "no-cycle",
            });
         return !detectedCycle;
      },
      [nodes, edges]
   );

   return (
      <main className="h-full w-full">
         <ReactFlow
            nodes={nodes}
            edges={edges}
            onEdgesChange={onEdgesChange}
            onNodesChange={onNodesChange}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            snapToGrid
            snapGrid={snapGrid}
            fitViewOptions={fitViewOptions}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onConnect={onConnect}
            isValidConnection={isValidConnection}

            // fitView -> after commenting this , viewport will be restored from last save
         >
            <Controls position="top-left" fitViewOptions={fitViewOptions} />
            <Background variant={BackgroundVariant.Dots} gap={12} />
         </ReactFlow>
      </main>
   );
}

export default FlowEditor;
