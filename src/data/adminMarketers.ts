import { z } from "zod";

export const MARKETER_REWARD_RATE = 0.05;
export const marketerCities = ["جدة", "مكة المكرمة", "الرياض", "ينبع"];
export const socialPlatforms = ["Instagram", "X", "Facebook", "Snapchat", "TikTok", "YouTube", "LinkedIn", "الموقع الشخصي"] as const;
export const marketerSchema = z.object({
  id: z.string(), firstName: z.string(), lastName: z.string(), phone: z.string(), email: z.string(),
  gender: z.enum(["ذكر", "أنثى"]), city: z.string(), date: z.string(), status: z.enum(["active", "pending", "suspended"]),
  birthDate: z.string(), nationality: z.string(), source: z.string(), photo: z.string(),
  username: z.string(), demoPassword: z.string(), paymentMethod: z.enum(["bank", "cash"]),
  beneficiary: z.string(), bank: z.string(), iban: z.string(), ibanConfirm: z.string(),
  links: z.record(z.string()), referralCode: z.string(), referralLink: z.string(), notes: z.string(),
  interests: z.number().nonnegative(), trainees: z.number().nonnegative(), paidSales: z.number().nonnegative(), withdrawn: z.number().nonnegative(),
});
export type Marketer = z.infer<typeof marketerSchema>;
export type Status = Marketer["status"];
export const marketerName = (m: Marketer) => `${m.firstName} ${m.lastName}`;
export const statusMap: Record<Status, { label: string; cls: string }> = {
  active: { label: "نشط", cls: "bg-admin-green/10 text-admin-green" },
  pending: { label: "بانتظار التفعيل", cls: "bg-admin-amber/15 text-admin-amber" },
  suspended: { label: "موقوف", cls: "bg-admin-red/10 text-admin-red" },
};
export function buildMarketers(): Marketer[] {
  const males = ["محمد العتيبي", "عبدالله الحربي", "خالد الغامدي", "فهد القحطاني", "سعد الزهراني", "عمر الشهري", "ياسر المطيري", "نايف الدوسري", "بندر السبيعي", "ماجد الشمري"];
  const females = ["نورة العنزي", "سارة المالكي", "ريم الجهني", "هيا البقمي", "لمى الرشيدي", "أمل الثبيتي", "منى الحارثي", "دانة السلمي", "جود العمري", "رهف اليامي"];
  const emailNames = ["m.otaibi", "a.harbi", "k.ghamdi", "f.qahtani", "s.zahrani", "o.shehri", "y.mutairi", "n.dosari", "b.subaie", "m.shammari"];
  return Array.from({ length: 286 }, (_, i) => {
    const female = i % 3 === 1;
    const [firstName = "محمد", lastName = "العتيبي"] = ((female ? females : males)[(i * 7) % 10] ?? "محمد العتيبي").split(" ");
    const id = `MK${String(i + 1).padStart(4, "0")}`;
    const username = `demo.marketer${i + 1}`;
    const iban = `SA12${String(80000000000000000000n + BigInt(i)).padStart(20, "0")}`;
    return {
      id, firstName, lastName, phone: `05${String(50000000 + ((i * 7919) % 49999999)).padStart(8, "0")}`,
      email: `${female ? "user" : emailNames[i % 10]}${i + 1}@mail.com`, gender: female ? "أنثى" : "ذكر", city: marketerCities[(i * 5) % 4] ?? "جدة",
      date: new Date(Date.UTC(2026, 0, 1) + i * 0.9 * 86400000).toISOString().slice(0, 10),
      status: i % 22 === 5 ? "suspended" : i % 9 === 4 ? "pending" : "active",
      birthDate: `${1992 + i % 10}-05-15`, nationality: "المملكة العربية السعودية", source: "إعلان في وسائل التواصل",
      photo: "", username, demoPassword: `DemoOnly-${i + 1}`, paymentMethod: "bank", beneficiary: `${firstName} ${lastName}`,
      bank: "مصرف الراجحي", iban, ibanConfirm: iban,
      links: Object.fromEntries(socialPlatforms.map(p => [p, ""])), referralCode: id, referralLink: "", notes: "",
      interests: 32 + (i * 17) % 100, trainees: 13 + i % 20, paidSales: 33600 + i * 1200, withdrawn: i % 4 * 300,
    };
  });
}
export function marketerStats(m: Marketer) {
  const rewards = Math.round(m.paidSales * MARKETER_REWARD_RATE * 100) / 100;
  return { interests: m.interests, trainees: m.trainees, sales: m.paidSales, rewards, withdrawn: m.withdrawn, available: Math.round((rewards - m.withdrawn) * 100) / 100 };
}
export function validateMarketer(m: Marketer): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const key of ["firstName", "lastName", "city", "nationality", "birthDate", "username", "demoPassword"] as const) {
    if (!m[key].trim()) errors[key] = "هذا الحقل مطلوب";
  }
  if (!/^05\d{8}$/.test(m.phone)) errors['phone'] = "أدخل رقم جوال صحيحًا يبدأ بـ05 ويتكون من 10 أرقام";
  if (!z.string().email().safeParse(m.email).success) errors['email'] = "أدخل بريدًا إلكترونيًا صحيحًا";
  if (m.birthDate && (!/^\d{4}-\d{2}-\d{2}$/.test(m.birthDate) || m.birthDate >= new Date().toISOString().slice(0, 10))) errors['birthDate'] = "أدخل تاريخ ميلاد صحيحًا";
  if (m.paymentMethod === "bank") {
    if (!m.beneficiary.trim()) errors['beneficiary'] = "اسم المستفيد مطلوب";
    if (!m.bank.trim()) errors['bank'] = "اسم البنك مطلوب";
    const iban = m.iban.replace(/\s/g, "").toUpperCase();
    if (!/^SA\d{22}$/.test(iban)) errors['iban'] = "أدخل آيبان سعوديًا من 24 خانة";
    if (iban !== m.ibanConfirm.replace(/\s/g, "").toUpperCase()) errors['ibanConfirm'] = "رقما الآيبان غير متطابقين";
  }
  for (const [platform, value] of Object.entries(m.links)) {
    if (value && !/^https?:\/\//i.test(value)) errors[platform] = "أدخل رابطًا يبدأ بـhttps:// أو http://";
    else if (value) { try { new URL(value); } catch { errors[platform] = "أدخل رابطًا صحيحًا"; } }
  }
  return errors;
}
export function updateMarketer(records: Marketer[], id: string, draft: Marketer) {
  return records.map(m => m.id === id ? { ...draft, id: m.id, status: m.status, date: m.date, interests: m.interests, trainees: m.trainees, paidSales: m.paidSales, withdrawn: m.withdrawn } : m);
}
export function toggleMembership(records: Marketer[], id: string) {
  return records.map(m => m.id === id ? { ...m, status: m.status === "active" ? "suspended" as const : "active" as const } : m);
}