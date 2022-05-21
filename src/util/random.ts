export const choose = <T>(choices: T[]): T => {
  var index = Math.floor(Math.random() * choices.length);
  return choices[index];
};

export const numberInRange = (min: number, max: number): number => {
  return Math.round(Math.random() * (max - min) + min);
};
