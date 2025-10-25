import { Key, Link, Database, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";

export function LineageLegend() {
  return (
    <Card className="bg-card/95 backdrop-blur-sm border-border shadow-elevated p-2.5">
      <div className="flex items-center gap-4 text-xs">
        <span className="text-xs font-semibold text-muted-foreground">Legend:</span>
        
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-3.5 rounded border-2 border-primary bg-card" />
          <span className="text-muted-foreground">Source</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-3.5 rounded border-2 border-accent bg-card" />
          <span className="text-muted-foreground">Dependent</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-3.5 rounded border-2 border-destructive bg-card" />
          <span className="text-muted-foreground">PII</span>
        </div>
        
        <div className="h-3 w-px bg-border" />
        
        <div className="flex items-center gap-1.5">
          <Key className="w-3.5 h-3.5 text-warning" />
          <span className="text-muted-foreground">PK</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <Link className="w-3.5 h-3.5 text-accent" />
          <span className="text-muted-foreground">FK</span>
        </div>
      </div>
    </Card>
  );
}
