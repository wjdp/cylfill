import { describe, it, expect, beforeEach } from "vitest";
import fill, {
  assertFillParameters,
  calculateFillTime,
  guesstimateLitresFilled,
  guesstimatePressure,
} from "./fill";

describe("assertFillParameters", () => {
  it("passes on valid input", () => {
    assertFillParameters({
      cylinderSize: 1,
      startingPressure: 1,
      fillRate: 1,
      targetPressure: 1,
    });
  });
  it("throws on invalid input", () => {
    expect(() =>
      assertFillParameters({
        cylinderSize: undefined,
        startingPressure: 1,
        fillRate: 1,
        targetPressure: 1,
      })
    ).toThrow();
  });
  it("throws on staring pressure greater than target", () => {
    expect(() =>
      assertFillParameters({
        cylinderSize: 1,
        startingPressure: 2,
        fillRate: 1,
        targetPressure: 1,
      })
    ).toThrow();
  });
});

describe("calculateFillTime", () => {
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
    [
      3,
      {
        cylinderSize: 12,
        startingPressure: 50,
        fillRate: 110,
        targetPressure: 232,
      },
      1191.27,
    ],
    [
      3,
      {
        cylinderSize: 15,
        startingPressure: 50,
        fillRate: 110,
        targetPressure: 232,
      },
      1489.1,
    ],
  ])("test %i", (n, params, expected) => {
    expect(calculateFillTime(params)).toBeCloseTo(expected, 1);
  });
});

describe("guesstimateLitresFilled", () => {
  it.each([
    [1, { fillRate: 1, startTime: 0, now: 0 }, 0],
    [1, { fillRate: 1, startTime: 0, now: 60 }, 1],
    [1, { fillRate: 0.5, startTime: 0, now: 60 }, 0.5],
    [1, { fillRate: 2, startTime: 0, now: 3600 }, 120],
    [1, { fillRate: 2, startTime: 50, now: 3650 }, 120],
  ])("test %i", (n, { fillRate, startTime, now }, expected) => {
    expect(
      guesstimateLitresFilled(
        { fillRate, cylinderSize: 1, startingPressure: 1, targetPressure: 1 },
        startTime,
        now
      )
    ).toBeCloseTo(expected, 1);
  });
});

describe("guesstimatePressure", () => {
  it.each([
    [
      "start with 1 bar so should be 1 at t=0",
      {
        cylinderSize: 1,
        startingPressure: 1,
        fillRate: 1,
        deltaTime: 0,
      },
      1,
    ],
    [
      "start with 2 bar so should be 2 at t=0",
      {
        cylinderSize: 1,
        startingPressure: 2,
        fillRate: 1,
        deltaTime: 0,
      },
      2,
    ],
    [
      "after 2 mins at 24 L/m delta p should be 4 bar",
      {
        cylinderSize: 12,
        startingPressure: 50,
        fillRate: 24,
        deltaTime: 120,
      },
      54,
    ],
    [
      "Let's fill a 12L tank",
      {
        cylinderSize: 12,
        startingPressure: 50,
        fillRate: 110,
        deltaTime: 1191.27,
      },
      232,
    ],
  ])(
    "test %s",
    (n, { cylinderSize, startingPressure, fillRate, deltaTime }, expected) => {
      // Run with startTime = 0
      expect(
        guesstimatePressure(
          { cylinderSize, startingPressure, fillRate, targetPressure: 232 },
          0,
          deltaTime
        )
      ).toBeCloseTo(expected, 1);
      // Run with startTime = 1234.56
      expect(
        guesstimatePressure(
          { cylinderSize, startingPressure, fillRate, targetPressure: 232 },
          1234.56,
          deltaTime + 1234.56
        )
      ).toBeCloseTo(expected, 1);
    }
  );
});

describe("fill store", () => {
  beforeEach(() => fill.resetStore());
  it("should have a default state", () => {
    expect(fill.state).toEqual({
      cylinderSize: 12,
      startingPressure: undefined,
      fillRate: 110,
      targetPressure: 232,
      startTime: undefined,
      endTime: undefined,
    });
  });

  it("throws when trying to get fill params when invalid", () => {
    expect(() => fill.getFillParameters()).toThrow();
  });

  it("accepts invalid fill params", () => {
    fill.setFillParameters({
      cylinderSize: 123,
      startingPressure: undefined,
      fillRate: undefined,
      targetPressure: undefined,
    });
    expect(fill.state).toEqual({
      cylinderSize: 123,
      startingPressure: undefined,
      fillRate: undefined,
      targetPressure: undefined,
      startTime: undefined,
      endTime: undefined,
    });
  });

  it("accepts valid fill params", () => {
    fill.setFillParameters({
      cylinderSize: 12,
      startingPressure: 50,
      fillRate: 110,
      targetPressure: 232,
    });
    expect(fill.getFillParameters()).toEqual({
      cylinderSize: 12,
      startingPressure: 50,
      fillRate: 110,
      targetPressure: 232,
    });
  });

  it("throws when trying to start filling with invalid parameters", () => {
    expect(() => fill.startFilling()).toThrow();
  });

  it("starts filling when params are valid", () => {
    expect(fill.state.startTime).toBeUndefined();
    expect(fill.state.endTime).toBeUndefined();
    fill.setFillParameters({
      cylinderSize: 12,
      startingPressure: 50,
      fillRate: 110,
      targetPressure: 232,
    });
    fill.startFilling();
    expect(fill.state.startTime).toBeDefined();
    expect(fill.state.endTime).toBeDefined();
    expect(fill.state.startTime).toBeLessThan(fill.state.endTime!);
  });

  it("resets when filling is stopped", () => {
    fill.setFillParameters({
      cylinderSize: 12,
      startingPressure: 50,
      fillRate: 110,
      targetPressure: 232,
    });
    fill.startFilling();
    fill.stopFilling();
    expect(fill.state.startTime).toBeUndefined();
    expect(fill.state.endTime).toBeUndefined();
    expect(fill.state.startingPressure).toBeUndefined();
  });

  it("tells us when filling is happening", () => {
    expect(fill.isFilling()).toBe(false);
    fill.setFillParameters({
      cylinderSize: 12,
      startingPressure: 50,
      fillRate: 110,
      targetPressure: 232,
    });
    expect(fill.isFilling()).toBe(false);
    fill.startFilling();
    expect(fill.isFilling()).toBe(true);
    fill.stopFilling();
    expect(fill.isFilling()).toBe(false);
  });

  it("gives a formatted start time", () => {
    expect(fill.getStartTimeFormatted()).toBeUndefined();
    fill.setFillParameters({
      cylinderSize: 12,
      startingPressure: 50,
      fillRate: 110,
      targetPressure: 232,
    });
    fill.startFilling();
    expect(fill.getStartTimeFormatted()).toBeTypeOf("string");
  });

  it("gives a fill time remaining", () => {
    expect(fill.getFillTimeRemaining(0)).toBeUndefined();
    fill.setFillParameters({
      cylinderSize: 12,
      startingPressure: 50,
      fillRate: 110,
      targetPressure: 232,
    });
    const startTime = fill.startFilling();
    const expected = 1191.27;
    expect(fill.getFillTimeRemaining(startTime)).toBeCloseTo(1191.27, 1);
    expect(fill.getFillTimeRemaining(startTime + 120)).toBeCloseTo(
      expected - 120,
      1
    );
  });

  it("gives a number of litres filled since start", () => {
    expect(fill.getLitresFilled(0)).toBeUndefined();
    fill.setFillParameters({
      cylinderSize: 12,
      startingPressure: 50,
      fillRate: 110,
      targetPressure: 232,
    });
    const startTime = fill.startFilling();
    expect(fill.getLitresFilled(startTime + 120)).toBe(220);
  });

  it("gives current pressure", () => {
    expect(fill.getCurrentPressure(0)).toBeUndefined();
    fill.setFillParameters({
      cylinderSize: 12,
      startingPressure: 50,
      fillRate: 24,
      targetPressure: 232,
    });
    const startTime = fill.startFilling();
    expect(fill.getCurrentPressure(startTime)).toBe(50);
    expect(fill.getCurrentPressure(startTime + 120)).toBe(54);
  });

  it("restores from local storage", () => {
    fill.setFillParameters({
      cylinderSize: 12,
      startingPressure: 50,
      fillRate: 24,
      targetPressure: 232,
    });
    fill.writeToLocalStorage();
    fill.resetStore();
    expect(fill.state.startingPressure).toBeUndefined();
    fill.loadFromLocalStorage();
    expect(fill.state.startingPressure).toBe(50);
  });
});
