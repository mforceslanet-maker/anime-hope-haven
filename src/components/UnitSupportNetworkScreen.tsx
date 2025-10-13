import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ArrowLeft, Users, Phone, MessageCircle, Heart, Shield, Video, Mail, MapPin } from 'lucide-react';

interface UnitSupportNetworkScreenProps {
  onBack: () => void;
}

export const UnitSupportNetworkScreen = ({ onBack }: UnitSupportNetworkScreenProps) => {
  const supportResources = [
    {
      title: "Peer Support Groups",
      icon: Users,
      description: "Connect with fellow service members who understand your experiences",
      items: [
        "Weekly virtual meetups",
        "Deployment support circles",
        "Post-deployment reintegration groups",
        "Family support networks"
      ]
    },
    {
      title: "24/7 Crisis Hotline",
      icon: Phone,
      description: "Immediate support available anytime you need it",
      items: [
        "Veterans Crisis Line: 988 (Press 1)",
        "Military OneSource: 800-342-9647",
        "Crisis Text Line: Text HOME to 741741",
        "Confidential and free"
      ]
    },
    {
      title: "Military Family Resources",
      icon: Heart,
      description: "Support services for military families and dependents",
      items: [
        "Spouse employment assistance",
        "Child care support",
        "Financial counseling",
        "Relocation assistance"
      ]
    },
    {
      title: "Virtual Support Sessions",
      icon: Video,
      description: "Online group therapy and discussion forums",
      items: [
        "PTSD support groups",
        "Stress management workshops",
        "Couples counseling",
        "Parent support groups"
      ]
    },
    {
      title: "Community Outreach",
      icon: MessageCircle,
      description: "Local military community programs and events",
      items: [
        "Unit family days",
        "Wellness workshops",
        "Recreation programs",
        "Volunteer opportunities"
      ]
    },
    {
      title: "In-Person Resources",
      icon: MapPin,
      description: "Find support services near your base or location",
      items: [
        "Base counseling centers",
        "Military family life counselors",
        "Chaplain services",
        "Community mental health clinics"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onBack}
        className="fixed top-4 left-4 z-50 hover:bg-white/10 text-white"
      >
        <ArrowLeft className="w-6 h-6" />
      </Button>

      <div className="max-w-6xl mx-auto pt-16">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="w-10 h-10 text-military" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-comfortaa font-bold text-white">
              Unit Support Network
            </h1>
            <Shield className="w-10 h-10 text-military" />
          </div>
          
          <p className="text-slate-300 text-lg max-w-3xl mx-auto mb-6">
            You're not alone. Connect with peers, access family resources, and find support from those who understand military life.
          </p>

          <div className="inline-flex items-center gap-3 px-6 py-3 bg-military/20 backdrop-blur-sm rounded-full border border-military/30">
            <Heart className="w-5 h-5 text-military" />
            <span className="text-sm font-medium text-military">
              No one serves alone • Together we're stronger
            </span>
            <Heart className="w-5 h-5 text-military" />
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {supportResources.map((resource, index) => (
            <Card 
              key={resource.title}
              className="bg-slate-800/50 backdrop-blur-sm border-2 border-military/30 hover:border-military hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-300 hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-military/20 rounded-lg flex items-center justify-center border border-military/30 flex-shrink-0">
                    <resource.icon className="w-6 h-6 text-military" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-comfortaa font-semibold text-white mb-2">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-slate-400 mb-4">
                      {resource.description}
                    </p>
                  </div>
                </div>
                
                <ul className="space-y-2">
                  {resource.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                      <div className="w-1.5 h-1.5 bg-military rounded-full mt-1.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Section */}
        <Card className="bg-slate-800/30 backdrop-blur-sm border-2 border-military/20 animate-fade-in mb-8" style={{ animationDelay: '0.6s' }}>
          <CardContent className="p-6">
            <div className="text-center">
              <Shield className="w-10 h-10 text-military mx-auto mb-4" />
              <h3 className="text-xl font-comfortaa font-semibold text-white mb-3">
                Need Immediate Support?
              </h3>
              <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                If you're experiencing a mental health crisis, please reach out immediately. Help is available 24/7.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-military hover:bg-military/80 text-white gap-2">
                  <Phone className="w-4 h-4" />
                  Call Veterans Crisis Line (988)
                </Button>
                <Button variant="outline" className="border-military/50 text-military hover:bg-military/10 gap-2">
                  <Mail className="w-4 h-4" />
                  Email Support Team
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Notice */}
        <div className="text-center text-slate-400 text-sm animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <p className="max-w-2xl mx-auto">
            All support services are confidential and specifically designed for military personnel and their families. 
            Your privacy and wellbeing are our highest priorities.
          </p>
        </div>
      </div>
    </div>
  );
};