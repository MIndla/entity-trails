import { useState } from "react";
import {
  ArrowDownUp,
  Eye,
  EyeOff,
  Maximize2,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export const LineageToolbar = ({
  layout,
  onLayoutChange,
  showPIIOnly,
  onTogglePIIOnly,
  nodeCount,
  edgeCount,
  onFitView,
  onZoomIn,
  onZoomOut,
  onClear,
}: LineageToolbarProps) => {
  return (
    <Card className="absolute top-6 left-6 right-6 p-4 bg-card/95 backdrop-blur-sm border-border shadow-elevated z-10">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <ArrowDownUp className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Layout:</span>
            <Select value={layout} onValueChange={onLayoutChange}>
              <SelectTrigger className="w-[160px] h-9 bg-secondary border-border">
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
            className="gap-2"
          >
            {showPIIOnly ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
            Show PII Only
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

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={onZoomIn}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onZoomOut}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onFitView}>
            <Maximize2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClear}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
