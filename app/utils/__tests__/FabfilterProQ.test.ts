import * as fs from "fs";
import * as path from "path";

import { FabfilterProQ } from "../FabfilterProQ";
import { areTypedArraysEqual, toPlainObject } from "./helpers/testUtils";

// set this to true to debug the outputs as objects
const DO_DEBUG_OBJECT = true;

test("rew-Generic-6-readFFP", () => {
  const filePath = path.join(
    __dirname,
    "data/genelec eq filters 6 Generic max boost.ffp"
  );
  const fileContent = fs.readFileSync(filePath);
  const uint8Array = new Uint8Array(fileContent);

  const proQ = new FabfilterProQ();
  proQ.ReadFFP(uint8Array);

  if (DO_DEBUG_OBJECT) console.log(JSON.stringify(proQ, null, 2));
  expect(toPlainObject(proQ)).toStrictEqual({
    bands: [
      {
        channelMode: 0,
        frequency: 63.49999856791864,
        gain: -5.400000095367432,
        q: 2.930000619635644,
        shape: 0,
        lphpSlope: 2,
        stereoPlacement: 2,
        enabled: true,
      },
      {
        channelMode: 0,
        frequency: 91.60000743063648,
        gain: 14.199999809265137,
        q: 2.000000221193361,
        shape: 0,
        lphpSlope: 2,
        stereoPlacement: 2,
        enabled: true,
      },
      {
        channelMode: 0,
        frequency: 136.00000573326327,
        gain: -18.399999618530273,
        q: 8.640001298418513,
        shape: 0,
        lphpSlope: 2,
        stereoPlacement: 2,
        enabled: true,
      },
      {
        channelMode: 0,
        frequency: 154.00000369576526,
        gain: 16.600000381469727,
        q: 14.309998912061054,
        shape: 0,
        lphpSlope: 2,
        stereoPlacement: 2,
        enabled: true,
      },
      {
        channelMode: 0,
        frequency: 169.99999884797205,
        gain: -9.600000381469727,
        q: 6.850001290908702,
        shape: 0,
        lphpSlope: 2,
        stereoPlacement: 2,
        enabled: true,
      },
      {
        channelMode: 0,
        frequency: 226.00000363125704,
        gain: -5.800000190734863,
        q: 15.939997427734745,
        shape: 0,
        lphpSlope: 2,
        stereoPlacement: 2,
        enabled: true,
      },
      {
        channelMode: 0,
        frequency: 249.00000231750545,
        gain: -6.900000095367432,
        q: 41.2700029649085,
        shape: 0,
        lphpSlope: 2,
        stereoPlacement: 2,
        enabled: true,
      },
      {
        channelMode: 0,
        frequency: 279.9999872702164,
        gain: -8,
        q: 30.07999388503878,
        shape: 0,
        lphpSlope: 2,
        stereoPlacement: 2,
        enabled: true,
      },
      {
        channelMode: 0,
        frequency: 388.99997471761327,
        gain: -8.399999618530273,
        q: 36.65999424543927,
        shape: 0,
        lphpSlope: 2,
        stereoPlacement: 2,
        enabled: true,
      },
      {
        channelMode: 0,
        frequency: 505.0000541586765,
        gain: 12.199999809265137,
        q: 39.39000088710455,
        shape: 0,
        lphpSlope: 2,
        stereoPlacement: 2,
        enabled: true,
      },
      {
        channelMode: 0,
        frequency: 653.9998764895852,
        gain: -6.900000095367432,
        q: 48.17000896963813,
        shape: 0,
        lphpSlope: 2,
        stereoPlacement: 2,
        enabled: true,
      },
      {
        channelMode: 0,
        frequency: 735.0001444546682,
        gain: 10.600000381469727,
        q: 39.0100060721537,
        shape: 0,
        lphpSlope: 2,
        stereoPlacement: 2,
        enabled: true,
      },
      {
        channelMode: 0,
        frequency: 769.9999808004303,
        gain: -4.699999809265137,
        q: 31.56000101802961,
        shape: 0,
        lphpSlope: 2,
        stereoPlacement: 2,
        enabled: true,
      },
      {
        channelMode: 0,
        frequency: 1066.9998749079991,
        gain: -5.900000095367432,
        q: 22.689998034382448,
        shape: 0,
        lphpSlope: 2,
        stereoPlacement: 2,
        enabled: true,
      },
      {
        channelMode: 0,
        frequency: 1274.999811686392,
        gain: -5.699999809265137,
        q: 12.910001916393572,
        shape: 0,
        lphpSlope: 2,
        stereoPlacement: 2,
        enabled: true,
      },
      {
        channelMode: 0,
        frequency: 1888.9995452751323,
        gain: 7.5,
        q: 14.750000710721164,
        shape: 0,
        lphpSlope: 2,
        stereoPlacement: 2,
        enabled: true,
      },
      {
        channelMode: 0,
        frequency: 2129.0006209201365,
        gain: -3.4000000953674316,
        q: 18.320002686639455,
        shape: 0,
        lphpSlope: 2,
        stereoPlacement: 2,
        enabled: true,
      },
      {
        channelMode: 0,
        frequency: 2829.000763765784,
        gain: -5.199999809265137,
        q: 28.59000004906813,
        shape: 0,
        lphpSlope: 2,
        stereoPlacement: 2,
        enabled: true,
      },
      {
        channelMode: 0,
        frequency: 3220.999353792972,
        gain: -3,
        q: 13.400001044051006,
        shape: 0,
        lphpSlope: 2,
        stereoPlacement: 2,
        enabled: true,
      },
      {
        channelMode: 0,
        frequency: 5126.000610734414,
        gain: -3.4000000953674316,
        q: 5.910000231194475,
        shape: 0,
        lphpSlope: 2,
        stereoPlacement: 2,
        enabled: true,
      },
      {
        channelMode: 0,
        frequency: 999.9998532010654,
        gain: 0,
        q: 1,
        shape: 0,
        lphpSlope: 2,
        stereoPlacement: 2,
        enabled: false,
      },
      {
        channelMode: 0,
        frequency: 999.9998532010654,
        gain: 0,
        q: 1,
        shape: 0,
        lphpSlope: 2,
        stereoPlacement: 2,
        enabled: false,
      },
      {
        channelMode: 0,
        frequency: 999.9998532010654,
        gain: 0,
        q: 1,
        shape: 0,
        lphpSlope: 2,
        stereoPlacement: 2,
        enabled: false,
      },
      {
        channelMode: 0,
        frequency: 999.9998532010654,
        gain: 0,
        q: 1,
        shape: 0,
        lphpSlope: 2,
        stereoPlacement: 2,
        enabled: false,
      },
    ],
    version: 2,
    parameterCount: 180,
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

test("rew-Generic-6-read-write-FFP-object", () => {
  const filePath = path.join(
    __dirname,
    "data/genelec eq filters 6 Generic max boost.ffp"
  );
  const fileContent = fs.readFileSync(filePath);
  const uint8ArrayRead = new Uint8Array(fileContent);

  const proQRead = new FabfilterProQ();
  proQRead.ReadFFP(uint8ArrayRead);
  if (DO_DEBUG_OBJECT) console.log(JSON.stringify(proQRead, null, 2));

  const uint8ArrayWrite = proQRead.writeFFP();
  if (uint8ArrayWrite) {
    const proQWrite = new FabfilterProQ();
    proQWrite.ReadFFP(uint8ArrayWrite);
    if (DO_DEBUG_OBJECT) console.log(JSON.stringify(proQWrite, null, 2));

    expect(toPlainObject(proQRead)).toStrictEqual(toPlainObject(proQWrite));
  }
});

test("rew-Generic-6-read-write-FFP-array", () => {
  const filePath = path.join(
    __dirname,
    "data/genelec eq filters 6 Generic max boost.ffp"
  );
  const fileContent = fs.readFileSync(filePath);
  const uint8ArrayRead = new Uint8Array(fileContent);

  const proQRead = new FabfilterProQ();
  proQRead.ReadFFP(uint8ArrayRead);
  if (DO_DEBUG_OBJECT) console.log(JSON.stringify(proQRead, null, 2));

  const uint8ArrayWrite = proQRead.writeFFP();
  if (uint8ArrayWrite) {
    expect(areTypedArraysEqual(uint8ArrayRead, uint8ArrayWrite)).toBe(true);

    // const filePathWrite = path.join(
    //   __dirname,
    //   "data/genelec eq filters 6 Generic max boost_tmp.ffp"
    // );
    // fs.writeFileSync(filePathWrite, uint8ArrayWrite);
  }
});
