import assert from "node:assert/strict";
import test from "node:test";
import { defaultContent } from "../src/content/defaults";
import { cv1stAdExp, cvOtherExperience } from "../src/data/cv";
import { portfolio } from "../src/data/portfolio";
import {
  ContentValidationError,
  isSafeImageUrl,
  isSafeWebUrl,
  parseContent,
  parseSnapshot,
} from "../src/content/validation";

test("initial managed content preserves all existing CV and portfolio entries", () => {
  const parsed = parseContent(defaultContent);
  assert.deepEqual(
    parsed.assistantExperience.map(({ title, year }) => ({ title, year })),
    cv1stAdExp,
  );
  assert.deepEqual(
    parsed.otherExperience.map(({ title, role, year, description }) => ({
      title,
      role,
      year,
      description,
    })),
    cvOtherExperience,
  );
  assert.deepEqual(
    parsed.portfolio.map(({ title, directedBy, description, images }) => ({
      title,
      directedBy,
      description,
      images,
    })),
    portfolio,
  );
});

test("new, edited, deleted and reordered entries survive validation in their exact order", () => {
  const content = structuredClone(defaultContent);
  content.portfolio = [
    {
      id: "new-project",
      title: "New project",
      directedBy: "Director",
      description: "Test",
      images: ["https://example.com/frame.jpg"],
    },
    { ...content.portfolio[2], title: "Updated title" },
    content.portfolio[0],
  ];
  assert.deepEqual(parseContent(content), content);
});

test("all optional lists and contacts can be emptied", () => {
  const content = structuredClone(defaultContent);
  content.portfolio = [];
  content.assistantExperience = [];
  content.otherExperience = [];
  content.education = [];
  content.skills = [];
  content.biography = [];
  content.contacts = {
    email: "",
    phone: "",
    mandy: "",
    instagram: "",
    linkedin: "",
  };
  assert.deepEqual(parseContent(content), content);
});

test("untrusted input cannot inject a script URL into image or contact fields", () => {
  for (const url of [
    "javascript:alert(1)",
    "data:text/html,test",
    "//evil.example/image",
    "http://example.com/image",
    "https://user:pass@example.com/image",
    "https://example.com/\nimage",
  ]) {
    assert.equal(isSafeImageUrl(url), false, url);
    assert.equal(isSafeWebUrl(url), false, url);
    const content = structuredClone(defaultContent);
    content.portfolio[0].images = [url];
    assert.throws(() => parseContent(content), ContentValidationError);
    content.portfolio[0].images = ["/img/PVC1.jpg"];
    content.contacts.instagram = url;
    assert.throws(() => parseContent(content), ContentValidationError);
  }
  assert.equal(isSafeImageUrl("/img/PVC1.jpg"), true);
  assert.equal(isSafeImageUrl("https://example.com/photo.jpg?q=1"), true);
});

test("rejects malformed, incomplete and oversized content instead of publishing it", () => {
  for (const value of [
    null,
    [],
    {},
    { ...defaultContent, schemaVersion: 2 },
    { ...defaultContent, profile: { name: "", role: "" } },
  ]) {
    assert.throws(() => parseContent(value), ContentValidationError);
  }
  const content = structuredClone(defaultContent);
  content.portfolio[0].images = [];
  assert.throws(() => parseContent(content), /immagini/);
  content.portfolio = [];
  content.biography[0].text = "x".repeat(12_001);
  assert.throws(() => parseContent(content), ContentValidationError);
  content.biography = Array.from({ length: 100 }, (_, i) => ({
    id: String(i),
    text: "x".repeat(12_000),
    lead: "",
    italic: false,
  }));
  assert.throws(() => parseContent(content), /troppo grandi/);
});

test("rejects duplicate identifiers that could target the wrong entry during editing", () => {
  const content = structuredClone(defaultContent);
  content.portfolio[1].id = content.portfolio[0].id;
  assert.throws(() => parseContent(content), /duplicati/);
});

test("public snapshots strip private audit fields and reject invalid revisions", () => {
  const snapshot = {
    content: defaultContent,
    revision: 7,
    updatedAt: "2026-09-28T10:00:00.000Z",
  };
  assert.deepEqual(
    parseSnapshot({
      ...snapshot,
      updatedBy: "private-user-uid",
      unexpected: "ignored",
    }),
    snapshot,
  );
  for (const revision of [-1, 1.5, "7", null, Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(
      () => parseSnapshot({ ...snapshot, revision }),
      ContentValidationError,
    );
  }
  assert.throws(
    () => parseSnapshot({ ...snapshot, updatedAt: "invalid" }),
    ContentValidationError,
  );
});
