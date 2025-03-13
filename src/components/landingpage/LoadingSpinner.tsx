export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center">
      {/* SVG Spinner */}
      <svg className="w-16 h-16 animate-spin" viewBox="0 0 50 50">
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="5"
          /* Tailwind can’t directly set dash/gap, so we use inline style */
          style={{
            stroke: "currentColor",
            strokeDasharray: "60 65", // length of arc vs. gap
            strokeDashoffset: "0", // start position of the dash
          }}
          /* Use a Tailwind text color for the stroke */
          className="text-blue-400"
          strokeLinecap="round" // rounded ends on the arc
        />
      </svg>

      {/* Loading text */}
      <p className="mt-4 text-blue-400 font-semibold">Loading...</p>
    </div>
  );
}
