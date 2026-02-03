/**
 * QuestionBlock - Shared component for form questions
 * Consistent styling across all sections
 * Uses design tokens only
 */

import { Label } from "@/components/ui/label";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionBlockProps {
  label: string;
  description?: string;
  icon?: LucideIcon;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function QuestionBlock({ 
  label, 
  description, 
  icon: Icon,
  required = false,
  children,
  className 
}: QuestionBlockProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <Label className="text-base font-medium text-slate-800 flex items-center">
        {Icon && <Icon className="h-4 w-4 mr-2 text-primary" />}
        {label}
        {required && <span className="text-warning ml-1">*</span>}
      </Label>
      {description && (
        <p className="text-sm text-slate-600">
          {description}
        </p>
      )}
      {children}
    </div>
  );
}