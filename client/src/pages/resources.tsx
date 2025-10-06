import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  ExternalLink,
  BookOpen,
  Send,
  CheckCircle2
} from 'lucide-react';

export default function Resources() {
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send to your backend
    console.log('Contact form submitted:', contactForm);
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setContactForm({ name: '', email: '', message: '' });
    }, 3000);
  };

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
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Essential links and information to help you measure and reduce your event's carbon footprint
          </p>
        </div>

        {/* External Resources */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm p-6 mb-12">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="w-6 h-6 text-emerald-500" />
            <h2 className="text-2xl font-bold text-white">External Resources</h2>
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

        {/* Contact Form */}
        <Card className="bg-slate-800/70 border-slate-700/50 backdrop-blur-sm p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-3">
              Need Help or Have Questions?
            </h2>
            <p className="text-slate-200 max-w-2xl mx-auto">
              Our team is here to help. Send us a message and we'll get back to you as soon as possible.
            </p>
          </div>

          {formSubmitted ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
              <p className="text-slate-300">We'll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="max-w-2xl mx-auto space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Name
                  </label>
                  <Input
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Message
                </label>
                <Textarea
                  required
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 min-h-[150px]"
                  placeholder="Tell us how we can help..."
                />
              </div>
              <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-6 text-lg">
                <Send className="w-5 h-5 mr-2" />
                Send Message
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
