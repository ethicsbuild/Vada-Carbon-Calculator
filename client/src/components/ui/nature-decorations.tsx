/**
 * Nature Decorations Component
 * Adds subtle, beautiful nature-inspired decorative elements
 */

export function FloatingLeaves() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-20">
      {/* Floating leaf decorations */}
      <div className="absolute top-10 left-10 text-6xl text-forest-400 animate-leaf-float" style={{ animationDelay: '0s' }}>
        🍃
      </div>
      <div className="absolute top-32 right-20 text-5xl text-sage-400 animate-leaf-float" style={{ animationDelay: '2s' }}>
        🌿
      </div>
      <div className="absolute bottom-40 left-1/4 text-4xl text-moss-400 animate-leaf-float" style={{ animationDelay: '4s' }}>
        🍂
      </div>
      <div className="absolute top-1/3 right-1/3 text-5xl text-forest-300 animate-leaf-float" style={{ animationDelay: '1s' }}>
        🌱
      </div>
      <div className="absolute bottom-20 right-10 text-6xl text-sage-300 animate-leaf-float" style={{ animationDelay: '3s' }}>
        🍃
      </div>
    </div>
  );
}

export function NatureGradientOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Subtle nature gradient overlays */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-forest-200/10 rounded-full blur-3xl" />
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-sage-200/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-moss-200/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-earth-200/10 rounded-full blur-3xl" />
    </div>
  );
}

export function NatureBorder() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Decorative nature border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-forest-300/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-sage-300/30 to-transparent" />
    </div>
  );
}