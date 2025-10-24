import { Key, Link, Database, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";

export function LineageLegend() {
  return (
    <Card className="bg-card/95 backdrop-blur-sm border-border shadow-elevated p-3">
      <div className="flex items-center gap-6 text-xs">
        <span className="text-sm font-semibold text-foreground mr-2">Legend:</span>
        
        <div className="flex items-center gap-2">
          <div className="w-6 h-4 rounded border-2 border-primary bg-card" />
          <span className="text-muted-foreground">Source</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-6 h-4 rounded border-2 border-accent bg-card" />
          <span className="text-muted-foreground">Entity</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-6 h-4 rounded border-2 border-destructive bg-card" />
          <span className="text-muted-foreground">PII</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-warning" />
          <span className="text-muted-foreground">PK</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Link className="w-4 h-4 text-accent" />
          <span className="text-muted-foreground">FK</span>
        </div>
      </div>
    </Card>
  );
}
