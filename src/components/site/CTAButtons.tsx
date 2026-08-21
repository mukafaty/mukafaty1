const base =
  "inline-flex h-[56px] items-center justify-center rounded-full px-10 text-base font-bold transition-all duration-[250ms] ease-out";

export function CTAButtons() {
  return (
    <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center">
      <a
        href="/dashboard"
        className={`${base} border border-transparent bg-primary text-primary-foreground shadow-[0_14px_30px_-16px_var(--navy)] hover:border-navy hover:bg-background hover:text-navy`}
      >
        انضم الآن
      </a>
      <button
        onClick={() =>
          document.getElementById("steps")?.scrollIntoView({ behavior: "smooth", block: "start" })
        }
        className={`${base} border-2 border-brand bg-background text-navy hover:bg-brand hover:text-primary-foreground`}
      >
        تعرف على البرنامج
      </button>
    </div>
  );
}
