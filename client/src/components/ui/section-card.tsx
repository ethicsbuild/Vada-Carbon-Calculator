/**
 * SectionCard - Shared component for all calculator sections
 * Uses design tokens only, no hardcoded colors
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  title: string;
  description?: string;
  variant?: "default" | "detailed";
  children: React.ReactNode;
  className?: string;
}

export function SectionCard({ 
  title, 
  description, 
  variant = "default",
  children,
  className 
}: SectionCardProps) {
  return (
    <Card className={cn(
      "bg-white shadow-sm",
      variant === "default" && "border-primary-border",
      variant === "detailed" && "border-warning-border",
      className
    )}>
      <CardHeader className={cn(
        variant === "default" && "bg-primary-light/50",
        variant === "detailed" && "bg-warning-light/50"
      )}>
        <CardTitle className="text-lg text-slate-800">{title}</CardTitle>
        {description && (
          <CardDescription className="text-slate-600">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {children}
      </CardContent>
    </Card>
  );
}