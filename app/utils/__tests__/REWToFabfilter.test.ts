import * as fs from "fs";
import * as path from "path";

import { REWEQ } from "../REWEQ";
import { toFabfilterProQ } from "../REWToFabfilter";
import { toPlainObject } from "./helpers/testUtils";

// set this to true to debug the outputs as objects
const DO_DEBUG_OBJECT = false;

test("rew-Generic-6", () => {
  const filePath = path.join(
    __dirname,
    "data/genelec eq filters 6 Generic max boost.txt"
  );
  const fileContent = fs.readFileSync(filePath, "utf8");
  const filters = REWEQ.readREWEQFiltersFromString(fileContent, ",");
  const actual = filters && toFabfilterProQ(filters);

  if (DO_DEBUG_OBJECT) console.log(JSON.stringify(actual, null, 2));
  expect(toPlainObject(actual)).toStrictEqual({
    bands: [
      {
        channelMode: 0,
        frequency: 63.5,
        gain: -5.4,
        q: 2.93,
        shape: 0,
        lphpSlope: 2,
        stereoPlacement: 2,
        enabled: true,
      },
      {
        channelMode: 0,
        frequency: 91.6,
        gain: 14.2,
        q: 2,
        shape: 0,
        lphpSlope: 2,
        stereoPlacement: 2,
        enabled: true,
      },
      {
        channelMode: 0,
        frequency: 136,
        gain: -18.4,
        q: 8.64,
        shape: 0,
        lphpSlope: 2,
        stereoPlacement: 2,
        enabled: true,
      },
      {
        channelMode: 0,
        frequency: 154,
        gain: 16.6,
        q: 14.31,
        shape: 0,
        lphpSlope: 2,
        stereoPlacement: 2,
        enabled: true,
      },
      {
        channelMode: 0,
        frequency: 170,
        gain: -9.6,
        q: 6.85,
        shape: 0,
        lphpSlope: 2,
        stereoPlacement: 2,
        enabled: true,
      },
      {
        channelMode: 0,
        frequency: 226,
        gain: -5.8,
        q: 15.94,
        shape: 0,
        lphpSlope: 2,
        stereoPlacement: 2,
        enabled: true,
      },
      {
        channelMode: 0,
        frequency: 249,
        gain: -6.9,
        q: 41.27,
        shape: 0,
        lphpSlope: 2,
        stereoPlacement: 2,
        enabled: true,
      },
      {
        channelMode: 0,
        frequency: 280,
        gain: -8,
        q: 30.08,
        shape: 0,
        lphpSlope: 2,
        stereoPlacement: 2,
        enabled: true,
      },
      {
        channelMode: 0,
        frequency: 389,
        gain: -8.4,
        q: 36.66,
        shape: 0,
        lphpSlope: 2,
        stereoPlacement: 2,
        enabled: true,
      },
      {
        channelMode: 0,
        frequency: 505,
        gain: 12.2,
        q: 39.39,
        shape: 0,
        lphpSlope: 2,
        stereoPlacement: 2,
        enabled: true,
      },
      {
        channelMode: 0,
        frequency: 654,
        gain: -6.9,
        q: 48.17,
        shape: 0,
        lphpSlope: 2,
        stereoPlacement: 2,
        enabled: true,
      },
      {
        channelMode: 0,
        frequency: 735,
        gain: 10.6,
        q: 39.01,
        shape: 0,
        lphpSlope: 2,
        stereoPlacement: 2,
        enabled: true,
      },
      {
        channelMode: 0,
        frequency: 770,
        gain: -4.7,
        q: 31.56,
        shape: 0,
        lphpSlope: 2,
        stereoPlacement: 2,
        enabled: true,
      },
      {
        channelMode: 0,
        frequency: 1067,
        gain: -5.9,
        q: 22.69,
        shape: 0,
        lphpSlope: 2,
        stereoPlacement: 2,
        enabled: true,
      },
      {
        channelMode: 0,
        frequency: 1275,
        gain: -5.7,
        q: 12.91,
        shape: 0,
        lphpSlope: 2,
        stereoPlacement: 2,
        enabled: true,
      },
      {
        channelMode: 0,
        frequency: 1889,
        gain: 7.5,
        q: 14.75,
        shape: 0,
        lphpSlope: 2,
        stereoPlacement: 2,
        enabled: true,
      },
      {
        channelMode: 0,
        frequency: 2129,
        gain: -3.4,
        q: 18.32,
        shape: 0,
        lphpSlope: 2,
        stereoPlacement: 2,
        enabled: true,
      },
      {
        channelMode: 0,
        frequency: 2829,
        gain: -5.2,
        q: 28.59,
        shape: 0,
        lphpSlope: 2,
        stereoPlacement: 2,
        enabled: true,
      },
      {
        channelMode: 0,
        frequency: 3221,
        gain: -3,
        q: 13.4,
        shape: 0,
        lphpSlope: 2,
        stereoPlacement: 2,
        enabled: true,
      },
      {
        channelMode: 0,
        frequency: 5126,
        gain: -3.4,
        q: 5.91,
        shape: 0,
        lphpSlope: 2,
        stereoPlacement: 2,
        enabled: true,
      },
      {
        channelMode: 0,
        frequency: 9.965784284662087,
        gain: 0,
        q: 0.5,
        shape: 0,
        lphpSlope: 2,
        stereoPlacement: 2,
        enabled: false,
      },
      {
        channelMode: 0,
        frequency: 9.965784284662087,
        gain: 0,
        q: 0.5,
        shape: 0,
        lphpSlope: 2,
        stereoPlacement: 2,
        enabled: false,
      },
      {
        channelMode: 0,
        frequency: 9.965784284662087,
        gain: 0,
        q: 0.5,
        shape: 0,
        lphpSlope: 2,
        stereoPlacement: 2,
        enabled: false,
      },
      {
        channelMode: 0,
        frequency: 9.965784284662087,
        gain: 0,
        q: 0.5,
        shape: 0,
        lphpSlope: 2,
        stereoPlacement: 2,
        enabled: false,
      },
    ],
    version: 2,
    parameterCount: 190,
    outputGain: 0,
    outputPan: 0,
    displayRange: 2,
    processMode: 0,
    channelMode: 0,
    bypass: 0,
    receiveMidi: 0,
    analyzer: 3,
    analyzerResolution: 1,
    analyzerSpeed: 2,
    soloBand: -1,
  });
});
