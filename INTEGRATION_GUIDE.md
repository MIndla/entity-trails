# Data Lineage Integration Guide

This guide explains how to integrate the redesigned Data Lineage system into your existing application.

## Overview

The system is built with three main components:
1. **Search Panel** (left) - Entity and attribute search with quick filters
2. **Graph Canvas** (center) - Interactive lineage visualization
3. **Details Panel** (right) - Rich context and metadata display

## Architecture

```
src/
├── types/
│   └── lineage.ts              # Shared type definitions
├── hooks/
│   └── useLineageState.ts      # State management with URL params
├── components/
│   └── lineage/
│       ├── DataLineageViewer.tsx      # Main viewer (3-panel layout)
│       ├── LineageSearch.tsx          # Search panel
│       ├── LineageDetails.tsx         # Details panel
│       ├── EntityNode.tsx             # Node component (existing)
│       ├── LineageToolbar.tsx         # Toolbar (existing)
│       └── LineageLegend.tsx          # Legend (existing)
├── pages/
│   └── DataLineage.tsx         # Page wrapper with routing
└── App.tsx                     # Route configuration
```

## Key Features Implemented

### Phase 1 - Foundation ✅
- ✅ 3-panel responsive layout
- ✅ URL-based routing (`/lineage?entity=X&attribute=Y`)
- ✅ Entity/attribute search with live results
- ✅ Rich details panel with metadata display
- ✅ Node and edge selection with context
- ✅ Expandable attributes
- ✅ Path highlighting on click

### Phase 2 - Intelligence ✅
- ✅ Attribute-level lineage tracing
- ✅ Bidirectional path traversal (upstream & downstream)
- ✅ PII filtering and highlighting
- ✅ Multiple filter options

### Phase 3 - Integration Ready 🚧
- ✅ Deep linking support
- ✅ Modular component structure
- ⏳ Right-click context menu (ready to integrate)
- ⏳ Saved views (localStorage structure ready)

## Integration Steps

### 1. Copy Core Files

Copy these files into your existing project:

```bash
# Type definitions
src/types/lineage.ts

# Hooks
src/hooks/useLineageState.ts

# Components
src/components/lineage/LineageSearch.tsx
src/components/lineage/LineageDetails.tsx
src/components/lineage/DataLineageViewer.tsx  # (updated version)

# Page (optional - if using routing)
src/pages/DataLineage.tsx
```

### 2. Update Your Router

Add the lineage route to your existing router configuration:

```tsx
// In your main router file (e.g., App.tsx, Routes.tsx)
import DataLineage from './pages/DataLineage';

<Route path="/lineage" element={<DataLineage />} />
```

### 3. Add Navigation Link

Add a link to the lineage viewer in your main navigation:

```tsx
import { Link } from 'react-router-dom';
import { Network } from 'lucide-react';

<Link to="/lineage">
  <Network className="h-4 w-4" />
  Data Lineage
</Link>
```

### 4. Integration from Data Model (Right-Click)

To invoke lineage from your data model diagram:

```tsx
// In your data model component
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

const handleShowLineage = (entityId: string) => {
  navigate(`/lineage?entity=${entityId}&mode=entity`);
};

const handleShowAttributeLineage = (entityId: string, attributeId: string) => {
  navigate(`/lineage?attribute=${entityId}.${attributeId}&mode=attribute`);
};

// Add context menu
<ContextMenu>
  <ContextMenuItem onClick={() => handleShowLineage(entity.id)}>
    Show Lineage
  </ContextMenuItem>
</ContextMenu>
```

### 5. Embed as Component (Alternative)

If you want to embed the lineage viewer within another page instead of a separate route:

```tsx
import { DataLineageViewer } from '@/components/lineage/DataLineageViewer';

// Full 3-panel layout
<DataLineageViewer 
  showSearch={true}
  showDetails={true}
/>

// Compact mode (no search/details panels)
<DataLineageViewer 
  showSearch={false}
  showDetails={false}
  initialFocusId="patient"
  initialFocusType="entity"
/>

// With callbacks
<DataLineageViewer 
  showSearch={true}
  showDetails={true}
  onNodeSelect={(node) => console.log('Selected:', node)}
  onEdgeSelect={(edge) => console.log('Selected edge:', edge)}
/>
```

## URL Parameters

The system supports deep linking with URL parameters:

| Parameter | Description | Example |
|-----------|-------------|---------|
| `entity` | Focus on specific entity | `/lineage?entity=patient` |
| `attribute` | Focus on specific attribute | `/lineage?attribute=patient.ssn` |
| `mode` | View mode | `/lineage?mode=impact` |
| `pii` | Filter PII only | `/lineage?pii=true` |
| `domain` | Filter by domain | `/lineage?domain=healthcare` |
| `depth` | Expansion depth | `/lineage?depth=3` |

## Data Structure

### Entity Format
```typescript
{
  id: "1",
  type: "entity",
  position: { x: 0, y: 0 },
  data: {
    label: "patient",
    type: "source" | "entity" | "derived",
    hasPII: true,
    attributes: [
      {
        id: "1-1",
        name: "patient_id",
        type: "int",
        isPrimaryKey: true,
        isForeignKey: false,
        hasPII: false,
        description: "Unique patient identifier",
        sampleValues: ["12345", "67890"]
      }
    ],
    metadata: {
      owner: "data-team@company.com",
      lastModified: "2025-01-15",
      rowCount: 1000000,
      qualityScore: 95,
      documentation: "Core patient information table",
      domain: "healthcare"
    }
  }
}
```

### Edge Format
```typescript
{
  id: "e1-2",
  source: "1",
  target: "2",
  type: "smoothstep",
  label: "FK • 100%",
  data: {
    sourceAttribute: "1-1",  // patient_id in source
    targetAttribute: "2-1",  // patient_id in target
    relationshipType: "FK",
    confidence: 1.0,
    transformationLogic: "SELECT * FROM patient WHERE active = true"
  }
}
```

## Customization

### Replace Mock Data with Your API

Update `DataLineageViewer.tsx`:

```tsx
// Replace this:
const initialNodesData = useMemo(() => createInitialNodes(), []);
const initialEdgesData = useMemo(() => createInitialEdges(), []);

// With your API call:
const { data: lineageData } = useQuery(['lineage', focusId], async () => {
  const response = await fetch(`/api/lineage/${focusId}`);
  return response.json();
});

const initialNodesData = useMemo(() => lineageData?.nodes || [], [lineageData]);
const initialEdgesData = useMemo(() => lineageData?.edges || [], [lineageData]);
```

### Customize Search Logic

Update `LineageSearch.tsx` to integrate with your search API:

```tsx
const { data: searchResults } = useQuery(
  ['lineage-search', searchQuery],
  async () => {
    const response = await fetch(`/api/lineage/search?q=${searchQuery}`);
    return response.json();
  },
  { enabled: searchQuery.trim().length > 0 }
);
```

### Add Custom Filters

Extend the toolbar filters in `LineageToolbar.tsx`:

```tsx
<DropdownMenu>
  <DropdownMenuTrigger>
    <Button variant="outline" size="sm">
      <Filter className="h-4 w-4 mr-2" />
      Filters
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onClick={() => onFilterChange('pii', true)}>
      PII Only
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => onFilterChange('domain', 'finance')}>
      Finance Domain
    </DropdownMenuItem>
    {/* Add your custom filters */}
  </DropdownMenuContent>
</DropdownMenu>
```

## Styling

The system uses your existing design tokens from `index.css`:

```css
/* Key variables used */
--primary          /* Node highlights, active states */
--accent           /* Secondary highlights */
--destructive      /* PII indicators */
--edge-fk          /* Relationship lines */
--background       /* Canvas background */
--card             /* Panel backgrounds */
--border           /* Panel dividers */
```

To customize colors, update these variables in your `index.css`.

## Performance Considerations

For large graphs (>100 nodes):

1. **Lazy load attributes**: Set `isExpanded: false` by default
2. **Limit initial depth**: Use `expandDepth: 2` in URL params
3. **Virtual scrolling**: Implement in search results if >1000 items
4. **Debounce search**: Already implemented (500ms)
5. **Memoize expensive calculations**: Already using `useMemo` and `useCallback`

## Testing Integration

1. **Navigate to `/lineage`** - Should show empty search state
2. **Search for "patient"** - Should show entity in results
3. **Click result** - Should focus graph on that entity
4. **Click expand (+)** - Should show attributes
5. **Click attribute** - Should highlight lineage path
6. **Check details panel** - Should show metadata
7. **Test URL params** - `/lineage?entity=patient` should work

## Next Steps (Phase 3 Enhancement Ideas)

1. **Impact Analysis Mode**
   - Add `LineageImpactAnalysis.tsx` component
   - Calculate affected downstream entities
   - Show breaking vs non-breaking changes

2. **Saved Views**
   - localStorage for favorite views
   - Share view URLs
   - Recent views in search panel

3. **Collaboration Features**
   - Comments on nodes/edges
   - @mentions in documentation
   - Change history

4. **Advanced Analytics**
   - Data quality metrics overlay
   - Lineage gap detection
   - Orphaned table identification

## Support

For questions or issues:
1. Check type definitions in `src/types/lineage.ts`
2. Review `INTEGRATION_GUIDE.md` (this file)
3. See inline JSDoc comments in components

## License

This implementation is part of your existing project and follows your project's license.
