import type { LucideIcon } from "lucide-react";

interface StepCardProps {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export function StepCard({ number, title, description, icon: Icon }: StepCardProps) {
  return (
    <article className="step-card flex h-full flex-col items-center rounded-[24px] border border-brand/15 bg-[oklch(0.99_0.005_250)] p-6 text-center shadow-[var(--shadow-card)]">
      <span className="step-number text-5xl font-black text-brand transition-colors duration-300 sm:text-6xl">
        {number}
      </span>
      <h3 className="mt-3 min-h-[3.5rem] text-lg font-bold leading-snug text-navy">{title}</h3>
      <div className="step-icon mt-4 grid h-20 w-20 place-items-center rounded-full bg-brand-soft text-brand transition-colors duration-300">
        <Icon size={34} strokeWidth={2.2} />
      </div>
      <span className="mt-6 h-px w-16 bg-border" />
      <p className="mt-4 text-sm leading-7 text-muted-foreground">{description}</p>
    </article>
  );
}
