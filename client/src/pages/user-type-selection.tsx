import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Briefcase, Users, ArrowRight } from 'lucide-react';

export default function UserTypeSelection() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-forest-50 to-sage-50 dark:from-forest-950 dark:via-sage-950 dark:to-forest-950 flex items-center justify-center px-4">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-forest-900 dark:text-forest-50">
            Welcome to VEDA CarbonCoPilot
          </h1>
          <p className="text-xl text-forest-700 dark:text-forest-300 max-w-2xl mx-auto">
            Professional carbon footprint calculator for events
          </p>
        </div>

        {/* User Type Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Event Producer Card */}
          <Link href="/calculator">
            <Card className="group cursor-pointer hover:shadow-2xl transition-all duration-300 bg-white dark:bg-forest-800 border-2 border-forest-200 dark:border-forest-700 hover:border-forest-400 dark:hover:border-forest-500 p-8 h-full">
              <div className="flex flex-col items-center text-center h-full">
                <div className="w-20 h-20 bg-forest-100 dark:bg-forest-700 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-10 h-10 text-forest-600 dark:text-forest-300" />
                </div>
                
                <h2 className="text-2xl font-bold text-forest-900 dark:text-forest-50 mb-4">
                  I am an Event Producer
                </h2>
                
                <p className="text-forest-600 dark:text-forest-400 mb-6 flex-grow">
                  Calculate your event's carbon footprint, get actionable recommendations, and generate professional reports for sponsors, venues, and stakeholders.
                </p>
                
                <Button 
                  size="lg" 
                  className="w-full bg-forest-600 hover:bg-forest-700 text-white group-hover:bg-forest-700"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          </Link>

          {/* Attendee Card */}
          <Link href="/attendee-coming-soon">
            <Card className="group cursor-pointer hover:shadow-2xl transition-all duration-300 bg-white dark:bg-forest-800 border-2 border-forest-200 dark:border-forest-700 hover:border-forest-400 dark:hover:border-forest-500 p-8 h-full">
              <div className="flex flex-col items-center text-center h-full">
                <div className="w-20 h-20 bg-sage-100 dark:bg-sage-700 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Users className="w-10 h-10 text-sage-600 dark:text-sage-300" />
                </div>
                
                <h2 className="text-2xl font-bold text-forest-900 dark:text-forest-50 mb-4">
                  I am an Attendee
                </h2>
                
                <p className="text-forest-600 dark:text-forest-400 mb-6 flex-grow">
                  Track your personal event carbon footprint, earn achievements, and discover ways to make your event attendance more sustainable.
                </p>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full border-sage-300 dark:border-sage-600 text-sage-700 dark:text-sage-300 hover:bg-sage-50 dark:hover:bg-sage-900"
                >
                  Coming Soon
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          </Link>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12">
          <p className="text-sm text-forest-600 dark:text-forest-400">
            Not sure which option to choose? Event producers are responsible for organizing and managing events.
            <br />
            Attendees are individuals participating in events.
          </p>
        </div>
      </div>
    </div>
  );
}