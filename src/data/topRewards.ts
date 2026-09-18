import firstPrizeImage from "@/assets/top-rewards/1st-win.png.asset.json";
import secondPrizeImage from "@/assets/top-rewards/2nd-win.png.asset.json";
import thirdPrizeImage from "@/assets/top-rewards/3rd-win.png.asset.json";

export type TopReward = {
  rank: 1 | 2 | 3;
  imageUrl: string;
  imageAlt: string;
};

export const TOP_REWARDS: TopReward[] = [
  {
    rank: 1,
    imageUrl: firstPrizeImage.url,
    imageAlt: "جائزة المركز الأول الذهبية",
  },
  {
    rank: 2,
    imageUrl: secondPrizeImage.url,
    imageAlt: "جائزة المركز الثاني الفضية",
  },
  {
    rank: 3,
    imageUrl: thirdPrizeImage.url,
    imageAlt: "جائزة المركز الثالث البرونزية",
  },
];

export const TOP_REWARDS_NOTE = "يمكنك الاستفادة من الدبلوم لك شخصيًا أو إهداؤه لمن تحب.";