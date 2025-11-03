import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Shield, HeartPulse, GraduationCap, Users, Briefcase, Sparkles, ArrowLeft } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
}

const iconMap: Record<string, any> = {
  'shield': Shield,
  'heart-pulse': HeartPulse,
  'graduation-cap': GraduationCap,
  'users': Users,
  'briefcase': Briefcase,
};

const colorMap: Record<string, string> = {
  'blue': 'from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 border-blue-500/30',
  'red': 'from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 border-red-500/30',
  'green': 'from-green-500/20 to-green-600/20 hover:from-green-500/30 hover:to-green-600/30 border-green-500/30',
  'purple': 'from-purple-500/20 to-purple-600/20 hover:from-purple-500/30 hover:to-purple-600/30 border-purple-500/30',
  'orange': 'from-orange-500/20 to-orange-600/20 hover:from-orange-500/30 hover:to-orange-600/30 border-orange-500/30',
};

export default function RelaxationHub() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfession, setUserProfession] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user profession from localStorage
    const profession = localStorage.getItem('userProfession');
    setUserProfession(profession);
    loadCategories(profession);
  }, []);

  const loadCategories = async (profession: string | null) => {
    try {
      const { data, error } = await supabase
        .from('relaxation_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      
      // Filter categories based on user profession
      let filteredCategories = data || [];
      
      if (profession) {
        const categoryMap: Record<string, string[]> = {
          'Teacher': ['teachers'],
          'Military Personnel': ['military-personnel'],
          'Subordinate Staff': ['staff-workers'],
          'Healthcare Worker': ['healthcare-workers'],
          'Military Student': ['community-members'], // Students see community
        };
        
        const allowedSlugs = categoryMap[profession];
        if (allowedSlugs) {
          filteredCategories = filteredCategories.filter(cat => 
            allowedSlugs.includes(cat.slug)
          );
        }
      }
      
      setCategories(filteredCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (slug: string) => {
    navigate(`/relaxation/${slug}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="mr-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Shield className="w-8 h-8 text-primary animate-pulse" />
              <h1 className="text-3xl font-comfortaa font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Wellness Center
              </h1>
            </div>
            <Badge variant="outline" className="gap-2 animate-fade-in">
              <Sparkles className="w-3 h-3" />
              <span>Systems Online • Mental Wellness Active</span>
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-comfortaa font-bold mb-4">
            Choose Your Path to Peace
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select your category to access curated relaxation music designed specifically for your needs
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className="h-48 animate-pulse bg-muted/50" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const Icon = iconMap[category.icon] || Shield;
              const gradient = colorMap[category.color] || colorMap['blue'];
              
              return (
                <Card
                  key={category.id}
                  className={`group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 bg-gradient-to-br ${gradient} animate-fade-in`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => handleCategoryClick(category.slug)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-xl bg-card/80 backdrop-blur-sm shadow-lg group-hover:scale-110 transition-transform">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                    <CardTitle className="text-xl font-comfortaa group-hover:text-primary transition-colors">
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {category.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Mission Brief */}
        <Card className="mt-12 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 animate-fade-in">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-3">
              <Shield className="w-12 h-12 text-primary" />
            </div>
            <CardTitle className="text-2xl font-comfortaa">
              Mission Brief: Mental Wellness Priority
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Your mental readiness is as vital as physical readiness. Taking care of your mental health is not a sign of 
              weakness—it's a demonstration of strength and tactical awareness. Stay mission-ready. Stay resilient. 🔥
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
