import { useState, useMemo } from 'react';
import { Search, Database, Table, ChevronRight, Shield, Key, Link as LinkIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { LineageSearchResult } from '@/types/lineage';

interface LineageSearchProps {
  onSelectEntity: (entityId: string) => void;
  onSelectAttribute: (entityId: string, attributeId: string) => void;
  entities: any[]; // Replace with actual entity data
}

export const LineageSearch = ({ onSelectEntity, onSelectAttribute, entities }: LineageSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock search results - replace with actual search logic
  const searchResults = useMemo<LineageSearchResult[]>(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const results: LineageSearchResult[] = [];

    entities.forEach((entity) => {
      // Search entity names
      if (entity.data.label.toLowerCase().includes(query)) {
        results.push({
          id: entity.id,
          name: entity.data.label,
          type: 'entity',
          path: entity.data.label,
          matchScore: 1,
          hasPII: entity.data.hasPII,
        });
      }

      // Search attributes
      entity.data.attributes?.forEach((attr: any) => {
        if (attr.name.toLowerCase().includes(query)) {
          results.push({
            id: attr.id,
            name: attr.name,
            type: 'attribute',
            entityName: entity.data.label,
            path: `${entity.data.label}.${attr.name}`,
            matchScore: 0.8,
            hasPII: attr.hasPII,
          });
        }
      });
    });

    return results.sort((a, b) => b.matchScore - a.matchScore);
  }, [searchQuery, entities]);

  const handleResultClick = (result: LineageSearchResult) => {
    if (result.type === 'entity') {
      onSelectEntity(result.id);
    } else {
      const entity = entities.find(e => e.data.label === result.entityName);
      if (entity) {
        onSelectAttribute(entity.id, result.id);
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      {/* Search Header */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search entities, attributes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Search Results or Quick Access */}
      <ScrollArea className="flex-1">
        {searchQuery.trim() ? (
          <div className="p-2">
            {searchResults.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Database className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No results found</p>
              </div>
            ) : (
              <div className="space-y-1">
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors text-left group"
                  >
                    {result.type === 'entity' ? (
                      <Table className="h-4 w-4 text-primary flex-shrink-0" />
                    ) : (
                      <div className="flex-shrink-0">
                        {result.hasPII ? (
                          <Shield className="h-4 w-4 text-destructive" />
                        ) : (
                          <Key className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{result.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{result.path}</div>
                    </div>

                    {result.hasPII && (
                      <Badge variant="destructive" className="text-xs">PII</Badge>
                    )}

                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wide">
                Quick Access
              </h3>
              <div className="space-y-1">
                <QuickAccessItem
                  icon={<Shield className="h-4 w-4" />}
                  label="All PII Data"
                  onClick={() => {/* Filter PII */}}
                />
                <QuickAccessItem
                  icon={<Database className="h-4 w-4" />}
                  label="Source Tables"
                  onClick={() => {/* Filter sources */}}
                />
                <QuickAccessItem
                  icon={<LinkIcon className="h-4 w-4" />}
                  label="Show All Relationships"
                  onClick={() => {/* Show all */}}
                />
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wide">
                Recent Views
              </h3>
              <div className="text-sm text-muted-foreground text-center py-4">
                No recent views
              </div>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

interface QuickAccessItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const QuickAccessItem = ({ icon, label, onClick }: QuickAccessItemProps) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors text-left group"
  >
    <div className="text-primary">{icon}</div>
    <span className="text-sm">{label}</span>
    <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
  </button>
);
