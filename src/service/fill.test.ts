import { describe, it, expect } from "vitest";
import { calculateFillTime } from "./fill";

describe("calculateFill", () => {
  it.each([
    [
      1,
      { cylinderSize: 1, startingPressure: 1, fillRate: 1, targetPressure: 1 },
      0,
    ],
    [
      2,
      { cylinderSize: 1, startingPressure: 1, fillRate: 1, targetPressure: 2 },
      60,
    ],
    // [3, { cylinderSize: 12, startingPressure: 100, fillRate: 3.1, targetPressure: 232 }, 1],
  ])("test %i", (n, params, expected) => {
    expect(calculateFillTime(params)).toEqual(expected);
  });
});
