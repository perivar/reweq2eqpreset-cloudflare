import * as fs from "fs";
import * as path from "path";

import { Convert2ReaEQ, ReaEQ, ReaEQBand, ReaEQFilterType } from "../ReaEQ";
import { REWEQ } from "../REWEQ";
import { areTypedArraysEqual, toPlainObject } from "./helpers/testUtils";

// set this to true to debug the outputs as objects
const DO_DEBUG_OBJECT = false;

test("Convert2ReaEQ", () => {
  const filePath = path.join(
    __dirname,
    "data/genelec eq filters 6 Generic max boost.txt"
  );
  const fileContent = fs.readFileSync(filePath, "utf8");
  const filters = REWEQ.readREWEQFiltersFromString(fileContent, ",");
  const fxp = filters && Convert2ReaEQ(filters);
  const uint8ArrayWrite = fxp?.writeFile();

  // if (DO_DEBUG_OBJECT) console.log(JSON.stringify(actual, null, 2));

  const destFilePath = path.join(
    __dirname,
    "data/ReaEQ/genelec eq filters 6 Generic max boost.fxp"
  );
  const destFileContent = fs.readFileSync(destFilePath);
  const uint8ArrayRead = new Uint8Array(destFileContent);

  if (uint8ArrayWrite) {
    // const filePathWrite = path.join(
    //   __dirname,
    //   "data/genelec eq filters 6 Generic max boost_tmp.fxp"
    // );
    // fs.writeFileSync(filePathWrite, uint8Array);

    expect(areTypedArraysEqual(uint8ArrayRead, uint8ArrayWrite)).toBe(true);
  }
});

test("ReaEQ-write-and-read", () => {
  // Create a ReaEQ preset with known values
  const sourceReaEQ = new ReaEQ();

  // Add test bands
  const band1 = new ReaEQBand();
  band1.FilterType = ReaEQFilterType.Band;
  band1.Enabled = true;
  band1.FilterFreq = 1000;
  band1.FilterGain = -3;
  band1.FilterBWOct = 1;
  sourceReaEQ.Bands.push(band1);

  const band2 = new ReaEQBand();
  band2.FilterType = ReaEQFilterType.LowShelf;
  band2.Enabled = true;
  band2.FilterFreq = 100;
  band2.FilterGain = 6.0;
  band2.FilterBWOct = 0.5;
  sourceReaEQ.Bands.push(band2);

  const band3 = new ReaEQBand();
  band3.FilterType = ReaEQFilterType.HighShelf;
  band3.Enabled = true;
  band3.FilterFreq = 10000;
  band3.FilterGain = -2;
  band3.FilterBWOct = 0.7;
  sourceReaEQ.Bands.push(band3);

  // Write to FXP
  const fxp = sourceReaEQ.Convert2FXP();
  const uint8Array = fxp.writeFile();

  // Read back
  const targetReaEQ = new ReaEQ();
  expect(targetReaEQ.ReadFXP(uint8Array!)).toBe(true);

  if (DO_DEBUG_OBJECT) {
    console.log("Source:", JSON.stringify(sourceReaEQ, null, 2));
    console.log("Target:", JSON.stringify(targetReaEQ, null, 2));
  }

  // Compare objects
  expect(toPlainObject(targetReaEQ)).toStrictEqual(toPlainObject(sourceReaEQ));
});

test("ReaEQ-readFXP-Generic-object", () => {
  const filePath = path.join(
    __dirname,
    "data/ReaEQ/genelec eq filters 6 Generic max boost.fxp"
  );
  const fileContent = fs.readFileSync(filePath);
  const uint8ArrayRead = new Uint8Array(fileContent);

  const reaEQRead = new ReaEQ();
  reaEQRead.ReadFXP(uint8ArrayRead);
  if (DO_DEBUG_OBJECT) console.log(JSON.stringify(reaEQRead, null, 2));

  const uint8ArrayWrite = reaEQRead.Convert2FXP()?.writeFile();
  if (uint8ArrayWrite) {
    const reaEQWrite = new ReaEQ();
    reaEQWrite.ReadFXP(uint8ArrayWrite);
    if (DO_DEBUG_OBJECT) console.log(JSON.stringify(reaEQWrite, null, 2));

    expect(toPlainObject(reaEQRead)).toStrictEqual(toPlainObject(reaEQWrite));
  }
});

test("ReaEQ-readFXP-Generic-array", () => {
  const filePath = path.join(
    __dirname,
    "data/ReaEQ/genelec eq filters 6 Generic max boost.fxp"
  );
  const fileContent = fs.readFileSync(filePath);
  const uint8ArrayRead = new Uint8Array(fileContent);

  const reaEQRead = new ReaEQ();
  reaEQRead.ReadFXP(uint8ArrayRead);
  if (DO_DEBUG_OBJECT) console.log(JSON.stringify(reaEQRead, null, 2));

  const uint8ArrayWrite = reaEQRead.Convert2FXP()?.writeFile();
  if (uint8ArrayWrite) {
    expect(areTypedArraysEqual(uint8ArrayRead, uint8ArrayWrite)).toBe(true);

    // Uncomment to write test file
    // const filePathWrite = path.join(
    //   __dirname,
    //   "data/ReaEQ/genelec eq filters 6 Generic max boost_tmp.fxp"
    // );
    // fs.writeFileSync(filePathWrite, uint8ArrayWrite);
  }
});
