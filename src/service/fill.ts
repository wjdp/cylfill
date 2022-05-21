import { reactive, readonly } from "@vue/reactivity";
import * as t from "typed-assert";
import * as _ from "lodash";
import { getNow } from "../util/time";

const LOCAL_STORAGE_KEY = "cylfill";
const LOCAL_STORAGE_VERSION = 1;

const getLocalStorageKey = () =>
  `${LOCAL_STORAGE_KEY}-${LOCAL_STORAGE_VERSION}`;

interface FillStoreState {
  cylinderSize?: number;
  startingPressure?: number;
  fillRate?: number;
  fillRateFromLog: boolean;
  targetPressure?: number;
  startTime?: number;
  endTime?: number;
}

const DEFAULT_STORE_STATE = {
  cylinderSize: 12,
  startingPressure: undefined,
  fillRate: 110,
  fillRateFromLog: false,
  targetPressure: 232,
  startTime: undefined,
  endTime: undefined,
} as FillStoreState;

const state = reactive({ ...DEFAULT_STORE_STATE });
export interface FillParameters {
  cylinderSize: number; // in liters
  startingPressure: number; // in bar
  fillRate: number; // in litres per minute
  targetPressure: number; // in bar
}

export function assertFillParameters(
  input: unknown
): asserts input is FillParameters {
  t.isRecordWithKeys(input, [
    "cylinderSize",
    "startingPressure",
    "fillRate",
    "targetPressure",
  ]);
  t.isNumber(input.cylinderSize, "cylinderSize");
  t.isNumber(input.startingPressure, "startingPressure");
  t.isNumber(input.fillRate, "fillRate");
  t.isNumber(input.targetPressure, "targetPressure");
  if (input.startingPressure > input.targetPressure) {
    throw new Error("starting pressure must be less than target pressure");
  }
}

// Return number of seconds to fill the tank to the target pressure
export const calculateFillTime = (params: FillParameters): number => {
  const { cylinderSize, startingPressure, fillRate, targetPressure } = params;
  const pressureDelta = targetPressure - startingPressure;
  const litreDelta = pressureDelta * cylinderSize;
  const fillTime = litreDelta / (fillRate / 60);
  return fillTime;
};

export const getInitialLitres = (params: FillParameters): number => {
  const { startingPressure, cylinderSize } = params;
  return startingPressure * cylinderSize;
};

export const guesstimateLitresFilled = (
  params: FillParameters,
  startTime: number,
  now: number
) => {
  const { fillRate } = params;
  const timeDelta = now - startTime;
  const litreDelta = timeDelta * (fillRate / 60);
  return litreDelta;
};

export const guesstimatePressure = (
  params: FillParameters,
  startTime: number,
  now: number
) => {
  const litresFilled = guesstimateLitresFilled(params, startTime, now);
  const initialLitres = getInitialLitres(params);
  return (initialLitres + litresFilled) / params.cylinderSize;
};

const fill = {
  state: readonly(state),
  resetStore: () => {
    Object.assign(state, _.cloneDeep(DEFAULT_STORE_STATE));
  },
  setFillParameters: (params: Partial<FillParameters>) => {
    Object.assign(state, params);
    if (params.fillRate) {
      state.fillRateFromLog = false;
    }
  },
  setFillRateFromLog: (fillRate: number) => {
    state.fillRate = fillRate;
    state.fillRateFromLog = true;
  },
  getPartialFillParameters: (): Partial<FillParameters> => {
    return {
      cylinderSize: state.cylinderSize,
      startingPressure: state.startingPressure,
      fillRate: state.fillRate,
      targetPressure: state.targetPressure,
    };
  },
  getFillParameters: (): FillParameters => {
    try {
      assertFillParameters(state);
    } catch {
      throw new Error("Fill parameters are not valid");
    }
    return {
      cylinderSize: state.cylinderSize,
      startingPressure: state.startingPressure,
      fillRate: state.fillRate,
      targetPressure: state.targetPressure,
    };
  },
  getFillTime: (): number => {
    const params = fill.getFillParameters();
    return calculateFillTime(params);
  },
  startFilling: (): number => {
    try {
      assertFillParameters({ ...state });
    } catch {
      throw new Error("Fill parameters are not valid");
    }
    state.startTime = getNow();
    state.endTime =
      state.startTime + calculateFillTime(fill.getFillParameters());
    fill.writeToLocalStorage();
    return state.startTime;
  },
  stopFilling: () => {
    state.startTime = undefined;
    state.endTime = undefined;
    state.startingPressure = undefined;
    fill.writeToLocalStorage();
  },
  isFilling: (): boolean => {
    return state.startTime !== undefined;
  },
  getStartTimeFormatted: (): string | undefined => {
    if (!state.startTime) return undefined;
    return new Date(state.startTime * 1000).toLocaleTimeString("en-GB", {
      hour: "numeric",
      minute: "numeric",
    });
  },
  getEndTimeFormatted: (): string | undefined => {
    if (!state.endTime) return undefined;
    return new Date(state.endTime * 1000).toLocaleTimeString("en-GB", {
      hour: "numeric",
      minute: "numeric",
    });
  },
  getFillTimeRemaining(now: number): number | undefined {
    if (state.endTime === undefined) {
      return undefined;
    }
    return Math.max(0, state.endTime - now);
  },
  getLitresFilled(now: number): number | undefined {
    if (state.startTime === undefined) {
      return undefined;
    }
    return guesstimateLitresFilled(
      fill.getFillParameters(),
      state.startTime,
      now
    );
  },
  getCurrentPressure: (now: number): number | undefined => {
    if (state.startTime) {
      return guesstimatePressure(
        fill.getFillParameters(),
        state.startTime,
        now
      );
    } else {
      return state.startingPressure;
    }
  },
  writeToLocalStorage: () => {
    localStorage.setItem(getLocalStorageKey(), JSON.stringify(state));
  },
  loadFromLocalStorage: () => {
    const storedState = localStorage.getItem(getLocalStorageKey());
    if (storedState) {
      Object.assign(state, JSON.parse(storedState));
    }
  },
};

export default fill;
