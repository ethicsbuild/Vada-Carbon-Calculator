import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  FileText,
  Video,
  Download,
  ExternalLink,
  Lightbulb,
  Calculator,
  Shield,
  Leaf,
  Users,
  Zap
} from 'lucide-react';

export default function Resources() {
  const guides = [
    {
      icon: BookOpen,
      title: 'Carbon Footprint Calculation Guide',
      description: 'Complete methodology for measuring event emissions across Scope 1, 2, and 3',
      type: 'PDF Guide',
      size: '2.4 MB'
    },
    {
      icon: FileText,
      title: 'GHG Protocol 2025 Compliance',
      description: 'Updated requirements and how to ensure your events meet the new standards',
      type: 'White Paper',
      size: '1.8 MB'
    },
    {
      icon: Lightbulb,
      title: 'Best Practices for Sustainable Events',
      description: '50+ actionable tips from leading event organizers and sustainability experts',
      type: 'eBook',
      size: '3.1 MB'
    },
    {
      icon: Calculator,
      title: 'Emissions Factor Database',
      description: 'Comprehensive database of emission factors for various activities and materials',
      type: 'Spreadsheet',
      size: '850 KB'
    }
  ];

  const videos = [
    {
      title: 'Getting Started with VADA',
      duration: '5:32',
      views: '12.4K',
      thumbnail: '🎬'
    },
    {
      title: 'Advanced Carbon Calculation Techniques',
      duration: '18:45',
      views: '8.2K',
      thumbnail: '📊'
    },
    {
      title: 'Case Study: Lightning in a Bottle',
      duration: '12:15',
      views: '15.7K',
      thumbnail: '⚡'
    }
  ];

  const tools = [
    {
      icon: Leaf,
      title: 'Carbon Offset Calculator',
      description: 'Calculate required offsets and find verified carbon credit providers'
    },
    {
      icon: Users,
      title: 'Vendor Sustainability Scorecard',
      description: 'Evaluate and compare vendors based on their environmental practices'
    },
    {
      icon: Zap,
      title: 'Energy Audit Template',
      description: 'Pre-built template for conducting comprehensive energy audits'
    },
    {
      icon: Shield,
      title: 'Compliance Checklist',
      description: 'Ensure your event meets all environmental regulations and certifications'
    }
  ];

  const externalResources = [
    {
      name: 'GHG Protocol',
      url: 'ghgprotocol.org',
      description: 'Official greenhouse gas accounting standards'
    },
    {
      name: 'UN Climate Action',
      url: 'un.org/climatechange',
      description: 'Global climate initiatives and frameworks'
    },
    {
      name: 'A Greener Festival',
      url: 'agreenerfestival.com',
      description: 'Non-profit helping festivals reduce environmental impact'
    },
    {
      name: 'EPA Green Power Partnership',
      url: 'epa.gov/greenpower',
      description: 'Resources for renewable energy procurement'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Resources
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Everything you need to measure, reduce, and offset your event's carbon footprint
          </p>
        </div>

        {/* Downloadable Guides */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Downloadable Guides</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {guides.map((guide, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm p-6 hover:bg-slate-800/70 transition-all">
                <div className="flex gap-4">
                  <div className="p-3 bg-emerald-500/10 rounded-lg h-fit">
                    <guide.icon className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{guide.title}</h3>
                    <p className="text-sm text-slate-400 mb-3">{guide.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>{guide.type}</span>
                        <span>•</span>
                        <span>{guide.size}</span>
                      </div>
                      <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                        <Download className="w-3 h-3 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Video Tutorials */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Video Tutorials</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {videos.map((video, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm overflow-hidden hover:bg-slate-800/70 transition-all group cursor-pointer">
                <div className="aspect-video bg-gradient-to-br from-emerald-500/20 to-violet-500/20 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform">
                  {video.thumbnail}
                </div>
                <div className="p-4">
                  <h3 className="text-white font-medium mb-2">{video.title}</h3>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Video className="w-3 h-3" />
                      {video.duration}
                    </span>
                    <span>{video.views} views</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Tools & Templates */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Tools & Templates</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm p-6 hover:bg-slate-800/70 transition-all text-center group cursor-pointer">
                <div className="inline-flex p-4 bg-violet-500/10 rounded-full mb-4 group-hover:bg-violet-500/20 transition-colors">
                  <tool.icon className="w-8 h-8 text-violet-500" />
                </div>
                <h3 className="text-white font-semibold mb-2">{tool.title}</h3>
                <p className="text-sm text-slate-400 mb-4">{tool.description}</p>
                <Button size="sm" variant="outline" className="border-violet-500/30 text-violet-400 hover:bg-violet-500/10 w-full">
                  Access Tool
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* External Resources */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm p-6">
          <h2 className="text-2xl font-bold text-white mb-6">External Resources</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {externalResources.map((resource, index) => (
              <a
                key={index}
                href={`https://${resource.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors group"
              >
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-1 group-hover:text-emerald-400 transition-colors">
                    {resource.name}
                  </h3>
                  <p className="text-sm text-slate-400">{resource.description}</p>
                  <p className="text-xs text-slate-500 mt-1">{resource.url}</p>
                </div>
                <ExternalLink className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition-colors ml-4" />
              </a>
            ))}
          </div>
        </Card>

        {/* Need Help Section */}
        <Card className="bg-gradient-to-r from-violet-500/10 to-emerald-500/10 border-violet-500/30 backdrop-blur-sm p-8 mt-12 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Our team is here to help. Reach out with questions about methodology, tools, or best practices.
          </p>
          <div className="flex gap-4 justify-center">
            <Button className="bg-violet-500 hover:bg-violet-600 text-white">
              Contact Support
            </Button>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
              Request Resource
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
