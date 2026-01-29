import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';
import { 
  Sun, 
  Moon, 
  Leaf, 
  Calculator, 
  BarChart3, 
  FileText, 
  Settings,
  Menu,
  X
} from 'lucide-react';

export function Navigation() {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Community', href: '/community', icon: FileText },
    { name: 'Resources', href: '/resources', icon: Settings },
  ];

  const carbonScore = 'B+'; // This will come from context/API later

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-forest-50/95 dark:bg-forest-900/95 border-b border-forest-200/50 dark:border-forest-700/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer group">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-forest-600 to-sage-600 bg-clip-text text-transparent tracking-tight group-hover:from-forest-500 group-hover:to-sage-500 transition-all">
                  VEDA
                </h1>
              </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const isActive = location === item.href;

              return (
                <Link key={item.name} href={item.href}>
                  <span className={cn(
                    "text-sm font-medium transition-colors cursor-pointer",
                    isActive
                      ? "text-forest-700 dark:text-forest-300 font-semibold"
                      : "text-sage-600 dark:text-sage-400 hover:text-forest-600 dark:hover:text-forest-400"
                  )}>
                    {item.name}
                  </span>
                </Link>
              );
            })}

            {/* Carbon Score Badge */}
            <div className="bg-forest-100 dark:bg-forest-800 px-4 py-2 rounded-full border border-forest-400/50">
              <span className="text-sm text-forest-700 dark:text-forest-300">
                Your Score: <span className="font-bold text-forest-600 dark:text-forest-400">{carbonScore}</span>
              </span>
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-9 h-9 p-0 text-forest-700 dark:text-forest-300 hover:bg-forest-100 dark:hover:bg-forest-800"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-forest-200/50 dark:border-forest-700/50">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => {
                const isActive = location === item.href;

                return (
                  <Link key={item.name} href={item.href}>
                    <div
                      className={cn(
                        "px-3 py-2 rounded-md text-base font-medium transition-colors cursor-pointer",
                        isActive
                          ? "text-forest-900 dark:text-forest-50 bg-forest-50 dark:bg-forest-800"
                          : "text-sage-600 dark:text-sage-400 hover:text-forest-600 dark:hover:text-forest-400 hover:bg-forest-50 dark:bg-forest-800"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </div>
                  </Link>
                );
              })}

              {/* Carbon Score Badge Mobile */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="bg-forest-50 dark:bg-forest-800 px-4 py-2 rounded-lg border border-emerald-500/50 text-center">
                  <span className="text-sm text-forest-700 dark:text-forest-300">
                    Your Score: <span className="font-bold text-forest-600 dark:text-forest-400">{carbonScore}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
