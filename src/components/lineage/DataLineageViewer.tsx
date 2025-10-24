import { useCallback, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  MarkerType,
  ReactFlowProvider,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";

import { EntityNode } from "./EntityNode";
import { LineageToolbar } from "./LineageToolbar";
import { LineageLegend } from "./LineageLegend";
import { LineageSearch } from "./LineageSearch";
import { LineageDetails } from "./LineageDetails";
import type { EntityNodeData } from "./EntityNode";
import type { LineageEdgeMetadata } from "@/types/lineage";

const nodeTypes = {
  entity: EntityNode,
};

// Sample data
const initialNodes: Node<EntityNodeData>[] = [
  {
    id: "1",
    type: "entity",
    position: { x: 100, y: 100 },
    data: {
      label: "patient",
      type: "source",
      attributes: [
        { id: "1-1", name: "patient_id", type: "int", isPrimaryKey: true },
        { id: "1-2", name: "first_name", type: "varchar", hasPII: true },
        { id: "1-3", name: "ssn", type: "varchar", hasPII: true },
      ],
      metadata: { owner: "Healthcare Team", rowCount: 15000 },
    },
  },
  {
    id: "2",
    type: "entity",
    position: { x: 100, y: 400 },
    data: {
      label: "patient_address",
      type: "entity",
      hasPII: true,
      attributes: [
        { id: "2-1", name: "address_id", type: "int", isPrimaryKey: true },
        { id: "2-2", name: "patient_id", type: "int", isForeignKey: true },
        { id: "2-3", name: "street_address", type: "varchar", hasPII: true },
      ],
      metadata: { owner: "Healthcare Team", rowCount: 25000 },
    },
  },
];

const initialEdges: Edge<LineageEdgeMetadata>[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    type: "smoothstep",
    label: "FK",
    data: {
      sourceAttribute: "1-1",
      targetAttribute: "2-2",
      relationshipType: "FK",
    },
    style: { stroke: "hsl(var(--accent))", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "hsl(var(--accent))" },
  },
];

function DataLineageFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node<EntityNodeData> | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge<LineageEdgeMetadata> | null>(null);

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node<EntityNodeData>) => {
    setSelectedNode(node);
    setSelectedEdge(null);
  }, []);

  const handleEdgeClick = useCallback((event: React.MouseEvent, edge: Edge<LineageEdgeMetadata>) => {
    setSelectedEdge(edge);
    setSelectedNode(null);
  }, []);

  const handleClear = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
  }, []);

  return (
    <div className="w-full h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="h-16 border-b border-border bg-card flex items-center px-6 flex-shrink-0">
        <h1 className="text-xl font-bold text-primary">Data Lineage Viewer</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Search */}
        <div className="w-80 border-r border-border flex-shrink-0">
          <LineageSearch
            onSelectEntity={(id) => {
              const node = nodes.find(n => n.id === id);
              if (node) setSelectedNode(node);
            }}
            onSelectAttribute={(entityId, attrId) => {
              const node = nodes.find(n => n.id === entityId);
              if (node) setSelectedNode(node);
            }}
            entities={nodes}
          />
        </div>

        {/* Center Panel - Graph */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={handleNodeClick}
            onEdgeClick={handleEdgeClick}
            nodeTypes={nodeTypes}
            fitView
            className="bg-background"
          >
            <Background color="hsl(var(--border))" gap={16} size={1} />
            <Controls className="!bg-card !border-border" />
            <MiniMap
              className="!bg-card !border-border"
              nodeColor={(node) => {
                if (node.data?.hasPII) return "hsl(var(--destructive))";
                if (node.data?.type === "source") return "hsl(var(--primary))";
                return "hsl(var(--accent))";
              }}
            />
            <Panel position="bottom-right">
              <LineageLegend />
            </Panel>
          </ReactFlow>
        </div>

        {/* Right Panel - Details */}
        <div className="w-96 border-l border-border flex-shrink-0">
          <LineageDetails
            selectedNode={selectedNode}
            selectedEdge={selectedEdge}
            nodes={nodes}
          />
        </div>
      </div>
    </div>
  );
}

export function DataLineageViewer() {
  return (
    <ReactFlowProvider>
      <DataLineageFlow />
    </ReactFlowProvider>
  );
}
