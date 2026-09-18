export type TopReward = {
  rank: 1 | 2 | 3;
  title: string;
  amount: number;
  benefit: string;
  threshold: number;
  condition: string;
  tone: "gold" | "silver" | "bronze";
};

export const TOP_REWARDS: TopReward[] = [
  {
    rank: 1,
    title: "المركز الأول",
    amount: 3000,
    benefit: "دبلوم تدريبي مجانًا",
    threshold: 10000,
    condition: "عند وصول مكافآتك إلى 10,000 ريال",
    tone: "gold",
  },
  {
    rank: 2,
    title: "المركز الثاني",
    amount: 2000,
    benefit: "دبلوم تدريبي مجانًا",
    threshold: 9000,
    condition: "عند وصول مكافآتك إلى 9,000 ريال",
    tone: "silver",
  },
  {
    rank: 3,
    title: "المركز الثالث",
    amount: 1000,
    benefit: "دبلوم تدريبي مجانًا",
    threshold: 8000,
    condition: "عند وصول مكافآتك إلى 8,000 ريال",
    tone: "bronze",
  },
];

export const TOP_REWARDS_NOTE = "يمكنك الاستفادة من الدبلوم لك شخصيًا أو إهداؤه لمن تحب.";