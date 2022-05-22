import { describe, it, expect } from "vitest";
import { formatTimePeriod, formatTimePeriodHMS, getTimePeriod } from "./time";

describe("getTimePeriod", () => {
  it.each([
    [0, { hours: 0, minutes: 0, seconds: 0 }],
    [1, { hours: 0, minutes: 0, seconds: 1 }],
    [59, { hours: 0, minutes: 0, seconds: 59 }],
    [60, { hours: 0, minutes: 1, seconds: 0 }],
    [119, { hours: 0, minutes: 1, seconds: 59 }],
    [120, { hours: 0, minutes: 2, seconds: 0 }],
    [3599, { hours: 0, minutes: 59, seconds: 59 }],
    [3600, { hours: 1, minutes: 0, seconds: 0 }],
    [3661, { hours: 1, minutes: 1, seconds: 1 }],
    [21600, { hours: 6, minutes: 0, seconds: 0 }],
  ])("%i seconds", (t, expected) => {
    expect(getTimePeriod(t)).toEqual(expected);
  });
});

describe("formatTimePeriod", () => {
  it.each([
    [{ hours: 0, minutes: 0, seconds: 0 }, "0"],
    [{ hours: 0, minutes: 0, seconds: 0.01 }, "1"],
    [{ hours: 0, minutes: 0, seconds: 1 }, "1"],
    [{ hours: 0, minutes: 0, seconds: 1.111 }, "2"],
    [{ hours: 0, minutes: 0, seconds: 1.599 }, "2"],
    [{ hours: 0, minutes: 0, seconds: 59 }, "59"],
    [{ hours: 0, minutes: 1, seconds: 0 }, "1:00"],
    [{ hours: 0, minutes: 1, seconds: 59 }, "1:59"],
    [{ hours: 0, minutes: 2, seconds: 0 }, "2:00"],
    [{ hours: 0, minutes: 59, seconds: 59 }, "59:59"],
    [{ hours: 1, minutes: 0, seconds: 0 }, "1:00:00"],
    [{ hours: 1, minutes: 1, seconds: 1 }, "1:01:01"],
  ])("%s", (t, expected) => {
    expect(formatTimePeriod(t)).toEqual(expected);
  });
});

describe("formatTimePeriodHMS", () => {
  it.each([
    [{ hours: 0, minutes: 0, seconds: 0 }, "0s"],
    [{ hours: 0, minutes: 0, seconds: 0.01 }, "1s"],
    [{ hours: 0, minutes: 0, seconds: 1 }, "1s"],
    [{ hours: 0, minutes: 0, seconds: 1.111 }, "2s"],
    [{ hours: 0, minutes: 0, seconds: 1.599 }, "2s"],
    [{ hours: 0, minutes: 0, seconds: 59 }, "59s"],
    [{ hours: 0, minutes: 1, seconds: 0 }, "1m 0s"],
    [{ hours: 0, minutes: 1, seconds: 59 }, "1m 59s"],
    [{ hours: 0, minutes: 2, seconds: 0 }, "2m 0s"],
    [{ hours: 0, minutes: 59, seconds: 59 }, "59m 59s"],
    [{ hours: 1, minutes: 0, seconds: 0 }, "1h 0m 0s"],
    [{ hours: 1, minutes: 1, seconds: 1 }, "1h 1m 1s"],
  ])("%s", (t, expected) => {
    expect(formatTimePeriodHMS(t)).toEqual(expected);
  });
});
