import { DataLineageViewer } from '@/components/lineage/DataLineageViewer';

/**
 * Data Lineage Page
 * 
 * This page serves as the main entry point for data lineage visualization.
 * It can be accessed via:
 * 1. Direct navigation: /lineage
 * 2. With entity focus: /lineage?entity=patient
 * 3. With attribute focus: /lineage?attribute=patient.ssn
 * 4. With filters: /lineage?pii=true&domain=healthcare
 * 
 * Integration points:
 * - Called from main menu "Data Lineage"
 * - Right-click context menu from data model diagrams
 * - Deep links from alerts, documentation, or query editors
 */
export default function DataLineage() {
  return (
    <div className="w-full h-screen">
      <DataLineageViewer
        showSearch={true}
        showDetails={true}
      />
    </div>
  );
}
