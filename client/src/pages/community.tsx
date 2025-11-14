import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Users, MessageCircle, Trophy, Share2, Calendar, CheckCircle2 } from 'lucide-react';

export default function Community() {
  const [interestForm, setInterestForm] = useState({ name: '', email: '', interest: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleInterestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send to your backend
    console.log('Interest form submitted:', interestForm);
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setInterestForm({ name: '', email: '', interest: '' });
    }, 3000);
  };

  const communityFeatures = [
    {
      icon: Users,
      title: 'Event Organizer Network',
      description: 'Connect with other event organizers who are committed to reducing carbon footprints',
      members: '2,400+'
    },
    {
      icon: MessageCircle,
      title: 'Discussion Forums',
      description: 'Share experiences, ask questions, and learn from the community',
      topics: '150+ topics'
    },
    {
      icon: Trophy,
      title: 'Leaderboard & Challenges',
      description: 'Compete with peers and celebrate sustainability milestones',
      active: '12 challenges'
    }
  ];

  const upcomingEvents = [
    {
      date: 'Nov 15',
      title: 'Sustainable Festival Summit 2024',
      type: 'Virtual Workshop',
      attendees: 450
    },
    {
      date: 'Nov 22',
      title: 'Carbon Offsetting Best Practices',
      type: 'Webinar',
      attendees: 280
    },
    {
      date: 'Dec 1',
      title: 'Green Venue Certification Workshop',
      type: 'In-Person',
      attendees: 120
    }
  ];

  const successStories = [
    {
      event: 'Lightning in a Bottle 2024',
      organizer: 'Do LaB',
      reduction: '45%',
      highlight: 'Switched to 100% renewable energy and eliminated single-use plastics'
    },
    {
      event: 'Outside Lands 2024',
      organizer: 'Another Planet Entertainment',
      reduction: '38%',
      highlight: 'Implemented comprehensive public transit program and compost station network'
    },
    {
      event: 'Coachella Valley Music Festival',
      organizer: 'Goldenvoice',
      reduction: '32%',
      highlight: 'Partnered with local farms for food sourcing and installed solar panels'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-forest-50 to-moss-50 dark:from-forest-950 dark:via-sage-950 dark:to-forest-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-forest-900 dark:text-forest-50 mb-4">
            Community
          </h1>
          <p className="text-lg text-sage-600 dark:text-sage-400 max-w-2xl mx-auto">
            Join a growing network of event organizers committed to creating sustainable, carbon-conscious experiences
          </p>
        </div>

        {/* Community Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {communityFeatures.map((feature, index) => (
            <Card key={index} className="bg-forest-50 dark:bg-forest-800/50 border-forest-200 dark:border-forest-700/50 backdrop-blur-sm p-6 hover:bg-forest-50 dark:bg-forest-800/70 transition-all">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-lg">
                  <feature.icon className="w-6 h-6 text-emerald-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-forest-900 dark:text-forest-50 mb-2">{feature.title}</h3>
                  <p className="text-sm text-sage-700 dark:text-sage-300 mb-3">{feature.description}</p>
                  <span className="text-xs text-emerald-400 font-medium">
                    {feature.members || feature.topics || feature.active}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upcoming Events */}
          <Card className="bg-forest-50 dark:bg-forest-800/50 border-forest-200 dark:border-forest-700/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-violet-500" />
              <h2 className="text-xl font-semibold text-forest-900 dark:text-forest-50">Upcoming Events</h2>
            </div>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex gap-4 p-4 bg-forest-100/80 dark:bg-forest-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                  <div className="text-center min-w-[60px]">
                    <div className="text-2xl font-bold text-emerald-400">{event.date.split(' ')[1]}</div>
                    <div className="text-xs text-sage-600 dark:text-sage-400">{event.date.split(' ')[0]}</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-forest-900 dark:text-forest-50 font-medium mb-1">{event.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-sage-600 dark:text-sage-400">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-violet-500 rounded-full"></span>
                        {event.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {event.attendees} registered
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Success Stories */}
          <Card className="bg-forest-50 dark:bg-forest-800/50 border-forest-200 dark:border-forest-700/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <Share2 className="w-5 h-5 text-emerald-500" />
              <h2 className="text-xl font-semibold text-forest-900 dark:text-forest-50">Success Stories</h2>
            </div>
            <div className="space-y-4">
              {successStories.map((story, index) => (
                <div key={index} className="p-4 bg-forest-100/80 dark:bg-forest-700/30 rounded-lg border-l-4 border-emerald-500">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-forest-900 dark:text-forest-50 font-semibold">{story.event}</h3>
                    <span className="text-emerald-400 font-bold text-lg">-{story.reduction}</span>
                  </div>
                  <p className="text-xs text-sage-600 dark:text-sage-400 mb-2">by {story.organizer}</p>
                  <p className="text-sm text-sage-700 dark:text-sage-300">{story.highlight}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Interest Form */}
        <Card className="bg-forest-50 dark:bg-forest-800/70 border-forest-200 dark:border-forest-700/50 backdrop-blur-sm p-8 mt-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-forest-900 dark:text-forest-50 mb-3">
              Interested in Joining Our Community?
            </h2>
            <p className="text-forest-700 dark:text-forest-200 max-w-2xl mx-auto">
              We're building a network of event organizers committed to sustainability. Share your interest and we'll keep you updated on launch details.
            </p>
          </div>

          {formSubmitted ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-forest-900 dark:text-forest-50 mb-2">Thanks for Your Interest!</h3>
              <p className="text-sage-700 dark:text-sage-300">We'll be in touch soon.</p>
            </div>
          ) : (
            <form onSubmit={handleInterestSubmit} className="max-w-2xl mx-auto space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-forest-700 dark:text-forest-200 mb-2">
                    Name
                  </label>
                  <Input
                    required
                    value={interestForm.name}
                    onChange={(e) => setInterestForm({ ...interestForm, name: e.target.value })}
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
                    value={interestForm.email}
                    onChange={(e) => setInterestForm({ ...interestForm, email: e.target.value })}
                    className="bg-sage-50 dark:bg-forest-900/50 border-forest-200 dark:border-forest-700 text-forest-900 dark:text-forest-50 placeholder:text-sage-500 dark:placeholder:text-sage-400"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-forest-700 dark:text-forest-200 mb-2">
                  What are you most interested in?
                </label>
                <Textarea
                  required
                  value={interestForm.interest}
                  onChange={(e) => setInterestForm({ ...interestForm, interest: e.target.value })}
                  className="bg-sage-50 dark:bg-forest-900/50 border-forest-200 dark:border-forest-700 text-forest-900 dark:text-forest-50 placeholder:text-sage-500 dark:placeholder:text-sage-400 min-h-[100px]"
                  placeholder="e.g., Networking with other organizers, accessing sustainability resources, etc."
                />
              </div>
              <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-forest-900 dark:text-forest-50 py-6 text-lg">
                Express Interest
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
