import { test } from "node:test";
import { strict as assert } from "node:assert";
import { AUTH_MODE } from "./auth-mode";
import { DEMO_ACCOUNT, DEMO_SESSION_KEY, isDemoEmail, readDemoSession, verifyDemoCredentials } from "./demo-auth";

test("external marketer authentication defaults to demo", () => {
  assert.equal(AUTH_MODE, "demo");
});

test("the fixed demo credentials authenticate without creating an account", () => {
  assert.equal(verifyDemoCredentials("demo@gmail.com", "demo2026"), true);
  assert.equal(verifyDemoCredentials("demo@gmail.com", "wrong"), false);
  assert.equal(verifyDemoCredentials("other@gmail.com", "demo2026"), false);
  assert.equal(verifyDemoCredentials("555", "555"), false);
  assert.equal(verifyDemoCredentials("666", "666"), false);
});

test("the email step only accepts the fixed demo email", () => {
  assert.equal(isDemoEmail(" DEMO@gmail.com "), true);
  assert.equal(isDemoEmail("real@gmail.com"), false);
});

test("the demonstration identity matches the requested account", () => {
  assert.equal(DEMO_ACCOUNT.name, "أحمد السبيعي");
  assert.equal(DEMO_ACCOUNT.memberNumber, "MK0001");
  assert.equal(DEMO_ACCOUNT.accountType, "مسوق خارجي");
});

test("a persisted local marker restores only the demo identity", () => {
  const storage = { getItem: (key: string) => key === DEMO_SESSION_KEY
    ? JSON.stringify({ kind: "external-demo", memberNumber: "MK0001" }) : null };
  assert.deepEqual(readDemoSession(storage), DEMO_ACCOUNT);
  assert.deepEqual(readDemoSession(storage), DEMO_ACCOUNT);
  assert.equal("access_token" in DEMO_ACCOUNT, false);
});

test("missing, corrupt, unrelated or live sessions never count as demo sessions", () => {
  for (const value of [null, "bad-json", "null", JSON.stringify({ access_token: "not-a-demo-session" }), JSON.stringify({ kind: "external-demo", memberNumber: "OTHER" })]) {
    assert.equal(readDemoSession({ getItem: () => value }), null);
  }
});