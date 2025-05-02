// components/AnalysisDashboard/ImprovementAccordion.tsx
"use client";
import { Disclosure } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
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
        "rounded-xl border bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-800",
        className
      )}
    >
      <h2 className="px-6 pt-6 text-lg font-semibold">
        12-Week Improvement Plan
      </h2>
      <div className="divide-y dark:divide-zinc-700">
        {plans.map((plan) => (
          <Disclosure key={plan.skill} as="div">
            {({ open }) => (
              <>
                <Disclosure.Button className="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-700/40">
                  <span>{plan.skill}</span>
                  <ChevronDown
                    className={clsx(
                      "h-5 w-5 transition-transform",
                      open && "rotate-180"
                    )}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="px-6 pb-4 pt-2 text-sm">
                  <p className="mb-2 font-medium">
                    Timeline: {plan.timeline_weeks} weeks
                  </p>

                  <Section title="Resources" items={plan.resources} />
                  <Section title="Projects" items={plan.projects} />
                  <Section title="Certifications" items={plan.certifications} />

                  <p className="mt-2 text-xs italic">{plan.estimated_cost}</p>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        ))}
      </div>
    </div>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <>
      <h4 className="mt-2 font-semibold">{title}</h4>
      <ul className="list-disc pl-5">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </>
  );
}
