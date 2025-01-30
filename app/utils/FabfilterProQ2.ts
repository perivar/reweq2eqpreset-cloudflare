import { BinaryFile, ByteOrder } from "./BinaryFile";
import { FabfilterProQBase } from "./FabfilterProQBase";

export enum ProQ2Shape {
  Bell = 0, // (default)
  LowShelf = 1,
  LowCut = 2,
  HighShelf = 3,
  HighCut = 4,
  Notch = 5,
  BandPass = 6,
  TiltShelf = 7,
}

export enum ProQ2Slope {
  Slope6dB_oct = 0,
  Slope12dB_oct = 1,
  Slope18dB_oct = 2,
  Slope24dB_oct = 3, // (default)
  Slope30dB_oct = 4,
  Slope36dB_oct = 5,
  Slope48dB_oct = 6,
  Slope72dB_oct = 7,
  Slope96dB_oct = 8,
}

export enum ProQ2StereoPlacement {
  LeftOrMid = 0,
  RightOrSide = 1,
  Stereo = 2, // (default)
}

export enum ProQ2ChannelMode {
  LeftRight = 0,
  MidSide = 1,
}

export class ProQ2Band {
  ChannelMode: ProQ2ChannelMode; // determine if band is in LS or MS mode
  Enabled: boolean;
  Frequency: number; // value range 10.0 -> 30000.0 Hz
  Gain: number; // + or - value in dB
  Q: number; // value range 0.025 -> 40.00
  Shape: ProQ2Shape;
  Slope: ProQ2Slope;
  StereoPlacement: ProQ2StereoPlacement;

  constructor() {
    this.ChannelMode = ProQ2ChannelMode.LeftRight;
    this.Enabled = false;
    this.Frequency = FabfilterProQBase.freqConvert(1000);
    this.Gain = 0;
    this.Q = FabfilterProQBase.qConvert(1);
    this.Shape = ProQ2Shape.Bell;
    this.Slope = ProQ2Slope.Slope24dB_oct;
    this.StereoPlacement = ProQ2StereoPlacement.Stereo;
  }

  toString(): string {
    const shapeStr = ProQ2Shape[this.Shape];
    const slopeStr = ProQ2Slope[this.Slope];
    const placementStr = ProQ2StereoPlacement[this.StereoPlacement];
    const channelStr = ProQ2ChannelMode[this.ChannelMode];

    return (
      `${this.Enabled ? "Enabled" : "Disabled"} | ${channelStr} | ${placementStr} | ` +
      `${shapeStr} @ ${this.Frequency.toFixed(1)} Hz | ` +
      `Gain: ${this.Gain.toFixed(1)} dB | Q: ${this.Q.toFixed(2)} | ` +
      `${slopeStr}`
    );
  }
}

export class FabfilterProQ2 implements FabfilterProQBase {
  Bands: ProQ2Band[] = [];
  Version: number = 2; // Normally 2
  ParameterCount: number = 190; // Normally 190

  // Post Band Parameters
  ProcessingMode: number = 0; // Zero Latency: 0.0, Natural Phase: 1.0, Linear Phase: 2.0
  ProcessingResolution: number = 0; // Medium
  ChannelMode: number = 0; // 0 = Left/Right, 1 = Mid/Side
  GainScale: number = 0; // 100%
  OutputLevel: number = 0; // 0.0 dB, -1 to 1 (- Infinity to +36 dB , 0 = 0 dB)
  OutputPan: number = 0; // Left 0 dB, Right: 0 dB, -1 to 1 (0 = middle)
  ByPass: number = 0; // Not Bypassed
  OutputInvertPhase: number = 0; // Normal
  AutoGain: number = 0; // Off
  AnalyzerShowPreProcessing: number = 0; // Disabled - 0: Off, 1: On
  AnalyzerShowPostProcessing: number = 0; // Disabled - 0: Off, 1: On
  AnalyzerShowSidechain: number = 0; // Disabled - 0: Off, 1: On
  AnalyzerRange: number = 0; // Analyzer Range in dB. 0.0: 60dB, 1.0: 90dB, 2.0: 120dB
  AnalyzerResolution: number = 0; // Analyzer Resolution. 0.0: Low, 1.0: Medium, 2.0: High, 3.00: Maximum
  AnalyzerSpeed: number = 0; // Analyzer Speed. 0.0: Very Slow, 1.0: Slow, 2.0: Medium, 3.0 Fast, 4.0: Very Fast
  AnalyzerTilt: number = 0; // Analyzer Tilt in dB/oct. 0.0: 0.0, 1.0: 1.5, 2.0: 3.0, 3.0: 4.5, 4.0: 6.0
  AnalyzerFreeze: number = 0; // 0: Off, 1: On
  SpectrumGrab: number = 0; // Enabled
  DisplayRange: number = 0; // 12dB
  ReceiveMidi: number = 0; // Enabled
  SoloBand: number = -1; // -1
  SoloGain: number = 0; // 0.00

  // Ignore the Ex fields
  // public float ExAutoGain;                   // (Other): 0.00

  public ReadFFP(data: Uint8Array): boolean {
    const bf = new BinaryFile(data, ByteOrder.LittleEndian);

    const header = bf.binaryReader?.readString(4);
    if (header !== "FQ2p") return false;

    this.Version = bf.binaryReader?.readUInt32() || 0;
    this.ParameterCount = bf.binaryReader?.readUInt32() || 0;

    this.Bands = [];
    for (let i = 0; i < 24; i++) {
      const band = new ProQ2Band();

      // 1 = Enabled, 2 = Disabled
      band.Enabled = bf.binaryReader?.readFloat32() == 1 ? true : false;

      const freq = bf.binaryReader?.readFloat32() || 0;
      band.Frequency = FabfilterProQBase.freqConvertBack(freq);

      band.Gain = bf.binaryReader?.readFloat32() || 0; // actual gain in dB

      const q = bf.binaryReader?.readFloat32() || 0;
      band.Q = FabfilterProQBase.qConvertBack(q);

      // 0 - 7
      const filterType = bf.binaryReader?.readFloat32();
      switch (filterType) {
        case ProQ2Shape.Bell:
          band.Shape = ProQ2Shape.Bell;
          break;
        case ProQ2Shape.LowShelf:
          band.Shape = ProQ2Shape.LowShelf;
          break;
        case ProQ2Shape.LowCut:
          band.Shape = ProQ2Shape.LowCut;
          break;
        case ProQ2Shape.HighShelf:
          band.Shape = ProQ2Shape.HighShelf;
          break;
        case ProQ2Shape.HighCut:
          band.Shape = ProQ2Shape.HighCut;
          break;
        case ProQ2Shape.Notch:
          band.Shape = ProQ2Shape.Notch;
          break;
        case ProQ2Shape.BandPass:
          band.Shape = ProQ2Shape.BandPass;
          break;
        case ProQ2Shape.TiltShelf:
          band.Shape = ProQ2Shape.TiltShelf;
        default:
          throw new Error(`Filter type is outside range: ${filterType}`);
      }

      // 0 - 8
      const filterSlope = bf.binaryReader?.readFloat32();
      switch (filterSlope) {
        case ProQ2Slope.Slope6dB_oct:
          band.Slope = ProQ2Slope.Slope6dB_oct;
          break;
        case ProQ2Slope.Slope12dB_oct:
          band.Slope = ProQ2Slope.Slope12dB_oct;
          break;
        case ProQ2Slope.Slope18dB_oct:
          band.Slope = ProQ2Slope.Slope18dB_oct;
          break;
        case ProQ2Slope.Slope24dB_oct:
          band.Slope = ProQ2Slope.Slope24dB_oct;
          break;
        case ProQ2Slope.Slope30dB_oct:
          band.Slope = ProQ2Slope.Slope30dB_oct;
          break;
        case ProQ2Slope.Slope36dB_oct:
          band.Slope = ProQ2Slope.Slope36dB_oct;
          break;
        case ProQ2Slope.Slope48dB_oct:
          band.Slope = ProQ2Slope.Slope48dB_oct;
          break;
        case ProQ2Slope.Slope72dB_oct:
          band.Slope = ProQ2Slope.Slope72dB_oct;
          break;
        case ProQ2Slope.Slope96dB_oct:
          band.Slope = ProQ2Slope.Slope96dB_oct;
          break;
        default:
          throw new Error(`Filter slope is outside range: ${filterSlope}`);
      }

      // 0 = Left, 1 = Right, 2 = Stereo
      const filterStereoPlacement = bf.binaryReader?.readFloat32();
      switch (filterStereoPlacement) {
        case ProQ2StereoPlacement.LeftOrMid:
          band.StereoPlacement = ProQ2StereoPlacement.LeftOrMid;
          break;
        case ProQ2StereoPlacement.RightOrSide:
          band.StereoPlacement = ProQ2StereoPlacement.RightOrSide;
          break;
        case ProQ2StereoPlacement.Stereo:
          band.StereoPlacement = ProQ2StereoPlacement.Stereo;
          break;
        default:
          throw new Error(
            `Filter stereo placement is outside range: ${filterStereoPlacement}`
          );
      }

      this.Bands.push(band);
    }

    // read the remaining floats
    // int remainingParameterCount = ParameterCount - 7 * Bands.Count;
    try {
      this.ProcessingMode = bf.binaryReader?.readFloat32() || 0; // Zero Latency: 0.0, Natural Phase: 1.0, Linear Phase: 2.0
      this.ProcessingResolution = bf.binaryReader?.readFloat32() || 0; // 0 - 4, Medium
      this.ChannelMode = bf.binaryReader?.readFloat32() || 0; // 0 = Left/Right, 1 = Mid/Side
      this.GainScale = bf.binaryReader?.readFloat32() || 0; // 100%
      this.OutputLevel = bf.binaryReader?.readFloat32() || 0; // 0.0 dB, -1 to 1 (- Infinity to +36 dB , 0 = 0 dB)
      this.OutputPan = bf.binaryReader?.readFloat32() || 0; // Left 0 dB, Right: 0 dB, -1 to 1 (0 = middle)
      this.ByPass = bf.binaryReader?.readFloat32() || 0; // Not Bypassed
      this.OutputInvertPhase = bf.binaryReader?.readFloat32() || 0; // Normal
      this.AutoGain = bf.binaryReader?.readFloat32() || 0; // Off
      this.AnalyzerShowPreProcessing = bf.binaryReader?.readFloat32() || 0; // Disabled - 0: Off, 1: On
      this.AnalyzerShowPostProcessing = bf.binaryReader?.readFloat32() || 0; // Disabled - 0: Off, 1: On
      this.AnalyzerShowSidechain = bf.binaryReader?.readFloat32() || 0; // Disabled - 0: Off, 1: On
      this.AnalyzerRange = bf.binaryReader?.readFloat32() || 0; // Analyzer Range in dB. 0.0: 60dB, 1.0: 90dB, 2.0: 120dB
      this.AnalyzerResolution = bf.binaryReader?.readFloat32() || 0; // Analyzer Resolution. 0.0: Low, 1.0: Medium, 2.0: High, 3.00: Maximum
      this.AnalyzerSpeed = bf.binaryReader?.readFloat32() || 0; // Analyzer Speed. 0.0: Very Slow, 1.0: Slow, 2.0: Medium, 3.0 Fast, 4.0: Very Fast
      this.AnalyzerTilt = bf.binaryReader?.readFloat32() || 0; // Analyzer Tilt in dB/oct. 0.0: 0.0, 1.0: 1.5, 2.0: 3.0, 3.0: 4.5, 4.0: 6.0
      this.AnalyzerFreeze = bf.binaryReader?.readFloat32() || 0; // 0: Off, 1: On
      this.SpectrumGrab = bf.binaryReader?.readFloat32() || 0; // Enabled
      this.DisplayRange = bf.binaryReader?.readFloat32() || 0; // 12dB
      this.ReceiveMidi = bf.binaryReader?.readFloat32() || 0; // Enabled
      this.SoloBand = bf.binaryReader?.readFloat32() || 0; // -1
      this.SoloGain = bf.binaryReader?.readFloat32() || 0; // 0.00
    } catch (e) {
      console.error("Error reading additional floats:", e);
    }

    // check if mid/side
    if (this.ChannelMode === 1) {
      this.Bands.forEach(b => (b.ChannelMode = ProQ2ChannelMode.MidSide));
    }

    return true;
  }

  public writeFFP(): Uint8Array | undefined {
    const bf = new BinaryFile(undefined, ByteOrder.LittleEndian);

    // Write the header
    bf.binaryWriter?.writeString("FQ2p");
    bf.binaryWriter?.writeUInt32(this.Version);

    // Write the bands content
    const bandsContent = this.getBandsContent();
    if (bandsContent) {
      bf.binaryWriter?.writeBytes(bandsContent);
    } else {
      console.warn("No bands content to write.");
    }

    // Retrieve the buffer and convert it to Uint8Array
    const buffer = bf.binaryWriter?.getBuffer();
    if (!buffer) {
      console.error("Failed to get buffer from binary writer.");
      return undefined; // Explicitly return undefined if the buffer is not available
    }

    return new Uint8Array(buffer);
  }

  private getBandsContent(): ArrayBuffer | undefined {
    const bf = new BinaryFile(undefined, ByteOrder.LittleEndian);

    // write total parameter count
    // 24 bands with 7 parameters each = 168
    // pluss the 22 parameters at the end
    bf.binaryWriter?.writeUInt32(24 * 7 + 22);

    for (let i = 0; i < 24; i++) {
      if (i < this.Bands.length) {
        const band = this.Bands[i];

        bf.binaryWriter?.writeFloat32(band.Enabled ? 1 : 2);

        const freq = FabfilterProQBase.freqConvert(band.Frequency);
        bf.binaryWriter?.writeFloat32(freq);

        bf.binaryWriter?.writeFloat32(band.Gain);

        const q = FabfilterProQBase.qConvert(band.Q);
        bf.binaryWriter?.writeFloat32(q);

        bf.binaryWriter?.writeFloat32(band.Shape);
        bf.binaryWriter?.writeFloat32(band.Slope);
        bf.binaryWriter?.writeFloat32(band.StereoPlacement);
      } else {
        bf.binaryWriter?.writeFloat32(2);
        bf.binaryWriter?.writeFloat32(FabfilterProQBase.freqConvert(1000));
        bf.binaryWriter?.writeFloat32(0);
        bf.binaryWriter?.writeFloat32(FabfilterProQBase.qConvert(1));
        bf.binaryWriter?.writeFloat32(ProQ2Shape.Bell);
        bf.binaryWriter?.writeFloat32(ProQ2Slope.Slope24dB_oct);
        bf.binaryWriter?.writeFloat32(ProQ2StereoPlacement.Stereo);
      }
    }

    // write the remaining floats
    bf.binaryWriter?.writeFloat32(this.ProcessingMode); // Zero Latency: 0.0, Natural Phase: 1.0, Linear Phase: 2.0
    bf.binaryWriter?.writeFloat32(this.ProcessingResolution); // 0 - 4, Medium
    bf.binaryWriter?.writeFloat32(this.ChannelMode); // 0 = Left/Right, 1 = Mid/Side
    bf.binaryWriter?.writeFloat32(this.GainScale); // 100%
    bf.binaryWriter?.writeFloat32(this.OutputLevel); // 0.0 dB, -1 to 1 (- Infinity to +36 dB , 0 = 0 dB)
    bf.binaryWriter?.writeFloat32(this.OutputPan); // Left 0 dB, Right: 0 dB, -1 to 1 (0 = middle)
    bf.binaryWriter?.writeFloat32(this.ByPass); // Not Bypassed
    bf.binaryWriter?.writeFloat32(this.OutputInvertPhase); // Normal
    bf.binaryWriter?.writeFloat32(this.AutoGain); // Off
    bf.binaryWriter?.writeFloat32(this.AnalyzerShowPreProcessing); // Disabled - 0: Off, 1: On
    bf.binaryWriter?.writeFloat32(this.AnalyzerShowPostProcessing); // Disabled - 0: Off, 1: On
    bf.binaryWriter?.writeFloat32(this.AnalyzerShowSidechain); // Disabled - 0: Off, 1: On
    bf.binaryWriter?.writeFloat32(this.AnalyzerRange); // Analyzer Range in dB. 0.0: 60dB, 1.0: 90dB, 2.0: 120dB
    bf.binaryWriter?.writeFloat32(this.AnalyzerResolution); // Analyzer Resolution. 0.0: Low, 1.0: Medium, 2.0: High, 3.00: Maximum
    bf.binaryWriter?.writeFloat32(this.AnalyzerSpeed); // Analyzer Speed. 0.0: Very Slow, 1.0: Slow, 2.0: Medium, 3.0 Fast, 4.0: Very Fast
    bf.binaryWriter?.writeFloat32(this.AnalyzerTilt); // Analyzer Tilt in dB/oct. 0.0: 0.0, 1.0: 1.5, 2.0: 3.0, 3.0: 4.5, 4.0: 6.0
    bf.binaryWriter?.writeFloat32(this.AnalyzerFreeze); // 0: Off, 1: On
    bf.binaryWriter?.writeFloat32(this.SpectrumGrab); // Enabled
    bf.binaryWriter?.writeFloat32(this.DisplayRange); // 12dB
    bf.binaryWriter?.writeFloat32(this.ReceiveMidi); // Enabled
    bf.binaryWriter?.writeFloat32(this.SoloBand); // -1
    bf.binaryWriter?.writeFloat32(this.SoloGain); // 0.00

    // Don't write the ex fields
    // bf.binaryWriter?.writeFloat32(this.ExAutoGain);                   // (Other)

    return bf.binaryWriter?.getBuffer();
  }
}
