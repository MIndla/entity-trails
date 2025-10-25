import { useCallback, useState, useMemo, useEffect } from "react";
import {
  ReactFlow,
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
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";

import { EntityNode } from "./EntityNode";
import { LineageToolbar } from "./LineageToolbar";
import { LineageLegend } from "./LineageLegend";
import { LineageSearch } from "./LineageSearch";
import { LineageDetails } from "./LineageDetails";
import type { EntityNodeData } from "./EntityNode";
import type { LineageEdgeMetadata } from "@/types/lineage";
import { useSearchParams } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronLeft, ChevronRight, PanelLeftClose, PanelRightClose } from "lucide-react";
import { Button } from "@/components/ui/button";

const nodeTypes = {
  entity: EntityNode,
};

// Auto-layout using dagre
const getLayoutedElements = (
  nodes: Node<EntityNodeData>[],
  edges: Edge<LineageEdgeMetadata>[],
  direction: string = "TB"
) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction, nodesep: 100, ranksep: 150 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 280, height: 200 });
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
        x: nodeWithPosition.x - 140,
        y: nodeWithPosition.y - 100,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

// Sample data - Healthcare System
const createInitialNodes = (): Node<EntityNodeData>[] => [
  {
    id: "1",
    type: "entity",
    position: { x: 0, y: 0 },
    data: {
      label: "patient",
      type: "source",
      isExpanded: true,
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
    position: { x: 0, y: 0 },
    data: {
      label: "patient_address",
      type: "entity",
      hasPII: true,
      isExpanded: true,
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
    position: { x: 0, y: 0 },
    data: {
      label: "appointment",
      type: "entity",
      isExpanded: true,
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
    position: { x: 0, y: 0 },
    data: {
      label: "doctor",
      type: "source",
      isExpanded: true,
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
    position: { x: 0, y: 0 },
    data: {
      label: "prescription",
      type: "entity",
      hasPII: true,
      isExpanded: true,
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
    position: { x: 0, y: 0 },
    data: {
      label: "medical_record",
      type: "entity",
      hasPII: true,
      isExpanded: true,
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
    position: { x: 0, y: 0 },
    data: {
      label: "patient_analytics",
      type: "derived",
      isExpanded: true,
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

const createInitialEdges = (): Edge<LineageEdgeMetadata>[] => [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    type: "smoothstep",
    label: "FK • 100%",
    data: {
      sourceAttribute: "1-1",
      targetAttribute: "2-2",
      relationshipType: "FK",
      confidence: 100,
    },
    labelStyle: { fill: "hsl(var(--accent))", fontWeight: 600, fontSize: 11 },
    labelBgStyle: { fill: "hsl(var(--background))", fillOpacity: 0.9 },
    style: { stroke: "hsl(var(--accent))", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "hsl(var(--accent))" },
  },
  {
    id: "e1-3",
    source: "1",
    target: "3",
    type: "smoothstep",
    label: "FK • 100%",
    data: {
      sourceAttribute: "1-1",
      targetAttribute: "3-2",
      relationshipType: "FK",
      confidence: 100,
    },
    labelStyle: { fill: "hsl(var(--accent))", fontWeight: 600, fontSize: 11 },
    labelBgStyle: { fill: "hsl(var(--background))", fillOpacity: 0.9 },
    style: { stroke: "hsl(var(--accent))", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "hsl(var(--accent))" },
  },
  {
    id: "e4-3",
    source: "4",
    target: "3",
    type: "smoothstep",
    label: "FK • 98%",
    data: {
      sourceAttribute: "4-1",
      targetAttribute: "3-3",
      relationshipType: "FK",
      confidence: 98,
    },
    labelStyle: { fill: "hsl(var(--accent))", fontWeight: 600, fontSize: 11 },
    labelBgStyle: { fill: "hsl(var(--background))", fillOpacity: 0.9 },
    style: { stroke: "hsl(var(--accent))", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "hsl(var(--accent))" },
  },
  {
    id: "e3-5",
    source: "3",
    target: "5",
    type: "smoothstep",
    label: "FK • 95%",
    data: {
      sourceAttribute: "3-1",
      targetAttribute: "5-2",
      relationshipType: "FK",
      confidence: 95,
    },
    labelStyle: { fill: "hsl(var(--accent))", fontWeight: 600, fontSize: 11 },
    labelBgStyle: { fill: "hsl(var(--background))", fillOpacity: 0.9 },
    style: { stroke: "hsl(var(--accent))", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "hsl(var(--accent))" },
  },
  {
    id: "e1-6",
    source: "1",
    target: "6",
    type: "smoothstep",
    label: "FK • 100%",
    data: {
      sourceAttribute: "1-1",
      targetAttribute: "6-2",
      relationshipType: "FK",
      confidence: 100,
    },
    labelStyle: { fill: "hsl(var(--accent))", fontWeight: 600, fontSize: 11 },
    labelBgStyle: { fill: "hsl(var(--background))", fillOpacity: 0.9 },
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
      confidence: 100,
    },
    labelStyle: { fill: "hsl(var(--primary))", fontWeight: 600, fontSize: 11 },
    labelBgStyle: { fill: "hsl(var(--background))", fillOpacity: 0.9 },
    style: { stroke: "hsl(var(--primary))", strokeWidth: 2, strokeDasharray: "5 5" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "hsl(var(--primary))" },
    animated: true,
  },
];

function DataLineageFlow() {
  const [searchParams] = useSearchParams();
  const [layout, setLayout] = useState("TB");
  const [showPIIOnly, setShowPIIOnly] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node<EntityNodeData> | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge<LineageEdgeMetadata> | null>(null);
  const [impactMetrics, setImpactMetrics] = useState({ upstream: 0, downstream: 0 });
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);

  const initialNodesData = useMemo(() => createInitialNodes(), []);
  const initialEdgesData = useMemo(() => createInitialEdges(), []);

  // Apply layout
  const layoutedElements = useMemo(() => {
    return getLayoutedElements(initialNodesData, initialEdgesData, layout);
  }, [layout, initialNodesData, initialEdgesData]);

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedElements.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedElements.edges);

  // Calculate impact metrics
  const calculateImpact = useCallback((nodeId: string) => {
    const upstream = new Set<string>();
    const downstream = new Set<string>();

    const traverse = (id: string, direction: 'up' | 'down', visited = new Set<string>()) => {
      if (visited.has(id)) return;
      visited.add(id);

      edges.forEach(edge => {
        if (direction === 'up' && edge.target === id) {
          upstream.add(edge.source);
          traverse(edge.source, 'up', visited);
        } else if (direction === 'down' && edge.source === id) {
          downstream.add(edge.target);
          traverse(edge.target, 'down', visited);
        }
      });
    };

    traverse(nodeId, 'up');
    traverse(nodeId, 'down');

    return { upstream: upstream.size, downstream: downstream.size };
  }, [edges]);

  // Path highlighting logic
  const findConnectedPath = useCallback((attributeId: string, nodeId: string) => {
    const connectedNodes = new Set<string>([nodeId]);
    const connectedEdges = new Set<string>();
    const connectedAttributes = new Set<string>([attributeId]);

    const visited = new Set<string>();
    
    const traverse = (currentNodeId: string, currentAttrId?: string) => {
      if (visited.has(currentNodeId)) return;
      visited.add(currentNodeId);

      edges.forEach(edge => {
        const edgeData = edge.data as LineageEdgeMetadata | undefined;
        
        // Upstream
        if (edge.target === currentNodeId) {
          if (!currentAttrId || edgeData?.targetAttribute === currentAttrId) {
            connectedEdges.add(edge.id);
            connectedNodes.add(edge.source);
            if (edgeData?.sourceAttribute) {
              connectedAttributes.add(edgeData.sourceAttribute);
              traverse(edge.source, edgeData.sourceAttribute);
            }
          }
        }
        
        // Downstream
        if (edge.source === currentNodeId) {
          if (!currentAttrId || edgeData?.sourceAttribute === currentAttrId) {
            connectedEdges.add(edge.id);
            connectedNodes.add(edge.target);
            if (edgeData?.targetAttribute) {
              connectedAttributes.add(edgeData.targetAttribute);
              traverse(edge.target, edgeData.targetAttribute);
            }
          }
        }
      });
    };

    traverse(nodeId, attributeId);

    return { nodes: connectedNodes, edges: connectedEdges, attributes: connectedAttributes };
  }, [edges]);

  // Handle attribute click - highlight path
  const handleAttributeClick = useCallback((nodeId: string, attributeId: string) => {
    const path = findConnectedPath(attributeId, nodeId);
    
    setNodes((prevNodes) =>
      prevNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isHighlighted: path.nodes.has(node.id),
          attributes: (node.data.attributes || []).map((attr) => ({
            ...attr,
            isHighlighted: path.attributes.has(attr.id),
          })),
        } as EntityNodeData,
      }))
    );
    
    setEdges(prevEdges =>
      prevEdges.map(edge => ({
        ...edge,
        animated: path.edges.has(edge.id),
        style: {
          ...edge.style,
          stroke: path.edges.has(edge.id) ? "rgb(250, 204, 21)" : // yellow-400
                  edge.data?.relationshipType === "DERIVED" ? "hsl(var(--primary))" : "hsl(var(--accent))",
          strokeWidth: path.edges.has(edge.id) ? 4 : 2,
        },
      }))
    );

    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setSelectedNode(node);
      setSelectedEdge(null);
      const metrics = calculateImpact(nodeId);
      setImpactMetrics(metrics);
    }
  }, [findConnectedPath, nodes, setNodes, setEdges, calculateImpact]);

  // Handle edge click
  const handleEdgeClick = useCallback((event: React.MouseEvent, edge: Edge<LineageEdgeMetadata>) => {
    const edgeData = edge.data;
    
    if (edgeData?.sourceAttribute && edgeData?.targetAttribute) {
      const sourcePath = findConnectedPath(edgeData.sourceAttribute, edge.source);
      const targetPath = findConnectedPath(edgeData.targetAttribute, edge.target);
      
      const combinedNodes = new Set([...sourcePath.nodes, ...targetPath.nodes]);
      const combinedEdges = new Set([...sourcePath.edges, ...targetPath.edges]);
      const combinedAttributes = new Set([...sourcePath.attributes, ...targetPath.attributes]);

      setNodes(prevNodes =>
        prevNodes.map(node => ({
          ...node,
          data: {
            ...node.data,
            isHighlighted: combinedNodes.has(node.id),
            attributes: node.data.attributes?.map(attr => ({
              ...attr,
              isHighlighted: combinedAttributes.has(attr.id),
            })),
          },
        }))
      );

      setEdges(prevEdges =>
        prevEdges.map(e => ({
          ...e,
          animated: combinedEdges.has(e.id),
          style: {
            ...e.style,
            stroke: combinedEdges.has(e.id) ? "rgb(250, 204, 21)" : // yellow-400
                    e.data?.relationshipType === "DERIVED" ? "hsl(var(--primary))" : "hsl(var(--accent))",
            strokeWidth: combinedEdges.has(e.id) ? 4 : 2,
          },
        }))
      );

      setSelectedEdge(edge);
      setSelectedNode(null);
    }
  }, [findConnectedPath, setNodes, setEdges]);

  // Toggle expand
  const handleToggleExpand = useCallback((nodeId: string) => {
    setNodes(prevNodes =>
      prevNodes.map(node => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              isExpanded: !node.data.isExpanded,
            },
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  // Initialize callbacks
  useEffect(() => {
    setNodes(prevNodes =>
      prevNodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          onToggleExpand: handleToggleExpand,
          onAttributeClick: handleAttributeClick,
        },
      }))
    );
  }, [handleToggleExpand, handleAttributeClick, setNodes]);

  // Handle URL parameters
  useEffect(() => {
    const entity = searchParams.get('entity');
    const attribute = searchParams.get('attribute');
    
    if (entity) {
      const node = nodes.find(n => n.data.label === entity);
      if (node) {
        setSelectedNode(node);
        const metrics = calculateImpact(node.id);
        setImpactMetrics(metrics);
      }
    }
    
    if (attribute) {
      const [entityName, attrName] = attribute.split('.');
      const node = nodes.find(n => n.data.label === entityName);
      if (node) {
        const attr = node.data.attributes.find(a => a.name === attrName);
        if (attr) {
          handleAttributeClick(node.id, attr.id);
        }
      }
    }
  }, [searchParams, nodes, handleAttributeClick, calculateImpact]);

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node<EntityNodeData>) => {
    setSelectedNode(node);
    setSelectedEdge(null);
    const metrics = calculateImpact(node.id);
    setImpactMetrics(metrics);
  }, [calculateImpact]);

  const handleLayoutChange = useCallback((newLayout: string) => {
    setLayout(newLayout);
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes.map(n => ({ ...n, data: { ...n.data, onToggleExpand: handleToggleExpand, onAttributeClick: handleAttributeClick } })),
      edges,
      newLayout
    );
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [nodes, edges, setNodes, setEdges, handleToggleExpand, handleAttributeClick]);

  const handleResetLayout = useCallback(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes.map(n => ({ ...n, data: { ...n.data, onToggleExpand: handleToggleExpand, onAttributeClick: handleAttributeClick } })),
      edges,
      layout
    );
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [nodes, edges, layout, setNodes, setEdges, handleToggleExpand, handleAttributeClick]);

  const handleClear = useCallback(() => {
    setNodes(prevNodes =>
      prevNodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          isHighlighted: false,
          attributes: node.data.attributes?.map(attr => ({
            ...attr,
            isHighlighted: false,
          })),
        },
      }))
    );

    setEdges(prevEdges =>
      prevEdges.map(edge => ({
        ...edge,
        animated: edge.data?.relationshipType === "DERIVED",
        style: {
          ...edge.style,
          stroke: edge.data?.relationshipType === "DERIVED" ? "hsl(var(--primary))" : "hsl(var(--accent))",
          strokeWidth: 2,
        },
      }))
    );

    setSelectedNode(null);
    setSelectedEdge(null);
    setImpactMetrics({ upstream: 0, downstream: 0 });
  }, [setNodes, setEdges]);

  const handleSelectEntity = useCallback((entityId: string) => {
    const node = nodes.find(n => n.id === entityId);
    if (node) {
      setSelectedNode(node);
      setSelectedEdge(null);
      const metrics = calculateImpact(entityId);
      setImpactMetrics(metrics);
      handleClear();
    }
  }, [nodes, calculateImpact, handleClear]);

  const handleSelectAttribute = useCallback((entityId: string, attributeId: string) => {
    handleAttributeClick(entityId, attributeId);
  }, [handleAttributeClick]);

  const filteredNodes = showPIIOnly 
    ? nodes.filter(n => n.data.hasPII) 
    : nodes;

  return (
    <div className="w-full h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="h-16 border-b border-border bg-card flex items-center px-6 flex-shrink-0">
        <div className="flex items-center gap-3 flex-1">
          <h1 className="text-xl font-bold text-primary">Data Lineage Viewer</h1>
          {selectedNode && (
            <>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground font-medium">{selectedNode.data.label}</span>
              {(impactMetrics.upstream > 0 || impactMetrics.downstream > 0) && (
                <span className="text-xs text-muted-foreground">
                  (↑ {impactMetrics.upstream} upstream • ↓ {impactMetrics.downstream} downstream)
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Panel - Collapsible Search */}
        <Collapsible open={leftPanelOpen} onOpenChange={setLeftPanelOpen} className="flex-shrink-0">
          <CollapsibleContent>
            <div className="w-80 border-r border-border h-full">
              <LineageSearch
                onSelectEntity={handleSelectEntity}
                onSelectAttribute={handleSelectAttribute}
                entities={nodes}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        {/* Left Panel Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute ${leftPanelOpen ? 'left-[19.5rem]' : 'left-2'} top-4 z-[15] bg-card/90 backdrop-blur-sm border border-border hover:bg-card shadow-md h-8 w-8`}
          onClick={() => setLeftPanelOpen(!leftPanelOpen)}
        >
          {leftPanelOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>

        {/* Center Panel - Graph */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={filteredNodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={handleNodeClick}
            onEdgeClick={handleEdgeClick}
            onPaneClick={handleClear}
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
            <Panel position="top-left" className="flex gap-3">
              <LineageToolbar
                layout={layout}
                onLayoutChange={handleLayoutChange}
                showPIIOnly={showPIIOnly}
                onTogglePIIOnly={() => setShowPIIOnly(!showPIIOnly)}
                nodeCount={nodes.length}
                edgeCount={edges.length}
                onFitView={() => {}}
                onZoomIn={() => {}}
                onZoomOut={() => {}}
                onClear={handleClear}
                onResetLayout={handleResetLayout}
              />
              <LineageLegend />
            </Panel>
          </ReactFlow>
        </div>

        {/* Right Panel - Collapsible Details */}
        <Collapsible open={rightPanelOpen} onOpenChange={setRightPanelOpen} className="flex-shrink-0">
          <CollapsibleContent>
            <div className="w-96 border-l border-border h-full">
              <LineageDetails
                selectedNode={selectedNode}
                selectedEdge={selectedEdge}
                nodes={nodes}
                impactMetrics={impactMetrics}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        {/* Right Panel Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute ${rightPanelOpen ? 'right-[23.5rem]' : 'right-2'} top-4 z-[15] bg-card/90 backdrop-blur-sm border border-border hover:bg-card shadow-md h-8 w-8`}
          onClick={() => setRightPanelOpen(!rightPanelOpen)}
        >
          {rightPanelOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
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
