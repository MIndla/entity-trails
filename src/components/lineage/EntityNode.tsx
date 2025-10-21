import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Plus, Minus, Key, Link, Database, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface Attribute {
  id: string;
  name: string;
  type: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  hasPII?: boolean;
  isHighlighted?: boolean;
}

export interface EntityNodeData {
  label: string;
  type: "entity" | "source";
  hasPII?: boolean;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  isHighlighted?: boolean;
  attributes?: Attribute[];
  isExpanded?: boolean;
  onToggleExpand?: (nodeId: string) => void;
  onAttributeClick?: (nodeId: string, attributeId: string) => void;
  nodeId?: string;
}

const EntityNode = memo(({ data, selected, id }: NodeProps<EntityNodeData>) => {
  const isSource = data.type === "source";
  const hasPII = data.hasPII;
  const hasAttributes = data.attributes && data.attributes.length > 0;

  const getBorderColor = () => {
    if (data.isHighlighted || selected) return "border-primary shadow-glow";
    if (hasPII) return "border-destructive";
    if (isSource) return "border-primary";
    return "border-accent";
  };

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.onToggleExpand) {
      data.onToggleExpand(id);
    }
  };

  const handleAttributeClick = (attributeId: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.onAttributeClick) {
      data.onAttributeClick(id, attributeId);
    }
  };

  return (
    <div
      className={cn(
        "relative px-6 py-4 rounded-xl transition-all duration-300",
        "bg-gradient-surface border-2",
        "min-w-[240px] shadow-node hover:shadow-elevated",
        getBorderColor(),
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-accent !border-2 !border-background"
      />

      {/* Expand button - top right */}
      {hasAttributes && (
        <Button
          size="icon"
          variant="ghost"
          className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary hover:bg-primary-glow shadow-md"
          title={data.isExpanded ? "Collapse attributes" : "Expand attributes"}
          onClick={handleToggleExpand}
        >
          {data.isExpanded ? (
            <Minus className="w-3 h-3 text-primary-foreground" />
          ) : (
            <Plus className="w-3 h-3 text-primary-foreground" />
          )}
        </Button>
      )}

      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-1">
          <Database className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground font-medium">{data.label}</span>
        </div>
      </div>

      {/* Attributes list */}
      {data.isExpanded && hasAttributes && (
        <div className="mt-3 space-y-1 border-t border-border pt-2">
          {data.attributes!.map((attr) => (
            <div
              key={attr.id}
              onClick={handleAttributeClick(attr.id)}
              className={cn(
                "flex items-center justify-between gap-2 px-2 py-1.5 rounded cursor-pointer transition-colors",
                "hover:bg-muted/50",
                attr.isHighlighted ? "bg-primary/20 ring-1 ring-primary" : "bg-muted/20"
              )}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-sm text-foreground truncate">{attr.name}</span>
                {attr.hasPII && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-destructive/20 text-destructive font-medium">
                    PII
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {attr.isPrimaryKey && (
                  <div className="p-0.5 rounded bg-warning/20" title="Primary Key">
                    <Key className="w-2.5 h-2.5 text-warning" />
                  </div>
                )}
                {attr.isForeignKey && (
                  <div className="p-0.5 rounded bg-accent/20" title="Foreign Key">
                    <Link className="w-2.5 h-2.5 text-accent" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PII Badge - only show if not expanded */}
      {hasPII && !data.isExpanded && (
        <div className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-destructive/20 text-destructive border border-destructive/30">
          PII
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-accent !border-2 !border-background"
      />
    </div>
  );
});

EntityNode.displayName = "EntityNode";

export default EntityNode;
