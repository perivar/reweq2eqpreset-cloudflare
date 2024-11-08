import * as fs from "fs";
import * as path from "path";

import { FabfilterProQ2 } from "../FabfilterProQ2";
import { areTypedArraysEqual, toPlainObject } from "./helpers/testUtils";

// set this to true to debug the outputs as objects
const DO_DEBUG_OBJECT = false;

test("FabfilterProQ2-readFFP-LCHC", () => {
  const filePath = path.join(
    __dirname,
    "data/Fabfilter/Q2-LowCut 32Hz HighCut 8500Hz.ffp"
  );
  const fileContent = fs.readFileSync(filePath);
  const uint8Array = new Uint8Array(fileContent);

  const proQ = new FabfilterProQ2();
  proQ.ReadFFP(uint8Array);

  if (DO_DEBUG_OBJECT) console.log(JSON.stringify(proQ, null, 2));
  expect(toPlainObject(proQ)).toStrictEqual({
    Bands: [
      {
        ChannelMode: 0,
        Enabled: true,
        Frequency: 8499.996301132896,
        Gain: 0,
        Q: 1,
        Shape: 4,
        Slope: 3,
        StereoPlacement: 2,
      },
      {
        ChannelMode: 0,
        Enabled: true,
        Frequency: 32,
        Gain: -0.41666698455810547,
        Q: 1,
        Shape: 2,
        Slope: 1,
        StereoPlacement: 2,
      },
      {
        ChannelMode: 0,
        Enabled: false,
        Frequency: 999.9998532010654,
        Gain: 0,
        Q: 1,
        Shape: 0,
        Slope: 1,
        StereoPlacement: 2,
      },
      {
        ChannelMode: 0,
        Enabled: false,
        Frequency: 999.9998532010654,
        Gain: 0,
        Q: 1,
        Shape: 0,
        Slope: 1,
        StereoPlacement: 2,
      },
      {
        ChannelMode: 0,
        Enabled: false,
        Frequency: 999.9998532010654,
        Gain: 0,
        Q: 1,
        Shape: 0,
        Slope: 1,
        StereoPlacement: 2,
      },
      {
        ChannelMode: 0,
        Enabled: false,
        Frequency: 999.9998532010654,
        Gain: 0,
        Q: 1,
        Shape: 0,
        Slope: 1,
        StereoPlacement: 2,
      },
      {
        ChannelMode: 0,
        Enabled: false,
        Frequency: 999.9998532010654,
        Gain: 0,
        Q: 1,
        Shape: 0,
        Slope: 1,
        StereoPlacement: 2,
      },
      {
        ChannelMode: 0,
        Enabled: false,
        Frequency: 999.9998532010654,
        Gain: 0,
        Q: 1,
        Shape: 0,
        Slope: 1,
        StereoPlacement: 2,
      },
      {
        ChannelMode: 0,
        Enabled: false,
        Frequency: 999.9998532010654,
        Gain: 0,
        Q: 1,
        Shape: 0,
        Slope: 1,
        StereoPlacement: 2,
      },
      {
        ChannelMode: 0,
        Enabled: false,
        Frequency: 999.9998532010654,
        Gain: 0,
        Q: 1,
        Shape: 0,
        Slope: 1,
        StereoPlacement: 2,
      },
      {
        ChannelMode: 0,
        Enabled: false,
        Frequency: 999.9998532010654,
        Gain: 0,
        Q: 1,
        Shape: 0,
        Slope: 1,
        StereoPlacement: 2,
      },
      {
        ChannelMode: 0,
        Enabled: false,
        Frequency: 999.9998532010654,
        Gain: 0,
        Q: 1,
        Shape: 0,
        Slope: 1,
        StereoPlacement: 2,
      },
      {
        ChannelMode: 0,
        Enabled: false,
        Frequency: 999.9998532010654,
        Gain: 0,
        Q: 1,
        Shape: 0,
        Slope: 1,
        StereoPlacement: 2,
      },
      {
        ChannelMode: 0,
        Enabled: false,
        Frequency: 999.9998532010654,
        Gain: 0,
        Q: 1,
        Shape: 0,
        Slope: 1,
        StereoPlacement: 2,
      },
      {
        ChannelMode: 0,
        Enabled: false,
        Frequency: 999.9998532010654,
        Gain: 0,
        Q: 1,
        Shape: 0,
        Slope: 1,
        StereoPlacement: 2,
      },
      {
        ChannelMode: 0,
        Enabled: false,
        Frequency: 999.9998532010654,
        Gain: 0,
        Q: 1,
        Shape: 0,
        Slope: 1,
        StereoPlacement: 2,
      },
      {
        ChannelMode: 0,
        Enabled: false,
        Frequency: 999.9998532010654,
        Gain: 0,
        Q: 1,
        Shape: 0,
        Slope: 1,
        StereoPlacement: 2,
      },
      {
        ChannelMode: 0,
        Enabled: false,
        Frequency: 999.9998532010654,
        Gain: 0,
        Q: 1,
        Shape: 0,
        Slope: 1,
        StereoPlacement: 2,
      },
      {
        ChannelMode: 0,
        Enabled: false,
        Frequency: 999.9998532010654,
        Gain: 0,
        Q: 1,
        Shape: 0,
        Slope: 1,
        StereoPlacement: 2,
      },
      {
        ChannelMode: 0,
        Enabled: false,
        Frequency: 999.9998532010654,
        Gain: 0,
        Q: 1,
        Shape: 0,
        Slope: 1,
        StereoPlacement: 2,
      },
      {
        ChannelMode: 0,
        Enabled: false,
        Frequency: 999.9998532010654,
        Gain: 0,
        Q: 1,
        Shape: 0,
        Slope: 1,
        StereoPlacement: 2,
      },
      {
        ChannelMode: 0,
        Enabled: false,
        Frequency: 999.9998532010654,
        Gain: 0,
        Q: 1,
        Shape: 0,
        Slope: 1,
        StereoPlacement: 2,
      },
      {
        ChannelMode: 0,
        Enabled: false,
        Frequency: 999.9998532010654,
        Gain: 0,
        Q: 1,
        Shape: 0,
        Slope: 1,
        StereoPlacement: 2,
      },
      {
        ChannelMode: 0,
        Enabled: false,
        Frequency: 999.9998532010654,
        Gain: 0,
        Q: 1,
        Shape: 0,
        Slope: 1,
        StereoPlacement: 2,
      },
    ],
    Version: 2,
    ParameterCount: 190,
    ProcessingMode: 0,
    ProcessingResolution: 1,
    ChannelMode: 0,
    GainScale: 1,
    OutputLevel: 0,
    OutputPan: 0,
    ByPass: 0,
    OutputInvertPhase: 0,
    AutoGain: 0,
    AnalyzerShowPreProcessing: 1,
    AnalyzerShowPostProcessing: 1,
    AnalyzerShowSidechain: 0,
    AnalyzerRange: 1,
    AnalyzerResolution: 1,
    AnalyzerSpeed: 2,
    AnalyzerTilt: 3,
    AnalyzerFreeze: 0,
    SpectrumGrab: 1,
    DisplayRange: 2,
    ReceiveMidi: 0,
    SoloBand: -1,
    SoloGain: 0,
  });
});

test("FabfilterProQ2-readFFP-LCHC-object", () => {
  const filePath = path.join(
    __dirname,
    "data/Fabfilter/Q2-LowCut 32Hz HighCut 8500Hz.ffp"
  );
  const fileContent = fs.readFileSync(filePath);
  const uint8ArrayRead = new Uint8Array(fileContent);

  const proQRead = new FabfilterProQ2();
  proQRead.ReadFFP(uint8ArrayRead);
  if (DO_DEBUG_OBJECT) console.log(JSON.stringify(proQRead, null, 2));

  const uint8ArrayWrite = proQRead.writeFFP();
  if (uint8ArrayWrite) {
    const proQWrite = new FabfilterProQ2();
    proQWrite.ReadFFP(uint8ArrayWrite);
    if (DO_DEBUG_OBJECT) console.log(JSON.stringify(proQWrite, null, 2));

    expect(toPlainObject(proQRead)).toStrictEqual(toPlainObject(proQWrite));
  }
});

test("FabfilterProQ2-readFFP-LCHC-array", () => {
  const filePath = path.join(
    __dirname,
    "data/Fabfilter/Q2-LowCut 32Hz HighCut 8500Hz.ffp"
  );
  const fileContent = fs.readFileSync(filePath);
  const uint8ArrayRead = new Uint8Array(fileContent);

  const proQRead = new FabfilterProQ2();
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
