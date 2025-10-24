import { memo } from "react";
import { Handle, Position } from "reactflow";
import { Database, Key, Link, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface Attribute {
  id: string;
  name: string;
  type: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  hasPII?: boolean;
  isHighlighted?: boolean;
  description?: string;
  sampleValues?: string[];
}

export interface EntityNodeData {
  label: string;
  type: "source" | "entity" | "derived" | "destination";
  hasPII?: boolean;
  attributes: Attribute[];
  isExpanded?: boolean;
  isHighlighted?: boolean;
  onToggleExpand?: (nodeId: string) => void;
  onAttributeClick?: (nodeId: string, attributeId: string) => void;
  metadata?: {
    owner?: string;
    lastModified?: string;
    rowCount?: number;
    qualityScore?: number;
    domain?: string;
    documentation?: string;
  };
}

export const EntityNode = memo(({ data, id }: { data: EntityNodeData; id: string }) => {
  const borderColor = data.hasPII
    ? "border-destructive"
    : data.type === "source"
    ? "border-primary"
    : "border-accent";

  return (
    <Card className={`min-w-[250px] bg-card border-2 ${borderColor} shadow-node`}>
      <Handle type="target" position={Position.Top} className="!bg-accent" />
      
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <Database className="w-5 h-5 text-primary" />
          <div className="flex-1">
            <div className="font-semibold text-foreground">{data.label}</div>
            <div className="text-xs text-muted-foreground capitalize">{data.type}</div>
          </div>
          {data.hasPII && (
            <Badge variant="destructive" className="text-xs">
              <Shield className="w-3 h-3 mr-1" />
              PII
            </Badge>
          )}
        </div>

        {/* Attributes */}
        <div className="space-y-1">
          {data.attributes.map((attr) => (
            <div
              key={attr.id}
              className={`flex items-center gap-2 text-sm px-2 py-1 rounded ${
                attr.isHighlighted ? "bg-primary/20" : "hover:bg-muted"
              }`}
            >
              {attr.isPrimaryKey && (
                <Key className="w-3 h-3 text-warning flex-shrink-0" />
              )}
              {attr.isForeignKey && (
                <Link className="w-3 h-3 text-accent flex-shrink-0" />
              )}
              <span className={`flex-1 truncate ${attr.hasPII ? "text-destructive" : "text-foreground"}`}>
                {attr.name}
              </span>
              <span className="text-muted-foreground text-xs">{attr.type}</span>
            </div>
          ))}
        </div>

        {/* Metadata */}
        {data.metadata && (
          <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
            {data.metadata.rowCount && (
              <div>Rows: {data.metadata.rowCount.toLocaleString()}</div>
            )}
            {data.metadata.owner && <div>Owner: {data.metadata.owner}</div>}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-accent" />
    </Card>
  );
});

EntityNode.displayName = "EntityNode";
