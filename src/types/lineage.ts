// Core lineage type definitions for integration

export interface LineageAttribute {
  id: string;
  name: string;
  type: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  hasPII?: boolean;
  isHighlighted?: boolean;
  description?: string;
  sampleValues?: string[];
}

export interface LineageEntity {
  id: string;
  label: string;
  type: 'source' | 'entity' | 'derived' | 'destination';
  hasPII?: boolean;
  attributes: LineageAttribute[];
  isExpanded?: boolean;
  isHighlighted?: boolean;
  metadata?: {
    owner?: string;
    lastModified?: string;
    rowCount?: number;
    documentation?: string;
    qualityScore?: number;
    domain?: string;
  };
}

export interface LineageEdgeMetadata extends Record<string, unknown> {
  sourceAttribute?: string;
  targetAttribute?: string;
  relationshipType?: 'FK' | 'DERIVED' | 'COPY';
  confidence?: number;
  transformationLogic?: string;
}

export interface LineageViewConfig {
  mode: 'search' | 'entity' | 'attribute' | 'path' | 'impact';
  focusId?: string;
  focusType?: 'entity' | 'attribute';
  filters?: {
    pii?: boolean;
    domain?: string;
    quality?: 'low' | 'medium' | 'high';
    entityType?: string[];
  };
  expandDepth?: number;
  highlightPath?: string[];
  metadata?: {
    source?: 'data-model' | 'search' | 'query' | 'alert';
    context?: any;
  };
}

export interface ImpactAnalysis {
  rootEntity: string;
  upstreamCount: number;
  downstreamCount: number;
  affectedEntities: string[];
  criticalPaths: string[][];
  estimatedImpact: 'low' | 'medium' | 'high' | 'critical';
}

export interface LineageSearchResult {
  id: string;
  name: string;
  type: 'entity' | 'attribute';
  entityName?: string;
  path: string;
  matchScore: number;
  hasPII?: boolean;
}
