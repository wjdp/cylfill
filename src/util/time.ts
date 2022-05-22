export interface TimePeriod {
  hours: number;
  minutes: number;
  seconds: number;
}

export const getTimePeriod = (t: number): TimePeriod => {
  const hours = Math.floor(t / 3600);
  const minutes = Math.floor((t % 3600) / 60);
  const seconds = t % 60;
  return { hours, minutes, seconds };
};

function pad(n: number, size: number = 2): string {
  let ns = n.toString();
  while (ns.length < size) ns = "0" + ns;
  return ns;
}

export const formatTimePeriod = (t: TimePeriod): string => {
  const hours = t.hours > 0 ? `${t.hours}:` : "";
  const minutes =
    hours || t.minutes > 0 ? `${hours ? pad(t.minutes) : t.minutes}:` : "";
  const seconds = `${
    minutes ? pad(Math.ceil(t.seconds)) : Math.ceil(t.seconds)
  }`;
  return `${hours}${minutes}${seconds}`.trim();
};

export const formatTimePeriodHMS = (t: TimePeriod): string => {
  const hours = t.hours > 0 ? `${t.hours}h ` : "";
  const minutes = hours || t.minutes > 0 ? `${t.minutes}m ` : "";
  const seconds = `${Math.ceil(t.seconds)}s`;
  return `${hours}${minutes}${seconds}`.trim();
};

export const getNow = (): number => {
  return Date.now() / 1000;
};
