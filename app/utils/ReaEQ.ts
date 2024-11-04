import { BinaryFile } from "./BinaryFile";
import { FXP, FxProgramSet } from "./FXP";
import { REWEQFilters, REWEQFilterType } from "./REWEQ";

export enum ReaEQFilterType {
  LowShelf = 0,
  HighShelf = 1,
  Band = 8,
  LowPass = 3,
  HighPass = 4,
  AllPass = 5,
  Notch = 6,
  BandPass = 7,
  Band_alt = 9,
  Band_alt2 = 2,
}

export class ReaEQBand {
  FilterType: ReaEQFilterType;
  Enabled: boolean;
  FilterFreq: number; // value range 20.0 -> 24000.0 Hz
  FilterGain: number; // value range -90.0 (inf) -> 24.0 dB (Store the inverse=10^(dBVal/20))
  FilterBWOct: number; // value range 0.01 -> 4.00
  LogScaleAutoFreq: boolean = true;

  constructor() {
    this.FilterType = ReaEQFilterType.Band;
    this.Enabled = true;
    this.FilterFreq = 0;
    this.FilterGain = 0;
    this.FilterBWOct = 0;
  }

  toString(): string {
    return `${this.FilterType}: ${this.FilterFreq} Hz  ${this.FilterGain} dB  BWOct: ${this.FilterBWOct}`;
  }
}

/**
 * Function for converting a REW filter set to a ReaEQ preset.
 */
export function Convert2ReaEQ(filters: REWEQFilters): FXP | undefined {
  const ReaEqBands: ReaEQBand[] = filters.EqBands.map(filter => {
    const band = new ReaEQBand();
    band.FilterFreq = filter.FilterFreq;
    band.FilterGain = filter.FilterGain;
    band.FilterBWOct = filter.FilterBWOct;
    band.Enabled = filter.Enabled;

    switch (filter.FilterType) {
      case REWEQFilterType.PK:
        band.FilterType = ReaEQFilterType.Band;
        break;
      case REWEQFilterType.LP:
        band.FilterType = ReaEQFilterType.LowPass;
        break;
      case REWEQFilterType.HP:
        band.FilterType = ReaEQFilterType.HighPass;
        break;
      case REWEQFilterType.LS:
        band.FilterType = ReaEQFilterType.LowShelf;
        break;
      case REWEQFilterType.HS:
        band.FilterType = ReaEQFilterType.HighShelf;
        break;
      default:
        band.FilterType = ReaEQFilterType.Band;
        break;
    }
    return band;
  });

  // store as fxp
  const fxp = new FXP();
  const fxpContent = new FxProgramSet();
  fxp.content = fxpContent;
  fxpContent.ChunkMagic = "CcnK";
  fxpContent.ByteSize = 0; // will be set correctly by FXP class
  fxpContent.FxMagic = "FPCh"; // FPCh = FXP (preset), FBCh = FXB (bank)
  fxpContent.Version = 1; // Format Version (should be 1)
  fxpContent.FxID = "reeq";
  fxpContent.FxVersion = 1100;
  fxpContent.NumPrograms = 1;
  fxpContent.Name = "";

  const bf = new BinaryFile();
  bf.binaryWriter?.writeInt32(33);
  bf.binaryWriter?.writeInt32(ReaEqBands.length);

  for (const band of ReaEqBands) {
    bf.binaryWriter?.writeInt32(band.FilterType);
    bf.binaryWriter?.writeInt32(band.Enabled ? 1 : 0);
    bf.binaryWriter?.writeFloat64(band.FilterFreq);
    bf.binaryWriter?.writeFloat64(Decibel2AmplitudeRatio(band.FilterGain));
    bf.binaryWriter?.writeFloat64(band.FilterBWOct);
    bf.binaryWriter?.writeInt8(1);
  }

  bf.binaryWriter?.writeInt32(1);
  bf.binaryWriter?.writeInt32(1);
  bf.binaryWriter?.writeFloat64(Decibel2AmplitudeRatio(0.0));
  bf.binaryWriter?.writeInt32(0);

  // Retrieve the buffer and convert it to Uint8Array
  const buffer = bf.binaryWriter?.getBuffer();
  if (buffer) {
    const ChunkData = new Uint8Array(buffer);

    fxpContent.ChunkSize = ChunkData.length;
    fxpContent.ChunkData = ChunkData;

    return fxp;
  }

  return undefined;
}

// Amplitude ratio to dB conversion
// For amplitude of waves like voltage, current and sound pressure level:
// GdB = 20 * log10(A2 / A1)
// A2 is the amplitude level.
// A1 is the referenced amplitude level.
// GdB is the amplitude ratio or gain in dB.
export function AmplitudeRatio2Decibel(value: number): number {
  return 20 * Math.log10(value);
}

// dB to amplitude ratio conversion
// A2 = A1 * 10^(GdB / 20)
// A2 is the amplitude level.
// A1 is the referenced amplitude level.
export function Decibel2AmplitudeRatio(value: number): number {
  return Math.pow(10, value / 20);
}
