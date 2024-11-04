import {
  FabfilterProQ,
  ProQBand,
  ProQLPHPSlope,
  ProQShape,
  ProQStereoPlacement,
} from "./FabfilterProQ";
import { FabfilterProQBase } from "./FabfilterProQBase";
import { REWEQBand, REWEQFilters, REWEQFilterType } from "./REWEQ";

/**
 * Class for converting a REW filter set to a Fabfilter ProQ preset.
 */
export function toFabfilterProQ(filters: REWEQFilters): FabfilterProQ {
  const preset = new FabfilterProQ();
  preset.version = 2;
  preset.bands = [];

  filters.EqBands.forEach((filter: REWEQBand) => {
    const band = new ProQBand();
    band.frequency = filter.FilterFreq;
    band.gain = filter.FilterGain;
    band.q = filter.FilterQ;
    band.enabled = filter.Enabled;

    // Map REWEQ filter types to Fabfilter ProQ shapes
    switch (filter.FilterType) {
      case REWEQFilterType.PK:
        band.shape = ProQShape.Bell;
        break;
      case REWEQFilterType.LP:
        band.shape = ProQShape.HighCut;
        break;
      case REWEQFilterType.HP:
        band.shape = ProQShape.LowCut;
        break;
      case REWEQFilterType.LS:
        band.shape = ProQShape.LowShelf;
        break;
      case REWEQFilterType.HS:
        band.shape = ProQShape.HighShelf;
        break;
      default:
        band.shape = ProQShape.Bell;
        break;
    }
    band.lphpSlope = ProQLPHPSlope.Slope24dB_oct;
    band.stereoPlacement = ProQStereoPlacement.Stereo;

    preset.bands.push(band);
  });

  // Fill with empty bands up to a maximum of 24 bands
  for (let i = preset.bands.length; i < 24; i++) {
    const band = new ProQBand();
    band.frequency = FabfilterProQBase.freqConvert(1000);
    band.gain = 0;
    band.q = FabfilterProQBase.qConvert(1);
    band.enabled = false;
    band.shape = ProQShape.Bell;
    band.lphpSlope = ProQLPHPSlope.Slope24dB_oct;
    band.stereoPlacement = ProQStereoPlacement.Stereo;

    preset.bands.push(band);
  }

  // Set additional preset properties
  preset.outputGain = 0; // -1 to 1 (-Infinity to +36 dB, 0 = 0 dB)
  preset.outputPan = 0; // -1 to 1 (0 = center)
  preset.displayRange = 2; // 0 = 6dB, 1 = 12dB, 2 = 30dB, 3 = 3dB
  preset.processMode = 0; // 0 = zero latency, 1 = lin. phase low to max
  preset.channelMode = 0; // 0 = Left/Right, 1 = Mid/Side
  preset.bypass = 0; // 0 = No bypass
  preset.receiveMidi = 0; // 0 = Enabled?
  preset.analyzer = 3; // 0 = Off, 1 = Pre, 2 = Post, 3 = Pre+Post
  preset.analyzerResolution = 1; // 0 - 3 : low, med[x], high, max
  preset.analyzerSpeed = 2; // 0 - 3 : very slow, slow, med[x], fast
  preset.soloBand = -1; // -1 (no band solo)

  return preset;
}
