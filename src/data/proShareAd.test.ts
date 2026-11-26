import assert from "node:assert/strict";
import { test } from "node:test";
import {
  professionalShareData,
  proSharePageShortLink,
  proShareContent,
  referralLinks,
  videoDownloads,
} from "./proShareAd";
import { platformText, platformLink } from "../lib/proShareLaunch";
import { buildPlatformReferralLink } from "../lib/shareAd";

const FULL_REFERRAL_LINK = "https://mukafaty.com/ad/hr-diploma?ref=mk0001";

test("pro-share main ad image is the new portrait asset", () => {
  assert.match(professionalShareData.mainAdImage, /\/hr-ad2-pro\.jpg$/);
  assert.notEqual(
    professionalShareData.mainAdImage,
    videoDownloads[1]!.previewImage,
    "video preview must keep its own image",
  );
});

test("reward per registration is shown as a whole number without decimals", () => {
  assert.equal(professionalShareData.commission, "403 ريال");
  assert.equal(/\d*\.\d/.test(professionalShareData.commission), false);
});

test("mock short link is the only short link shown, with no placeholder left", () => {
  assert.equal(proSharePageShortLink, "https://m.k/4xK8mQ");

  const shortLinkRow = referralLinks.find((link) => link.id === "referral-link-short");
  assert.equal(shortLinkRow?.value, "https://m.k/4xK8mQ");

  assert.equal(professionalShareData.xText.includes("{SHORT_LINK}"), false);
  assert.equal(professionalShareData.xText.includes("https://m.k/4xK8mQ"), true);
  assert.equal(professionalShareData.marketingText.includes("mukafaty.com"), false);
});

test("full referral link and per-platform tracking stay untouched", () => {
  assert.equal(referralLinks[0]!.value, FULL_REFERRAL_LINK);
  assert.equal(proShareContent.referralUrl, FULL_REFERRAL_LINK);
  assert.equal(proShareContent.landingUrl, FULL_REFERRAL_LINK);
  assert.equal(
    buildPlatformReferralLink(FULL_REFERRAL_LINK, "whatsapp"),
    "https://mukafaty.com/ad/hr-diploma?ref=mk0001&platform=whatsapp",
  );
  assert.equal(
    platformLink(proShareContent, "x"),
    "https://mukafaty.com/ad/hr-diploma?ref=mk0001&platform=x",
  );
});

test("shared texts keep the full tracked link and never expose the mock short link as tracking", () => {
  const xShare = platformText(proShareContent, "x");
  assert.equal(xShare.includes("https://m.k/4xK8mQ"), true);
  assert.equal(xShare.includes("https://mukafaty.com/ad/hr-diploma?ref=mk0001&platform=x"), true);

  const whatsappShare = platformText(proShareContent, "whatsapp");
  assert.equal(whatsappShare.includes("https://m.k/4xK8mQ"), false);
  assert.equal(
    whatsappShare.includes("https://mukafaty.com/ad/hr-diploma?ref=mk0001&platform=whatsapp"),
    true,
  );
});
