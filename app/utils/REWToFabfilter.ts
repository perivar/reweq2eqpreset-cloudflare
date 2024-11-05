import {
  FabfilterProQ,
  ProQBand,
  ProQLPHPSlope,
  ProQShape,
  ProQStereoPlacement,
} from "./FabfilterProQ";
import {
  FabfilterProQ2,
  ProQ2Band,
  ProQ2Shape,
  ProQ2Slope,
  ProQ2StereoPlacement,
} from "./FabfilterProQ2";
import {
  FabfilterProQ3,
  ProQ3Band,
  ProQ3Shape,
  ProQ3Slope,
  ProQ3StereoPlacement,
} from "./FabfilterProQ3";
import { FabfilterProQBase } from "./FabfilterProQBase";
import { REWEQBand, REWEQFilters, REWEQFilterType } from "./REWEQ";

/**
 * Function for converting a REW filter set to a Fabfilter Pro Q1 preset.
 */
export function toFabfilterProQ(filters: REWEQFilters): FabfilterProQ {
  const preset = new FabfilterProQ();
  preset.Version = 2;
  preset.Bands = [];

  filters.EqBands.forEach((filter: REWEQBand) => {
    const band = new ProQBand();
    band.Frequency = filter.FilterFreq;
    band.Gain = filter.FilterGain;
    band.Q = filter.FilterQ;
    band.Enabled = filter.Enabled;

    // Map REWEQ filter types to Fabfilter ProQ shapes
    switch (filter.FilterType) {
      case REWEQFilterType.PK:
        band.Shape = ProQShape.Bell;
        break;
      case REWEQFilterType.LP:
        band.Shape = ProQShape.HighCut;
        break;
      case REWEQFilterType.HP:
        band.Shape = ProQShape.LowCut;
        break;
      case REWEQFilterType.LS:
        band.Shape = ProQShape.LowShelf;
        break;
      case REWEQFilterType.HS:
        band.Shape = ProQShape.HighShelf;
        break;
      default:
        band.Shape = ProQShape.Bell;
        break;
    }
    band.LPHPSlope = ProQLPHPSlope.Slope24dB_oct;
    band.StereoPlacement = ProQStereoPlacement.Stereo;

    preset.Bands.push(band);
  });

  // Fill with empty bands up to a maximum of 24 bands
  for (let i = preset.Bands.length; i < 24; i++) {
    const band = new ProQBand();
    band.Frequency = FabfilterProQBase.freqConvert(1000);
    band.Gain = 0;
    band.Q = FabfilterProQBase.qConvert(1);
    band.Enabled = false;
    band.Shape = ProQShape.Bell;
    band.LPHPSlope = ProQLPHPSlope.Slope24dB_oct;
    band.StereoPlacement = ProQStereoPlacement.Stereo;

    preset.Bands.push(band);
  }

  // Set additional preset properties
  preset.OutputGain = 0; // -1 to 1 (-Infinity to +36 dB, 0 = 0 dB)
  preset.OutputPan = 0; // -1 to 1 (0 = center)
  preset.DisplayRange = 2; // 0 = 6dB, 1 = 12dB, 2 = 30dB, 3 = 3dB
  preset.ProcessMode = 0; // 0 = zero latency, 1 = lin. phase low to max
  preset.ChannelMode = 0; // 0 = Left/Right, 1 = Mid/Side
  preset.Bypass = 0; // 0 = No bypass
  preset.ReceiveMidi = 0; // 0 = Enabled?
  preset.Analyzer = 3; // 0 = Off, 1 = Pre, 2 = Post, 3 = Pre+Post
  preset.AnalyzerResolution = 1; // 0 - 3 : low, med[x], high, max
  preset.AnalyzerSpeed = 2; // 0 - 3 : very slow, slow, med[x], fast
  preset.SoloBand = -1; // -1 (no band solo)

  return preset;
}

/**
 * Function for converting a REW filter set to a Fabfilter Pro Q2 preset.
 */
export function toFabfilterProQ2(filters: REWEQFilters): FabfilterProQ2 {
  const preset = new FabfilterProQ2();
  preset.Bands = [];

  filters.EqBands.forEach((filter: REWEQBand) => {
    const band = new ProQ2Band();
    band.Frequency = filter.FilterFreq;
    band.Gain = filter.FilterGain;
    band.Q = filter.FilterQ;
    band.Enabled = filter.Enabled;

    // Map REWEQ filter types to Fabfilter ProQ shapes
    switch (filter.FilterType) {
      case REWEQFilterType.PK:
        band.Shape = ProQ2Shape.Bell;
        break;
      case REWEQFilterType.LP:
        band.Shape = ProQ2Shape.HighCut;
        break;
      case REWEQFilterType.HP:
        band.Shape = ProQ2Shape.LowCut;
        break;
      case REWEQFilterType.LS:
        band.Shape = ProQ2Shape.LowShelf;
        break;
      case REWEQFilterType.HS:
        band.Shape = ProQ2Shape.HighShelf;
        break;
      default:
        band.Shape = ProQ2Shape.Bell;
        break;
    }
    band.Slope = ProQ2Slope.Slope24dB_oct;
    band.StereoPlacement = ProQ2StereoPlacement.Stereo;

    preset.Bands.push(band);
  });

  // Fill with empty bands up to a maximum of 24 bands
  for (let i = preset.Bands.length; i < 24; i++) {
    const band = new ProQ2Band();
    band.Frequency = FabfilterProQBase.freqConvert(1000);
    band.Gain = 0;
    band.Q = FabfilterProQBase.qConvert(1);
    band.Enabled = false;
    band.Shape = ProQ2Shape.Bell;
    band.Slope = ProQ2Slope.Slope24dB_oct;
    band.StereoPlacement = ProQ2StereoPlacement.Stereo;

    preset.Bands.push(band);
  }

  return preset;
}

/**
 * Function for converting a REW filter set to a Fabfilter Pro Q3 preset.
 */
export function toFabfilterProQ3(filters: REWEQFilters): FabfilterProQ3 {
  const preset = new FabfilterProQ3();
  preset.Bands = [];

  filters.EqBands.forEach((filter: REWEQBand) => {
    const band = new ProQ3Band();
    band.Frequency = filter.FilterFreq;
    band.Gain = filter.FilterGain;
    band.Q = filter.FilterQ;
    band.Enabled = filter.Enabled;

    // Map REWEQ filter types to Fabfilter ProQ shapes
    switch (filter.FilterType) {
      case REWEQFilterType.PK:
        band.Shape = ProQ3Shape.Bell;
        break;
      case REWEQFilterType.LP:
        band.Shape = ProQ3Shape.HighCut;
        break;
      case REWEQFilterType.HP:
        band.Shape = ProQ3Shape.LowCut;
        break;
      case REWEQFilterType.LS:
        band.Shape = ProQ3Shape.LowShelf;
        break;
      case REWEQFilterType.HS:
        band.Shape = ProQ3Shape.HighShelf;
        break;
      default:
        band.Shape = ProQ3Shape.Bell;
        break;
    }
    band.Slope = ProQ3Slope.Slope24dB_oct;
    band.StereoPlacement = ProQ3StereoPlacement.Stereo;

    preset.Bands.push(band);
  });

  // Fill with empty bands up to a maximum of 24 bands
  for (let i = preset.Bands.length; i < 24; i++) {
    const band = new ProQ3Band();
    band.Frequency = FabfilterProQBase.freqConvert(1000);
    band.Gain = 0;
    band.Q = FabfilterProQBase.qConvert(1);
    band.Enabled = false;
    band.Shape = ProQ3Shape.Bell;
    band.Slope = ProQ3Slope.Slope24dB_oct;
    band.StereoPlacement = ProQ3StereoPlacement.Stereo;

    preset.Bands.push(band);
  }

  return preset;
}
