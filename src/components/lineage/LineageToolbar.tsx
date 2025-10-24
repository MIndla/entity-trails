import { ArrowDownUp, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LineageToolbarProps {
  layout: string;
  onLayoutChange: (layout: string) => void;
  showPIIOnly: boolean;
  onTogglePIIOnly: () => void;
  nodeCount: number;
  edgeCount: number;
  onFitView: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onClear: () => void;
}

export function LineageToolbar({
  showPIIOnly,
  onTogglePIIOnly,
  nodeCount,
  edgeCount,
}: LineageToolbarProps) {
  return (
    <Card className="p-3 bg-card/95 backdrop-blur-sm border-border shadow-elevated">
      <div className="flex items-center gap-3">
        <Button
          variant={showPIIOnly ? "default" : "outline"}
          size="sm"
          onClick={onTogglePIIOnly}
          className="gap-2"
        >
          {showPIIOnly ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          PII Only
        </Button>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <span className="text-xs text-muted-foreground">Nodes:</span>
            <span className="font-semibold">{nodeCount}</span>
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <span className="text-xs text-muted-foreground">Edges:</span>
            <span className="font-semibold">{edgeCount}</span>
          </Badge>
        </div>
      </div>
    </Card>
  );
}
