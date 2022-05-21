import { reactive, readonly } from "vue";
import * as _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import { choose, numberInRange } from "../util/random";
import { calculateFillTime } from "./fill";

const LOCAL_STORAGE_KEY = "cylfill-log";
const LOCAL_STORAGE_VERSION = 1;

const getLocalStorageKey = () =>
  `${LOCAL_STORAGE_KEY}-${LOCAL_STORAGE_VERSION}`;

interface LogEntryInput {
  cylinderSize: number;
  startingPressure: number;
  targetPressure: number;
  startTime: number;
  endTime: number;
}

export interface LogEntry {
  id: string;
  cylinderSize: number;
  startingPressure: number;
  targetPressure: number;
  startTime: number;
  endTime: number;
}

export interface LogEntryEnhanced extends LogEntry {
  duration: number;
  fillRate: number;
}

interface LogStats {
  logCount: number;
  fillRateToday?: number;
  fillRateAll?: number;
}

interface LogStoreState {
  logEntries: LogEntry[];
}

const DEFAULT_STORE_STATE: LogStoreState = { logEntries: [] };

const state = reactive({ ...DEFAULT_STORE_STATE });

export const getFillRate = (entry: LogEntry): number => {
  const duration = entry.endTime - entry.startTime;
  const litres =
    entry.cylinderSize * (entry.targetPressure - entry.startingPressure);
  return litres / (duration / 60);
};

const log = {
  state: readonly(state),
  resetStore: () => {
    Object.assign(state, _.cloneDeep(DEFAULT_STORE_STATE));
  },
  addLogEntry: (logEntry: LogEntryInput): LogEntry => {
    const newLogEntry = {
      id: uuidv4(),
      ...logEntry,
    };
    state.logEntries.push(newLogEntry);
    log.writeToLocalStorage();
    return newLogEntry;
  },
  deleteLogEntry: (id: string) => {
    state.logEntries = state.logEntries.filter((entry) => entry.id !== id);
    log.writeToLocalStorage();
  },
  numberOfLogEntries: () => state.logEntries.length,
  hasLogs: () => state.logEntries.length > 0,

  writeToLocalStorage: () => {
    localStorage.setItem(getLocalStorageKey(), JSON.stringify(state));
  },
  loadFromLocalStorage: () => {
    const storedState = localStorage.getItem(getLocalStorageKey());
    if (storedState) {
      Object.assign(state, JSON.parse(storedState));
    }
  },
  getLogs: (): LogEntryEnhanced[] =>
    state.logEntries
      .map((entry) => ({
        ...entry,
        duration: entry.endTime - entry.startTime,
        fillRate: getFillRate(entry),
      }))
      .reverse(),

  getLogStats: (now: number): LogStats => {
    const nowDay = dayjs(new Date(now * 1000)).startOf("day");
    const entries = log.getLogs();
    const todayEntries = entries.filter((entry) =>
      dayjs(new Date(entry.startTime * 1000))
        .startOf("day")
        .isSame(nowDay)
    );
    const fillRateToday =
      todayEntries
        .map((entry) => entry.fillRate)
        .reduce((acc, curr) => acc + curr, 0) / todayEntries.length ||
      undefined;
    const fillRateAll =
      entries
        .map((entry) => entry.fillRate)
        .reduce((acc, curr) => acc + curr, 0) / entries.length || undefined;
    return {
      logCount: entries.length,
      fillRateToday,
      fillRateAll,
    };
  },

  getExportText(): string {
    const HEADERS = [
      "ID",
      "Start Time",
      "End Time",
      "Cylinder Size (L)",
      "Starting Pressure (bar)",
      "Target Pressure (bar)",
      "Duration (seconds)",
      "Fill Rate (L/min)",
    ];
    const rows = log
      .getLogs()
      .map((entry) => [
        entry.id,
        dayjs(new Date(entry.startTime * 1000)).format("YYYY-MM-DD HH:mm:ss"),
        dayjs(new Date(entry.endTime * 1000)).format("YYYY-MM-DD HH:mm:ss"),
        entry.cylinderSize,
        entry.startingPressure,
        entry.targetPressure,
        entry.duration.toFixed(1),
        entry.fillRate.toFixed(2),
      ]);
    return [HEADERS, ...rows].map((row) => row.join(",")).join("\n");
  },

  generateFakeLogEntry: () => {
    const startTime = 0;
    const cylinderSize = choose([12, 12, 12, 12, 15, 7, 24]);
    const startingPressure = numberInRange(20, 150);
    const targetPressure = 232;
    const fillRate = numberInRange(90, 150);
    const duration = calculateFillTime({
      cylinderSize,
      startingPressure,
      targetPressure,
      fillRate,
    });
    return log.addLogEntry({
      cylinderSize,
      startingPressure,
      targetPressure,
      startTime,
      endTime: startTime + duration,
    });
  },
};

export default log;
