import { describe, it, expect } from "vitest";
import { choose, numberInRange } from "./random";

describe("choose", () => {
  it("works with strings", () => {
    const choiceSet = ["a", "b", "c"];
    expect(choiceSet.includes(choose(choiceSet))).toBe(true);
    expect(choiceSet.includes(choose(choiceSet))).toBe(true);
    expect(choiceSet.includes(choose(choiceSet))).toBe(true);
    expect(choiceSet.includes(choose(choiceSet))).toBe(true);
  });
  it("works with numbers", () => {
    const choiceSet = [1, 2, 3, 4, 5];
    expect(choiceSet.includes(choose(choiceSet))).toBe(true);
    expect(choiceSet.includes(choose(choiceSet))).toBe(true);
    expect(choiceSet.includes(choose(choiceSet))).toBe(true);
    expect(choiceSet.includes(choose(choiceSet))).toBe(true);
  });
});

describe("numberInRange", () => {
  it("generates numbers in a provided range", () => {
    expect(numberInRange(2, 4)).toBeGreaterThanOrEqual(2);
    expect(numberInRange(2, 4)).toBeLessThanOrEqual(4);
  });
});
