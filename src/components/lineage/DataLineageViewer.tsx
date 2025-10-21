import { useCallback, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  MarkerType,
  ConnectionLineType,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";

import EntityNode, { EntityNodeData } from "./EntityNode";
import { LineageToolbar } from "./LineageToolbar";
import { LineageLegend } from "./LineageLegend";

const nodeTypes = {
  entity: EntityNode,
};

// Sample data - replace with your actual data
const initialNodes: Node<EntityNodeData>[] = [
  {
    id: "1",
    type: "entity",
    position: { x: 0, y: 0 },
    data: {
      label: "patient",
      type: "source",
      isForeignKey: false,
      isPrimaryKey: false,
    },
  },
  {
    id: "2",
    type: "entity",
    position: { x: 0, y: 0 },
    data: {
      label: "lookup_address_type",
      type: "source",
      isForeignKey: false,
      isPrimaryKey: false,
    },
  },
  {
    id: "3",
    type: "entity",
    position: { x: 0, y: 0 },
    data: {
      label: "patient_address",
      type: "entity",
      hasPII: true,
      isForeignKey: true,
      isPrimaryKey: false,
      isHighlighted: true,
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: "e1-3",
    source: "1",
    target: "3",
    type: "smoothstep",
    animated: true,
    label: "FK • 100%",
    labelStyle: {
      fill: "hsl(var(--accent))",
      fontWeight: 600,
      fontSize: 12,
    },
    labelBgStyle: {
      fill: "hsl(var(--background))",
      fillOpacity: 0.9,
    },
    style: { stroke: "hsl(var(--edge-fk))", strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "hsl(var(--edge-fk))",
    },
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    type: "smoothstep",
    animated: true,
    label: "FK • 100%",
    labelStyle: {
      fill: "hsl(var(--accent))",
      fontWeight: 600,
      fontSize: 12,
    },
    labelBgStyle: {
      fill: "hsl(var(--background))",
      fillOpacity: 0.9,
    },
    style: { stroke: "hsl(var(--edge-fk))", strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "hsl(var(--edge-fk))",
    },
  },
];

const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction: string = "TB"
) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction, nodesep: 80, ranksep: 120 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 250, height: 100 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - 125,
        y: nodeWithPosition.y - 50,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

export const DataLineageViewer = () => {
  const [layout, setLayout] = useState("TB");
  const [showPIIOnly, setShowPIIOnly] = useState(false);

  const layoutedElements = useMemo(() => {
    return getLayoutedElements(initialNodes, initialEdges, layout);
  }, [layout]);

  const [nodes, setNodes, onNodesChange] = useNodesState(
    layoutedElements.nodes
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    layoutedElements.edges
  );

  const handleLayoutChange = useCallback(
    (newLayout: string) => {
      setLayout(newLayout);
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(initialNodes, initialEdges, newLayout);
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    },
    [setNodes, setEdges]
  );

  const handleTogglePIIOnly = useCallback(() => {
    setShowPIIOnly((prev) => !prev);
    // Implement PII filtering logic here
  }, []);

  const handleFitView = useCallback(() => {
    // This will be handled by the ReactFlow component
  }, []);

  const handleZoomIn = useCallback(() => {
    // This will be handled by the ReactFlow component
  }, []);

  const handleZoomOut = useCallback(() => {
    // This will be handled by the ReactFlow component
  }, []);

  const handleClear = useCallback(() => {
    setNodes([]);
    setEdges([]);
  }, [setNodes, setEdges]);

  return (
    <div className="w-full h-screen bg-background">
      <div className="h-16 border-b border-border bg-card flex items-center px-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Data Lineage
          </h1>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground font-medium">
            patient_address
          </span>
        </div>
      </div>

      <div className="relative w-full" style={{ height: "calc(100vh - 4rem)" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView
          minZoom={0.1}
          maxZoom={2}
          defaultEdgeOptions={{
            type: "smoothstep",
            animated: true,
          }}
          className="bg-background"
        >
          <Background
            color="hsl(var(--border))"
            gap={16}
            size={1}
            className="opacity-20"
          />
          <Controls
            className="!bg-card !border-border !shadow-elevated"
            showInteractive={false}
          />
          <MiniMap
            className="!bg-card !border-2 !border-border !shadow-elevated"
            nodeColor={(node) => {
              if (node.data?.hasPII) return "hsl(var(--destructive))";
              if (node.data?.type === "source") return "hsl(var(--primary))";
              return "hsl(var(--accent))";
            }}
            maskColor="hsl(var(--background) / 0.8)"
          />
          <Panel position="top-left">
            <LineageToolbar
              layout={layout}
              onLayoutChange={handleLayoutChange}
              showPIIOnly={showPIIOnly}
              onTogglePIIOnly={handleTogglePIIOnly}
              nodeCount={nodes.length}
              edgeCount={edges.length}
              onFitView={handleFitView}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onClear={handleClear}
            />
          </Panel>
        </ReactFlow>

        <LineageLegend />
      </div>
    </div>
  );
};
