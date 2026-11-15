import { test } from "node:test";
import { strict as assert } from "node:assert";
import { credentialsMatch, hasSupportAccess } from "./support-auth.server";
import { supportCredentialsSchema } from "./support-auth.schema";

test("only the separately configured support credentials authenticate", () => {
  assert.equal(credentialsMatch("test-support", "test-password", "test-support", "test-password"), true);
  assert.equal(credentialsMatch("666", "666", "test-support", "test-password"), false);
  assert.equal(credentialsMatch("555", "555", "test-support", "test-password"), false);
  assert.equal(credentialsMatch("test-support", "wrong", "test-support", "test-password"), false);
  assert.equal(credentialsMatch("wrong", "test-password", "test-support", "test-password"), false);
});

test("missing, unrelated, signed-out and expired sessions cannot access support", () => {
  assert.equal(hasSupportAccess({}, 1000), false);
  assert.equal(hasSupportAccess({ support: false, expiresAt: 2000 }, 1000), false);
  assert.equal(hasSupportAccess({ support: true, expiresAt: 1000 }, 1000), false);
  assert.equal(hasSupportAccess({ support: true, expiresAt: 2000 }, 1000), true);
});

test("credentials require bounded nonempty inputs", () => {
  assert.equal(supportCredentialsSchema.safeParse({ username: " ", password: "x" }).success, false);
  assert.equal(supportCredentialsSchema.safeParse({ username: "x", password: "" }).success, false);
  assert.equal(supportCredentialsSchema.safeParse({ username: "x".repeat(101), password: "x" }).success, false);
  assert.equal(supportCredentialsSchema.safeParse({ username: "x", password: "x".repeat(257) }).success, false);
});