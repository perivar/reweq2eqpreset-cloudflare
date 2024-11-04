import * as fs from "fs";
import * as path from "path";

import { FabfilterProQ } from "../FabfilterProQ";
import { areTypedArraysEqual, toPlainObject } from "./helpers/testUtils";

// set this to true to debug the outputs as objects
const DO_DEBUG_OBJECT = false;

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
    Bands: [
      {
        ChannelMode: 0,
        Frequency: 63.49999856791864,
        Gain: -5.400000095367432,
        Q: 2.930000619635644,
        Shape: 0,
        LPHPSlope: 2,
        StereoPlacement: 2,
        Enabled: true,
      },
      {
        ChannelMode: 0,
        Frequency: 91.60000743063648,
        Gain: 14.199999809265137,
        Q: 2.000000221193361,
        Shape: 0,
        LPHPSlope: 2,
        StereoPlacement: 2,
        Enabled: true,
      },
      {
        ChannelMode: 0,
        Frequency: 136.00000573326327,
        Gain: -18.399999618530273,
        Q: 8.640001298418513,
        Shape: 0,
        LPHPSlope: 2,
        StereoPlacement: 2,
        Enabled: true,
      },
      {
        ChannelMode: 0,
        Frequency: 154.00000369576526,
        Gain: 16.600000381469727,
        Q: 14.309998912061054,
        Shape: 0,
        LPHPSlope: 2,
        StereoPlacement: 2,
        Enabled: true,
      },
      {
        ChannelMode: 0,
        Frequency: 169.99999884797205,
        Gain: -9.600000381469727,
        Q: 6.850001290908702,
        Shape: 0,
        LPHPSlope: 2,
        StereoPlacement: 2,
        Enabled: true,
      },
      {
        ChannelMode: 0,
        Frequency: 226.00000363125704,
        Gain: -5.800000190734863,
        Q: 15.939997427734745,
        Shape: 0,
        LPHPSlope: 2,
        StereoPlacement: 2,
        Enabled: true,
      },
      {
        ChannelMode: 0,
        Frequency: 249.00000231750545,
        Gain: -6.900000095367432,
        Q: 41.2700029649085,
        Shape: 0,
        LPHPSlope: 2,
        StereoPlacement: 2,
        Enabled: true,
      },
      {
        ChannelMode: 0,
        Frequency: 279.9999872702164,
        Gain: -8,
        Q: 30.07999388503878,
        Shape: 0,
        LPHPSlope: 2,
        StereoPlacement: 2,
        Enabled: true,
      },
      {
        ChannelMode: 0,
        Frequency: 388.99997471761327,
        Gain: -8.399999618530273,
        Q: 36.65999424543927,
        Shape: 0,
        LPHPSlope: 2,
        StereoPlacement: 2,
        Enabled: true,
      },
      {
        ChannelMode: 0,
        Frequency: 505.0000541586765,
        Gain: 12.199999809265137,
        Q: 39.39000088710455,
        Shape: 0,
        LPHPSlope: 2,
        StereoPlacement: 2,
        Enabled: true,
      },
      {
        ChannelMode: 0,
        Frequency: 653.9998764895852,
        Gain: -6.900000095367432,
        Q: 48.17000896963813,
        Shape: 0,
        LPHPSlope: 2,
        StereoPlacement: 2,
        Enabled: true,
      },
      {
        ChannelMode: 0,
        Frequency: 735.0001444546682,
        Gain: 10.600000381469727,
        Q: 39.0100060721537,
        Shape: 0,
        LPHPSlope: 2,
        StereoPlacement: 2,
        Enabled: true,
      },
      {
        ChannelMode: 0,
        Frequency: 769.9999808004303,
        Gain: -4.699999809265137,
        Q: 31.56000101802961,
        Shape: 0,
        LPHPSlope: 2,
        StereoPlacement: 2,
        Enabled: true,
      },
      {
        ChannelMode: 0,
        Frequency: 1066.9998749079991,
        Gain: -5.900000095367432,
        Q: 22.689998034382448,
        Shape: 0,
        LPHPSlope: 2,
        StereoPlacement: 2,
        Enabled: true,
      },
      {
        ChannelMode: 0,
        Frequency: 1274.999811686392,
        Gain: -5.699999809265137,
        Q: 12.910001916393572,
        Shape: 0,
        LPHPSlope: 2,
        StereoPlacement: 2,
        Enabled: true,
      },
      {
        ChannelMode: 0,
        Frequency: 1888.9995452751323,
        Gain: 7.5,
        Q: 14.750000710721164,
        Shape: 0,
        LPHPSlope: 2,
        StereoPlacement: 2,
        Enabled: true,
      },
      {
        ChannelMode: 0,
        Frequency: 2129.0006209201365,
        Gain: -3.4000000953674316,
        Q: 18.320002686639455,
        Shape: 0,
        LPHPSlope: 2,
        StereoPlacement: 2,
        Enabled: true,
      },
      {
        ChannelMode: 0,
        Frequency: 2829.000763765784,
        Gain: -5.199999809265137,
        Q: 28.59000004906813,
        Shape: 0,
        LPHPSlope: 2,
        StereoPlacement: 2,
        Enabled: true,
      },
      {
        ChannelMode: 0,
        Frequency: 3220.999353792972,
        Gain: -3,
        Q: 13.400001044051006,
        Shape: 0,
        LPHPSlope: 2,
        StereoPlacement: 2,
        Enabled: true,
      },
      {
        ChannelMode: 0,
        Frequency: 5126.000610734414,
        Gain: -3.4000000953674316,
        Q: 5.910000231194475,
        Shape: 0,
        LPHPSlope: 2,
        StereoPlacement: 2,
        Enabled: true,
      },
      {
        ChannelMode: 0,
        Frequency: 999.9998532010654,
        Gain: 0,
        Q: 1,
        Shape: 0,
        LPHPSlope: 2,
        StereoPlacement: 2,
        Enabled: false,
      },
      {
        ChannelMode: 0,
        Frequency: 999.9998532010654,
        Gain: 0,
        Q: 1,
        Shape: 0,
        LPHPSlope: 2,
        StereoPlacement: 2,
        Enabled: false,
      },
      {
        ChannelMode: 0,
        Frequency: 999.9998532010654,
        Gain: 0,
        Q: 1,
        Shape: 0,
        LPHPSlope: 2,
        StereoPlacement: 2,
        Enabled: false,
      },
      {
        ChannelMode: 0,
        Frequency: 999.9998532010654,
        Gain: 0,
        Q: 1,
        Shape: 0,
        LPHPSlope: 2,
        StereoPlacement: 2,
        Enabled: false,
      },
    ],
    Version: 2,
    ParameterCount: 180,
    OutputGain: 0,
    OutputPan: 0,
    DisplayRange: 2,
    ProcessMode: 0,
    ChannelMode: 0,
    Bypass: 0,
    ReceiveMidi: 0,
    Analyzer: 3,
    AnalyzerResolution: 1,
    AnalyzerSpeed: 2,
    SoloBand: -1,
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
