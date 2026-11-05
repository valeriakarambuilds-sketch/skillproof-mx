import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase-server", () => ({ authenticatedClient: vi.fn(async () => null) }));
vi.mock("@/lib/assessment", () => ({
  parseWorkbook: vi.fn(() => []),
  gradeCells: vi.fn(() => ({ accuracy: 35, traceability: 25, checks: [] })),
  clampScore: (value: number, max: number) => Math.max(0, Math.min(max, value)),
}));
vi.mock("@/lib/explanation", () => ({ simulatedExplanation: () => ({ score: 40, feedback: "Simulated", evidence: [], simulated: true }) }));

import { POST } from "./route";

afterEach(() => vi.unstubAllEnvs());
describe("provisional assessment boundary", () => {
  it("never exposes advisory reasoning as a final score, even for perfect calculations", async () => {
    vi.stubEnv("GEMINI_API_KEY", "");
    const form = new FormData();
    form.append("file", new File(["fictional"], "case.xlsx"));
    form.append("explanation", "This fictional recommendation requires human review and does not establish a final hiring result.");
    const response = await POST(new Request("http://localhost/api/evaluate", { method: "POST", body: form }));
    const report = await response.json();
    expect(response.status).toBe(200);
    expect(report.reviewStatus).toBe("pending_human_review");
    expect(report.total).toBeNull();
    expect(report.numericalSubtotal).toBe(60);
    expect(report.explanation.score).toBe(40);
  });
});
