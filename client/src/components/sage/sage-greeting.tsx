import { Card } from '@/components/ui/card';

export function SageGreeting() {
  return (
    <Card className="relative overflow-hidden bg-slate-800/50 border-emerald-500/20 backdrop-blur-sm p-8 mb-8">
      {/* Animated background glow */}
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-30">
        <div className="absolute inset-0 bg-gradient-radial from-emerald-500/20 via-emerald-500/5 to-transparent animate-pulse" />
      </div>

      <div className="relative">
        {/* Sage Avatar */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-violet-500 mb-4 text-2xl">
          🌱
        </div>

        {/* Greeting Message */}
        <h1 className="text-3xl md:text-4xl font-light text-white mb-3 leading-relaxed">
          Hey friend, planning something special?
        </h1>

        <p className="text-slate-400 text-lg">
          I'm Sage. Let's figure out your event's carbon footprint together with clarity and actionable steps.
        </p>
      </div>
    </Card>
  );
}
