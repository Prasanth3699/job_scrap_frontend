interface Props {
  value: number; // 0-100
}

export default function ScoreGauge({ value }: Props) {
  // Enhanced color system
  const getColor = () => {
    if (value >= 80) return "text-emerald-500";
    if (value >= 60) return "text-amber-500";
    return "text-rose-500";
  };

  // Calculate the color for the gauge elements
  const gaugeColor = getColor();
  const glowColor =
    value >= 80
      ? "bg-emerald-800/20"
      : value >= 60
      ? "bg-amber-800/20"
      : "bg-rose-800/20";

  // Calculate ring progress - the outer ring should show progress
  const circumference = 2 * Math.PI * 48; // radius = 48
  const dashOffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative mx-auto h-48 w-48">
      {/* Background glow effect matching score color */}
      <div
        className={`absolute inset-0 rounded-full ${glowColor} blur-xl`}
      ></div>

      {/* SVG circular progress */}
      <svg
        className="absolute inset-0 transform -rotate-90"
        viewBox="0 0 100 100"
      >
        {/* Background track */}
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-zinc-800"
        />
        {/* Progress indicator */}
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          className={gaugeColor}
        />
      </svg>

      {/* Main gauge - with dynamic color based on score */}
      <div className="absolute inset-0 flex h-full w-full flex-col items-center justify-center">
        <span className={`text-7xl font-bold ${gaugeColor}`}>{value}</span>
        <span className="mt-2 text-sm uppercase tracking-wider text-zinc-400">
          Score
        </span>
      </div>

      {/* Decorative circular elements */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <div className="h-32 w-32 rounded-full border-4 border-dashed border-zinc-400"></div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="h-40 w-40 rounded-full border border-zinc-400"></div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <div className="h-44 w-44 rounded-full border border-zinc-400"></div>
      </div>
    </div>
  );
}
