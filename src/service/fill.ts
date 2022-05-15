import { reactive, readonly } from "@vue/reactivity";
import * as t from "typed-assert";
import { getNow } from "../util/time";

interface FillStoreState {
  cylinderSize?: number;
  startingPressure?: number;
  fillRate?: number;
  targetPressure?: number;
  startTime?: number;
  endTime?: number;
}

const state = reactive({
  cylinderSize: 12,
  startingPressure: undefined,
  fillRate: 110,
  targetPressure: 232,
  startTime: undefined,
  endTime: undefined,
} as FillStoreState);

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
}

export const guesstimateLitresFilled = (
    params: FillParameters,
    startTime: number,
    now: number
  ) => {
    const { fillRate } = params;
    const timeDelta = now - startTime;
    const litreDelta = timeDelta * (fillRate/60);
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
  startFilling: () => {
    state.startTime = getNow();
    state.endTime =
      state.startTime + calculateFillTime(fill.getFillParameters());
    console.log(state.startTime, state.endTime, state.endTime - state.startTime);
  },
  stopFilling: () => {
    state.startTime = undefined;
    state.startingPressure = undefined;
  },
  isFilling: (): boolean => {
    return state.startTime !== undefined;
  },
  getStartTimeFormatted: (): string | undefined => {
    if (!state.startTime) return undefined;
    return new Date(state.startTime*1000).toLocaleTimeString('en-GB', {hour: 'numeric', minute: 'numeric'});
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
    return guesstimateLitresFilled(fill.getFillParameters(), state.startTime, now);
    },
  getCurrentPressure: (now: number): number | undefined => {
    if (state.startTime) {
      return guesstimatePressure(fill.getFillParameters(), state.startTime, getNow());
    } else {
      return state.startingPressure;
    }
  },
  setFillParameters: (params: Partial<FillParameters>) => {
    Object.assign(state, params);
  },
};

export default fill;
