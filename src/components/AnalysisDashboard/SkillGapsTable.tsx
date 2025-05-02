// components/AnalysisDashboard/SkillGapsTable.tsx
import { SkillGap } from "@/lib/llm/client/types";
import clsx from "clsx";

interface Props {
  gaps: SkillGap[];
  className?: string;
}

export default function SkillGapsTable({ gaps, className }: Props) {
  return (
    <div
      className={clsx(
        "overflow-hidden rounded-xl border bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-800",
        className
      )}
    >
      <table className="w-full text-sm">
        <thead className="bg-zinc-50 text-left font-semibold dark:bg-zinc-700">
          <tr>
            <th className="px-4 py-2">Skill</th>
            <th className="px-4 py-2">Priority</th>
            <th className="px-4 py-2">Current</th>
            <th className="px-4 py-2">Required</th>
          </tr>
        </thead>
        <tbody>
          {gaps.map((g) => (
            <tr
              key={g.skill}
              className="border-t dark:border-zinc-700 odd:bg-white even:bg-zinc-50 dark:odd:bg-zinc-800 dark:even:bg-zinc-700/40"
            >
              <td className="px-4 py-2">{g.skill}</td>
              <td className="px-4 py-2">{g.priority}</td>
              <td className="px-4 py-2">{g.current_level}</td>
              <td className="px-4 py-2">{g.required_level}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
