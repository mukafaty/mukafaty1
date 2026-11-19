import { useEffect, useState, type ReactNode } from 'react';
import { createFileRoute, Link, useBlocker, useNavigate } from '@tanstack/react-router';
import { ArrowRight, Plus, FileText, Coins, ImageIcon, Video, Pencil, CalendarDays, Eye, Save, Send, X, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AD_CITIES, AD_MODES, AD_PROGRAMS, AD_STATUS_LABEL, type AdDetails, type LocalMedia, type AdStatus, type TrainingMode } from '@/data/adminAds';
import { createMockAd, emptyAdForm, insertMockAd, validateAdForm, type AdForm, type AdFormErrors } from '@/data/adminAdForm';
import { readMockAds, writeMockAds } from '@/data/adminAdsStore';
import { AdPreview } from '@/components/admin/AdPreview';
import { AdMediaField } from '@/components/admin/AdMediaField';

export const Route = createFileRoute('/admin/ads_/new')({
  head: () => ({ meta: [
    { title: 'إضافة إعلان جديد — مكافآتي' },
    { name: 'description', content: 'إنشاء إعلان تسويقي تجريبي ببياناته ووسائطه وإعدادات نشره في لوحة إدارة مكافآتي.' },
    { property: 'og:title', content: 'إضافة إعلان جديد — مكافآتي' },
    { property: 'og:description', content: 'إعداد بيانات الإعلان والرسوم والصور والنصوص التسويقية ومعاينته قبل الحفظ التجريبي.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }, { name: 'robots', content: 'noindex' },
  ] }), component: NewAdPage,
});
const fieldClass = 'h-10 rounded-lg border-admin-navy/15 bg-card text-sm';
const panelClass = 'min-w-0 rounded-2xl border border-border bg-card p-4 shadow-sm';
function Section({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return <section className={panelClass}><h2 className="mb-4 flex items-center gap-2 text-base font-extrabold"><span className="text-admin-blue">{icon}</span>{title}</h2>{children}</section>;
}
function Field({ label, error, required, children }: {label: string; error?: string | undefined; required?: boolean; children: ReactNode}) {
  return <div className="min-w-0 space-y-1.5"><div className="text-xs font-bold">{label}{required && <span className="ms-1 text-destructive">*</span>}</div>{children}{error && <p role="alert" className="text-xs text-destructive">{error}</p>}</div>;
}
function Choice({ label, value, options, onChange }: {label: string; value: string; options: [string,string][]; onChange: (v: string) => void}) {
  return <Select value={value} onValueChange={onChange}><SelectTrigger dir="rtl" aria-label={label} className={`${fieldClass} w-full`}><SelectValue placeholder="اختر" /></SelectTrigger><SelectContent dir="rtl">{options.map(([v,l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent></Select>;
}
function CheckOption({label, checked, onChange}: {label: string; checked: boolean; onChange: () => void}) {
  return <label className="flex cursor-pointer items-center gap-2 text-sm"><Checkbox checked={checked} onCheckedChange={onChange} aria-label={label} />{label}</label>;
}
function NewAdPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<AdForm>(() => emptyAdForm(1));
  const [dirty, setDirty] = useState(false); const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<AdFormErrors>({}); const [preview, setPreview] = useState(false); const [benefit, setBenefit] = useState('');
  useEffect(() => { setForm(emptyAdForm(Math.max(0,...readMockAds().map(a => a.order)) + 1)); }, []);
  const blocker = useBlocker({ shouldBlockFn: () => dirty, withResolver: true, enableBeforeUnload: dirty });
  const patch = (part: Partial<AdForm>) => { setForm(f => ({...f,...part})); setDirty(true); setErrors({}); };
  const detail = (part: Partial<AdDetails>) => { setForm(f => ({...f, details: {...f.details,...part}})); setDirty(true); setErrors({}); };
  const d = form.details;
  const program = AD_PROGRAMS.find(p => p.programId === form.programId);
  const input = (key: 'name'|'cash'|'installments'|'order', label: string, numeric = false, placeholder?: string) => <Input aria-label={label} value={form[key]} type={numeric ? 'number' : 'text'} min={numeric ? 0 : undefined} step={key === 'order' ? 1 : numeric ? 'any' : undefined} placeholder={placeholder} onChange={e => patch({[key]: e.target.value})} className={fieldClass} aria-invalid={!!errors[key]} />;
  const detailInput = (key: 'ageFrom'|'ageTo'|'duration'|'monthly'|'discount'|'tagline'|'startsAt'|'endsAt', label: string, type = 'text') => <Input type={type} aria-label={label} value={d[key]} onChange={e => detail({[key]:e.target.value})} className={fieldClass} min={type === 'number' ? 0 : undefined} max={key === 'discount' ? 100 : undefined} step={type === 'number' ? 'any' : undefined} aria-invalid={!!errors[key]} />;
  function toggleDetail(key: 'visibility'|'badges', value: string) { detail({[key]: d[key].includes(value) ? d[key].filter(x => x !== value) : [...d[key],value]}); }
  function media(key: 'images'|'videos', slot: string, value?: LocalMedia) { const next = {...d[key]}; if (value) next[slot] = value; else delete next[slot]; detail({[key]:next}); }
  function moveBenefit(i: number, dir: number) { const arr = [...d.benefits]; const a = arr[i]; const b = arr[i+dir]; if (a === undefined || b === undefined) return; arr[i] = b; arr[i+dir] = a; detail({benefits:arr}); }
  async function save(publish: boolean) {
    const issues = validateAdForm(form,publish); setErrors(issues);
    if (Object.keys(issues).length) { document.querySelector('[aria-invalid="true"]')?.scrollIntoView({block:'center', behavior:'smooth'}); return; }
    setSaving(true);
    try {
      const ad = createMockAd(form,publish,new Date(),`AD-${crypto.randomUUID()}`);
      writeMockAds(insertMockAd(readMockAds(),ad));
      setDirty(false); toast.success(publish ? 'تم حفظ الإعلان في السجل التجريبي' : 'تم حفظ المسودة في السجل التجريبي');
    } catch { toast.error('تعذر الحفظ المحلي. تحقق من مساحة المتصفح وإمكانية التخزين ثم أعد المحاولة.'); setSaving(false); return; }
  }
  useEffect(() => { if (saving && !dirty) void navigate({to:'/admin/ads'}); }, [saving,dirty,navigate]);
  const adPreview = createMockAd(form,false,new Date(),'preview');
  return <div className="space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground"><div className="flex items-center gap-2"><Link to="/admin/ads" className="hover:text-admin-blue">إدارة الإعلانات</Link><span>/</span><span>إضافة إعلان جديد</span></div><Button asChild variant="outline" className="rounded-xl"><Link to="/admin/ads"><ArrowRight />العودة إلى إدارة الإعلانات</Link></Button></div>
    <div><h1 className="flex items-center gap-3 text-2xl font-extrabold md:text-3xl"><span className="grid h-11 w-11 place-items-center rounded-full bg-admin-blue/10 text-admin-blue"><Plus size={28} /></span>إضافة إعلان جديد</h1><p className="mt-2 text-sm text-muted-foreground">أنشئ إعلانًا تسويقيًا جديدًا وحدد بياناته ووسائطه وإعدادات نشره</p></div>
    <div className="grid min-w-0 items-start gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_minmax(240px,.8fr)]">
      <div className="min-w-0 space-y-4">
        <Section title="البيانات الأساسية" icon={<FileText size={20} />}><div className="space-y-3">
          <Field label="اسم الإعلان" required error={errors.name}>{input('name','اسم الإعلان',false,'حملة دبلوم الموارد البشرية — نوفمبر 2026')}</Field>
          <div className="grid grid-cols-2 gap-3"><Field label="البرنامج التدريبي" required error={errors.programId}><Choice label="البرنامج التدريبي" value={form.programId} options={AD_PROGRAMS.map(p => [p.programId,p.program])} onChange={v => patch({programId:v})} /></Field><Field label="نوع البرنامج"><Input aria-label="نوع البرنامج" readOnly value={program?.type ?? ''} placeholder="حسب البرنامج" className={`${fieldClass} bg-muted`} /></Field></div>
          <Field label="نمط التدريب"><Choice label="نمط التدريب" value={form.mode} options={AD_MODES.map(m => [m,m])} onChange={v => patch({mode:v as TrainingMode, cities: v === 'عن بُعد' ? form.cities : form.cities.filter(c => c !== 'جميع أنحاء المملكة')})} /></Field>
          <Field label="المدينة" required error={errors.cities}><div className="flex flex-wrap gap-x-4 gap-y-2 rounded-lg border border-input p-3">{[...AD_CITIES,...(form.mode === 'عن بُعد' ? ['جميع أنحاء المملكة'] : [])].map(c => <CheckOption key={c} label={c} checked={form.cities.includes(c)} onChange={() => patch({cities: form.cities.includes(c) ? form.cities.filter(x => x !== c) : [...form.cities,c]})} />)}</div></Field>
          <Field label="الفئة المستهدفة"><Choice label="الفئة المستهدفة" value={d.audience} options={['رجال','نساء','الجميع'].map(v => [v,v])} onChange={v => detail({audience:v})} /></Field>
          <div className="grid grid-cols-2 gap-3"><Field label="من عمر" error={errors.ageFrom}>{detailInput('ageFrom','من عمر','number')}</Field><Field label="إلى عمر" error={errors.ageTo}>{detailInput('ageTo','إلى عمر','number')}</Field><Field label="مدة البرنامج" error={errors.duration}>{detailInput('duration','مدة البرنامج','number')}</Field><Field label="وحدة المدة"><Choice label="وحدة المدة" value={d.durationUnit} options={['أيام','أسابيع','أشهر','سنوات'].map(v => [v,v])} onChange={v => detail({durationUnit:v})} /></Field></div>
          <Field label="وصف مختصر"><Textarea aria-label="وصف مختصر" value={d.description} onChange={e => detail({description:e.target.value})} className="min-h-20 rounded-lg text-sm" /></Field>
          <Field label="العبارة التسويقية (اختيارية)">{detailInput('tagline','العبارة التسويقية')}</Field>
        </div></Section>
        <Section title="النصوص التسويقية" icon={<Pencil size={20} />}><div className="space-y-3"><Field label="النص العام للإعلان"><Textarea aria-label="النص العام للإعلان" value={d.marketing} onChange={e => detail({marketing:e.target.value})} className="min-h-24 rounded-lg text-sm" /></Field><Field label="النص الخاص بمنصة X"><Textarea aria-label="النص الخاص بمنصة X" value={d.xText} onChange={e => detail({xText:e.target.value})} className="min-h-20 rounded-lg text-sm" /><p className={`text-xs ${d.xText.length > 257 ? 'text-destructive' : 'text-muted-foreground'}`} dir="ltr">{d.xText.length} / 257</p></Field>
          <Field label="المزايا التسويقية"><div className="space-y-2">{d.benefits.map((b,i) => <div key={i} className="flex items-center gap-1 rounded-lg bg-admin-canvas p-2"><span className="min-w-0 flex-1 break-words text-sm">{b}</span><Button variant="ghost" size="icon" aria-label={`رفع الميزة ${i+1}`} title="تحريك للأعلى" disabled={i===0} onClick={() => moveBenefit(i,-1)}><ChevronUp /></Button><Button variant="ghost" size="icon" aria-label={`خفض الميزة ${i+1}`} title="تحريك للأسفل" disabled={i===d.benefits.length-1} onClick={() => moveBenefit(i,1)}><ChevronDown /></Button><Button variant="ghost" size="icon" aria-label={`حذف الميزة ${i+1}`} title="حذف" onClick={() => detail({benefits:d.benefits.filter((_,j) => i!==j)})}><Trash2 /></Button></div>)}<div className="flex gap-2"><Input aria-label="ميزة جديدة" value={benefit} onChange={e => setBenefit(e.target.value)} className={fieldClass} onKeyDown={e => {if(e.key==='Enter') {e.preventDefault(); if(benefit.trim()) {detail({benefits:[...d.benefits,benefit.trim()]});setBenefit('');}}}} /><Button variant="outline" size="icon" aria-label="إضافة ميزة" title="إضافة ميزة" disabled={!benefit.trim()} onClick={() => {detail({benefits:[...d.benefits,benefit.trim()]});setBenefit('');}}><Plus /></Button></div></div></Field>
        </div></Section>
      </div>
      <div className="min-w-0 space-y-4">
        <Section title="الرسوم الدراسية" icon={<Coins size={20} />}><div className="grid grid-cols-2 gap-3"><Field label="رسوم الكاش (ريال)" required error={errors.cash}>{input('cash','رسوم الكاش',true)}</Field><Field label="نسبة الخصم (%)" error={errors.discount}>{detailInput('discount','نسبة الخصم','number')}</Field><div className="col-span-2"><CheckOption label="إتاحة خيار الأقساط" checked={d.installmentsEnabled} onChange={() => detail({installmentsEnabled:!d.installmentsEnabled})} /></div>{d.installmentsEnabled && <><Field label="رسوم الأقساط (ريال)" error={errors.installments}>{input('installments','رسوم الأقساط',true)}</Field><Field label="القسط الشهري (ريال)" error={errors.monthly}>{detailInput('monthly','القسط الشهري','number')}</Field></>}</div></Section>
        <Section title="صور الإعلان" icon={<ImageIcon size={20} />}><div className="grid grid-cols-2 gap-3">{[['square','الصورة المربعة 1:1','1080 × 1080',1],['portrait','الصورة العمودية 9:16','1080 × 1920',9/16],['x','صورة منصة X','1200 × 628',1200/628],['a5','صورة A5','148 × 210',148/210]].map(([slot,label,size,ratio]) => <AdMediaField key={slot} label={String(label)} preferred={String(size)} ratio={Number(ratio)} value={d.images[String(slot)]} onChange={v => media('images',String(slot),v)} error={errors[String(slot)]} />)}</div><p className="mt-3 text-xs text-muted-foreground">JPG / PNG / WebP · حتى 10 ميجابايت للصورة</p></Section>
        <Section title="فيديوهات الإعلان" icon={<Video size={20} />}><div className="grid grid-cols-2 gap-3"><AdMediaField label="فيديو خاص" preferred="9:16" ratio={9/16} video value={d.videos.private} onChange={v => media('videos','private',v)} /><AdMediaField label="فيديو عام" preferred="16:9" ratio={16/9} video value={d.videos.public} onChange={v => media('videos','public',v)} /></div><p className="mt-3 text-xs text-muted-foreground">MP4 / WebM · حتى 100 ميجابايت للفيديو</p></Section>
        <Section title="إعدادات النشر والظهور" icon={<CalendarDays size={20} />}><div className="space-y-3"><div className="grid grid-cols-2 gap-3"><Field label="حالة الإعلان"><Choice label="حالة الإعلان" value={form.status} options={Object.entries(AD_STATUS_LABEL)} onChange={v => patch({status:v as AdStatus})} /></Field><Field label="ترتيب العرض" error={errors.order}>{input('order','ترتيب العرض',true)}</Field><Field label="تاريخ بداية النشر">{detailInput('startsAt','تاريخ بداية النشر','datetime-local')}</Field><Field label="تاريخ نهاية النشر" error={errors.endsAt}>{detailInput('endsAt','تاريخ نهاية النشر','datetime-local')}</Field></div><Field label="أماكن ظهور الإعلان"><div className="space-y-2">{([['listing','إظهار في صفحة نشر الإعلانات'],['quick','متاح في النشر السريع'],['pro','متاح في النشر الاحترافي']] as const).map(([v,l]) => <CheckOption key={v} label={l} checked={d.visibility.includes(v)} onChange={() => toggleDetail('visibility',v)} />)}</div></Field><Field label="شارات الإعلان"><div className="flex flex-wrap gap-4">{['جديد','الأكثر طلبًا','خصم'].map(v => <CheckOption key={v} label={v} checked={d.badges.includes(v)} onChange={() => toggleDetail('badges',v)} />)}</div></Field></div></Section>
      </div>
      <aside className="min-w-0 xl:sticky xl:top-24"><Section title="معاينة الإعلان" icon={<Eye size={20} />}><AdPreview ad={adPreview} /></Section></aside>
    </div>
    <p className="text-xs text-muted-foreground">حفظ تجريبي محلي فقط؛ الصور والفيديوهات لم تُرفع إلى خادم، وقد تحتاج إلى إعادة اختيارها بعد تحديث الصفحة أو إعادة فتح المتصفح.</p>
    <div className="flex flex-wrap gap-2 border-t border-border pt-4"><Button disabled={saving} onClick={() => void save(true)} className="rounded-lg bg-admin-blue font-bold text-primary-foreground hover:bg-admin-blue/90"><Send />حفظ ونشر</Button><Button variant="outline" onClick={() => setPreview(true)}><Eye />معاينة الإعلان</Button><Button variant="outline" disabled={saving} onClick={() => void save(false)}><Save />حفظ كمسودة</Button><Button variant="outline" onClick={() => void navigate({to:'/admin/ads'})}><X />إلغاء</Button></div>
    <Dialog open={preview} onOpenChange={setPreview}><DialogContent dir="rtl" className="max-h-[85vh] max-w-2xl overflow-y-auto text-right"><DialogHeader><DialogTitle className="pe-8 text-right">معاينة الإعلان</DialogTitle><DialogDescription className="text-right">معاينة محلية قبل الحفظ</DialogDescription></DialogHeader><div className="mx-auto w-full max-w-md"><AdPreview ad={adPreview} /></div></DialogContent></Dialog>
    <Dialog open={blocker.status==='blocked'} onOpenChange={open => {if(!open && blocker.status==='blocked') blocker.reset();}}><DialogContent dir="rtl" className="text-right"><DialogHeader><DialogTitle className="pe-8 text-right">تعديلات غير محفوظة</DialogTitle><DialogDescription className="text-right">هل تريد مغادرة الصفحة دون حفظ تعديلات الإعلان؟</DialogDescription></DialogHeader><div className="flex flex-wrap gap-2"><Button variant="destructive" onClick={() => {if(blocker.status==='blocked') blocker.proceed();}}>مغادرة دون حفظ</Button><Button variant="outline" onClick={() => {if(blocker.status==='blocked') blocker.reset();}}>متابعة التحرير</Button></div></DialogContent></Dialog>
  </div>;
}