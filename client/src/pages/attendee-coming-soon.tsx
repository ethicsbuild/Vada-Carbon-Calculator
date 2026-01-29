import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Users, ArrowLeft, Mail, Bell } from 'lucide-react';

export default function AttendeeComingSoon() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-forest-50 to-sage-50 dark:from-forest-950 dark:via-sage-950 dark:to-forest-950 flex items-center justify-center px-4">
      <div className="max-w-3xl w-full">
        <Card className="bg-white dark:bg-forest-800 border-2 border-forest-200 dark:border-forest-700 p-12">
          <div className="text-center">
            {/* Icon */}
            <div className="w-24 h-24 bg-sage-100 dark:bg-sage-700 rounded-full flex items-center justify-center mx-auto mb-8">
              <Users className="w-12 h-12 text-sage-600 dark:text-sage-300" />
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-bold text-forest-900 dark:text-forest-50 mb-4">
              Attendee Experience Coming Soon
            </h1>

            {/* Description */}
            <p className="text-xl text-forest-700 dark:text-forest-300 mb-8">
              We're building an exciting experience for event attendees to track their personal carbon footprint, 
              earn achievements, and discover sustainable event practices.
            </p>

            {/* What's Coming */}
            <div className="bg-sage-50 dark:bg-sage-900/30 rounded-lg p-6 mb-8 text-left">
              <h2 className="text-lg font-semibold text-forest-900 dark:text-forest-50 mb-4">
                What's Coming for Attendees:
              </h2>
              <ul className="space-y-3 text-forest-700 dark:text-forest-300">
                <li className="flex items-start gap-3">
                  <span className="text-sage-600 dark:text-sage-400 mt-1">✓</span>
                  <span>Personal carbon footprint tracking for your event attendance</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sage-600 dark:text-sage-400 mt-1">✓</span>
                  <span>Achievements and badges for sustainable choices</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sage-600 dark:text-sage-400 mt-1">✓</span>
                  <span>Community leaderboards and challenges</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sage-600 dark:text-sage-400 mt-1">✓</span>
                  <span>Tips and recommendations for greener event attendance</span>
                </li>
              </ul>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <ArrowLeft className="mr-2 w-5 h-5" />
                  Back to Home
                </Button>
              </Link>
              
              <Link href="/calculator">
                <Button size="lg" className="w-full sm:w-auto bg-forest-600 hover:bg-forest-700">
                  I'm an Event Producer
                </Button>
              </Link>
            </div>

            {/* Notify Me Section */}
            <div className="border-t border-forest-200 dark:border-forest-700 pt-8">
              <div className="flex items-center justify-center gap-2 text-forest-600 dark:text-forest-400 mb-2">
                <Bell className="w-5 h-5" />
                <span className="font-medium">Want to be notified when we launch?</span>
              </div>
              <p className="text-sm text-forest-500 dark:text-forest-500">
                Contact us at{' '}
                <a 
                  href="mailto:hello@veda.earth" 
                  className="text-sage-600 dark:text-sage-400 hover:underline font-medium"
                >
                  hello@veda.earth
                </a>
                {' '}to join our waitlist
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}