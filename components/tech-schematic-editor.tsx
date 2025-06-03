"use client"

import type React from "react"

import { useCallback, useRef, useState } from "react"
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type Node,
} from "reactflow"
import "reactflow/dist/style.css"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomNode } from "@/components/custom-node"
import { Toolbar } from "@/components/toolbar"
import { PropertiesPanel } from "@/components/properties-panel"

// Initial nodes for the diagram
const initialNodes: Node[] = [
  {
    id: "1",
    type: "custom",
    position: { x: 250, y: 100 },
    data: {
      label: "CPU",
      description: "Central Processing Unit",
      specs: "3.5GHz, 8 cores",
      connections: ["Memory", "GPU", "Storage"],
      color: "#f97316",
    },
  },
  {
    id: "2",
    type: "custom",
    position: { x: 100, y: 300 },
    data: {
      label: "Memory",
      description: "RAM Module",
      specs: "32GB DDR4",
      connections: ["CPU"],
      color: "#0ea5e9",
    },
  },
  {
    id: "3",
    type: "custom",
    position: { x: 400, y: 300 },
    data: {
      label: "GPU",
      description: "Graphics Processing Unit",
      specs: "8GB VRAM",
      connections: ["CPU", "Display"],
      color: "#22c55e",
    },
  },
]

// Initial edges for the diagram
const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e1-3", source: "1", target: "3", animated: true },
]

// Define node types
const nodeTypes = {
  custom: CustomNode,
}

export default function TechSchematicEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)

  // Handle connections between nodes
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges],
  )

  // Handle node selection
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
    setSelectedEdge(null)
  }, [])

  // Handle edge selection
  const onEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge)
    setSelectedNode(null)
  }, [])

  // Handle pane click (deselect everything)
  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
    setSelectedEdge(null)
  }, [])

  // Update node data when properties change
  const updateNodeData = useCallback(
    (id: string, data: any) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === id) {
            return { ...node, data: { ...node.data, ...data } }
          }
          return node
        }),
      )
    },
    [setNodes],
  )

  // Add a new node to the diagram
  const addNewNode = useCallback(
    (type: string) => {
      const newNode: Node = {
        id: `${nodes.length + 1}`,
        type: "custom",
        position: { x: 100, y: 100 },
        data: {
          label: `New ${type}`,
          description: `Description for ${type}`,
          specs: "Specifications",
          connections: [],
          color: "#a855f7",
        },
      }
      setNodes((nds) => [...nds, newNode])
    },
    [nodes, setNodes],
  )

  return (
    <div className="flex h-[calc(100vh-57px)]">
      {/* Left sidebar with tools */}
      <div className="w-64 border-r bg-background p-4">
        <Tabs defaultValue="components">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
          </TabsList>
          <TabsContent value="components" className="space-y-4 pt-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Hardware</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="justify-start text-sm" onClick={() => addNewNode("CPU")}>
                  CPU
                </Button>
                <Button variant="outline" className="justify-start text-sm" onClick={() => addNewNode("Memory")}>
                  Memory
                </Button>
                <Button variant="outline" className="justify-start text-sm" onClick={() => addNewNode("Storage")}>
                  Storage
                </Button>
                <Button variant="outline" className="justify-start text-sm" onClick={() => addNewNode("GPU")}>
                  GPU
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Network</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="justify-start text-sm" onClick={() => addNewNode("Router")}>
                  Router
                </Button>
                <Button variant="outline" className="justify-start text-sm" onClick={() => addNewNode("Switch")}>
                  Switch
                </Button>
                <Button variant="outline" className="justify-start text-sm" onClick={() => addNewNode("Server")}>
                  Server
                </Button>
                <Button variant="outline" className="justify-start text-sm" onClick={() => addNewNode("Firewall")}>
                  Firewall
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="tools" className="space-y-4 pt-4">
            <Toolbar />
          </TabsContent>
        </Tabs>
      </div>

      {/* Main canvas area */}
      <div className="flex-1" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background gap={12} size={1} />
        </ReactFlow>
      </div>

      {/* Right sidebar with properties */}
      <div className="w-72 border-l bg-background p-4">
        <h3 className="mb-4 font-medium">Properties</h3>
        {selectedNode && <PropertiesPanel node={selectedNode} updateNodeData={updateNodeData} />}
        {selectedEdge && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="edge-id">Edge ID</Label>
              <Input id="edge-id" value={selectedEdge.id} disabled />
            </div>
            <div>
              <Label htmlFor="edge-source">Source</Label>
              <Input id="edge-source" value={selectedEdge.source} disabled />
            </div>
            <div>
              <Label htmlFor="edge-target">Target</Label>
              <Input id="edge-target" value={selectedEdge.target} disabled />
            </div>
          </div>
        )}
        {!selectedNode && !selectedEdge && (
          <div className="text-sm text-muted-foreground">Select a node or edge to view and edit its properties.</div>
        )}
      </div>
    </div>
  )
}
