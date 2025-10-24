import { Key, Link, Database, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";

export function LineageLegend() {
  return (
    <Card className="bg-card/95 backdrop-blur-sm border-border shadow-elevated p-4 mb-4 mr-4">
      <h3 className="text-sm font-semibold text-foreground mb-3">Legend</h3>
      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-6 rounded border-2 border-primary bg-card" />
          <span className="text-muted-foreground">Source</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-6 rounded border-2 border-accent bg-card" />
          <span className="text-muted-foreground">Entity</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-6 rounded border-2 border-destructive bg-card" />
          <span className="text-muted-foreground">Contains PII</span>
        </div>
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-warning" />
          <span className="text-muted-foreground">Primary Key</span>
        </div>
        <div className="flex items-center gap-2">
          <Link className="w-4 h-4 text-accent" />
          <span className="text-muted-foreground">Foreign Key</span>
        </div>
      </div>
    </Card>
  );
}
