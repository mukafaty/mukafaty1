import { AD_PROGRAMS, type AdRecord, type AdDetails, type AdStatus } from './adminAds';

// Central platform setting; never editable per ad. No financial operations in this mock.
export const PLATFORM_REWARD_RATE = 0.05;
export type AdForm = {
  name: string; programId: string; mode: AdRecord['mode']; cities: string[];
  cash: string; installments: string; status: AdStatus; order: string; details: AdDetails;
};
export type AdFormErrors = Partial<Record<'name'|'programId'|'cities'|'cash'|'installments'|'monthly'|'square'|'discount'|'ageFrom'|'ageTo'|'duration'|'order'|'endsAt', string>> & Record<string,string | undefined>;
export function emptyAdForm(order: number): AdForm {
  return { name: '', programId: '', mode: 'حضوري', cities: [], cash: '', installments: '', status: 'draft', order: String(order), details: {
    audience: 'الجميع', ageFrom: '', ageTo: '', duration: '', durationUnit: 'أشهر', description: '', tagline: '',
    installmentsEnabled: true, monthly: '', discount: '', images: {}, videos: {}, marketing: '', xText: '', benefits: [],
    startsAt: '', endsAt: '', visibility: ['listing', 'quick', 'pro'], badges: [],
  }};
}
export function validateAdForm(f: AdForm, publish: boolean) {
  const e: AdFormErrors = {};
  if (publish) {
    if (!f.name.trim()) e.name = 'أدخل اسم الإعلان';
    if (!AD_PROGRAMS.some(p => p.programId === f.programId)) e.programId = 'اختر البرنامج التدريبي';
    if (!f.cities.length) e.cities = 'اختر مدينة واحدة على الأقل';
    if (!f.cash) e.cash = 'أدخل رسوم الكاش';
    if (f.details.installmentsEnabled && !f.installments) e.installments = 'أدخل رسوم الأقساط أو عطّلها';
    if (!f.details.images.square?.url) e.square = 'الصورة المربعة إلزامية قبل النشر';
  }
  for (const [key, value] of [['cash', f.cash], ['installments', f.details.installmentsEnabled ? f.installments : ''], ['monthly', f.details.installmentsEnabled ? f.details.monthly : '']] as const) {
    if (value !== '' && (!Number.isFinite(Number(value)) || Number(value) <= 0)) e[key] = 'أدخل مبلغًا موجبًا';
  }
  const d = f.details;
  if (d.discount && (!Number.isFinite(Number(d.discount)) || Number(d.discount) < 0 || Number(d.discount) > 100)) e.discount = 'نسبة الخصم من 0 إلى 100%';
  for (const key of ['ageFrom', 'ageTo', 'duration'] as const) if (d[key] && (!Number.isFinite(Number(d[key])) || Number(d[key]) < (key === 'duration' ? 1 : 0))) e[key] = 'أدخل قيمة صحيحة';
  if (d.ageFrom && d.ageTo && Number(d.ageTo) < Number(d.ageFrom)) e.ageTo = 'العمر الأعلى يجب ألا يقل عن العمر الأدنى';
  if (!Number.isInteger(Number(f.order)) || Number(f.order) < 1) e.order = 'أدخل ترتيبًا صحيحًا يبدأ من 1';
  if (d.startsAt && d.endsAt && new Date(d.endsAt) < new Date(d.startsAt)) e.endsAt = 'نهاية النشر يجب ألا تسبق بدايته';
  return e;
}
export function createMockAd(f: AdForm, publish: boolean, now: Date, id: string): AdRecord {
  const p = AD_PROGRAMS.find(p => p.programId === f.programId);
  const status: AdStatus = !publish ? 'draft' : f.details.startsAt && new Date(f.details.startsAt) > now ? 'scheduled' : f.status === 'paused' ? 'paused' : 'active';
  return { id, name: f.name.trim() || 'إعلان غير مكتمل', programId: f.programId, program: p?.program ?? 'غير محدد', type: p?.type ?? 'دبلوم',
    mode: f.mode, cities: [...f.cities], cash: Number(f.cash), installments: f.details.installmentsEnabled ? Number(f.installments) : 0,
    image: f.details.images.square?.url ?? '', createdAt: now, status, order: Number(f.order),
    details: { ...f.details, monthly: f.details.installmentsEnabled ? f.details.monthly : '', badges: f.details.badges.filter(b => b !== 'خصم' || Number(f.details.discount) > 0) } };
}
export function insertMockAd(ads: AdRecord[], ad: AdRecord) {
  const sorted = [...ads].sort((a,b) => a.order - b.order);
  sorted.splice(Math.min(ad.order - 1, sorted.length), 0, ad);
  return sorted.map((a,i) => ({ ...a, order: i + 1 }));
}
export function validateMediaFile(file: {type: string; size: number}, video: boolean) {
  const types = video ? ['video/mp4', 'video/webm'] : ['image/jpeg', 'image/png', 'image/webp'];
  if (!types.includes(file.type)) return video ? 'اختر فيديو MP4 أو WebM' : 'اختر صورة JPG أو PNG أو WebP';
  if (file.size > (video ? 100 : 10) * 1024 * 1024) return video ? 'الحد الأقصى للفيديو 100 ميجابايت' : 'الحد الأقصى للصورة 10 ميجابايت';
  if (!file.size) return 'الملف فارغ';
  return '';
}