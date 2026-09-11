/**
 * بيانات تجريبية (Mock) لصفحة "النشر الاحترافي"
 * تُستخدم حاليًا لوضع الهيكل البصري فقط، ويمكن استبدالها لاحقًا ببيانات حقيقية.
 */
import mainAdImageAsset from "@/assets/landing/HR-diploma-ad.jpg.asset.json";

export interface ProShareData {
  programName: string;
  location: string;
  targetAudience: string;
  ageRange: string;
  cashFee: string;
  commission: string;
  marketingText: string;
  xText: string;
  mainAdImage: string;
}

export const professionalShareData: ProShareData = {
  programName: "دبلوم إدارة الموارد البشرية عن بُعد",
  location: "جميع أنحاء المملكة",
  targetAudience: "رجال",
  ageRange: "18 إلى 40 عام",
  cashFee: "9,500 ريال",
  commission: "475 ريال",
  marketingText:
    "يسرنا استقبال المهتمين بـ دبلوم إدارة الموارد البشرية عن بُعد.\n\n" +
    "احصل على شهادة معتمدة، وتعلم من نخبة من الخبراء، مع محتوى تدريبي متطور يلبي احتياجات سوق العمل.\n\n" +
    "✓ الدراسة عن بُعد وفي أي مكان في المملكة\n" +
    "✓ شهادة معتمدة\n" +
    "✓ أقساط شهرية ميسرة\n" +
    "✓ استخدم كود الخصم AHMED15 للحصول على خصم خاص",
  xText:
    "دبلوم إدارة الموارد البشرية عن بُعد\n" +
    "شهادة معتمدة + تدريب متطور + فرصة مميزة للتعلم من أي مكان في المملكة.\n" +
    "استخدم كود الخصم: AHMED15\n" +
    "mharatcom.com/r/ahmed2487",
  mainAdImage: mainAdImageAsset.url,
};
