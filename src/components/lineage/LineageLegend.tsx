import { Key, Link, Database, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";

export const LineageLegend = () => {
  return (
    <Card className="absolute bottom-6 right-6 p-4 bg-card/95 backdrop-blur-sm border-border shadow-elevated z-10">
      <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
        <Eye className="w-4 h-4" />
        Legend
      </h3>
      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-6 rounded border-2 border-primary bg-gradient-surface" />
          <span className="text-muted-foreground">Source Node</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-6 rounded border-2 border-accent bg-gradient-surface" />
          <span className="text-muted-foreground">Entity Node</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-6 rounded border-2 border-destructive bg-gradient-surface" />
          <span className="text-muted-foreground">Contains PII</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-warning/20 flex items-center justify-center">
            <Key className="w-3 h-3 text-warning" />
          </div>
          <span className="text-muted-foreground">Primary Key</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-accent/20 flex items-center justify-center">
            <Link className="w-3 h-3 text-accent" />
          </div>
          <span className="text-muted-foreground">Foreign Key</span>
        </div>
        <div className="flex items-center gap-2">
          <svg width="32" height="2" className="mt-1">
            <line
              x1="0"
              y1="1"
              x2="32"
              y2="1"
              stroke="hsl(var(--edge-fk))"
              strokeWidth="2"
            />
          </svg>
          <span className="text-muted-foreground">FK Relationship</span>
        </div>
        <div className="flex items-center gap-2">
          <svg width="32" height="2" className="mt-1">
            <line
              x1="0"
              y1="1"
              x2="32"
              y2="1"
              stroke="hsl(var(--edge-derived))"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          </svg>
          <span className="text-muted-foreground">Derived</span>
        </div>
      </div>
    </Card>
  );
};
