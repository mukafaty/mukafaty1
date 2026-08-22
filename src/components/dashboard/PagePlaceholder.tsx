import type { LucideIcon } from "lucide-react";

export function PagePlaceholder({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="rounded-3xl border border-border bg-card p-8">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand">
            <Icon size={26} />
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-black text-navy">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <p className="mt-6 rounded-2xl bg-brand-soft/70 p-5 text-sm font-medium leading-8 text-navy">
          هذه الصفحة قيد التجهيز، وسيتم تفعيل محتواها قريبًا داخل لوحة تحكم مكافآتي.
        </p>
      </div>
    </section>
  );
}
