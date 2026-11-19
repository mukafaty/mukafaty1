import { CalendarDays, Users, Monitor, Check } from 'lucide-react';
import type { AdRecord } from '@/data/adminAds';
export function AdPreview({ ad }: { ad: AdRecord }) {
  const d = ad.details;
  const money = (v: number) => `${v.toLocaleString('en-US')} ريال`;
  return <div className="space-y-4 text-sm">
    <div className="relative overflow-hidden rounded-xl bg-admin-canvas">
      {ad.image ? <img src={ad.image} alt={ad.name} className="aspect-square w-full object-contain" /> : <div className="grid aspect-square place-items-center text-muted-foreground">لم تُحدد صورة رئيسية</div>}
      <div className="absolute inset-x-3 top-3 flex flex-wrap gap-2">{d?.badges.map(b => <span key={b} className="rounded-full bg-admin-red px-3 py-1 font-bold text-primary-foreground">{b === 'خصم' ? `خصم ${d.discount}%` : b}</span>)}</div>
    </div>
    <h3 className="text-lg font-extrabold">{ad.name}</h3><p className="font-bold text-admin-blue">{ad.program}</p>
    <div className="grid grid-cols-3 gap-2 text-center text-xs"><div><Users className="mx-auto mb-1 text-admin-blue" />{d?.audience ?? 'الجميع'}</div><div><Monitor className="mx-auto mb-1 text-admin-blue" />{ad.mode}</div><div><CalendarDays className="mx-auto mb-1 text-admin-blue" />{d?.duration ? `${d.duration} ${d.durationUnit}` : ad.type}</div></div>
    <p>{ad.cities.join('، ') || 'لم تُحدد المدن'} · {ad.type}</p>
    {(d?.ageFrom || d?.ageTo) && <p>الفئة العمرية: {d.ageFrom || '—'} إلى {d.ageTo || '—'} سنة</p>}
    <div className="grid grid-cols-2 gap-2"><div className="rounded-lg bg-admin-sidebar p-3 text-center">رسوم الكاش<strong className="mt-1 block text-lg">{money(ad.cash)}</strong></div>{(!d || d.installmentsEnabled) && <div className="rounded-lg bg-admin-sidebar p-3 text-center">رسوم الأقساط<strong className="mt-1 block text-lg">{money(ad.installments)}</strong></div>}</div>
    {d?.monthly && <p className="rounded-lg bg-admin-amber/15 p-2 text-center font-bold">أقساط شهرية تبدأ من {money(Number(d.monthly))}</p>}
    {d?.tagline && <p className="font-bold">{d.tagline}</p>}<p className="whitespace-pre-wrap break-words">{d?.description}</p>
    {d?.benefits.map((b,i) => <p key={i} className="flex items-center gap-2"><Check size={16} className="text-admin-blue" />{b}</p>)}
    {d?.marketing && <p className="whitespace-pre-wrap break-words border-t border-border pt-3">{d.marketing}</p>}
  </div>;
}