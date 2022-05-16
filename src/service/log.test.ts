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
    expect(log.getLogStats()).toEqual({
      logCount: 0,
      fillRateToday: undefined,
      fillRateAll: undefined,
    });
  });

  it("duplicate entries give same stats", () => {
    addLogEntry(20 * 60);
    expect(log.getLogStats()).toEqual({
      logCount: 1,
      fillRateToday: 108,
      fillRateAll: 108,
    });
    addLogEntry(20 * 60);
    addLogEntry(20 * 60);
    addLogEntry(20 * 60);
    expect(log.getLogStats()).toEqual({
      logCount: 4,
      fillRateToday: 108,
      fillRateAll: 108,
    });
  });

  it("combines multiple entries into stats", () => {
    addLogEntry(20 * 60);
    addLogEntry(18 * 60);
    expect(log.getLogStats()).toEqual({
      logCount: 2,
      fillRateToday: 114,
      fillRateAll: 114,
    });
  });

  it("should return undefined for fillRateToday if no logs today", () => {
    const yesterday = getNow() - ONE_DAY;
    addLogEntry(0, {
      startTime: yesterday - 20 * 60,
      endTime: yesterday,
    });
    expect(log.getLogStats()).toEqual({
      logCount: 1,
      fillRateToday: undefined,
      fillRateAll: 108,
    });
  });

  it("should return combined stats and stats for today only", () => {
    const yesterday = getNow() - ONE_DAY;
    addLogEntry(0, {
      startTime: yesterday - 20 * 60,
      endTime: yesterday,
    });
    addLogEntry(18 * 60);
    expect(log.getLogStats()).toEqual({
      logCount: 2,
      fillRateToday: 120,
      fillRateAll: 114,
    });
  });
});
