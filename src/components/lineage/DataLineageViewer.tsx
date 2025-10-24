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

// Sample data - Healthcare System
const initialNodes: Node<EntityNodeData>[] = [
  {
    id: "1",
    type: "entity",
    position: { x: 250, y: 50 },
    data: {
      label: "patient",
      type: "source",
      attributes: [
        { id: "1-1", name: "patient_id", type: "int", isPrimaryKey: true },
        { id: "1-2", name: "first_name", type: "varchar", hasPII: true },
        { id: "1-3", name: "last_name", type: "varchar", hasPII: true },
        { id: "1-4", name: "ssn", type: "varchar", hasPII: true },
        { id: "1-5", name: "date_of_birth", type: "date", hasPII: true },
        { id: "1-6", name: "email", type: "varchar", hasPII: true },
      ],
      metadata: { owner: "Healthcare Team", rowCount: 15000, domain: "Patient Management" },
    },
  },
  {
    id: "2",
    type: "entity",
    position: { x: 50, y: 300 },
    data: {
      label: "patient_address",
      type: "entity",
      hasPII: true,
      attributes: [
        { id: "2-1", name: "address_id", type: "int", isPrimaryKey: true },
        { id: "2-2", name: "patient_id", type: "int", isForeignKey: true },
        { id: "2-3", name: "street_address", type: "varchar", hasPII: true },
        { id: "2-4", name: "city", type: "varchar", hasPII: true },
        { id: "2-5", name: "state", type: "varchar", hasPII: true },
        { id: "2-6", name: "zip_code", type: "varchar", hasPII: true },
      ],
      metadata: { owner: "Healthcare Team", rowCount: 25000, domain: "Patient Management" },
    },
  },
  {
    id: "3",
    type: "entity",
    position: { x: 450, y: 300 },
    data: {
      label: "appointment",
      type: "entity",
      attributes: [
        { id: "3-1", name: "appointment_id", type: "int", isPrimaryKey: true },
        { id: "3-2", name: "patient_id", type: "int", isForeignKey: true },
        { id: "3-3", name: "doctor_id", type: "int", isForeignKey: true },
        { id: "3-4", name: "appointment_date", type: "datetime" },
        { id: "3-5", name: "status", type: "varchar" },
      ],
      metadata: { owner: "Scheduling Team", rowCount: 45000, domain: "Appointments" },
    },
  },
  {
    id: "4",
    type: "entity",
    position: { x: 700, y: 50 },
    data: {
      label: "doctor",
      type: "source",
      attributes: [
        { id: "4-1", name: "doctor_id", type: "int", isPrimaryKey: true },
        { id: "4-2", name: "first_name", type: "varchar" },
        { id: "4-3", name: "last_name", type: "varchar" },
        { id: "4-4", name: "specialization", type: "varchar" },
        { id: "4-5", name: "license_number", type: "varchar" },
      ],
      metadata: { owner: "HR Team", rowCount: 350, domain: "Staff Management" },
    },
  },
  {
    id: "5",
    type: "entity",
    position: { x: 700, y: 550 },
    data: {
      label: "prescription",
      type: "entity",
      hasPII: true,
      attributes: [
        { id: "5-1", name: "prescription_id", type: "int", isPrimaryKey: true },
        { id: "5-2", name: "appointment_id", type: "int", isForeignKey: true },
        { id: "5-3", name: "medication_name", type: "varchar" },
        { id: "5-4", name: "dosage", type: "varchar" },
        { id: "5-5", name: "duration_days", type: "int" },
      ],
      metadata: { owner: "Pharmacy Team", rowCount: 38000, domain: "Medications" },
    },
  },
  {
    id: "6",
    type: "entity",
    position: { x: 250, y: 550 },
    data: {
      label: "medical_record",
      type: "entity",
      hasPII: true,
      attributes: [
        { id: "6-1", name: "record_id", type: "int", isPrimaryKey: true },
        { id: "6-2", name: "patient_id", type: "int", isForeignKey: true },
        { id: "6-3", name: "diagnosis", type: "text" },
        { id: "6-4", name: "treatment", type: "text" },
        { id: "6-5", name: "record_date", type: "datetime" },
      ],
      metadata: { owner: "Medical Team", rowCount: 52000, domain: "Clinical Data" },
    },
  },
  {
    id: "7",
    type: "entity",
    position: { x: 1000, y: 300 },
    data: {
      label: "patient_analytics",
      type: "derived",
      attributes: [
        { id: "7-1", name: "analytics_id", type: "int", isPrimaryKey: true },
        { id: "7-2", name: "patient_id", type: "int", isForeignKey: true },
        { id: "7-3", name: "total_visits", type: "int" },
        { id: "7-4", name: "last_visit_date", type: "date" },
        { id: "7-5", name: "risk_score", type: "decimal" },
      ],
      metadata: { owner: "Analytics Team", rowCount: 15000, domain: "Analytics" },
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
  {
    id: "e1-3",
    source: "1",
    target: "3",
    type: "smoothstep",
    label: "FK",
    data: {
      sourceAttribute: "1-1",
      targetAttribute: "3-2",
      relationshipType: "FK",
    },
    style: { stroke: "hsl(var(--accent))", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "hsl(var(--accent))" },
  },
  {
    id: "e4-3",
    source: "4",
    target: "3",
    type: "smoothstep",
    label: "FK",
    data: {
      sourceAttribute: "4-1",
      targetAttribute: "3-3",
      relationshipType: "FK",
    },
    style: { stroke: "hsl(var(--accent))", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "hsl(var(--accent))" },
  },
  {
    id: "e3-5",
    source: "3",
    target: "5",
    type: "smoothstep",
    label: "FK",
    data: {
      sourceAttribute: "3-1",
      targetAttribute: "5-2",
      relationshipType: "FK",
    },
    style: { stroke: "hsl(var(--accent))", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "hsl(var(--accent))" },
  },
  {
    id: "e1-6",
    source: "1",
    target: "6",
    type: "smoothstep",
    label: "FK",
    data: {
      sourceAttribute: "1-1",
      targetAttribute: "6-2",
      relationshipType: "FK",
    },
    style: { stroke: "hsl(var(--accent))", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "hsl(var(--accent))" },
  },
  {
    id: "e1-7",
    source: "1",
    target: "7",
    type: "smoothstep",
    label: "DERIVED",
    data: {
      sourceAttribute: "1-1",
      targetAttribute: "7-2",
      relationshipType: "DERIVED",
    },
    style: { stroke: "hsl(var(--primary))", strokeWidth: 2, strokeDasharray: "5 5" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "hsl(var(--primary))" },
    animated: true,
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
