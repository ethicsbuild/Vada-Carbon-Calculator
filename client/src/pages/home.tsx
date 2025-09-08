import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Leaf, 
  Brain, 
  Shield, 
  TrendingDown, 
  Play, 
  CheckCircle,
  Award,
  BarChart3,
  Users,
  Lightbulb,
  ArrowRight
} from 'lucide-react';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: Brain,
      title: "AI Co-Pilot",
      description: "Conversational interface that guides you through complex calculations with intelligent memory and context awareness.",
      gradient: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
      iconBg: "bg-blue-600",
      benefits: ["Smart data estimation", "Context-aware recommendations", "Repeat user memory"]
    },
    {
      icon: Shield,
      title: "GHG Protocol Compliant",
      description: "Full compliance with 2025 GHG Protocol standards including mandatory Scope 3 reporting requirements.",
      gradient: "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
      iconBg: "bg-green-600",
      benefits: ["Scope 1, 2, 3 calculations", "2025 standard updates", "Automated compliance checking"]
    },
    {
      icon: Award,
      title: "Hedera Guardian Integration",
      description: "Blockchain-ready architecture with Hedera Guardian for traceable carbon receipts and NFT generation.",
      gradient: "from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20",
      iconBg: "bg-orange-600",
      benefits: ["Immutable audit trails", "Carbon receipt NFTs", "Verra partnership integration"]
    }
  ];

  const stats = [
    { value: "97%", label: "S&P 500 Use GHG Protocol" },
    { value: "$250B", label: "Carbon Market by 2050" },
    { value: "2,700+", label: "Companies with SBT" }
  ];

  return (
    <div className="bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-blue-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`space-y-8 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
              <Badge variant="outline" className="inline-flex items-center px-4 py-2 bg-green-600/10 border-green-600/20">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-green-600 text-sm font-medium">GHG Protocol Compliant</span>
              </Badge>
              
              <h1 className="text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                AI-Powered Carbon Calculator with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-700">
                  Intelligent Co-Pilot
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Transform your carbon footprint measurement with our conversational AI that guides you through Scope 1, 2, and 3 emissions calculations. Built for accuracy, designed for simplicity.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/calculator">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                    <Brain className="w-5 h-5 mr-2" />
                    Start with AI Co-Pilot
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </div>
              
              <div className="flex items-center justify-between pt-4 max-w-md">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-green-600">{stat.value}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <Card className="relative rounded-2xl overflow-hidden shadow-2xl">
                <div className="relative h-96">
                  <img 
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                    alt="Diverse team collaborating on sustainability projects" 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-green-600/20 to-transparent"></div>
                </div>
                <Card className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 p-6 shadow-xl">
                  <CardContent className="p-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                        <TrendingDown className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">CO2 Reduced</div>
                        <div className="text-2xl font-bold text-green-600">-42%</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Intelligent Carbon Calculation Platform
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Leverage AI-powered estimation, blockchain verification, and gamification to transform your carbon footprint journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className={`p-8 bg-gradient-to-br ${feature.gradient} border-0`}>
                  <CardContent className="p-0">
                    <div className={`w-12 h-12 ${feature.iconBg} rounded-xl flex items-center justify-center mb-6`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Transform Your Carbon Management?
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Join thousands of organizations already using CarbonCoPilot to achieve their sustainability goals with AI-powered precision and blockchain verification.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/calculator">
                <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                  <Brain className="w-5 h-5 mr-2" />
                  Start Free Calculation
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Explore Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Why Choose CarbonCoPilot?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mt-1">
                    <Brain className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">AI-Guided Experience</h3>
                    <p className="text-gray-600 dark:text-gray-300">Our intelligent co-pilot remembers your preferences, estimates missing data, and guides you through complex calculations step-by-step.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mt-1">
                    <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Future-Proof Compliance</h3>
                    <p className="text-gray-600 dark:text-gray-300">Stay ahead with 2025 GHG Protocol updates, including mandatory Scope 3 reporting and enhanced verification requirements.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mt-1">
                    <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Blockchain Verification</h3>
                    <p className="text-gray-600 dark:text-gray-300">Generate tamper-proof carbon receipts and NFTs through Hedera Guardian integration with Verra partnership.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mt-1">
                    <Lightbulb className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Gamified Journey</h3>
                    <p className="text-gray-600 dark:text-gray-300">Unlock achievements, track progress, and celebrate milestones as you advance your sustainability goals.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Environmental dashboard interface showing carbon metrics" 
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-600/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
