import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MessageCircle, Trophy, Share2, BookOpen, Calendar } from 'lucide-react';

export default function Community() {
  const communityFeatures = [
    {
      icon: Users,
      title: 'Event Organizer Network',
      description: 'Connect with other event organizers who are committed to reducing carbon footprints',
      members: '2,400+',
      action: 'Join Network'
    },
    {
      icon: MessageCircle,
      title: 'Discussion Forums',
      description: 'Share experiences, ask questions, and learn from the community',
      topics: '150+ topics',
      action: 'Browse Forums'
    },
    {
      icon: Trophy,
      title: 'Leaderboard & Challenges',
      description: 'Compete with peers and celebrate sustainability milestones',
      active: '12 challenges',
      action: 'View Challenges'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Community
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Join a growing network of event organizers committed to creating sustainable, carbon-conscious experiences
          </p>
        </div>

        {/* Community Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {communityFeatures.map((feature, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm p-6 hover:bg-slate-800/70 transition-all">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-lg">
                  <feature.icon className="w-6 h-6 text-emerald-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-400 mb-3">{feature.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-emerald-400 font-medium">
                      {feature.members || feature.topics || feature.active}
                    </span>
                    <Button size="sm" variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
                      {feature.action}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upcoming Events */}
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-violet-500" />
              <h2 className="text-xl font-semibold text-white">Upcoming Events</h2>
            </div>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex gap-4 p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                  <div className="text-center min-w-[60px]">
                    <div className="text-2xl font-bold text-emerald-400">{event.date.split(' ')[1]}</div>
                    <div className="text-xs text-slate-400">{event.date.split(' ')[0]}</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium mb-1">{event.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
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
            <Button className="w-full mt-4 bg-violet-500 hover:bg-violet-600 text-white">
              View All Events
            </Button>
          </Card>

          {/* Success Stories */}
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <Share2 className="w-5 h-5 text-emerald-500" />
              <h2 className="text-xl font-semibold text-white">Success Stories</h2>
            </div>
            <div className="space-y-4">
              {successStories.map((story, index) => (
                <div key={index} className="p-4 bg-slate-700/30 rounded-lg border-l-4 border-emerald-500">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-semibold">{story.event}</h3>
                    <span className="text-emerald-400 font-bold text-lg">-{story.reduction}</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-2">by {story.organizer}</p>
                  <p className="text-sm text-slate-300">{story.highlight}</p>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-white">
              Share Your Story
            </Button>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-emerald-500/10 to-violet-500/10 border-emerald-500/30 backdrop-blur-sm p-8 mt-12 text-center">
          <BookOpen className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-3">
            Ready to Make an Impact?
          </h2>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Join thousands of event organizers who are leading the charge toward sustainable events. Share your journey, learn from others, and make a difference.
          </p>
          <div className="flex gap-4 justify-center">
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
              Join Community
            </Button>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
              Learn More
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
