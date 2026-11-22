import { useEffect, useState, type ReactNode } from "react";
import { createFileRoute, Link, useBlocker } from "@tanstack/react-router";
import { ArrowLeft, UserRound, Pencil, Ban, CheckCircle2, Send, Users, GraduationCap, BarChart3, Wallet, CreditCard, Banknote, LockKeyhole, Link2, NotebookPen, Eye, EyeOff, Save, X, Camera, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MembershipConfirmation } from "@/components/admin/MembershipConfirmation";
import { MarketerField } from "@/components/admin/MarketerField";
import { useMockMarketers } from "@/data/adminMarketersStore";
import { marketerCities, marketerName, marketerStats, socialPlatforms, statusMap, toggleMembership, updateMarketer, validateMarketer, type Marketer } from "@/data/adminMarketers";

export const Route = createFileRoute("/admin/external-marketers_/$id")({
  head: ({ params }) => ({ meta: [
    { title: `ملف المسوق ${params.id} — إدارة مكافآتي` },
    { name: "description", content: "عرض وتعديل ملف المسوق الخارجي وبيانات العضوية في إدارة مكافآتي." },
    { property: "og:title", content: `ملف المسوق ${params.id} — مكافآتي` },
    { property: "og:description", content: "بيانات المسوق الخارجي وعضويته ومكافآته في منصة مكافآتي." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" },
  ] }),
  component: MarketerProfilePage,
});

const sections = [
  { id: "personal", title: "البيانات الشخصية", icon: UserRound },
  { id: "credentials", title: "بيانات الدخول", icon: LockKeyhole },
  { id: "financial", title: "البيانات المالية", icon: Wallet },
  { id: "links", title: "الروابط والأكواد", icon: Link2 },
  { id: "notes", title: "الملاحظات", icon: NotebookPen },
] as const;

function MarketerProfilePage() {
  const { id } = Route.useParams();
  const { marketers, ready, update } = useMockMarketers();
  const marketer = marketers.find(m => m.id === id);
  if (!ready) return <p className="p-6 text-muted-foreground">جارٍ تحميل ملف المسوق…</p>;
  if (!marketer) return <div className="space-y-4"><h1 className="text-2xl font-bold">ملف المسوق غير موجود</h1><Button asChild variant="outline"><Link to="/admin/external-marketers"><ArrowLeft />العودة للقائمة</Link></Button></div>;
  return <Profile key={id} marketer={marketer} update={update} />;
}

function Profile({ marketer, update }: { marketer: Marketer; update: (fn: (records: Marketer[]) => Marketer[]) => void }) {
  const [draft, setDraft] = useState(marketer);
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [active, setActive] = useState("personal");
  const value = editing ? draft : marketer;
  const dirty = editing && JSON.stringify(draft) !== JSON.stringify(marketer);
  useBlocker({ shouldBlockFn: () => dirty && !window.confirm("لديك تغييرات غير محفوظة. هل تريد المغادرة دون حفظ؟"), enableBeforeUnload: dirty });
  useEffect(() => {
    let scheduled = false;
    const sync = () => {
      scheduled = false;
      let current: string = "personal";
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element && element.getBoundingClientRect().top <= 190) current = section.id;
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = "notes";
      setActive(current);
    };
    const onScroll = () => { if (!scheduled) { scheduled = true; requestAnimationFrame(sync); } };
    window.addEventListener("scroll", onScroll, { passive: true }); sync();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const set = (key: keyof Marketer, next: string) => { setDraft(d => ({ ...d, [key]: next })); setErrors(e => ({ ...e, [key]: "" })); };
  function field(key: keyof Marketer, label: string, opts: { required?: boolean; type?: string; options?: readonly string[]; locked?: boolean; dir?: "ltr" | "rtl" } = {}) {
    return <MarketerField label={label} value={String(value[key])} editing={editing} error={errors[key]} onChange={next => set(key, next)} {...opts} />;
  }
  function cancel() { setDraft(marketer); setErrors({}); setEditing(false); setShowPassword(false); setNotice(""); }
  function save() {
    const nextErrors = validateMarketer(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setNotice("راجع الحقول المطلوبة والبيانات المدخلة");
      requestAnimationFrame(() => document.querySelector('[aria-invalid="true"]')?.scrollIntoView({ block: "center", behavior: "smooth" }));
      return;
    }
    try { update(records => updateMarketer(records, marketer.id, draft)); setEditing(false); setShowPassword(false); setNotice("تم حفظ التغييرات بنجاح"); }
    catch { setNotice("تعذر حفظ التغييرات محليًا. لم يتم حفظ البيانات، حاول مجددًا."); }
  }
  function changeStatus() {
    try { update(records => toggleMembership(records, marketer.id)); setNotice("تم تحديث حالة العضوية"); }
    catch { setNotice("تعذر حفظ حالة العضوية محليًا، حاول مجددًا"); }
  }
  function uploadPhoto(file: File | undefined) {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 2 * 1024 * 1024) { setNotice("اختر صورة JPG أو PNG أو WebP لا تتجاوز 2 ميجابايت"); return; }
    const reader = new FileReader();
    reader.onload = () => { if (typeof reader.result === "string") set("photo", reader.result); };
    reader.readAsDataURL(file);
  }
  const stats = marketerStats(marketer);
  const statCards = [
    { title: "تسجيلات الاهتمام", amount: stats.interests, icon: Users, color: "text-admin-blue bg-admin-blue/10" },
    { title: "المتدربون", amount: stats.trainees, icon: GraduationCap, color: "text-admin-green bg-admin-green/10" },
    { title: "إجمالي المبيعات", amount: stats.sales, icon: BarChart3, color: "text-admin-amber bg-admin-amber/10" },
    { title: "إجمالي المكافآت", amount: stats.rewards, icon: Banknote, color: "text-admin-green bg-admin-green/10" },
    { title: "الرصيد المسحوب", amount: stats.withdrawn, icon: CreditCard, color: "text-admin-blue bg-admin-blue/10" },
    { title: "الرصيد المتاح", amount: stats.available, icon: Wallet, color: "text-admin-blue bg-admin-blue/10" },
  ];
  const photo = <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-admin-blue/15 bg-admin-blue/10 text-2xl font-extrabold text-admin-blue">{value.photo ? <img src={value.photo} alt={marketerName(value)} className="h-full w-full object-cover" /> : `${value.firstName.slice(0, 1)}${value.lastName.slice(0, 1)}`}</div>;
  return <div className="space-y-5">
    <div className="flex flex-wrap items-start justify-between gap-3"><h1 className="flex items-center gap-2 text-2xl font-extrabold"><UserRound className="text-admin-blue" />ملف المسوق (خارجي)</h1><Button asChild variant="outline" size="sm"><Link to="/admin/external-marketers"><ArrowLeft />العودة للقائمة</Link></Button></div>
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">{photo}<div><h2 className="text-xl font-extrabold">{marketerName(marketer)}</h2><div className="mt-2 flex flex-wrap items-center gap-2 text-xs"><span>رقم العضوية: <b dir="ltr">{marketer.id}</b></span><span className={`rounded-full px-3 py-1 font-bold ${statusMap[marketer.status].cls}`}>{statusMap[marketer.status].label}</span></div></div></div>
      <div className="flex flex-wrap gap-2">
        {!editing ? <Button className="bg-admin-blue text-primary-foreground hover:bg-admin-blue/90" onClick={() => { setDraft(structuredClone(marketer)); setEditing(true); setNotice(""); }}><Pencil />تعديل البيانات</Button> : <><Button onClick={save} className="bg-admin-blue text-primary-foreground hover:bg-admin-blue/90"><Save />حفظ التغييرات</Button><Button variant="outline" onClick={cancel}><X />إلغاء</Button></>}
        <Button variant="outline" className={marketer.status === "active" ? "border-admin-red/20 bg-admin-red/10 text-admin-red" : "border-admin-green/20 text-admin-green"} onClick={() => marketer.status === "active" ? setConfirm(true) : changeStatus()}>{marketer.status === "active" ? <Ban /> : <CheckCircle2 />}{marketer.status === "active" ? "إيقاف العضوية" : "تفعيل العضوية"}</Button>
        <Button variant="outline" onClick={() => setNotice("تمت محاكاة إرسال بيانات الدخول، دون إرسال بريد أو رسالة فعلية")}><Send />إرسال بيانات الدخول</Button>
      </div>
    </div>
    {notice && <p role="status" className="rounded-lg border border-admin-blue/15 bg-admin-blue/5 px-4 py-3 text-sm font-bold text-admin-blue">{notice}</p>}
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">{statCards.map((stat, i) => <div key={stat.title} className="min-w-0 rounded-xl border border-admin-blue/15 bg-card p-3 shadow-sm"><div className="flex items-center justify-between gap-1"><span className="text-xs font-bold">{stat.title}</span><span className={`rounded-lg p-1.5 ${stat.color}`}><stat.icon size={18} /></span></div><div className="mt-3 text-xl font-extrabold">{stat.amount.toLocaleString("en-US")} {i > 1 && <span className="text-xs">ر.س</span>}</div>{i === 3 && <p className="mt-1 text-[11px] text-admin-blue">5% من المبيعات المسددة</p>}</div>)}</div>
    <nav aria-label="أقسام ملف المسوق" className="sticky top-[66px] z-10 flex gap-1 overflow-x-auto bg-admin-canvas py-3">{sections.map(section => <Button key={section.id} aria-current={active === section.id ? "location" : undefined} variant="outline" className={`min-w-max flex-1 rounded-lg ${active === section.id ? "border-marketer-tab bg-marketer-tab text-primary-foreground hover:bg-marketer-tab/90 hover:text-primary-foreground" : "border-admin-blue/10 bg-admin-sidebar/60"}`} onClick={() => { document.getElementById(section.id)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" }); setActive(section.id); }}><section.icon />{section.title}</Button>)}</nav>
    <Section id="personal" title="البيانات الشخصية" icon={<UserRound />}>
      <div className="grid items-start gap-5 md:grid-cols-[1fr_120px]"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {field("firstName", "الاسم الأول", { required: true })}{field("lastName", "اسم العائلة", { required: true })}{field("id", "رقم العضوية", { locked: true, dir: "ltr" })}
        {field("gender", "الجنس", { options: ["ذكر", "أنثى"] })}{field("birthDate", "تاريخ الميلاد", { required: true, type: "date" })}{field("nationality", "الجنسية", { required: true })}
        {field("phone", "الجوال", { required: true, dir: "ltr", type: "tel" })}{field("city", "المدينة", { required: true, options: marketerCities })}{field("email", "البريد الإلكتروني", { required: true, type: "email", dir: "ltr" })}
        <div className="sm:col-span-2">{field("source", "وسيلة المعرفة")}</div>
      </div><div className="flex flex-col items-center gap-3">{photo}{editing && <><Button asChild variant="outline" size="sm"><label className="cursor-pointer"><Camera />تغيير الصورة<input type="file" aria-label="تغيير الصورة" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={e => uploadPhoto(e.target.files?.[0])} /></label></Button><Button variant="ghost" size="sm" className="text-admin-red" disabled={!value.photo} onClick={() => set("photo", "")}><Trash2 />حذف الصورة</Button></>}</div></div>
    </Section>
    <Section id="credentials" title="بيانات الدخول" icon={<LockKeyhole />}><div className="grid gap-6 sm:grid-cols-2">{field("username", "اسم المستخدم", { required: true, dir: "ltr" })}<div className="flex items-start gap-2"><div className="min-w-0 flex-1">{field("demoPassword", "كلمة المرور التجريبية", { required: true, type: showPassword ? "text" : "password", dir: "ltr" })}</div><Button type="button" variant="outline" size="icon" className="mt-6 shrink-0" aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"} onClick={() => setShowPassword(v => !v)}>{showPassword ? <EyeOff /> : <Eye />}</Button></div></div></Section>
    <Section id="financial" title="البيانات المالية" icon={<Wallet />}><div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2"><label className="mb-2 block text-xs font-bold">طريقة استلام المكافأة</label><div className="flex flex-wrap gap-5">{([['bank', 'تحويل بنكي'], ['cash', 'استلام نقدي']] as const).map(([method, title]) => <label key={method} className="flex items-center gap-2 text-sm"><input type="radio" name="payment-method" checked={value.paymentMethod === method} disabled={!editing} onChange={() => set("paymentMethod", method)} className="accent-admin-blue" />{title}</label>)}</div></div>
      {field("beneficiary", "اسم المستفيد", { required: value.paymentMethod === "bank" })}{field("bank", "البنك", { required: value.paymentMethod === "bank" })}{field("iban", "رقم الآيبان", { required: value.paymentMethod === "bank", dir: "ltr" })}{field("ibanConfirm", "تأكيد الآيبان", { required: value.paymentMethod === "bank", dir: "ltr" })}
    </div></Section>
    <Section id="links" title="الروابط والأكواد" icon={<Link2 />}><div className="grid gap-4 sm:grid-cols-2">{socialPlatforms.map(platform => <MarketerField key={platform} label={platform} value={value.links[platform] ?? ""} dir="ltr" editing={editing} error={errors[platform]} onChange={next => { setDraft(d => ({ ...d, links: { ...d.links, [platform]: next } })); setErrors(e => ({ ...e, [platform]: "" })); }} />)}{value.referralCode && field("referralCode", "كود الإحالة", { locked: true, dir: "ltr" })}{value.referralLink && field("referralLink", "رابط الإحالة", { locked: true, dir: "ltr" })}</div></Section>
    <Section id="notes" title="الملاحظات" icon={<NotebookPen />}><label htmlFor="admin-notes" className="sr-only">ملاحظات إدارية</label><textarea id="admin-notes" value={value.notes} readOnly={!editing} onChange={e => set("notes", e.target.value)} className="min-h-28 w-full resize-y rounded-lg border border-admin-blue/15 bg-admin-canvas p-3 text-sm outline-none focus:border-admin-blue" /></Section>
    {editing && <div className="flex gap-3 pb-4"><Button className="bg-admin-blue text-primary-foreground hover:bg-admin-blue/90" onClick={save}><Save />حفظ التغييرات</Button><Button variant="outline" onClick={cancel}><X />إلغاء</Button></div>}
    <MembershipConfirmation open={confirm} onOpenChange={setConfirm} name={marketerName(marketer)} onConfirm={changeStatus} />
  </div>;
}

function Section({ id, title, icon, children }: { id: string; title: string; icon: ReactNode; children: ReactNode }) {
  return <section id={id} className="scroll-mt-40 rounded-2xl border border-admin-blue/10 bg-card p-4 shadow-sm md:p-5"><h2 className="mb-5 flex items-center gap-2 text-lg font-extrabold"><span className="text-admin-blue">{icon}</span>{title}</h2>{children}</section>;
}