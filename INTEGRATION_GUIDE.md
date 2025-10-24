# Data Lineage System - Integration Guide for ModelBridge.ai

This guide explains how the Data Lineage visualization system integrates into the ModelBridge.ai Data Architecture/Data Modeling platform.

## Overview

The Data Lineage system provides a comprehensive, interactive visualization of data flows across your organization. It features a modern 3-panel layout, intelligent search, URL-based deep linking, and attribute-level lineage tracking.

## ModelBridge.ai Integration

The Data Lineage viewer is integrated into the **Data Governance** menu:

```
Data Governance → Data Lineage → /governance/lineage
```

### Context Menu Integration

From the Model Studio canvas, users can right-click any entity and select **"View Lineage (Track data flow)"** to navigate directly to the lineage viewer with that entity in focus:

```
/governance/lineage?entity=patient&mode=forward
```

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
│       ├── EntityNode.tsx             # Node component
│       ├── LineageToolbar.tsx         # Toolbar
│       └── LinageLegend.tsx          # Legend
└── pages/
    └── DataLineage.tsx         # Page wrapper with routing
```

## Key Features Implemented

### Phase 1 - Foundation ✅
- ✅ 3-panel responsive layout
- ✅ URL-based routing (`/governance/lineage?entity=X&attribute=Y`)
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

### Phase 3 - Integration Ready ✅
- ✅ Deep linking support
- ✅ Modular component structure
- ✅ Right-click context menu integration ready
- ✅ Integration with ModelBridge.ai navigation

## Integration Steps (Already Completed)

### 1. Core Files (✓ Installed)

All core files are installed in the project:

```
src/
├── types/
│   └── lineage.ts              # TypeScript types for lineage entities and edges
├── hooks/
│   └── useLineageState.ts      # State management hook with URL sync
├── components/
│   └── lineage/
│       ├── DataLineageViewer.tsx    # Main viewer component
│       ├── EntityNode.tsx           # Custom node component
│       ├── LineageSearch.tsx        # Search panel
│       ├── LineageDetails.tsx       # Details panel
│       ├── LineageToolbar.tsx       # Layout/filter controls
│       └── LineageLegend.tsx        # Visual legend
└── pages/
    └── DataLineage.tsx         # Page wrapper component
```

### 2. Router Configuration (✓ Configured)

The lineage route is configured at `/governance/lineage`:

```tsx
// In App.tsx
import DataLineage from "./pages/DataLineage";

<Routes>
  <Route path="/" element={<Index />} />
  <Route path="/governance/lineage" element={<DataLineage />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

### 3. Navigation Integration (For Your Implementation)

Add the Data Lineage link to your existing Data Governance dropdown menu:

```tsx
// In your main navigation component
<NavigationMenuItem>
  <NavigationMenuTrigger>Data Governance</NavigationMenuTrigger>
  <NavigationMenuContent>
    <Link to="/governance/retention">Data Retention Policies</Link>
    <Link to="/governance/compliance">Compliance Management</Link>
    {/* ... other governance links ... */}
    <Link to="/governance/lineage">
      <Network className="mr-2 h-4 w-4" />
      Data Lineage
    </Link>
    <Link to="/governance/audit">Audit & Monitoring</Link>
  </NavigationMenuContent>
</NavigationMenuItem>
```

### 4. Context Menu Integration (For Your Model Studio)

When users right-click an entity in your Model Studio canvas, navigate to lineage viewer:

```tsx
// In your Model Studio context menu handler
import { useNavigate } from 'react-router-dom';
import { Network } from 'lucide-react';

const navigate = useNavigate();

const handleViewLineage = (entityId: string) => {
  navigate(`/governance/lineage?entity=${entityId}&mode=forward`);
};

// Context menu (as shown in your screenshot)
<ContextMenu>
  <ContextMenuItem onClick={() => handleViewLineage(selectedEntity.id)}>
    <Network className="mr-2 h-4 w-4" />
    View Lineage (Track data flow)
  </ContextMenuItem>
  <ContextMenuSeparator />
  <ContextMenuItem onClick={() => handleDuplicateEntity()}>
    Duplicate Entity
  </ContextMenuItem>
  <ContextMenuItem onClick={() => handleDeleteEntity()}>
    Delete Entity
  </ContextMenuItem>
  <ContextMenuItem onClick={() => handleCopyName()}>
    Copy Entity Name
  </ContextMenuItem>
</ContextMenu>
```

### 5. Embed as Component (Alternative)

If you want to embed the lineage viewer within another page:

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
| `entity` | Focus on specific entity | `/governance/lineage?entity=patient` |
| `attribute` | Focus on specific attribute | `/governance/lineage?attribute=patient.ssn` |
| `mode` | View mode | `/governance/lineage?mode=impact` |
| `pii` | Filter PII only | `/governance/lineage?pii=true` |
| `domain` | Filter by domain | `/governance/lineage?domain=healthcare` |
| `depth` | Expansion depth | `/governance/lineage?depth=3` |

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

## Testing Integration Checklist

- [ ] Navigate to `/governance/lineage` - Should show empty search state
- [ ] Search for "patient" - Should show entity in results
- [ ] Click result - Should focus graph on that entity
- [ ] Click expand (+) - Should show attributes
- [ ] Click attribute - Should highlight lineage path
- [ ] Check details panel - Should show metadata
- [ ] Test URL params - `/governance/lineage?entity=patient` should work
- [ ] Test from Model Studio - Right-click context menu navigation works

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

This implementation is part of your ModelBridge.ai project and follows your project's license.
