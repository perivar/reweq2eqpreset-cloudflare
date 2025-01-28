import * as fs from "fs";
import * as path from "path";

import { REWEQ } from "../REWEQ";
import { toPlainObject } from "./helpers/testUtils";

// set this to true to debug the outputs as objects
const DO_DEBUG_OBJECT = true;

test("rew-FBQ2496-4", () => {
  const filePath = path.join(
    __dirname,
    "data/genelec eq filters 4 FBQ2496.txt"
  );
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
        FilterBWHz: 48.0522,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 137,
        FilterGain: -17,
        FilterQ: 10.0846,
        FilterBWOct: 0.143,
        FilterBWHz: 13.5851,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 170,
        FilterGain: -9.5,
        FilterQ: 7.2077,
        FilterBWOct: 0.2,
        FilterBWHz: 23.5859,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 249,
        FilterGain: -6.5,
        FilterQ: 43.7171,
        FilterBWOct: 0.033,
        FilterBWHz: 5.6957,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 64,
        FilterGain: -5,
        FilterQ: 8.6341,
        FilterBWOct: 0.167,
        FilterBWHz: 7.4125,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 1276,
        FilterGain: -5.5,
        FilterQ: 11.538,
        FilterBWOct: 0.125,
        FilterBWHz: 110.5911,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 155,
        FilterGain: 14,
        FilterQ: 12.994,
        FilterBWOct: 0.111,
        FilterBWHz: 11.9286,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 502,
        FilterGain: 10.5,
        FilterQ: 43.7171,
        FilterBWOct: 0.033,
        FilterBWHz: 11.4829,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 1888,
        FilterGain: 7.5,
        FilterQ: 17.3795,
        FilterBWOct: 0.083,
        FilterBWHz: 108.6337,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 5141,
        FilterGain: -3.5,
        FilterQ: 5.7636,
        FilterBWOct: 0.25,
        FilterBWHz: 891.9772,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 390,
        FilterGain: -8,
        FilterQ: 28.8525,
        FilterBWOct: 0.05,
        FilterBWHz: 13.517,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 735,
        FilterGain: 11.5,
        FilterQ: 43.7171,
        FilterBWOct: 0.033,
        FilterBWHz: 16.8126,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 655,
        FilterGain: -6,
        FilterQ: 43.7171,
        FilterBWOct: 0.033,
        FilterBWHz: 14.9827,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 279,
        FilterGain: -9,
        FilterQ: 43.7171,
        FilterBWOct: 0.033,
        FilterBWHz: 6.3819,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 2825,
        FilterGain: -4.5,
        FilterQ: 21.5308,
        FilterBWOct: 0.067,
        FilterBWHz: 131.2074,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 224,
        FilterGain: -5.5,
        FilterQ: 14.4241,
        FilterBWOct: 0.1,
        FilterBWHz: 15.5296,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 1062,
        FilterGain: -6,
        FilterQ: 21.5308,
        FilterBWOct: 0.067,
        FilterBWHz: 49.3247,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 2143,
        FilterGain: -3.5,
        FilterQ: 21.5308,
        FilterBWOct: 0.067,
        FilterBWHz: 99.5318,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 3206,
        FilterGain: -3.5,
        FilterQ: 17.3795,
        FilterBWOct: 0.083,
        FilterBWHz: 184.4702,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 769,
        FilterGain: -4,
        FilterQ: 21.5308,
        FilterBWOct: 0.067,
        FilterBWHz: 35.7163,
      },
    ],
  });
});

test("rew-Generic-4", () => {
  const filePath = path.join(
    __dirname,
    "data/genelec eq filters 4 Generic.txt"
  );
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
        FilterBWHz: 45.95,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 136,
        FilterGain: -17.7,
        FilterQ: 10.43,
        FilterBWOct: 0.1383,
        FilterBWHz: 13.0393,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 171,
        FilterGain: -9.4,
        FilterQ: 7.56,
        FilterBWOct: 0.1907,
        FilterBWHz: 22.619,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 249,
        FilterGain: -6.3,
        FilterQ: 37,
        FilterBWOct: 0.039,
        FilterBWHz: 6.7297,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 63.8,
        FilterGain: -5,
        FilterQ: 8.06,
        FilterBWOct: 0.1789,
        FilterBWHz: 7.9156,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 1275,
        FilterGain: -5.4,
        FilterQ: 11.31,
        FilterBWOct: 0.1275,
        FilterBWHz: 112.7321,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 154,
        FilterGain: 14.1,
        FilterQ: 13.38,
        FilterBWOct: 0.1078,
        FilterBWHz: 11.5097,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 505,
        FilterGain: 10.7,
        FilterQ: 34.38,
        FilterBWOct: 0.042,
        FilterBWHz: 14.6888,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 1887,
        FilterGain: 7.7,
        FilterQ: 15.78,
        FilterBWOct: 0.0914,
        FilterBWHz: 119.5817,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 5123,
        FilterGain: -3.5,
        FilterQ: 6,
        FilterBWOct: 0.2402,
        FilterBWHz: 853.8333,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 389,
        FilterGain: -7.8,
        FilterQ: 33.62,
        FilterBWOct: 0.0429,
        FilterBWHz: 11.5705,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 735,
        FilterGain: 11.7,
        FilterQ: 42.83,
        FilterBWOct: 0.0337,
        FilterBWHz: 17.1609,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 653,
        FilterGain: -6,
        FilterQ: 42.36,
        FilterBWOct: 0.0341,
        FilterBWHz: 15.4155,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 280,
        FilterGain: -8.9,
        FilterQ: 39.13,
        FilterBWOct: 0.0369,
        FilterBWHz: 7.1556,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 2830,
        FilterGain: -4.7,
        FilterQ: 22.73,
        FilterBWOct: 0.0635,
        FilterBWHz: 124.5051,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 225,
        FilterGain: -5.4,
        FilterQ: 14.96,
        FilterBWOct: 0.0964,
        FilterBWHz: 15.0401,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 1066,
        FilterGain: -5.8,
        FilterQ: 22.81,
        FilterBWOct: 0.0632,
        FilterBWHz: 46.7339,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 2135,
        FilterGain: -3.6,
        FilterQ: 22.59,
        FilterBWOct: 0.0639,
        FilterBWHz: 94.5108,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 3210,
        FilterGain: -3.3,
        FilterQ: 16.57,
        FilterBWOct: 0.0871,
        FilterBWHz: 193.7236,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 771,
        FilterGain: -4,
        FilterQ: 23.54,
        FilterBWOct: 0.0613,
        FilterBWHz: 32.7528,
      },
    ],
  });
});

test("rew-FBQ2496-5", () => {
  const filePath = path.join(
    __dirname,
    "data/genelec eq filters 5 FBQ2496.txt"
  );
  const fileContent = fs.readFileSync(filePath, "utf8");
  const actual = REWEQ.readREWEQFiltersFromString(fileContent, ",");

  if (DO_DEBUG_OBJECT) console.log(JSON.stringify(actual, null, 2));
  expect(toPlainObject(actual)).toStrictEqual({
    EqBands: [
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 64,
        FilterGain: -5,
        FilterQ: 8.6341,
        FilterBWOct: 0.167,
        FilterBWHz: 7.4125,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 91.4,
        FilterGain: 10.5,
        FilterQ: 1.9021,
        FilterBWOct: 0.75,
        FilterBWHz: 48.0522,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 137,
        FilterGain: -17,
        FilterQ: 10.0846,
        FilterBWOct: 0.143,
        FilterBWHz: 13.5851,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 155,
        FilterGain: 14,
        FilterQ: 12.994,
        FilterBWOct: 0.111,
        FilterBWHz: 11.9286,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 170,
        FilterGain: -9.5,
        FilterQ: 7.2077,
        FilterBWOct: 0.2,
        FilterBWHz: 23.5859,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 224,
        FilterGain: -5.5,
        FilterQ: 14.4241,
        FilterBWOct: 0.1,
        FilterBWHz: 15.5296,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 249,
        FilterGain: -6.5,
        FilterQ: 43.7171,
        FilterBWOct: 0.033,
        FilterBWHz: 5.6957,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 279,
        FilterGain: -9,
        FilterQ: 43.7171,
        FilterBWOct: 0.033,
        FilterBWHz: 6.3819,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 390,
        FilterGain: -8,
        FilterQ: 28.8525,
        FilterBWOct: 0.05,
        FilterBWHz: 13.517,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 502,
        FilterGain: 10.5,
        FilterQ: 43.7171,
        FilterBWOct: 0.033,
        FilterBWHz: 11.4829,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 655,
        FilterGain: -6,
        FilterQ: 43.7171,
        FilterBWOct: 0.033,
        FilterBWHz: 14.9827,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 735,
        FilterGain: 11.5,
        FilterQ: 43.7171,
        FilterBWOct: 0.033,
        FilterBWHz: 16.8126,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 769,
        FilterGain: -4,
        FilterQ: 21.5308,
        FilterBWOct: 0.067,
        FilterBWHz: 35.7163,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 1062,
        FilterGain: -6,
        FilterQ: 21.5308,
        FilterBWOct: 0.067,
        FilterBWHz: 49.3247,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 1276,
        FilterGain: -5.5,
        FilterQ: 11.538,
        FilterBWOct: 0.125,
        FilterBWHz: 110.5911,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 1888,
        FilterGain: 7.5,
        FilterQ: 17.3795,
        FilterBWOct: 0.083,
        FilterBWHz: 108.6337,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 2143,
        FilterGain: -3.5,
        FilterQ: 21.5308,
        FilterBWOct: 0.067,
        FilterBWHz: 99.5318,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 2825,
        FilterGain: -4.5,
        FilterQ: 21.5308,
        FilterBWOct: 0.067,
        FilterBWHz: 131.2074,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 3206,
        FilterGain: -3.5,
        FilterQ: 17.3795,
        FilterBWOct: 0.083,
        FilterBWHz: 184.4702,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 5141,
        FilterGain: -3.5,
        FilterQ: 5.7636,
        FilterBWOct: 0.25,
        FilterBWHz: 891.9772,
      },
    ],
  });
});

test("rew-Generic-5", () => {
  const filePath = path.join(
    __dirname,
    "data/genelec eq filters 5 Generic.txt"
  );
  const fileContent = fs.readFileSync(filePath, "utf8");
  const actual = REWEQ.readREWEQFiltersFromString(fileContent, ",");

  if (DO_DEBUG_OBJECT) console.log(JSON.stringify(actual, null, 2));
  expect(toPlainObject(actual)).toStrictEqual({
    EqBands: [
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 63.8,
        FilterGain: -5,
        FilterQ: 8.06,
        FilterBWOct: 0.1789,
        FilterBWHz: 7.9156,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 91.9,
        FilterGain: 10.4,
        FilterQ: 2,
        FilterBWOct: 0.714,
        FilterBWHz: 45.95,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 136,
        FilterGain: -17.7,
        FilterQ: 10.43,
        FilterBWOct: 0.1383,
        FilterBWHz: 13.0393,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 154,
        FilterGain: 14.1,
        FilterQ: 13.38,
        FilterBWOct: 0.1078,
        FilterBWHz: 11.5097,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 171,
        FilterGain: -9.4,
        FilterQ: 7.56,
        FilterBWOct: 0.1907,
        FilterBWHz: 22.619,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 225,
        FilterGain: -5.4,
        FilterQ: 14.96,
        FilterBWOct: 0.0964,
        FilterBWHz: 15.0401,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 249,
        FilterGain: -6.3,
        FilterQ: 37,
        FilterBWOct: 0.039,
        FilterBWHz: 6.7297,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 280,
        FilterGain: -8.9,
        FilterQ: 39.13,
        FilterBWOct: 0.0369,
        FilterBWHz: 7.1556,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 389,
        FilterGain: -7.8,
        FilterQ: 33.62,
        FilterBWOct: 0.0429,
        FilterBWHz: 11.5705,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 505,
        FilterGain: 10.7,
        FilterQ: 34.38,
        FilterBWOct: 0.042,
        FilterBWHz: 14.6888,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 653,
        FilterGain: -6,
        FilterQ: 42.36,
        FilterBWOct: 0.0341,
        FilterBWHz: 15.4155,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 735,
        FilterGain: 11.7,
        FilterQ: 42.83,
        FilterBWOct: 0.0337,
        FilterBWHz: 17.1609,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 771,
        FilterGain: -4,
        FilterQ: 23.54,
        FilterBWOct: 0.0613,
        FilterBWHz: 32.7528,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 1066,
        FilterGain: -5.8,
        FilterQ: 22.81,
        FilterBWOct: 0.0632,
        FilterBWHz: 46.7339,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 1275,
        FilterGain: -5.4,
        FilterQ: 11.31,
        FilterBWOct: 0.1275,
        FilterBWHz: 112.7321,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 1887,
        FilterGain: 7.7,
        FilterQ: 15.78,
        FilterBWOct: 0.0914,
        FilterBWHz: 119.5817,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 2135,
        FilterGain: -3.6,
        FilterQ: 22.59,
        FilterBWOct: 0.0639,
        FilterBWHz: 94.5108,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 2830,
        FilterGain: -4.7,
        FilterQ: 22.73,
        FilterBWOct: 0.0635,
        FilterBWHz: 124.5051,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 3210,
        FilterGain: -3.3,
        FilterQ: 16.57,
        FilterBWOct: 0.0871,
        FilterBWHz: 193.7236,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 5123,
        FilterGain: -3.5,
        FilterQ: 6,
        FilterBWOct: 0.2402,
        FilterBWHz: 853.8333,
      },
    ],
  });
});

test("rew-Generic-hometheatershack", () => {
  const filePath = path.join(
    __dirname,
    "data/hometheatershack-eq-filters-generic-testfr.txt"
  );
  const fileContent = fs.readFileSync(filePath, "utf8");
  const actual = REWEQ.readREWEQFiltersFromString(fileContent, ".");

  if (DO_DEBUG_OBJECT) console.log(JSON.stringify(actual, null, 2));
  expect(toPlainObject(actual)).toStrictEqual({
    EqBands: [
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 22.6,
        FilterGain: -9.4,
        FilterQ: 10.09,
        FilterBWOct: 0.1429,
        FilterBWHz: 2.2398,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 27.6,
        FilterGain: -16.1,
        FilterQ: 11.16,
        FilterBWOct: 0.1292,
        FilterBWHz: 2.4731,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 28.5,
        FilterGain: 12,
        FilterQ: 2,
        FilterBWOct: 0.714,
        FilterBWHz: 14.25,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 34.5,
        FilterGain: -5.4,
        FilterQ: 4.02,
        FilterBWOct: 0.358,
        FilterBWHz: 8.5821,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 42.6,
        FilterGain: 1.7,
        FilterQ: 6.7,
        FilterBWOct: 0.2151,
        FilterBWHz: 6.3582,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 51.7,
        FilterGain: -8.2,
        FilterQ: 18.08,
        FilterBWOct: 0.0798,
        FilterBWHz: 2.8595,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 64.8,
        FilterGain: 12,
        FilterQ: 8.29,
        FilterBWOct: 0.1739,
        FilterBWHz: 7.8166,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 66.9,
        FilterGain: -5.3,
        FilterQ: 31.69,
        FilterBWOct: 0.0455,
        FilterBWHz: 2.1111,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 77.8,
        FilterGain: -7.3,
        FilterQ: 2.88,
        FilterBWOct: 0.4985,
        FilterBWHz: 27.0139,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 128,
        FilterGain: 11.2,
        FilterQ: 7.92,
        FilterBWOct: 0.182,
        FilterBWHz: 16.1616,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 146,
        FilterGain: -4.8,
        FilterQ: 7.97,
        FilterBWOct: 0.1809,
        FilterBWHz: 18.3187,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 176,
        FilterGain: -7.9,
        FilterQ: 4,
        FilterBWOct: 0.3597,
        FilterBWHz: 44,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 208,
        FilterGain: -6.6,
        FilterQ: 30.91,
        FilterBWOct: 0.0467,
        FilterBWHz: 6.7292,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 219,
        FilterGain: 12,
        FilterQ: 4.14,
        FilterBWOct: 0.3476,
        FilterBWHz: 52.8986,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 232,
        FilterGain: -10.6,
        FilterQ: 18.13,
        FilterBWOct: 0.0796,
        FilterBWHz: 12.7965,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 301,
        FilterGain: -10.5,
        FilterQ: 5.9,
        FilterBWOct: 0.2442,
        FilterBWHz: 51.0169,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 344,
        FilterGain: 12,
        FilterQ: 2.62,
        FilterBWOct: 0.5474,
        FilterBWHz: 131.2977,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 398,
        FilterGain: -9.1,
        FilterQ: 4.68,
        FilterBWOct: 0.3077,
        FilterBWHz: 85.0427,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 613,
        FilterGain: -5,
        FilterQ: 45.32,
        FilterBWOct: 0.0318,
        FilterBWHz: 13.526,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 688,
        FilterGain: 7,
        FilterQ: 45.76,
        FilterBWOct: 0.0315,
        FilterBWHz: 15.035,
      },
    ],
  });
});

test("rew-Generic-sirblew new", () => {
  const filePath = path.join(__dirname, "data/sirblew new generic.txt");
  const fileContent = fs.readFileSync(filePath, "utf8");
  const actual = REWEQ.readREWEQFiltersFromString(fileContent, ".");

  if (DO_DEBUG_OBJECT) console.log(JSON.stringify(actual, null, 2));
  expect(toPlainObject(actual)).toStrictEqual({
    EqBands: [
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 52,
        FilterGain: -7.8,
        FilterQ: 3.76,
        FilterBWOct: 0.3826,
        FilterBWHz: 13.8298,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 63,
        FilterGain: -4.8,
        FilterQ: 6.9,
        FilterBWOct: 0.2089,
        FilterBWHz: 9.1304,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 95,
        FilterGain: 11.5,
        FilterQ: 6.1,
        FilterBWOct: 0.2362,
        FilterBWHz: 15.5738,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 116,
        FilterGain: -17.9,
        FilterQ: 6.04,
        FilterBWOct: 0.2386,
        FilterBWHz: 19.2053,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 159,
        FilterGain: 12,
        FilterQ: 7.5,
        FilterBWOct: 0.1922,
        FilterBWHz: 21.2,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 174,
        FilterGain: -13.4,
        FilterQ: 5.27,
        FilterBWOct: 0.2733,
        FilterBWHz: 33.0171,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 208,
        FilterGain: 6.9,
        FilterQ: 7.5,
        FilterBWOct: 0.1922,
        FilterBWHz: 27.7333,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 916,
        FilterGain: -4.4,
        FilterQ: 5.46,
        FilterBWOct: 0.2639,
        FilterBWHz: 167.7656,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 1315,
        FilterGain: 3.5,
        FilterQ: 4.81,
        FilterBWOct: 0.2994,
        FilterBWHz: 273.3888,
      },
      {
        FilterType: 0,
        Enabled: true,
        FilterFreq: 2091,
        FilterGain: -3.3,
        FilterQ: 4.91,
        FilterBWOct: 0.2933,
        FilterBWHz: 425.8656,
      },
    ],
  });
});
