import { Database, Link as LinkIcon, Info } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { Node, Edge } from "@xyflow/react";
import type { EntityNodeData } from "./EntityNode";
import type { LineageEdgeMetadata } from "@/types/lineage";

interface LineageDetailsProps {
  selectedNode: Node<EntityNodeData> | null;
  selectedEdge: Edge<LineageEdgeMetadata> | null;
  nodes: Node<EntityNodeData>[];
  impactMetrics?: { upstream: number; downstream: number };
}

export function LineageDetails({ selectedNode, selectedEdge, nodes, impactMetrics }: LineageDetailsProps) {
  if (!selectedNode && !selectedEdge) {
    return (
      <div className="h-full bg-card flex items-center justify-center p-8">
        <div className="text-center text-muted-foreground">
          <Info className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Select a node or edge to view details</p>
        </div>
      </div>
    );
  }

  if (selectedNode) {
    return (
      <div className="h-full bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Database className="w-5 h-5" />
            Entity Details
          </h2>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-foreground mb-1">
                {selectedNode.data.label}
              </h3>
              <Badge variant="secondary" className="capitalize">
                {selectedNode.data.type}
              </Badge>
              {selectedNode.data.hasPII && (
                <Badge variant="destructive" className="ml-2">PII</Badge>
              )}
            </div>

            {/* Impact Analysis */}
            {impactMetrics && (impactMetrics.upstream > 0 || impactMetrics.downstream > 0) && (
              <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                <h4 className="text-sm font-medium text-foreground">Impact Analysis</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-card rounded p-2">
                    <div className="text-xs text-muted-foreground">Upstream</div>
                    <div className="text-lg font-semibold text-primary">{impactMetrics.upstream}</div>
                  </div>
                  <div className="bg-card rounded p-2">
                    <div className="text-xs text-muted-foreground">Downstream</div>
                    <div className="text-lg font-semibold text-accent">{impactMetrics.downstream}</div>
                  </div>
                </div>
              </div>
            )}

            {selectedNode.data.metadata && (
              <div className="space-y-2 text-sm">
                {selectedNode.data.metadata.owner && (
                  <div>
                    <span className="text-muted-foreground">Owner: </span>
                    <span className="text-foreground">{selectedNode.data.metadata.owner}</span>
                  </div>
                )}
                {selectedNode.data.metadata.rowCount && (
                  <div>
                    <span className="text-muted-foreground">Rows: </span>
                    <span className="text-foreground">
                      {selectedNode.data.metadata.rowCount.toLocaleString()}
                    </span>
                  </div>
                )}
                {selectedNode.data.metadata.domain && (
                  <div>
                    <span className="text-muted-foreground">Domain: </span>
                    <span className="text-foreground">{selectedNode.data.metadata.domain}</span>
                  </div>
                )}
              </div>
            )}

            <div>
              <h4 className="font-medium text-foreground mb-2">
                Attributes ({selectedNode.data.attributes.length})
              </h4>
              <div className="space-y-2">
                {selectedNode.data.attributes.map((attr) => (
                  <div
                    key={attr.id}
                    className="border border-border rounded p-2 text-sm"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-medium ${attr.hasPII ? "text-destructive" : "text-foreground"}`}>
                        {attr.name}
                      </span>
                      <span className="text-muted-foreground text-xs">{attr.type}</span>
                    </div>
                    <div className="flex gap-1">
                      {attr.isPrimaryKey && (
                        <Badge variant="outline" className="text-xs">PK</Badge>
                      )}
                      {attr.isForeignKey && (
                        <Badge variant="outline" className="text-xs">FK</Badge>
                      )}
                      {attr.hasPII && (
                        <Badge variant="destructive" className="text-xs">PII</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  if (selectedEdge) {
    const sourceNode = nodes.find(n => n.id === selectedEdge.source);
    const targetNode = nodes.find(n => n.id === selectedEdge.target);

    return (
      <div className="h-full bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <LinkIcon className="w-5 h-5" />
            Relationship Details
          </h2>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            <div>
              <h4 className="text-sm text-muted-foreground mb-2">From</h4>
              <div className="font-medium text-foreground">{sourceNode?.data.label}</div>
            </div>

            <div>
              <h4 className="text-sm text-muted-foreground mb-2">To</h4>
              <div className="font-medium text-foreground">{targetNode?.data.label}</div>
            </div>

            {selectedEdge.data?.relationshipType && (
              <div>
                <h4 className="text-sm text-muted-foreground mb-2">Type</h4>
                <Badge variant="secondary">{selectedEdge.data.relationshipType}</Badge>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    );
  }

  return null;
}
