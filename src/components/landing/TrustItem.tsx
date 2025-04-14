"use client";

interface TrustItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "purple" | "blue" | "green" | "indigo";
}

export default function TrustItem({
  icon,
  title,
  description,
  color,
}: TrustItemProps) {
  // Define color classes based on the color prop
  const colorStyles = {
    purple: {
      gradient:
        "from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    blue: {
      gradient:
        "from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    green: {
      gradient:
        "from-green-100 to-teal-100 dark:from-green-900/20 dark:to-teal-900/20",
      iconColor: "text-green-600 dark:text-green-400",
    },
    indigo: {
      gradient:
        "from-indigo-100 to-blue-100 dark:from-indigo-900/20 dark:to-blue-900/20",
      iconColor: "text-indigo-600 dark:text-indigo-400",
    },
  };

  return (
    <div className="trust-item bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center">
      <div
        className={`w-20 h-20 rounded-full bg-gradient-to-br ${colorStyles[color].gradient} flex items-center justify-center mb-6`}
      >
        <svg
          className={`h-10 w-10 ${colorStyles[color].iconColor}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {icon}
        </svg>
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}
