import { ArrowDownUp, Eye, EyeOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  layout,
  onLayoutChange,
  showPIIOnly,
  onTogglePIIOnly,
  nodeCount,
  edgeCount,
  onClear,
}: LineageToolbarProps) {
  return (
    <Card className="p-3 bg-card/95 backdrop-blur-sm border-border shadow-elevated">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <ArrowDownUp className="w-4 h-4 text-muted-foreground" />
          <Select value={layout} onValueChange={onLayoutChange}>
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TB">Top → Bottom</SelectItem>
              <SelectItem value="BT">Bottom → Top</SelectItem>
              <SelectItem value="LR">Left → Right</SelectItem>
              <SelectItem value="RL">Right → Left</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant={showPIIOnly ? "default" : "outline"}
          size="sm"
          onClick={onTogglePIIOnly}
          className="gap-2 h-8 text-xs"
        >
          {showPIIOnly ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          PII Only
        </Button>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1 h-8">
            <span className="text-xs text-muted-foreground">Nodes:</span>
            <span className="font-semibold">{nodeCount}</span>
          </Badge>
          <Badge variant="secondary" className="gap-1 h-8">
            <span className="text-xs text-muted-foreground">Edges:</span>
            <span className="font-semibold">{edgeCount}</span>
          </Badge>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="gap-2 h-8 text-xs"
        >
          <X className="w-3 h-3" />
          Clear
        </Button>
      </div>
    </Card>
  );
}
