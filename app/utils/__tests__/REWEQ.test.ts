import * as fs from "fs";

import { REWEQ } from "../REWEQ";

// set this to true to debug the outputs as objects
const DO_DEBUG_OBJECT = true;

function toPlainObject(obj: unknown): unknown {
  return JSON.parse(JSON.stringify(obj));
}

test("rew-FBQ2496", () => {
  const filePath =
    "/Users/perivar/development/REWEQ2EQPresetOrig/genelec eq filters 4 FBQ2496.txt";
  const fileContent = fs.readFileSync(filePath, "utf8");
  const actual = REWEQ.readREWEQFiltersFromString(fileContent, ",");

  if (DO_DEBUG_OBJECT) console.log(JSON.stringify(actual, null, 2));
  expect(toPlainObject(actual)).toStrictEqual({
    EqBands: [
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 91.4,
        FilterGain: 10.5,
        FilterQ: 1.9021,
        FilterBWOct: 0.75,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 137,
        FilterGain: -17,
        FilterQ: 10.0846,
        FilterBWOct: 0.143,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 170,
        FilterGain: -9.5,
        FilterQ: 7.2077,
        FilterBWOct: 0.2,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 249,
        FilterGain: -6.5,
        FilterQ: 43.7171,
        FilterBWOct: 0.033,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 64,
        FilterGain: -5,
        FilterQ: 8.6341,
        FilterBWOct: 0.167,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 1276,
        FilterGain: -5.5,
        FilterQ: 11.538,
        FilterBWOct: 0.125,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 155,
        FilterGain: 14,
        FilterQ: 12.994,
        FilterBWOct: 0.111,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 502,
        FilterGain: 10.5,
        FilterQ: 43.7171,
        FilterBWOct: 0.033,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 1888,
        FilterGain: 7.5,
        FilterQ: 17.3795,
        FilterBWOct: 0.083,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 5141,
        FilterGain: -3.5,
        FilterQ: 5.7636,
        FilterBWOct: 0.25,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 390,
        FilterGain: -8,
        FilterQ: 28.8525,
        FilterBWOct: 0.05,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 735,
        FilterGain: 11.5,
        FilterQ: 43.7171,
        FilterBWOct: 0.033,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 655,
        FilterGain: -6,
        FilterQ: 43.7171,
        FilterBWOct: 0.033,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 279,
        FilterGain: -9,
        FilterQ: 43.7171,
        FilterBWOct: 0.033,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 2825,
        FilterGain: -4.5,
        FilterQ: 21.5308,
        FilterBWOct: 0.067,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 224,
        FilterGain: -5.5,
        FilterQ: 14.4241,
        FilterBWOct: 0.1,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 1062,
        FilterGain: -6,
        FilterQ: 21.5308,
        FilterBWOct: 0.067,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 2143,
        FilterGain: -3.5,
        FilterQ: 21.5308,
        FilterBWOct: 0.067,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 3206,
        FilterGain: -3.5,
        FilterQ: 17.3795,
        FilterBWOct: 0.083,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 769,
        FilterGain: -4,
        FilterQ: 21.5308,
        FilterBWOct: 0.067,
      },
    ],
  });
});

test("rew-Generic", () => {
  const filePath =
    "/Users/perivar/development/REWEQ2EQPresetOrig/genelec eq filters 4 Generic.txt";
  const fileContent = fs.readFileSync(filePath, "utf8");
  const actual = REWEQ.readREWEQFiltersFromString(fileContent, ",");

  if (DO_DEBUG_OBJECT) console.log(JSON.stringify(actual, null, 2));
  expect(toPlainObject(actual)).toStrictEqual({
    EqBands: [
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 91.9,
        FilterGain: 10.4,
        FilterQ: 2,
        FilterBWOct: 0.714,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 136,
        FilterGain: -17.7,
        FilterQ: 10.43,
        FilterBWOct: 0.1383,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 171,
        FilterGain: -9.4,
        FilterQ: 7.56,
        FilterBWOct: 0.1907,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 249,
        FilterGain: -6.3,
        FilterQ: 37,
        FilterBWOct: 0.039,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 63.8,
        FilterGain: -5,
        FilterQ: 8.06,
        FilterBWOct: 0.1789,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 1275,
        FilterGain: -5.4,
        FilterQ: 11.31,
        FilterBWOct: 0.1275,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 154,
        FilterGain: 14.1,
        FilterQ: 13.38,
        FilterBWOct: 0.1078,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 505,
        FilterGain: 10.7,
        FilterQ: 34.38,
        FilterBWOct: 0.042,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 1887,
        FilterGain: 7.7,
        FilterQ: 15.78,
        FilterBWOct: 0.0914,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 5123,
        FilterGain: -3.5,
        FilterQ: 6,
        FilterBWOct: 0.2402,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 389,
        FilterGain: -7.8,
        FilterQ: 33.62,
        FilterBWOct: 0.0429,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 735,
        FilterGain: 11.7,
        FilterQ: 42.83,
        FilterBWOct: 0.0337,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 653,
        FilterGain: -6,
        FilterQ: 42.36,
        FilterBWOct: 0.0341,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 280,
        FilterGain: -8.9,
        FilterQ: 39.13,
        FilterBWOct: 0.0369,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 2830,
        FilterGain: -4.7,
        FilterQ: 22.73,
        FilterBWOct: 0.0635,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 225,
        FilterGain: -5.4,
        FilterQ: 14.96,
        FilterBWOct: 0.0964,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 1066,
        FilterGain: -5.8,
        FilterQ: 22.81,
        FilterBWOct: 0.0632,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 2135,
        FilterGain: -3.6,
        FilterQ: 22.59,
        FilterBWOct: 0.0639,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 3210,
        FilterGain: -3.3,
        FilterQ: 16.57,
        FilterBWOct: 0.0871,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 771,
        FilterGain: -4,
        FilterQ: 23.54,
        FilterBWOct: 0.0613,
      },
    ],
  });
});
