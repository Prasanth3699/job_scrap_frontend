"use client";
import { Disclosure, Transition } from "@headlessui/react";
import {
  ChevronDown,
  BarChart3,
  BookOpen,
  Award,
  Briefcase,
} from "lucide-react";
import { ImprovementPlan } from "@/lib/llm/client/types";
import clsx from "clsx";

interface Props {
  plans: ImprovementPlan[];
  className?: string;
}

export default function ImprovementAccordion({ plans, className }: Props) {
  return (
    <div
      className={clsx(
        "rounded-xl border overflow-hidden bg-zinc-900 shadow-lg dark:border-zinc-700",
        className
      )}
    >
      <div className="px-6 py-4 border-b border-zinc-800 flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-indigo-400" />
        <h2 className="text-lg font-semibold">12-Week Improvement Plan</h2>
      </div>

      <div className="divide-y dark:divide-zinc-800">
        {plans.map((plan, index) => (
          <Disclosure key={plan.skill} as="div">
            {({ open }) => (
              <>
                <Disclosure.Button className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-zinc-800/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center ${getColorByIndex(
                        index
                      )}`}
                    >
                      <span className="text-xs font-medium">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-medium">{plan.skill}</h3>
                      <p className="text-xs text-zinc-400">
                        {plan.timeline_weeks} week plan
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={clsx(
                      "h-5 w-5 text-zinc-400 transition-transform duration-300",
                      open && "rotate-180"
                    )}
                  />
                </Disclosure.Button>

                <Transition
                  enter="transition duration-200 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-150 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Disclosure.Panel className="px-6 pb-5 pt-2 text-sm bg-zinc-800/30">
                    <div className="grid gap-4 md:grid-cols-3">
                      <ResourceSection
                        title="Resources"
                        icon={<BookOpen className="h-4 w-4" />}
                        items={plan.resources}
                      />
                      <ResourceSection
                        title="Projects"
                        icon={<Briefcase className="h-4 w-4" />}
                        items={plan.projects}
                      />
                      <ResourceSection
                        title="Certifications"
                        icon={<Award className="h-4 w-4" />}
                        items={plan.certifications}
                      />
                    </div>

                    <div className="mt-4 px-3 py-2 bg-zinc-800 rounded-lg">
                      <p className="text-xs text-zinc-400">
                        {plan.estimated_cost}
                      </p>
                    </div>
                  </Disclosure.Panel>
                </Transition>
              </>
            )}
          </Disclosure>
        ))}
      </div>
    </div>
  );
}

function ResourceSection({
  title,
  icon,
  items,
}: {
  title: string;
  icon: React.ReactNode;
  items: string[];
}) {
  if (!items.length) return null;
  return (
    <div className="space-y-2">
      <h4 className="font-medium flex items-center gap-2 text-zinc-300">
        {icon}
        {title}
      </h4>
      <ul className="space-y-1 pl-6">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-zinc-400 leading-tight">
            <span className="text-indigo-400 font-bold">•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function getColorByIndex(index: number): string {
  const colors = [
    "bg-indigo-900/40 text-indigo-400",
    "bg-emerald-900/40 text-emerald-400",
    "bg-purple-900/40 text-purple-400",
    "bg-amber-900/40 text-amber-400",
    "bg-blue-900/40 text-blue-400",
    "bg-rose-900/40 text-rose-400",
  ];

  return colors[index % colors.length];
}
