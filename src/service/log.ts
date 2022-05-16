import { reactive, readonly } from "vue";

const LOCAL_STORAGE_KEY = "cylfill-log";
const LOCAL_STORAGE_VERSION = 1;

const getLocalStorageKey = () =>
  `${LOCAL_STORAGE_KEY}-${LOCAL_STORAGE_VERSION}`;

interface LogEntry {
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
  averageFillRate: number;
}

interface LogStoreState {
  logEntries: LogEntry[];
}

const state = reactive({
  logEntries: [],
} as LogStoreState);

export const getFillRate = (entry: LogEntry): number => {
  const duration = entry.endTime - entry.startTime;
  const litres =
    entry.cylinderSize * (entry.targetPressure - entry.startingPressure);
  return litres / (duration / 60);
};

const log = {
  state: readonly(state),
  addLogEntry: (logEntry: LogEntry) => {
    state.logEntries.push(logEntry);
    console.log(logEntry);
    log.writeToLocalStorage();
  },
  deleteLogEntry: (startTime: number) => {
    state.logEntries = state.logEntries.filter(
      (entry) => entry.startTime !== startTime
    );
    log.writeToLocalStorage();
  },

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
    const averageFillRate =
      entries
        .map((entry) => entry.fillRate)
        .reduce((acc, curr) => acc + curr, 0) / entries.length;
    return {
      averageFillRate,
    };
  },
};

export default log;
