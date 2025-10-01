import { cn } from '@/lib/utils';

interface QuestionFlowProps {
  currentQuestion: number;
  selectedTransport: string;
  onTransportChange: (transport: string) => void;
}

interface TransportOption {
  id: string;
  icon: string;
  label: string;
  detail: string;
}

const transportOptions: TransportOption[] = [
  {
    id: 'driving',
    icon: '🚗',
    label: 'Mostly Driving',
    detail: '60-80% by car'
  },
  {
    id: 'transit',
    icon: '🚌',
    label: 'Public Transit',
    detail: 'Buses & trains'
  },
  {
    id: 'flying',
    icon: '✈️',
    label: 'Flying In',
    detail: 'Destination event'
  },
  {
    id: 'walking',
    icon: '🚶',
    label: 'Local/Walking',
    detail: 'Neighborhood event'
  }
];

export function QuestionFlow({
  currentQuestion,
  selectedTransport,
  onTransportChange
}: QuestionFlowProps) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl md:text-3xl font-light text-white mb-6">
        How are most people getting to your event?
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {transportOptions.map((option) => (
          <div
            key={option.id}
            onClick={() => onTransportChange(option.id)}
            className={cn(
              "p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 text-center",
              selectedTransport === option.id
                ? "bg-emerald-500/10 border-emerald-500"
                : "bg-white/5 border-slate-700 hover:bg-white/10 hover:border-emerald-500/50"
            )}
          >
            <div className="text-4xl mb-3">{option.icon}</div>
            <div className="text-white font-medium mb-1">{option.label}</div>
            <div className="text-slate-400 text-sm">{option.detail}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
