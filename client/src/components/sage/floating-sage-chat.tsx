import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { SageChat } from './sage-chat';
import { MessageCircle, X } from 'lucide-react';

export function FloatingSageChat() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl bg-gradient-to-br from-emerald-500 to-violet-500 hover:from-emerald-600 hover:to-violet-600 text-white z-50 flex items-center justify-center group transition-all hover:scale-110"
        aria-label="Chat with Sage Riverstone"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
      </Button>

      {/* Chat Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl h-[700px] p-0 bg-slate-900 border-slate-700">
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-violet-500 flex items-center justify-center text-lg">
                🌱
              </div>
              Chat with Sage Riverstone
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex-1 overflow-hidden">
            <SageChat />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
