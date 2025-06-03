"use client"

import { useState } from "react"
import { HexColorPicker } from "react-colorful"
import type { Node } from "reactflow"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"

interface PropertiesPanelProps {
  node: Node
  updateNodeData: (id: string, data: any) => void
}

export function PropertiesPanel({ node, updateNodeData }: PropertiesPanelProps) {
  const [label, setLabel] = useState(node.data.label)
  const [description, setDescription] = useState(node.data.description)
  const [specs, setSpecs] = useState(node.data.specs)
  const [color, setColor] = useState(node.data.color)

  const handleUpdate = () => {
    updateNodeData(node.id, {
      label,
      description,
      specs,
      color,
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="node-label">Label</Label>
        <Input id="node-label" value={label} onChange={(e) => setLabel(e.target.value)} onBlur={handleUpdate} />
      </div>
      <div>
        <Label htmlFor="node-description">Description</Label>
        <Textarea
          id="node-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={handleUpdate}
          rows={2}
        />
      </div>
      <div>
        <Label htmlFor="node-specs">Specifications</Label>
        <Textarea
          id="node-specs"
          value={specs}
          onChange={(e) => setSpecs(e.target.value)}
          onBlur={handleUpdate}
          rows={2}
        />
      </div>
      <div>
        <Label htmlFor="node-color">Color</Label>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-8 p-0" style={{ backgroundColor: color }}>
                <span className="sr-only">Pick a color</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <HexColorPicker
                color={color}
                onChange={(newColor) => {
                  setColor(newColor)
                  updateNodeData(node.id, { color: newColor })
                }}
              />
            </PopoverContent>
          </Popover>
          <Input
            id="node-color"
            value={color}
            onChange={(e) => {
              setColor(e.target.value)
              updateNodeData(node.id, { color: e.target.value })
            }}
          />
        </div>
      </div>
      {node.data.barcode && (
        <div>
          <Label>Barcode</Label>
          <Input value={node.data.barcode} disabled className="text-sm" />
        </div>
      )}
      {node.data.manufacturer && (
        <div>
          <Label>Manufacturer</Label>
          <Input value={node.data.manufacturer} disabled className="text-sm" />
        </div>
      )}
      {node.data.model && (
        <div>
          <Label>Model</Label>
          <Input value={node.data.model} disabled className="text-sm" />
        </div>
      )}
      <div>
        <Label>Position</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="node-x" className="text-xs">
              X
            </Label>
            <Input id="node-x" value={Math.round(node.position.x)} disabled className="text-sm" />
          </div>
          <div>
            <Label htmlFor="node-y" className="text-xs">
              Y
            </Label>
            <Input id="node-y" value={Math.round(node.position.y)} disabled className="text-sm" />
          </div>
        </div>
      </div>
    </div>
  )
}
