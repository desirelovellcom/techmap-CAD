import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"

export const CustomNode = memo(({ data, isConnectable }: NodeProps) => {
  return (
    <div className="rounded-md border bg-background p-3 shadow-md" style={{ borderColor: data.color }}>
      <div className="flex items-center justify-between">
        <div className="font-medium" style={{ color: data.color }}>
          {data.label}
        </div>
        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: data.color }} />
      </div>
      <div className="mt-2 text-xs text-muted-foreground">{data.description}</div>
      <div className="mt-1 text-xs">{data.specs}</div>

      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="!bg-background !border-primary"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="!bg-background !border-primary"
      />
    </div>
  )
})

CustomNode.displayName = "CustomNode"
