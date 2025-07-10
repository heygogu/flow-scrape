import { NodeProps } from '@xyflow/react'
import React, { memo } from 'react'
import NodeCard from '@/app/workflow/_components/nodes/NodeCard'
import NodeHeader from './NodeHeader'
import { AppNodeData } from '@/types/appNode'

const NodeComponent = memo((props: NodeProps) => {

    const nodeData = props.data as AppNodeData
    return (
        <NodeCard isSelected={!!props.selected} nodeId={props.id}>
            <NodeHeader taskType={nodeData.type} />
        </NodeCard>
    )
})

export default NodeComponent

NodeComponent.displayName = "NodeComponent"