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
  EdgeMouseHandler,
} from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";

import EntityNode, { EntityNodeData, Attribute } from "./EntityNode";
import { LineageToolbar } from "./LineageToolbar";
import { LineageLegend } from "./LineageLegend";

const nodeTypes = {
  entity: EntityNode,
};

// Sample data with attributes
const createInitialNodes = (): Node<EntityNodeData>[] => [
  {
    id: "1",
    type: "entity",
    position: { x: 0, y: 0 },
    data: {
      label: "patient",
      type: "source",
      attributes: [
        { id: "1-1", name: "patient_id", type: "int", isPrimaryKey: true },
        { id: "1-2", name: "first_name", type: "varchar", hasPII: true },
        { id: "1-3", name: "last_name", type: "varchar", hasPII: true },
        { id: "1-4", name: "date_of_birth", type: "date", hasPII: true },
        { id: "1-5", name: "ssn", type: "varchar", hasPII: true },
      ],
    },
  },
  {
    id: "2",
    type: "entity",
    position: { x: 0, y: 0 },
    data: {
      label: "lookup_address_type",
      type: "source",
      attributes: [
        { id: "2-1", name: "address_type_id", type: "int", isPrimaryKey: true },
        { id: "2-2", name: "type_name", type: "varchar" },
        { id: "2-3", name: "description", type: "varchar" },
      ],
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
      attributes: [
        { id: "3-1", name: "address_id", type: "int", isPrimaryKey: true },
        { id: "3-2", name: "patient_id", type: "int", isForeignKey: true },
        { id: "3-3", name: "address_type_id", type: "int", isForeignKey: true },
        { id: "3-4", name: "street_address", type: "varchar", hasPII: true },
        { id: "3-5", name: "city", type: "varchar", hasPII: true },
        { id: "3-6", name: "state", type: "varchar", hasPII: true },
        { id: "3-7", name: "zip_code", type: "varchar", hasPII: true },
      ],
    },
  },
];

// Edge metadata for relationship tracking
interface EdgeMetadata {
  sourceAttribute?: string;
  targetAttribute?: string;
}

const createInitialEdges = (): Edge<EdgeMetadata>[] => [
  {
    id: "e1-3",
    source: "1",
    target: "3",
    type: "smoothstep",
    animated: false,
    label: "FK • 100%",
    data: {
      sourceAttribute: "1-1", // patient_id from patient
      targetAttribute: "3-2", // patient_id in patient_address
    },
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
    animated: false,
    label: "FK • 100%",
    data: {
      sourceAttribute: "2-1", // address_type_id from lookup_address_type
      targetAttribute: "3-3", // address_type_id in patient_address
    },
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
  const [highlightedPath, setHighlightedPath] = useState<Set<string>>(new Set());

  const initialNodesData = useMemo(() => createInitialNodes(), []);
  const initialEdgesData = useMemo(() => createInitialEdges(), []);

  const layoutedElements = useMemo(() => {
    return getLayoutedElements(initialNodesData, initialEdgesData, layout);
  }, [layout, initialNodesData, initialEdgesData]);

  const [nodes, setNodes, onNodesChange] = useNodesState(
    layoutedElements.nodes
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    layoutedElements.edges
  );

  // Find all connected nodes and edges in both directions
  const findConnectedPath = useCallback((attributeId: string, nodeId: string) => {
    const connectedNodes = new Set<string>([nodeId]);
    const connectedEdges = new Set<string>();
    const connectedAttributes = new Set<string>([attributeId]);

    // Find edges connected to this attribute
    const relatedEdges = edges.filter(edge => {
      const edgeData = edge.data as EdgeMetadata | undefined;
      return (
        (edge.source === nodeId && edgeData?.sourceAttribute === attributeId) ||
        (edge.target === nodeId && edgeData?.targetAttribute === attributeId)
      );
    });

    // Recursively find all connected nodes and attributes
    const visited = new Set<string>();
    const traverse = (currentNodeId: string, currentAttrId?: string) => {
      if (visited.has(currentNodeId)) return;
      visited.add(currentNodeId);

      edges.forEach(edge => {
        const edgeData = edge.data as EdgeMetadata | undefined;
        
        // Check upstream connections
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
        
        // Check downstream connections
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

    return {
      nodes: connectedNodes,
      edges: connectedEdges,
      attributes: connectedAttributes,
    };
  }, [edges]);

  const handleAttributeClick = useCallback((nodeId: string, attributeId: string) => {
    const path = findConnectedPath(attributeId, nodeId);
    
    // Update nodes with highlighted attributes
    setNodes(prevNodes =>
      prevNodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          isHighlighted: path.nodes.has(node.id),
          attributes: node.data.attributes?.map(attr => ({
            ...attr,
            isHighlighted: path.attributes.has(attr.id),
          })),
        },
      }))
    );

    // Update edges with highlighting
    setEdges(prevEdges =>
      prevEdges.map(edge => ({
        ...edge,
        animated: path.edges.has(edge.id),
        style: {
          ...edge.style,
          stroke: path.edges.has(edge.id)
            ? "hsl(var(--primary))"
            : "hsl(var(--edge-fk))",
          strokeWidth: path.edges.has(edge.id) ? 3 : 2,
        },
      }))
    );

    setHighlightedPath(path.edges);
  }, [findConnectedPath, setNodes, setEdges]);

  const handleEdgeClick: EdgeMouseHandler = useCallback((event, edge) => {
    const edgeData = edge.data as EdgeMetadata | undefined;
    
    if (edgeData?.sourceAttribute && edgeData?.targetAttribute) {
      // Highlight the entire path through this edge
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
            stroke: combinedEdges.has(e.id)
              ? "hsl(var(--primary))"
              : "hsl(var(--edge-fk))",
            strokeWidth: combinedEdges.has(e.id) ? 3 : 2,
          },
        }))
      );

      setHighlightedPath(combinedEdges);
    }
  }, [findConnectedPath, setNodes, setEdges]);

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

  const handleLayoutChange = useCallback(
    (newLayout: string) => {
      setLayout(newLayout);
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(initialNodesData, initialEdgesData, newLayout);
      
      // Preserve expand states and callbacks
      const updatedNodes = layoutedNodes.map(node => {
        const existingNode = nodes.find(n => n.id === node.id);
        return {
          ...node,
          data: {
            ...node.data,
            isExpanded: existingNode?.data.isExpanded || false,
            onToggleExpand: handleToggleExpand,
            onAttributeClick: handleAttributeClick,
          },
        };
      });
      
      setNodes(updatedNodes);
      setEdges(layoutedEdges);
    },
    [setNodes, setEdges, nodes, initialNodesData, initialEdgesData, handleToggleExpand, handleAttributeClick]
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
    // Clear highlighting
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
        animated: false,
        style: {
          ...edge.style,
          stroke: "hsl(var(--edge-fk))",
          strokeWidth: 2,
        },
      }))
    );

    setHighlightedPath(new Set());
  }, [setNodes, setEdges]);

  // Initialize nodes with callbacks
  useMemo(() => {
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
          onEdgeClick={handleEdgeClick}
          nodeTypes={nodeTypes}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView
          minZoom={0.1}
          maxZoom={2}
          defaultEdgeOptions={{
            type: "smoothstep",
            animated: false,
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
