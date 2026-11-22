import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function MarketerField({ label, value, onChange, editing, error, type = "text", options, required = false, locked = false, dir }: {
  label: string; value: string; onChange: (value: string) => void; editing: boolean; error?: string | undefined;
  type?: string; options?: readonly string[]; required?: boolean; locked?: boolean; dir?: "ltr" | "rtl";
}) {
  const id = `marketer-${label}`;
  return <div className="min-w-0 space-y-1.5">
    <label htmlFor={id} className="block text-xs font-bold">{label} {required && <span className="text-admin-red">*</span>}</label>
    {options ? <Select value={value} onValueChange={onChange} disabled={!editing || locked}><SelectTrigger id={id} dir="rtl" className="h-10 w-full rounded-lg bg-admin-canvas disabled:opacity-100"><SelectValue /></SelectTrigger><SelectContent dir="rtl">{options.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select>
      : <Input id={id} aria-invalid={!!error} type={type} value={value} onChange={e => onChange(e.target.value)} readOnly={!editing || locked} dir={dir} autoComplete="off" className={`h-10 rounded-lg ${locked ? "bg-muted" : "bg-admin-canvas"} ${!editing ? "border-admin-navy/5" : ""}`} />}
    {error && <p role="alert" className="text-xs text-admin-red">{error}</p>}
  </div>;
}