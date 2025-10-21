import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Plus, Key, Link, Database } from "lucide-react";
import { cn } from "@/lib/utils";

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

  return (
    <div
      className={cn(
        "relative px-6 py-4 rounded-xl transition-all duration-300",
        "bg-gradient-surface border-2",
        "min-w-[200px] shadow-node hover:shadow-elevated",
        data.isHighlighted || selected
          ? "border-primary shadow-glow scale-105"
          : hasPII
          ? "border-destructive"
          : "border-border hover:border-primary/50",
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-accent !border-2 !border-background"
      />

      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
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

      <div className="flex items-center gap-2">
        <div
          className={cn(
            "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium",
            isSource
              ? "bg-primary/20 text-primary border border-primary/30"
              : "bg-accent/20 text-accent border border-accent/30",
          )}
        >
          <span className="uppercase tracking-wider">
            {isSource ? "Source" : "Entity"}
          </span>
          <Plus className="w-3 h-3" />
        </div>

        {hasPII && (
          <div className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-destructive/20 text-destructive border border-destructive/30">
            PII
          </div>
        )}
      </div>

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
