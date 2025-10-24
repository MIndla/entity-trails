import { Node, Edge } from 'reactflow';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { 
  Database, 
  Calendar, 
  User, 
  TrendingUp, 
  Shield, 
  Key, 
  Link as LinkIcon,
  ArrowRight,
  AlertCircle,
  FileText,
  BarChart3
} from 'lucide-react';
import { EntityNodeData } from './EntityNode';
import { LineageEdgeMetadata } from '@/types/lineage';

interface LineageDetailsProps {
  selectedNode: Node<EntityNodeData> | null;
  selectedEdge: Edge<LineageEdgeMetadata> | null;
  nodes: Node<EntityNodeData>[];
}

export const LineageDetails = ({ selectedNode, selectedEdge, nodes }: LineageDetailsProps) => {
  if (!selectedNode && !selectedEdge) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-card border-l border-border p-6">
        <Database className="h-16 w-16 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Selection</h3>
        <p className="text-sm text-muted-foreground text-center">
          Click on a node or relationship to view detailed information
        </p>
      </div>
    );
  }

  if (selectedEdge) {
    return <EdgeDetails edge={selectedEdge} nodes={nodes} />;
  }

  return <NodeDetails node={selectedNode!} />;
};

const NodeDetails = ({ node }: { node: Node<EntityNodeData> }) => {
  const data = node.data;
  const metadata = data.metadata || {};

  return (
    <div className="h-full flex flex-col bg-card border-l border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-start gap-3">
          <Database className="h-5 w-5 text-primary mt-1" />
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold truncate">{data.label}</h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge variant={data.type === 'source' ? 'default' : 'secondary'}>
                {data.type.toUpperCase()}
              </Badge>
              {data.hasPII && (
                <Badge variant="destructive" className="gap-1">
                  <Shield className="h-3 w-3" />
                  PII
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Metadata Section */}
          <section>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
              Metadata
            </h3>
            <div className="space-y-2">
              {metadata.owner && (
                <MetadataRow icon={<User className="h-4 w-4" />} label="Owner" value={metadata.owner} />
              )}
              {metadata.lastModified && (
                <MetadataRow icon={<Calendar className="h-4 w-4" />} label="Last Modified" value={metadata.lastModified} />
              )}
              {metadata.rowCount !== undefined && (
                <MetadataRow icon={<BarChart3 className="h-4 w-4" />} label="Row Count" value={metadata.rowCount.toLocaleString()} />
              )}
              {metadata.qualityScore !== undefined && (
                <MetadataRow 
                  icon={<TrendingUp className="h-4 w-4" />} 
                  label="Quality Score" 
                  value={
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all" 
                          style={{ width: `${metadata.qualityScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{metadata.qualityScore}%</span>
                    </div>
                  }
                />
              )}
              {metadata.domain && (
                <MetadataRow icon={<FileText className="h-4 w-4" />} label="Domain" value={metadata.domain} />
              )}
            </div>
          </section>

          <Separator />

          {/* Attributes Section */}
          {data.attributes && data.attributes.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                Attributes ({data.attributes.length})
              </h3>
              <div className="space-y-2">
                {data.attributes.map((attr) => (
                  <Card key={attr.id} className="p-3">
                    <div className="flex items-start gap-2">
                      <div className="flex gap-1 mt-0.5">
                        {attr.isPrimaryKey && (
                          <Key className="h-3 w-3 text-primary" />
                        )}
                        {attr.isForeignKey && (
                          <LinkIcon className="h-3 w-3 text-accent" />
                        )}
                        {attr.hasPII && (
                          <Shield className="h-3 w-3 text-destructive" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{attr.name}</div>
                        <div className="text-xs text-muted-foreground">{attr.type}</div>
                        {attr.description && (
                          <p className="text-xs text-muted-foreground mt-1">{attr.description}</p>
                        )}
                        {attr.sampleValues && attr.sampleValues.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {attr.sampleValues.map((val, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {val}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}

          <Separator />

          {/* Documentation Section */}
          {metadata.documentation && (
            <section>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                Documentation
              </h3>
              <p className="text-sm text-foreground leading-relaxed">{metadata.documentation}</p>
            </section>
          )}

          {/* Impact Analysis */}
          <section>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
              Impact Radius
            </h3>
            <Card className="p-4">
              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Click "Analyze Impact" to see downstream effects</span>
              </div>
            </Card>
          </section>
        </div>
      </ScrollArea>
    </div>
  );
};

const EdgeDetails = ({ edge, nodes }: { edge: Edge<LineageEdgeMetadata>; nodes: Node<EntityNodeData>[] }) => {
  const sourceNode = nodes.find(n => n.id === edge.source);
  const targetNode = nodes.find(n => n.id === edge.target);
  const edgeData = edge.data || {};

  const sourceAttr = sourceNode?.data.attributes?.find(a => a.id === edgeData.sourceAttribute);
  const targetAttr = targetNode?.data.attributes?.find(a => a.id === edgeData.targetAttribute);

  return (
    <div className="h-full flex flex-col bg-card border-l border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-start gap-3">
          <LinkIcon className="h-5 w-5 text-primary mt-1" />
          <div className="flex-1">
            <h2 className="text-lg font-bold">Relationship</h2>
            <div className="flex items-center gap-2 mt-2 text-sm">
              <span className="font-medium">{sourceNode?.data.label}</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{targetNode?.data.label}</span>
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Relationship Type */}
          <section>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
              Connection Details
            </h3>
            <div className="space-y-2">
              <MetadataRow 
                icon={<LinkIcon className="h-4 w-4" />} 
                label="Type" 
                value={edgeData.relationshipType || 'FK'} 
              />
              {edgeData.confidence && (
                <MetadataRow 
                  icon={<TrendingUp className="h-4 w-4" />} 
                  label="Confidence" 
                  value={`${Math.round(edgeData.confidence * 100)}%`} 
                />
              )}
            </div>
          </section>

          <Separator />

          {/* Attribute Mapping */}
          {sourceAttr && targetAttr && (
            <section>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                Attribute Mapping
              </h3>
              <Card className="p-4">
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Source</div>
                    <div className="font-medium text-sm">{sourceNode?.data.label}.{sourceAttr.name}</div>
                    <div className="text-xs text-muted-foreground">{sourceAttr.type}</div>
                  </div>
                  <div className="flex justify-center">
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Target</div>
                    <div className="font-medium text-sm">{targetNode?.data.label}.{targetAttr.name}</div>
                    <div className="text-xs text-muted-foreground">{targetAttr.type}</div>
                  </div>
                </div>
              </Card>
            </section>
          )}

          {/* Transformation Logic */}
          {edgeData.transformationLogic && (
            <>
              <Separator />
              <section>
                <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                  Transformation Logic
                </h3>
                <Card className="p-4">
                  <code className="text-xs text-foreground whitespace-pre-wrap">
                    {edgeData.transformationLogic}
                  </code>
                </Card>
              </section>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

interface MetadataRowProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

const MetadataRow = ({ icon, label, value }: MetadataRowProps) => (
  <div className="flex items-start gap-3 text-sm">
    <div className="text-muted-foreground mt-0.5">{icon}</div>
    <div className="flex-1 min-w-0">
      <div className="text-muted-foreground text-xs mb-0.5">{label}</div>
      <div className="font-medium break-words">{value}</div>
    </div>
  </div>
);
