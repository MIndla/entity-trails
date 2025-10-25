import { useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Node, Edge } from '@xyflow/react';
import { LineageViewConfig, LineageEntity, ImpactAnalysis } from '@/types/lineage';

export const useLineageState = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Parse config from URL
  const config: LineageViewConfig = useMemo(() => {
    const mode = (searchParams.get('mode') as LineageViewConfig['mode']) || 'search';
    const focusId = searchParams.get('entity') || searchParams.get('attribute') || undefined;
    const focusType = searchParams.get('attribute') ? 'attribute' : 'entity';
    
    return {
      mode,
      focusId,
      focusType: focusId ? focusType : undefined,
      filters: {
        pii: searchParams.get('pii') === 'true',
        domain: searchParams.get('domain') || undefined,
        quality: searchParams.get('quality') as any,
      },
      expandDepth: parseInt(searchParams.get('depth') || '2'),
    };
  }, [searchParams]);

  // Update URL with new config
  const updateConfig = useCallback((updates: Partial<LineageViewConfig>) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (updates.mode) newParams.set('mode', updates.mode);
    if (updates.focusId) {
      if (updates.focusType === 'attribute') {
        newParams.set('attribute', updates.focusId);
        newParams.delete('entity');
      } else {
        newParams.set('entity', updates.focusId);
        newParams.delete('attribute');
      }
    }
    if (updates.filters?.pii !== undefined) {
      newParams.set('pii', String(updates.filters.pii));
    }
    if (updates.filters?.domain) {
      newParams.set('domain', updates.filters.domain);
    }
    if (updates.expandDepth) {
      newParams.set('depth', String(updates.expandDepth));
    }
    
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [impactAnalysis, setImpactAnalysis] = useState<ImpactAnalysis | null>(null);

  return {
    config,
    updateConfig,
    selectedNode,
    setSelectedNode,
    selectedEdge,
    setSelectedEdge,
    impactAnalysis,
    setImpactAnalysis,
  };
};
