// components/AnalysisDashboard/ScoreGauge.tsx
interface Props {
  value: number; // 0-100
}
export default function ScoreGauge({ value }: Props) {
  return (
    <div className="relative mx-auto h-40 w-40">
      <svg viewBox="0 0 36 36" className="h-full w-full">
        <path
          className="stroke-gray-200 dark:stroke-zinc-600"
          strokeWidth="3.8"
          fill="none"
          d="M18 2.0845
             a 15.9155 15.9155 0 0 1 0 31.831
             a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          className="stroke-indigo-500 transition-all"
          strokeWidth="3.8"
          strokeDasharray={`${value}, 100`}
          fill="none"
          d="M18 2.0845
             a 15.9155 15.9155 0 0 1 0 31.831
             a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <text
          x="18"
          y="20.35"
          className="fill-zinc-800 text-sm font-bold text-center dark:fill-zinc-100"
          textAnchor="middle"
        >
          {value}%
        </text>
      </svg>
    </div>
  );
}
