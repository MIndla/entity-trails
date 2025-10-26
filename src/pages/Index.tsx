import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Database, LayoutGrid } from 'lucide-react';

/**
 * Index/Home Page
 * 
 * This is a placeholder for your existing ModelBridge.ai home page.
 * Replace this with your actual Model Studio / home page component.
 */
export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-6 mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ModelBridge.ai
            </h1>
            <p className="text-xl text-muted-foreground">
              Data Modeling & Governance Platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <Link to="/governance/lineage" className="group">
              <div className="p-6 border rounded-lg hover:border-primary transition-all hover:shadow-lg bg-card">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                    <Database className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-semibold">Data Lineage</h2>
                </div>
                <p className="text-muted-foreground">
                  Visualize and explore data lineage, entity relationships, and data flow across your models.
                </p>
              </div>
            </Link>

            <div className="p-6 border rounded-lg bg-muted/50">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-lg bg-muted text-muted-foreground">
                  <LayoutGrid className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-semibold text-muted-foreground">Model Studio</h2>
              </div>
              <p className="text-muted-foreground">
                Replace this section with your actual Model Studio component and navigation.
              </p>
            </div>
          </div>

          <div className="mt-12 p-6 border border-dashed rounded-lg bg-muted/30">
            <h3 className="font-semibold mb-3">Quick Navigation</h3>
            <div className="flex flex-wrap gap-3">
              <Link to="/governance/lineage?modelId=aa9d4563-bb15-4d4f-a0eb-9ddacf9dd9d4">
                <Button variant="outline" size="sm">
                  View Sample Model Lineage
                </Button>
              </Link>
              <Link to="/governance/lineage">
                <Button variant="outline" size="sm">
                  Lineage Viewer
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
