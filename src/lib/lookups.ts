/**
 * مصادر البيانات (Lookups) الخاصة بصفحة إعدادات الحساب.
 *
 * كل الدوال هنا غير متزامنة (async) وتُرجع نفس الشكل الذي ستُرجعه قاعدة البيانات
 * لاحقًا: { id, name, isActive }. عند ربط قاعدة البيانات يكفي استبدال محتوى
 * الدوال باستعلام فعلي دون أي تعديل على تصميم الصفحة أو مكوناتها.
 */

export type LookupItem = {
  id: string;
  name: string;
  isActive: boolean;
};

const ISO_COUNTRY_CODES = [
  "AD","AE","AF","AG","AI","AL","AM","AO","AQ","AR","AS","AT","AU","AW","AX","AZ",
  "BA","BB","BD","BE","BF","BG","BH","BI","BJ","BL","BM","BN","BO","BQ","BR","BS",
  "BT","BW","BY","BZ","CA","CC","CD","CF","CG","CH","CI","CK","CL","CM","CN","CO",
  "CR","CU","CV","CW","CX","CY","CZ","DE","DJ","DK","DM","DO","DZ","EC","EE","EG",
  "EH","ER","ES","ET","FI","FJ","FK","FM","FO","FR","GA","GB","GD","GE","GF","GG",
  "GH","GI","GL","GM","GN","GP","GQ","GR","GT","GU","GW","GY","HK","HN","HR","HT",
  "HU","ID","IE","IL","IM","IN","IO","IQ","IR","IS","IT","JE","JM","JO","JP","KE",
  "KG","KH","KI","KM","KN","KP","KR","KW","KY","KZ","LA","LB","LC","LI","LK","LR",
  "LS","LT","LU","LV","LY","MA","MC","MD","ME","MF","MG","MH","MK","ML","MM","MN",
  "MO","MP","MQ","MR","MS","MT","MU","MV","MW","MX","MY","MZ","NA","NC","NE","NF",
  "NG","NI","NL","NO","NP","NR","NU","NZ","OM","PA","PE","PF","PG","PH","PK","PL",
  "PM","PN","PR","PS","PT","PW","PY","QA","RE","RO","RS","RU","RW","SA","SB","SC",
  "SD","SE","SG","SH","SI","SJ","SK","SL","SM","SN","SO","SR","SS","ST","SV","SX",
  "SY","SZ","TC","TD","TG","TH","TJ","TK","TL","TM","TN","TO","TR","TT","TV","TW",
  "TZ","UA","UG","US","UY","UZ","VA","VC","VE","VG","VI","VN","VU","WF","WS","YE",
  "YT","ZA","ZM","ZW",
];

/** جميع دول العالم بالأسماء العربية. */
export async function fetchNationalities(): Promise<LookupItem[]> {
  let display: Intl.DisplayNames | null = null;
  try {
    display = new Intl.DisplayNames(["ar"], { type: "region" });
  } catch {
    display = null;
  }

  const items = ISO_COUNTRY_CODES.map((code) => ({
    id: code,
    name: display?.of(code) ?? code,
    isActive: true,
  }));

  return items.sort((a, b) => a.name.localeCompare(b.name, "ar"));
}

/** المدن — قابلة للإدارة من لوحة الإدارة مستقبلًا. */
export async function fetchCities(): Promise<LookupItem[]> {
  return [
    "الرياض","جدة","مكة المكرمة","المدينة المنورة","الدمام","الخبر","الظهران","الطائف",
    "بريدة","عنيزة","تبوك","حائل","أبها","خميس مشيط","نجران","جازان","الباحة","عرعر",
    "سكاكا","ينبع","الجبيل","الأحساء","القطيف","الخرج","حفر الباطن","القريات","رابغ","بيشة",
  ].map((name, index) => ({ id: `city-${index + 1}`, name, isActive: true }));
}

/** وسيلة المعرفة — قابلة للإدارة من لوحة الإدارة مستقبلًا. */
export async function fetchReferralSources(): Promise<LookupItem[]> {
  return [
    "فيسبوك","واتساب","X","سناب شات","تيك توك","يوتيوب","جوجل","إعلان","صديق","أخرى",
  ].map((name, index) => ({ id: `source-${index + 1}`, name, isActive: true }));
}

/** البنوك — قابلة للإضافة/التعديل/التعطيل من لوحة الإدارة مستقبلًا. */
export async function fetchBanks(): Promise<LookupItem[]> {
  return [
    "مصرف الراجحي","البنك الأهلي السعودي","بنك الرياض","البنك السعودي الفرنسي",
    "البنك السعودي البريطاني (ساب)","بنك البلاد","بنك الجزيرة","البنك العربي الوطني",
    "مصرف الإنماء","البنك السعودي الأول","بنك الخليج الدولي","بنك الإمارات دبي الوطني",
  ].map((name, index) => ({ id: `bank-${index + 1}`, name, isActive: true }));
}
