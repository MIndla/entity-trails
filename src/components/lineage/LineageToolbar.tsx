import { ArrowDownUp, Eye, EyeOff, X, LayoutGrid } from "lucide-react";
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
  onResetLayout: () => void;
}

export function LineageToolbar({
  layout,
  onLayoutChange,
  showPIIOnly,
  onTogglePIIOnly,
  nodeCount,
  edgeCount,
  onClear,
  onResetLayout,
}: LineageToolbarProps) {
  return (
    <Card className="p-2.5 bg-card/95 backdrop-blur-sm border-border shadow-elevated">
      <div className="flex items-center justify-between gap-3">
        {/* Left side controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <ArrowDownUp className="w-4 h-4 text-muted-foreground" />
            <Select value={layout} onValueChange={onLayoutChange}>
              <SelectTrigger className="w-[135px] h-7 text-xs">
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
            variant="outline"
            size="sm"
            onClick={onResetLayout}
            className="gap-2 h-7 text-xs px-2.5"
          >
            <LayoutGrid className="w-3 h-3" />
            Reset Layout
          </Button>

          <Button
            variant={showPIIOnly ? "default" : "outline"}
            size="sm"
            onClick={onTogglePIIOnly}
            className="gap-2 h-7 text-xs px-2.5"
          >
            {showPIIOnly ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            PII Only
          </Button>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1 h-7 px-2">
              <span className="text-xs text-muted-foreground">Nodes:</span>
              <span className="font-semibold text-xs">{nodeCount}</span>
            </Badge>
            <Badge variant="secondary" className="gap-1 h-7 px-2">
              <span className="text-xs text-muted-foreground">Edges:</span>
              <span className="font-semibold text-xs">{edgeCount}</span>
            </Badge>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="gap-2 h-7 text-xs px-2.5"
          >
            <X className="w-3 h-3" />
            Clear
          </Button>
        </div>
      </div>
    </Card>
  );
}
