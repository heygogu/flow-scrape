'use client';

import { Button } from '@/components/ui/button';
import {
   BaseEdge,
   EdgeLabelRenderer,
   EdgeProps,
   getBezierPath,
   getSmoothStepPath,
   useReactFlow,
} from '@xyflow/react';
import React from 'react';

const DeletableEdge = (props: EdgeProps) => {
   const [edgePath, labelX, labelY] = getSmoothStepPath(props);
   const { setEdges } = useReactFlow();
   return (
      <>
         <BaseEdge
            path={edgePath}
            markerEnd={props.markerEnd}
            style={props.style}
         />
         <EdgeLabelRenderer>
            <div
               style={{
                  position: 'absolute',
                  transform: `translate(-50%,-50%) translate(${labelX}px,${labelY}px)`,
                  pointerEvents: 'all',
               }}
            >
               <Button
                  onClick={() => {
                     setEdges(edges =>
                        edges.filter(edge => edge.id !== props.id)
                     );
                  }}
                  variant="outline"
                  className="dark:bg-primary/80 dark:text-white/90 h-8 w-5 border cursor-pointer rounded-full text-xs leading-none hover:shadow-lg"
               >
                  X
               </Button>
            </div>
         </EdgeLabelRenderer>
      </>
   );
};

export default DeletableEdge;
