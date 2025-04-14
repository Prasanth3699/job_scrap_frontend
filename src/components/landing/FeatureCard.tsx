"use client";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "purple" | "blue" | "green" | "indigo";
}

export default function FeatureCard({
  icon,
  title,
  description,
  color,
}: FeatureCardProps) {
  const colorClasses = {
    purple: {
      bg: "bg-purple-100/50 dark:bg-purple-900/20",
      hover: "bg-purple-600/10",
      icon: "text-purple-600 dark:text-purple-400",
      iconHover: "text-purple-700 dark:text-purple-300",
    },
    blue: {
      bg: "bg-blue-100/50 dark:bg-blue-900/20",
      hover: "bg-blue-600/10",
      icon: "text-blue-600 dark:text-blue-400",
      iconHover: "text-blue-700 dark:text-blue-300",
    },
    green: {
      bg: "bg-green-100/50 dark:bg-green-900/20",
      hover: "bg-green-600/10",
      icon: "text-green-600 dark:text-green-400",
      iconHover: "text-green-700 dark:text-green-300",
    },
    indigo: {
      bg: "bg-indigo-100/50 dark:bg-indigo-900/20",
      hover: "bg-indigo-600/10",
      icon: "text-indigo-600 dark:text-indigo-400",
      iconHover: "text-indigo-700 dark:text-indigo-300",
    },
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 transform border border-gray-100 dark:border-gray-800 group/item">
      <div
        className={`w-14 h-14 ${colorClasses[color].bg} rounded-lg flex items-center justify-center mb-6 group-hover/item:${colorClasses[color].hover} transition-colors`}
      >
        {typeof icon === "string" ? (
          <svg
            className={`h-7 w-7 ${colorClasses[color].icon} group-hover/item:${colorClasses[color].iconHover} transition-colors`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {icon}
          </svg>
        ) : (
          <div
            className={`h-7 w-7 ${colorClasses[color].icon} group-hover/item:${colorClasses[color].iconHover} transition-colors`}
          >
            {icon}
          </div>
        )}
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}
