import dayjs from "dayjs";
import { describe, it, expect, beforeEach } from "vitest";
import { getNow } from "../util/time";
import log, { LogEntry } from "./log";

const addLogEntry = (
  duration: number = 20 * 60,
  props: Partial<LogEntry> = {}
): LogEntry => {
  return log.addLogEntry({
    cylinderSize: 12,
    startingPressure: 50,
    targetPressure: 230,
    startTime: getNow() - duration,
    endTime: getNow(),
    ...props,
  });
};

const ONE_DAY = 24 * 60 * 60;

describe("log service", () => {
  beforeEach(() => log.resetStore());
  it("stores a log entry", () => {
    expect(log.numberOfLogEntries()).toEqual(0);
    const logEntry = log.addLogEntry({
      cylinderSize: 12,
      startingPressure: 50,
      targetPressure: 232,
      startTime: 1652696982852,
      endTime: 1652696984052,
    });
    expect(log.numberOfLogEntries()).toEqual(1);
    expect(log.state.logEntries).toEqual([
      {
        id: logEntry.id,
        cylinderSize: 12,
        startingPressure: 50,
        targetPressure: 232,
        startTime: 1652696982852,
        endTime: 1652696984052,
      },
    ]);
  });

  it("get number of log entries", () => {
    expect(log.numberOfLogEntries()).toEqual(0);
    addLogEntry();
    expect(log.numberOfLogEntries()).toEqual(1);
    addLogEntry();
    expect(log.numberOfLogEntries()).toEqual(2);
    addLogEntry();
    addLogEntry();
    addLogEntry();
    expect(log.numberOfLogEntries()).toEqual(5);
  });

  it("deletes log entries", () => {
    expect(log.numberOfLogEntries()).toEqual(0);
    const logEntry1 = addLogEntry();
    const logEntry2 = addLogEntry();
    expect(log.numberOfLogEntries()).toEqual(2);
    log.deleteLogEntry(logEntry1.id);
    expect(log.numberOfLogEntries()).toEqual(1);
    expect(log.state.logEntries[0].id).toEqual(logEntry2.id);
    log.deleteLogEntry(logEntry1.id);
    expect(log.numberOfLogEntries()).toEqual(1);
    log.deleteLogEntry(logEntry2.id);
    expect(log.numberOfLogEntries()).toEqual(0);
  });

  it("has logs", () => {
    expect(log.hasLogs()).toEqual(false);
    const logEntry = addLogEntry();
    expect(log.hasLogs()).toEqual(true);
    log.deleteLogEntry(logEntry.id);
    expect(log.hasLogs()).toEqual(false);
  });

  it("writes to local storage when empty", () => {
    expect(log.numberOfLogEntries()).toEqual(0);
    log.writeToLocalStorage();
    log.resetStore();
    log.loadFromLocalStorage();
    expect(log.numberOfLogEntries()).toEqual(0);
  });

  it("writes to local storage when has logs", () => {
    const logEntry = addLogEntry();
    expect(log.numberOfLogEntries()).toEqual(1);
    log.writeToLocalStorage();
    log.resetStore();
    expect(log.numberOfLogEntries()).toEqual(0);
    log.loadFromLocalStorage();
    expect(log.numberOfLogEntries()).toEqual(1);
    expect(log.state.logEntries[0].id).toEqual(logEntry.id);
  });

  it("returns enhanced logs", () => {
    expect(log.getLogs().length).toEqual(0);
    const logEntry = addLogEntry();
    const enhancedLogEntries = log.getLogs();
    expect(enhancedLogEntries.length).toEqual(1);
    expect(enhancedLogEntries).toEqual([
      {
        ...logEntry,
        duration: 1200,
        fillRate: 108,
      },
    ]);
  });

  it("has empty log stats", () => {
    expect(log.getLogStats(getNow())).toEqual({
      logCount: 0,
      fillRateToday: undefined,
      fillRateAll: undefined,
    });
  });

  it("duplicate entries give same stats", () => {
    addLogEntry(20 * 60);
    expect(log.getLogStats(getNow())).toEqual({
      logCount: 1,
      fillRateToday: 108,
      fillRateAll: 108,
    });
    addLogEntry(20 * 60);
    addLogEntry(20 * 60);
    addLogEntry(20 * 60);
    expect(log.getLogStats(getNow())).toEqual({
      logCount: 4,
      fillRateToday: 108,
      fillRateAll: 108,
    });
  });

  it("combines multiple entries into stats", () => {
    const now = dayjs("2022-05-17T00:25:00+00:10");
    addLogEntry(0, {
      startTime: now.subtract(20, "minutes").unix(),
      endTime: now.unix(),
    });
    addLogEntry(0, {
      startTime: now.subtract(18, "minutes").unix(),
      endTime: now.unix(),
    });
    expect(log.getLogStats(now.unix())).toEqual({
      logCount: 2,
      fillRateToday: 114,
      fillRateAll: 114,
    });
  });

  it("should return undefined for fillRateToday if no logs today", () => {
    const now = dayjs("2022-05-17T00:25:00+00:10");
    const yesterday = now.subtract(1, "day");
    addLogEntry(0, {
      startTime: yesterday.subtract(20, "minutes").unix(),
      endTime: yesterday.unix(),
    });
    expect(log.getLogStats(now.unix())).toEqual({
      logCount: 1,
      fillRateToday: undefined,
      fillRateAll: 108,
    });
  });

  it("should return combined stats and stats for today only", () => {
    const now = dayjs("2022-05-17T00:25:00+00:10");
    const yesterday = now.subtract(1, "day");
    addLogEntry(0, {
      startTime: yesterday.subtract(20, "minutes").unix(),
      endTime: yesterday.unix(),
    });
    addLogEntry(0, {
      startTime: now.subtract(18, "minutes").unix(),
      endTime: now.unix(),
    });
    expect(log.getLogStats(now.unix())).toEqual({
      logCount: 2,
      fillRateToday: 120,
      fillRateAll: 114,
    });
  });

  const HEADER_LINE_RENDERED =
    "ID,Start Time,End Time,Cylinder Size (L),Starting Pressure (bar),Target Pressure (bar),Duration (seconds),Fill Rate (L/min)";

  it("should generate a blank csv with no logs", async () => {
    expect(log.getExportText()).toEqual(HEADER_LINE_RENDERED);
  });

  it("should generate a csv with data in it", async () => {
    const now = 1500000000;
    const entry1 = addLogEntry(0, {
      startTime: now - ONE_DAY - 20 * 60,
      endTime: now - ONE_DAY,
    });
    const entry2 = addLogEntry(0, {
      startTime: now - 18 * 60,
      endTime: now,
    });
    const lines = log.getExportText().split("\n");
    expect(lines[0]).toEqual(HEADER_LINE_RENDERED);
    // Entry 2 before entry 1 as in reverse chronological order
    expect(lines[1]).toEqual(
      `${entry2.id},2017-07-14 03:22:00,2017-07-14 03:40:00,12,50,230,1080.0,120.00`
    );
    expect(lines[2]).toEqual(
      `${entry1.id},2017-07-13 03:20:00,2017-07-13 03:40:00,12,50,230,1200.0,108.00`
    );
  });
});
