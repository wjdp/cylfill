import { reactive, readonly } from "vue";
import * as _ from "lodash";
import { v4 as uuidv4 } from "uuid";

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

  getLogStats: (): LogStats => {
    const entries = log.getLogs();
    const todayEntries = entries
      // Pretty hacky way to filter by today's date
      .filter(
        (entry) =>
          new Date(entry.startTime * 1000).toDateString() ===
          new Date().toDateString()
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
};

export default log;
