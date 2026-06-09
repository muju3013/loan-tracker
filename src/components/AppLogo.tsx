

export function AppLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shield background */}
      <path d="M50 5 L90 20 L90 50 C90 75 50 95 50 95 C50 95 10 75 10 50 L10 20 L50 5 Z" fill="#0A0F1C" />
      
      {/* Golden border */}
      <path d="M50 5 L90 20 L90 50 C90 75 50 95 50 95 C50 95 10 75 10 50 L10 20 L50 5 Z" stroke="url(#goldGradient)" strokeWidth="4" strokeLinejoin="round" />
      
      {/* Rupee Symbol */}
      <path d="M35 35 H65 M35 45 H55 C65 45 65 55 55 55 H45 M45 45 L55 55 M45 55 L60 70" stroke="#10B981" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Golden Checkmark */}
      <path d="M30 60 L45 75 L75 40" stroke="url(#goldGradient)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />

      <defs>
        <linearGradient id="goldGradient" x1="10" y1="5" x2="90" y2="95" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDE047" />
          <stop offset="0.5" stopColor="#EAB308" />
          <stop offset="1" stopColor="#CA8A04" />
        </linearGradient>
      </defs>
    </svg>
  );
}
