import assert from "node:assert/strict";
import test from "node:test";
import { defaultContent } from "../src/content/defaults";
import { readContentResponse } from "../apps/admin/src/lib/content-response";

test("HTML server failures produce a useful message instead of a JSON parsing error", async () => {
  for (const status of [500, 502, 503, 504]) {
    const response = new Response("<!DOCTYPE html><title>Internal error</title>", {
      status,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
    await assert.rejects(readContentResponse(response), {
      message: "Il server del pannello non è disponibile. Riprova tra poco.",
    });
  }
});

test("HTML login pages and missing API routes cannot be accepted as content", async () => {
  for (const status of [200, 401, 403, 404]) {
    await assert.rejects(
      readContentResponse(
        new Response("<!DOCTYPE html><title>Login</title>", {
          status,
          headers: { "Content-Type": "text/html" },
        }),
      ),
      { message: "Il server ha restituito una risposta inattesa. Riprova tra poco." },
    );
  }
});

test("JSON API errors preserve authentication, permission and conflict messages", async () => {
  for (const status of [401, 403, 409, 503]) {
    const message = `API error ${status}`;
    await assert.rejects(
      readContentResponse(Response.json({ error: message }, { status })),
      { message },
    );
  }
});

test("malformed JSON and invalid error bodies do not leak parser details", async () => {
  await assert.rejects(
    readContentResponse(
      new Response("<!DOCTYPE html>", {
        headers: { "Content-Type": "application/json" },
      }),
    ),
    { message: "Il server ha restituito una risposta inattesa. Riprova tra poco." },
  );
  await assert.rejects(
    readContentResponse(Response.json({ error: { internal: "detail" } }, { status: 500 })),
    { message: "Il server del pannello non è disponibile. Riprova tra poco." },
  );
});

test("valid content responses are parsed and invalid snapshots remain rejected", async () => {
  const snapshot = { content: defaultContent, revision: 0, updatedAt: null };
  assert.deepEqual(await readContentResponse(Response.json(snapshot)), snapshot);
  await assert.rejects(readContentResponse(Response.json({ content: null })));
});
