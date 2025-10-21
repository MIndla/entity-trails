import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Plus, Key, Link, Database } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface EntityNodeData {
  label: string;
  type: "entity" | "source";
  hasPII?: boolean;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  isHighlighted?: boolean;
}

const EntityNode = memo(({ data, selected }: NodeProps<EntityNodeData>) => {
  const isSource = data.type === "source";
  const hasPII = data.hasPII;

  const getBorderColor = () => {
    if (data.isHighlighted || selected) return "border-primary shadow-glow scale-105";
    if (hasPII) return "border-destructive";
    if (isSource) return "border-primary";
    return "border-border";
  };

  return (
    <div
      className={cn(
        "relative px-6 py-4 rounded-xl transition-all duration-300",
        "bg-gradient-surface border-2",
        "min-w-[200px] shadow-node hover:shadow-elevated",
        getBorderColor(),
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-accent !border-2 !border-background"
      />

      {/* Expand button - top right */}
      <Button
        size="icon"
        variant="ghost"
        className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary hover:bg-primary-glow shadow-md"
        title="Expand entity details"
      >
        <Plus className="w-3 h-3 text-primary-foreground" />
      </Button>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          <Database className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground font-medium">{data.label}</span>
        </div>

        <div className="flex items-center gap-1">
          {data.isPrimaryKey && (
            <div className="p-1 rounded bg-warning/20" title="Primary Key">
              <Key className="w-3 h-3 text-warning" />
            </div>
          )}
          {data.isForeignKey && (
            <div className="p-1 rounded bg-accent/20" title="Foreign Key">
              <Link className="w-3 h-3 text-accent" />
            </div>
          )}
        </div>
      </div>

      {/* PII Badge */}
      {hasPII && (
        <div className="mt-2 inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-destructive/20 text-destructive border border-destructive/30">
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
