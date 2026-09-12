/**
 * بيانات تجريبية (Mock) لصفحة "النشر الاحترافي"
 * تُستخدم حاليًا لوضع الهيكل البصري فقط، ويمكن استبدالها لاحقًا ببيانات حقيقية.
 */
import mainAdImageAsset from "@/assets/landing/HR-diploma-ad.jpg.asset.json";
import portraitAdAsset from "@/assets/ad-portrait.jpg.asset.json";
import squareAdAsset from "@/assets/landing/HR-diploma-1to1.png.asset.json";
import wideAdAsset from "@/assets/ad-square.png.asset.json";
import hrDiplomaVideoAsset from "@/assets/vid-hr-diploma.mp4.asset.json";

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

export interface ReferralLink {
  id: string;
  title: string;
  value: string;
}

export interface AdDownloadSize {
  id: string;
  platform: string;
  title: string;
  width: number;
  height: number;
  aspectRatio: string;
  description: string;
  previewImage: string;
  fileUrl: string;
}

export interface VideoDownload {
  id: string;
  title: string;
  duration: string;
  width: number;
  height: number;
  aspectRatio: string;
  description: string;
  previewImage: string;
  fileUrl: string;
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

export const referralLinks: ReferralLink[] = [
  {
    id: "referral-link",
    title: "رابط الإحالة",
    value: "https://mukafaty.com/ad/hr-diploma?ref=ahmed2487",
  },
  {
    id: "referral-link-short",
    title: "رابط الإحالة (مختصر)",
    value: "https://mukafaty.com/ad/r/",
  },
  {
    id: "discount-code",
    title: "كود الخصم",
    value: "AHMED15",
  },
];

export const adDownloadSizes: AdDownloadSize[] = [
  {
    id: "size-9-16",
    platform: "9:16",
    title: "9:16",
    width: 1080,
    height: 1920,
    aspectRatio: "9:16",
    description: "مناسب\nسناب شات\nتيك توك",
    previewImage: portraitAdAsset.url,
    fileUrl: portraitAdAsset.url,
  },
  {
    id: "size-1-1",
    platform: "1:1",
    title: "1:1",
    width: 1080,
    height: 1080,
    aspectRatio: "1:1",
    description: "مناسب\nإنستغرام\nفيسبوك",
    previewImage: squareAdAsset.url,
    fileUrl: squareAdAsset.url,
  },
  {
    id: "size-x",
    platform: "X",
    title: "X",
    width: 1200,
    height: 628,
    aspectRatio: "1.91:1",
    description: "مناسب لمنصة X",
    previewImage: wideAdAsset.url,
    fileUrl: wideAdAsset.url,
  },
  {
    id: "size-a5",
    platform: "A5",
    title: "A5",
    width: 148,
    height: 210,
    aspectRatio: "148:210",
    description: "مناسب\nواتساب\nتيليجرام",
    previewImage: portraitAdAsset.url,
    fileUrl: portraitAdAsset.url,
  },
];

export const videoDownloads: VideoDownload[] = [
  {
    id: "video-private",
    title: "فيديو خاص",
    duration: "00:45",
    width: 1920,
    height: 1080,
    aspectRatio: "16:9",
    description: "مناسب لجميع المنصات",
    previewImage: portraitAdAsset.url,
    fileUrl: hrDiplomaVideoAsset.url,
  },
  {
    id: "video-public",
    title: "فيديو عام",
    duration: "02:30",
    width: 1080,
    height: 1920,
    aspectRatio: "9:16",
    description: "مقطع تعريفي عن برامج إدارة الموارد البشرية",
    previewImage: mainAdImageAsset.url,
    fileUrl: hrDiplomaVideoAsset.url,
  },
];
