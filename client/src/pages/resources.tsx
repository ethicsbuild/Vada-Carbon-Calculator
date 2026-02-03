import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  ExternalLink,
  BookOpen,
  Send,
  CheckCircle2,
  FileText,
  Video,
  Lightbulb,
  Calculator,
  Leaf,
  Users,
  Zap,
  Shield
} from 'lucide-react';

export default function Resources() {
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactForm),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        setContactForm({ name: '', email: '', message: '' });
      }, 3000);
    } catch (err) {
      console.error('Contact form error:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const recommendedGuides = [
    {
      icon: BookOpen,
      title: 'GHG Protocol Event Sector Guidance',
      description: 'Comprehensive methodology for measuring event emissions across Scope 1, 2, and 3 categories',
      type: 'Industry Standard',
      url: 'https://ghgprotocol.org/corporate-standard'
    },
    {
      icon: FileText,
      title: 'ISO 20121 Event Sustainability',
      description: 'International standard for sustainable event management systems and best practices',
      type: 'Certification Guide',
      url: 'https://www.iso.org/iso-20121-sustainable-events.html'
    },
    {
      icon: Lightbulb,
      title: 'Carbon Reduction Strategies for Events',
      description: '50+ proven tactics from leading festivals and conferences worldwide',
      type: 'Best Practices',
      url: 'https://www.unep.org/resources/publication/greening-events-carbon-management-guide-festivals-and-major-events'
    },
    {
      icon: Calculator,
      title: 'Event Emissions Factor Database',
      description: 'Reference database of emission factors for venues, transport, catering, and production',
      type: 'Reference Material',
      url: 'https://www.epa.gov/climateleadership/ghg-emission-factors-hub'
    }
  ];

  const educationalContent = [
    {
      title: 'Understanding Event Carbon Footprints',
      duration: 'Guide',
      description: 'Learn the basics of measuring and managing event emissions',
      category: 'Getting Started',
      url: 'https://ghgprotocol.org/sites/default/files/standards/Corporate-Value-Chain-Accounting-Reporing-Standard_041613_2.pdf'
    },
    {
      title: 'Case Study: Carbon-Neutral Music Festivals',
      duration: 'Article',
      description: 'How major festivals achieved net-zero emissions',
      category: 'Case Studies',
      url: 'https://www.greenthemusic.org/resources'
    },
    {
      title: 'Vendor Sustainability Evaluation',
      duration: 'Checklist',
      description: 'Assess and select eco-conscious event suppliers',
      category: 'Tools',
      url: 'https://www.greenbiz.com/article/how-evaluate-your-suppliers-sustainability-performance'
    }
  ];

  const keyTopics = [
    {
      icon: Leaf,
      title: 'Carbon Offsetting',
      description: 'Understanding offset markets, credits, and verification standards for events',
      url: 'https://www.goldstandard.org/'
    },
    {
      icon: Users,
      title: 'Stakeholder Engagement',
      description: 'Communicating sustainability goals to attendees, vendors, and sponsors',
      url: 'https://www.iso.org/standard/54552.html'
    },
    {
      icon: Zap,
      title: 'Energy Solutions',
      description: 'Renewable energy options, power management, and efficiency strategies',
      url: 'https://www.epa.gov/greenpower'
    },
    {
      icon: Shield,
      title: 'Compliance & Reporting',
      description: 'Meeting environmental regulations and industry certification requirements',
      url: 'https://ghgprotocol.org/standards'
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
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-forest-50 to-moss-50 dark:from-forest-950 dark:via-sage-950 dark:to-forest-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-forest-900 dark:text-forest-50 mb-4">
            Resources
          </h1>
          <p className="text-lg text-sage-700 dark:text-sage-300 max-w-2xl mx-auto">
            Essential links and information to help you measure and reduce your event's carbon footprint
          </p>
        </div>

        {/* Recommended Guides & Standards */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-forest-900 dark:text-forest-50 mb-6">Industry Guides & Standards</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {recommendedGuides.map((guide, index) => (
              <a
                key={index}
                href={guide.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <Card className="bg-forest-50 dark:bg-forest-800/50 border-forest-200 dark:border-forest-700/50 backdrop-blur-sm p-6 hover:bg-forest-100 dark:hover:bg-forest-800/70 hover:border-emerald-500/50 transition-all">
                  <div className="flex gap-4">
                    <div className="p-3 bg-emerald-500/10 rounded-lg h-fit group-hover:bg-emerald-500/20 transition-colors">
                      <guide.icon className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h3 className="text-lg font-semibold text-forest-900 dark:text-forest-50 mb-2 group-hover:text-emerald-400 transition-colors">
                          {guide.title}
                        </h3>
                        <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                      </div>
                      <p className="text-sm text-sage-700 dark:text-sage-300 mb-3">{guide.description}</p>
                      <span className="inline-block text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
                        {guide.type}
                      </span>
                    </div>
                  </div>
                </Card>
              </a>
            ))}
          </div>
        </div>

        {/* Educational Content */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-forest-900 dark:text-forest-50 mb-6">Educational Resources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {educationalContent.map((content, index) => (
              <a
                key={index}
                href={content.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <Card className="bg-forest-50 dark:bg-forest-800/50 border-forest-200 dark:border-forest-700/50 backdrop-blur-sm p-6 hover:bg-forest-100 dark:hover:bg-forest-800/70 hover:border-violet-500/50 transition-all h-full">
                  <div className="mb-3">
                    <span className="inline-block text-xs text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full mb-3">
                      {content.category}
                    </span>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-forest-900 dark:text-forest-50 font-semibold group-hover:text-violet-400 transition-colors flex-1">
                        {content.title}
                      </h3>
                      <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-violet-400 transition-colors ml-2" />
                    </div>
                    <p className="text-sm text-sage-700 dark:text-sage-300 mb-3">{content.description}</p>
                    <p className="text-xs text-sage-600 dark:text-sage-400">{content.duration}</p>
                  </div>
                </Card>
              </a>
            ))}
          </div>
        </div>

        {/* Key Topics */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-forest-900 dark:text-forest-50 mb-6">Key Sustainability Topics</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyTopics.map((topic, index) => (
              <a
                key={index}
                href={topic.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <Card className="bg-forest-50 dark:bg-forest-800/50 border-forest-200 dark:border-forest-700/50 backdrop-blur-sm p-6 text-center hover:bg-forest-100 dark:hover:bg-forest-800/70 hover:border-violet-500/50 transition-all h-full">
                  <div className="inline-flex p-4 bg-violet-500/10 rounded-full mb-4 group-hover:bg-violet-500/20 transition-colors">
                    <topic.icon className="w-8 h-8 text-violet-500" />
                  </div>
                  <h3 className="text-forest-900 dark:text-forest-50 font-semibold mb-2 group-hover:text-violet-400 transition-colors">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-sage-700 dark:text-sage-300 mb-3">{topic.description}</p>
                  <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-violet-400 transition-colors mx-auto" />
                </Card>
              </a>
            ))}
          </div>
        </div>

        {/* External Resources */}
        <Card className="bg-forest-50 dark:bg-forest-800/50 border-forest-200 dark:border-forest-700/50 backdrop-blur-sm p-6 mb-12">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="w-6 h-6 text-emerald-500" />
            <h2 className="text-2xl font-bold text-forest-900 dark:text-forest-50">External Resources</h2>
          </div>
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
                  <h3 className="text-forest-900 dark:text-forest-50 font-medium mb-1 group-hover:text-emerald-400 transition-colors">
                    {resource.name}
                  </h3>
                  <p className="text-sm text-sage-600 dark:text-sage-400">{resource.description}</p>
                  <p className="text-xs text-slate-500 mt-1">{resource.url}</p>
                </div>
                <ExternalLink className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition-colors ml-4" />
              </a>
            ))}
          </div>
        </Card>

        {/* Contact Form */}
        <Card className="bg-forest-50 dark:bg-forest-800/70 border-forest-200 dark:border-forest-700/50 backdrop-blur-sm p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-forest-900 dark:text-forest-50 mb-3">
              Need Help or Have Questions?
            </h2>
            <p className="text-forest-700 dark:text-forest-200 max-w-2xl mx-auto">
              Our team is here to help. Send us a message and we'll get back to you as soon as possible.
            </p>
          </div>

          {formSubmitted ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-forest-900 dark:text-forest-50 mb-2">Message Sent!</h3>
              <p className="text-sage-700 dark:text-sage-300">We'll get back to you soon.</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6">
                  <p className="text-red-400 text-center">{error}</p>
                </div>
              )}
              <form onSubmit={handleContactSubmit} className="max-w-2xl mx-auto space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-forest-700 dark:text-forest-200 mb-2">
                    Name
                  </label>
                  <Input
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="bg-sage-50 dark:bg-forest-900/50 border-forest-200 dark:border-forest-700 text-forest-900 dark:text-forest-50 placeholder:text-sage-500 dark:placeholder:text-sage-400"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-forest-700 dark:text-forest-200 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="bg-sage-50 dark:bg-forest-900/50 border-forest-200 dark:border-forest-700 text-forest-900 dark:text-forest-50 placeholder:text-sage-500 dark:placeholder:text-sage-400"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-forest-700 dark:text-forest-200 mb-2">
                  Message
                </label>
                <Textarea
                  required
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="bg-sage-50 dark:bg-forest-900/50 border-forest-200 dark:border-forest-700 text-forest-900 dark:text-forest-50 placeholder:text-sage-500 dark:placeholder:text-sage-400 min-h-[150px]"
                  placeholder="Tell us how we can help..."
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-forest-900 dark:text-forest-50 py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5 mr-2" />
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
