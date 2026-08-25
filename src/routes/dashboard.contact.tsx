import { useState, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, Send, Upload, CheckCircle, X, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/contact")({
  head: () => ({
    meta: [
      { title: "تواصل معنا | لوحة تحكم مكافآتي" },
      { name: "description", content: "تواصل مع فريق دعم مكافآتي." },
      { property: "og:title", content: "تواصل معنا | لوحة تحكم مكافآتي" },
      { property: "og:description", content: "تواصل مع فريق دعم مكافآتي." },
    ],
  }),
  component: ContactPage,
});

const inquiryOptions = [
  "استفسار عام",
  "استفسار عن المكافآت",
  "استفسار عن العملاء",
  "استفسار عن البرامج",
  "مشكلة تقنية",
  "اقتراح أو شكوى",
];

type FormState = {
  name: string;
  membershipNumber: string;
  email: string;
  phone: string;
  inquiryType: string;
  subject: string;
  message: string;
  file: File | null;
};

const initialForm: FormState = {
  name: "",
  membershipNumber: "",
  email: "",
  phone: "",
  inquiryType: "",
  subject: "",
  message: "",
  file: null,
};

function ContactPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (submitted) setSubmitted(false);
  };

  const handleFileChange = (file: File | null) => {
    if (file && file.size > 5 * 1024 * 1024) {
      alert("حجم الملف يتجاوز 5MB. يرجى اختيار ملف أصغر.");
      return;
    }
    updateField("file", file);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0] ?? null;
    handleFileChange(file);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setForm(initialForm);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = () => {
    updateField("file", null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <section className="animate-in fade-in slide-in-from-bottom-2 space-y-5 duration-500">
      <div className="flex items-center gap-3 text-right">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand text-primary-foreground">
          <Mail size={22} />
        </span>
        <div>
          <h1 className="text-2xl font-black text-navy sm:text-3xl">تواصل معنا</h1>
          <p className="mt-1 text-sm text-muted-foreground">تواصل مع فريق دعم مكافأتي.</p>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-4 shadow-card sm:p-6 lg:p-8">
        <div className="mb-6 text-right">
          <h2 className="text-xl font-black text-navy sm:text-2xl">أرسل لنا رسالة</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            يرجى تعبئة النموذج وسيتم الرد عليك في أقرب وقت.
          </p>
        </div>

        {submitted && (
          <div className="mb-6 flex items-start justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-right text-emerald-800 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-start gap-3">
              <CheckCircle size={22} className="mt-0.5 shrink-0 text-emerald-600" />
              <p className="text-sm font-bold leading-relaxed sm:text-base">
                تم استلام رسالتك بنجاح، وسيقوم فريق مكافأتي بالرد عليك في أقرب وقت.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="shrink-0 rounded-lg p-1 text-emerald-600 transition-colors hover:bg-emerald-100"
              aria-label="إخفاء التنبيه"
            >
              <X size={18} />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2 text-right">
              <Label htmlFor="name" className="text-sm font-bold text-navy">
                الاسم <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="أدخل اسمك الكامل"
                required
                className="h-11 rounded-xl border-border bg-background text-right text-sm font-medium text-navy placeholder:text-muted-foreground focus-visible:ring-brand"
              />
            </div>

            <div className="space-y-2 text-right">
              <Label htmlFor="membershipNumber" className="text-sm font-bold text-navy">
                رقم العضوية <span className="text-muted-foreground font-normal">(اختياري)</span>
              </Label>
              <Input
                id="membershipNumber"
                value={form.membershipNumber}
                onChange={(e) => updateField("membershipNumber", e.target.value)}
                placeholder="أدخل رقم العضوية"
                className="h-11 rounded-xl border-border bg-background text-right text-sm font-medium text-navy placeholder:text-muted-foreground focus-visible:ring-brand"
              />
            </div>

            <div className="space-y-2 text-right">
              <Label htmlFor="email" className="text-sm font-bold text-navy">
                البريد الإلكتروني <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="أدخل بريدك الإلكتروني"
                required
                className="h-11 rounded-xl border-border bg-background text-right text-sm font-medium text-navy placeholder:text-muted-foreground focus-visible:ring-brand"
              />
            </div>

            <div className="space-y-2 text-right">
              <Label htmlFor="phone" className="text-sm font-bold text-navy">
                رقم الجوال <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="05XXXXXXXX"
                required
                pattern="05[0-9]{8}"
                title="يرجى إدخال رقم جوال سعودي صحيح مثل 05XXXXXXXX"
                className="h-11 rounded-xl border-border bg-background text-right text-sm font-medium text-navy placeholder:text-muted-foreground focus-visible:ring-brand"
              />
            </div>

            <div className="space-y-2 text-right sm:col-span-2 lg:col-span-2">
              <Label htmlFor="inquiryType" className="text-sm font-bold text-navy">
                نوع الاستفسار <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <select
                  id="inquiryType"
                  value={form.inquiryType}
                  onChange={(e) => updateField("inquiryType", e.target.value)}
                  required
                  className="flex h-11 w-full appearance-none rounded-xl border border-border bg-background px-3 py-2 text-right text-sm font-medium text-navy outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand"
                >
                  <option value="" disabled>
                    اختر نوع الاستفسار
                  </option>
                  {inquiryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2 text-right">
            <Label htmlFor="subject" className="text-sm font-bold text-navy">
              موضوع الرسالة <span className="text-destructive">*</span>
            </Label>
            <Input
              id="subject"
              value={form.subject}
              onChange={(e) => updateField("subject", e.target.value)}
              placeholder="أدخل موضوع الرسالة"
              required
              className="h-11 rounded-xl border-border bg-background text-right text-sm font-medium text-navy placeholder:text-muted-foreground focus-visible:ring-brand"
            />
          </div>

          <div className="space-y-2 text-right">
            <Label htmlFor="message" className="text-sm font-bold text-navy">
              الرسالة <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="message"
              value={form.message}
              onChange={(e) => updateField("message", e.target.value)}
              placeholder="اكتب رسالتك هنا بالتفصيل..."
              required
              rows={5}
              className="min-h-[140px] rounded-xl border-border bg-background text-right text-sm font-medium text-navy placeholder:text-muted-foreground focus-visible:ring-brand"
            />
          </div>

          <div className="space-y-2 text-right">
            <Label className="text-sm font-bold text-navy">إرفاق ملف <span className="text-muted-foreground font-normal">(اختياري)</span></Label>
            <div
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-colors ${
                isDragging
                  ? "border-brand bg-brand-soft/50"
                  : "border-border bg-background hover:border-brand/50 hover:bg-brand-soft/30"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-2">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft text-brand">
                  <Upload size={20} />
                </span>
                <p className="text-sm font-bold text-navy">انقر لإرفاق ملف أو اسحب الملف هنا</p>
                <p className="text-xs text-muted-foreground">
                  الملفات المسموحة: PDF, PNG, JPG (الحد الأقصى 5MB)
                </p>
              </div>
            </div>

            {form.file && (
              <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-border bg-brand-soft/30 px-4 py-2.5 animate-in fade-in duration-200">
                <span className="min-w-0 truncate text-sm font-bold text-navy">{form.file.name}</span>
                <button
                  type="button"
                  onClick={removeFile}
                  className="shrink-0 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  aria-label="إزالة الملف"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-start pt-2">
            <Button
              type="submit"
              className="h-12 gap-2 rounded-2xl bg-navy-deep px-8 text-sm font-bold text-primary-foreground transition-colors hover:bg-navy"
            >
              <Send size={18} />
              إرسال الرسالة
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
