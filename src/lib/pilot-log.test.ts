import { describe, expect, it } from "vitest";
import { cleanFeedback, pilotEvent } from "./pilot-log";
describe("pilot data minimization", () => {
  it("exports only a bounded event envelope, never arbitrary metadata", () => {
    expect(Object.keys(pilotEvent("evaluation_completed")).sort()).toEqual(["at", "caseVersion", "event", "rubricVersion"]);
  });
  it("rejects common personal identifiers and out-of-range comments", () => {
    for (const text of ["", "a".repeat(501), "contact me at private@example.com", "call 5512345678", "https://example.com"]) expect(() => cleanFeedback(text)).toThrow();
    expect(cleanFeedback("  No entiendo qué falta revisar.  ")).toBe("No entiendo qué falta revisar.");
  });
});
