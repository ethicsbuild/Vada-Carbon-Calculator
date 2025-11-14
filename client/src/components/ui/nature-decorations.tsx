/**
 * Nature Decorations Component
 * Subtle, sophisticated nature-inspired ambient elements
 */

export function NatureGradientOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Very subtle ambient gradients - barely noticeable but adds warmth */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-forest-200/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-sage-200/5 rounded-full blur-3xl" />
    </div>
  );
}

export function NatureBorder() {
  return null; // Removed - too obvious
}