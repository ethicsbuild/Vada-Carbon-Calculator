/**
 * Callout - Shared component for informational messages
 * Variants: info (blue), warning (amber), neutral (slate)
 * Uses design tokens only
 */

import { Card, CardContent } from "@/components/ui/card";
import { Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalloutProps {
  variant?: "info" | "warning" | "neutral";
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Callout({ 
  variant = "info", 
  title,
  children,
  className 
}: CalloutProps) {
  const Icon = variant === "warning" ? AlertTriangle : Info;
  
  return (
    <Card className={cn(
      "shadow-sm",
      variant === "info" && "border-info-border bg-info-light/30",
      variant === "warning" && "border-warning-border bg-warning-light/50",
      variant === "neutral" && "border-slate-200 bg-slate-50",
      className
    )}>
      <CardContent className="pt-6">
        <div className="flex items-start space-x-3">
          <Icon className={cn(
            "h-5 w-5 mt-0.5 flex-shrink-0",
            variant === "info" && "text-info",
            variant === "warning" && "text-warning",
            variant === "neutral" && "text-slate-600"
          )} />
          <div className="space-y-2 flex-1">
            {title && (
              <p className="text-sm font-medium text-slate-800">
                {title}
              </p>
            )}
            <div className="text-sm text-slate-700">
              {children}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}