import { Link } from 'react-router-dom';
import { Network, ArrowRight, Database, Shield, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-primary/10 rounded-full">
            <Network className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">Data Lineage Platform</span>
          </div>
          
          <h1 className="text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Understand Your Data Flow
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Visualize, trace, and analyze data lineage across your entire data ecosystem. 
            From source to destination, understand every transformation and dependency.
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <Link to="/lineage">
              <Button size="lg" className="gap-2">
                Explore Data Lineage
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 mb-16">
          <FeatureCard
            icon={<Database className="h-8 w-8 text-primary" />}
            title="Interactive Visualization"
            description="Explore data relationships with an intuitive, interactive graph interface. Click to trace lineage paths."
          />
          <FeatureCard
            icon={<Shield className="h-8 w-8 text-destructive" />}
            title="PII Detection"
            description="Automatically identify and track personally identifiable information across your data pipeline."
          />
          <FeatureCard
            icon={<TrendingUp className="h-8 w-8 text-primary" />}
            title="Impact Analysis"
            description="Understand downstream effects of schema changes and data quality issues before they happen."
          />
        </div>

        {/* Screenshot/Demo Section */}
        <div className="max-w-6xl mx-auto">
          <Card className="p-8 bg-card/50 backdrop-blur-sm">
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
              <Link to="/lineage">
                <Button variant="outline" size="lg" className="gap-2">
                  <Network className="h-5 w-5" />
                  View Live Demo
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <Card className="p-6 hover:shadow-elevated transition-shadow">
    <div className="mb-4">{icon}</div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </Card>
);

export default Index;
