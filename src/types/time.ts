type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

type Hour =
  | `0${Digit}`
  | `1${Digit}`
  | `2${0 | 1 | 2 | 3}`;

type Minute =
  `${0 | 1 | 2 | 3 | 4 | 5}${Digit}`;

export type TimeString = `${Hour}:${Minute}`;