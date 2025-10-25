import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { Node } from "@xyflow/react";
import type { EntityNodeData } from "./EntityNode";

interface LineageSearchProps {
  onSelectEntity: (entityId: string) => void;
  onSelectAttribute: (entityId: string, attributeId: string) => void;
  entities: Node<EntityNodeData>[];
}

export function LineageSearch({ onSelectEntity, onSelectAttribute, entities }: LineageSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEntities = entities.filter(
    (entity) =>
      entity.data.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.data.attributes.some((attr) =>
        attr.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="h-full bg-card flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-foreground mb-3">Search Lineage</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search entities or attributes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {filteredEntities.map((entity) => (
            <div
              key={entity.id}
              className="border border-border rounded-lg p-3 hover:bg-muted cursor-pointer transition-colors"
              onClick={() => onSelectEntity(entity.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-foreground">{entity.data.label}</span>
                {entity.data.hasPII && (
                  <Badge variant="destructive" className="text-xs">PII</Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground capitalize">
                {entity.data.type} • {entity.data.attributes.length} attributes
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
