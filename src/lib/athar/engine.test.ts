import { describe, expect, it } from "vitest";
import { retentionDemo } from "../../data/demo-legislation";
import { atharEngine } from "./engine";

describe("AtharEngine", () => {
  it("finds dependencies and potential conflicts in the retention demo", () => {
    const result = atharEngine.analyze(retentionDemo);
    expect(result.impactScore).toBe("مرتفع");
    expect(result.alerts.some((item) => item.type === "potential_conflict")).toBe(true);
    expect(result.alerts.some((item) => item.type === "dependency")).toBe(true);
  });
  it("flags a new undefined term", () => {
    const result = atharEngine.analyze({ ...retentionDemo, proposedText: "تحتفظ الجهة بالبيانات الشخصية ضمن مستودع سيادي لمدة خمس سنوات." });
    expect(result.alerts.some((item) => item.type === "undefined_term")).toBe(true);
  });
  it("flags a reference to an unavailable article", () => {
    const result = atharEngine.analyze({ ...retentionDemo, proposedText: "تطبق أحكام المادة 99 على الاحتفاظ بالبيانات." });
    expect(result.alerts.some((item) => item.type === "broken_reference")).toBe(true);
  });
});
