import assert from "node:assert/strict";
import { test } from "node:test";
import {
  quickShareAd,
  quickSharePageAd,
  quickSharePageShortLink,
  quickShareDisplayedReward,
} from "./quickShareAd";
import { buildPlatformReferralLink, buildShareText } from "../lib/shareAd";

test("quick-share HR program uses the requested mock details", () => {
  assert.equal(quickSharePageAd.title, "دبلوم إدارة الموارد البشرية عن بُعد");
  assert.equal(quickSharePageAd.trainingMode, "عن بُعد");
  assert.equal(quickSharePageAd.location, "جميع أنحاء المملكة");
  assert.equal(quickSharePageAd.targetAudience, "الرجال والنساء");
  assert.equal(quickSharePageAd.cashFee, 8055);
});

test("reward rounds to 403 only for display and retains 5% precision", () => {
  assert.equal(quickSharePageAd.rewardPerRegistration, 402.75);
  assert.equal(quickSharePageAd.rewardPerRegistration, quickSharePageAd.cashFee * 0.05);
  assert.equal(quickShareDisplayedReward(quickSharePageAd.rewardPerRegistration), 403);
  assert.equal(quickShareDisplayedReward(537.75), 538);
});

test("new portrait is scoped to quick-share only", () => {
  assert.match(quickSharePageAd.imagePortraitUrl, /\/hr-ad2\.jpg$/);
  assert.notEqual(quickSharePageAd.imagePortraitUrl, quickShareAd.imagePortraitUrl);
  assert.equal(quickSharePageAd.imageSquareUrl, quickShareAd.imageSquareUrl);
  assert.equal(quickShareAd.location, "جميع مدن المملكة");
});

test("mock short link never replaces the full referral link or tracking", () => {
  assert.equal(quickSharePageShortLink, "https://m.k/4xK8mQ");
  assert.equal(quickSharePageAd.baseReferralLink, "https://mukafaty.com/ad/hr-diploma?ref=mk0001");
  assert.equal(buildPlatformReferralLink(quickSharePageAd.baseReferralLink, "whatsapp"),
    "https://mukafaty.com/ad/hr-diploma?ref=mk0001&platform=whatsapp");
  assert.equal(buildShareText(quickSharePageAd, "telegram").includes(quickSharePageShortLink), false);
});