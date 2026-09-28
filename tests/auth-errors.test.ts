import assert from "node:assert/strict";
import test from "node:test";
import { getAuthFailure } from "../apps/admin/src/lib/auth-errors";

test("missing server IAM permissions do not report a valid login as expired", () => {
  const failure = getAuthFailure({
    code: "auth/insufficient-permission",
    message: "The credential does not have sufficient permission.",
  });
  assert.equal(failure.status, 503);
  assert.match(failure.message, /permessi Firebase/);
  assert.doesNotMatch(failure.message, /scaduta|Accedi di nuovo/);
});

test("expired and revoked sessions still require authentication", () => {
  for (const code of ["auth/id-token-expired", "auth/id-token-revoked"]) {
    const failure = getAuthFailure({ code });
    assert.equal(failure.status, 401);
    assert.match(failure.message, /Accedi di nuovo/);
  }
});

test("disabled accounts and malformed tokens remain denied", () => {
  assert.equal(getAuthFailure({ code: "auth/user-disabled" }).status, 403);
  for (const code of [
    "auth/argument-error",
    "auth/invalid-argument",
    "auth/invalid-id-token",
    "auth/user-not-found",
  ]) {
    assert.equal(getAuthFailure({ code }).status, 401);
  }
});

test("server credential errors and outages do not tell the user to log in again", () => {
  for (const error of [
    { code: "auth/invalid-credential" },
    { code: "app/invalid-credential" },
    { code: "auth/project-not-found" },
    { code: "app/network-error" },
    { code: "auth/internal-error" },
    new Error("Connection failed"),
    null,
  ]) {
    const failure = getAuthFailure(error);
    assert.equal(failure.status, 503);
    assert.doesNotMatch(failure.message, /scaduta|Accedi di nuovo/);
  }
});

test("responses never expose Firebase error messages or credentials", () => {
  const detail = "private-service-account-and-token";
  for (const code of [
    "auth/insufficient-permission",
    "auth/invalid-argument",
    "auth/id-token-expired",
    "auth/internal-error",
    detail,
  ]) {
    assert.equal(
      JSON.stringify(getAuthFailure({ code, message: detail })).includes(detail),
      false,
    );
  }
});
