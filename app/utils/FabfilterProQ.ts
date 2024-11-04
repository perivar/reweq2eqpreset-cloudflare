import { BinaryFile, ByteOrder } from "./BinaryFile";
import { FabfilterProQBase } from "./FabfilterProQBase";
import { FXP } from "./FXP";

export enum ProQShape {
  Bell = 0,
  LowShelf = 1,
  LowCut = 2,
  HighShelf = 3,
  HighCut = 4,
  Notch = 5,
}

export enum ProQLPHPSlope {
  Slope6dB_oct = 0,
  Slope12dB_oct = 1,
  Slope24dB_oct = 2,
  Slope48dB_oct = 3,
}

export enum ProQStereoPlacement {
  LeftOrMid = 0,
  RightOrSide = 1,
  Stereo = 2,
}

export enum ProQChannelMode {
  LeftRight = 0,
  MidSide = 1,
}

export class ProQBand {
  ChannelMode: ProQChannelMode;
  Frequency: number;
  Gain: number;
  Q: number;
  Shape: ProQShape;
  LPHPSlope: ProQLPHPSlope;
  StereoPlacement: ProQStereoPlacement;
  Enabled: boolean;

  constructor() {
    this.ChannelMode = ProQChannelMode.LeftRight;
    this.Frequency = FabfilterProQBase.freqConvert(1000);
    this.Gain = 0;
    this.Q = FabfilterProQBase.qConvert(1);
    this.Shape = ProQShape.Bell;
    this.LPHPSlope = ProQLPHPSlope.Slope24dB_oct;
    this.StereoPlacement = ProQStereoPlacement.Stereo;
    this.Enabled = false;
  }
}

export class FabfilterProQ implements FabfilterProQBase {
  Bands: ProQBand[] = [];
  Version: number = 2;
  ParameterCount: number = 190;
  OutputGain: number = 0;
  OutputPan: number = 0;
  DisplayRange: number = 0;
  ProcessMode: number = 0;
  ChannelMode: number = 0;
  Bypass: number = 0;
  ReceiveMidi: number = 0;
  Analyzer: number = 0;
  AnalyzerResolution: number = 0;
  AnalyzerSpeed: number = 0;
  SoloBand: number = -1;

  public ReadFFP(data: Uint8Array): boolean {
    const bf = new BinaryFile(data, ByteOrder.LittleEndian);

    const header = bf.binaryReader?.readString(4);
    if (header !== "FPQr") return false;

    this.Version = bf.binaryReader?.readUInt32() || 0;
    this.ParameterCount = bf.binaryReader?.readUInt32() || 0;

    // Read in how many bands are enabled
    const numActiveBands = bf.binaryReader?.readFloat32() || 0;

    this.Bands = [];
    for (let i = 0; i < 24; i++) {
      const band = new ProQBand();

      const freq = bf.binaryReader?.readFloat32() || 0;
      band.Frequency = FabfilterProQBase.freqConvertBack(freq);

      band.Gain = bf.binaryReader?.readFloat32() || 0; // actual gain in dB

      const q = bf.binaryReader?.readFloat32() || 0;
      band.Q = FabfilterProQBase.qConvertBack(q);

      // 0 - 5
      const filterType = bf.binaryReader?.readFloat32();
      switch (filterType) {
        case ProQShape.Bell:
          band.Shape = ProQShape.Bell;
          break;
        case ProQShape.LowShelf:
          band.Shape = ProQShape.LowShelf;
          break;
        case ProQShape.LowCut:
          band.Shape = ProQShape.LowCut;
          break;
        case ProQShape.HighShelf:
          band.Shape = ProQShape.HighShelf;
          break;
        case ProQShape.HighCut:
          band.Shape = ProQShape.HighCut;
          break;
        case ProQShape.Notch:
          band.Shape = ProQShape.Notch;
          break;
        default:
          throw new Error(`Filter type is outside range: ${filterType}`);
      }

      // 0 = 6 dB/oct, 1 = 12 dB/oct, 2 = 24 dB/oct, 3 = 48 dB/oct
      const filterSlope = bf.binaryReader?.readFloat32();
      switch (filterSlope) {
        case ProQLPHPSlope.Slope6dB_oct:
          band.LPHPSlope = ProQLPHPSlope.Slope6dB_oct;
          break;
        case ProQLPHPSlope.Slope12dB_oct:
          band.LPHPSlope = ProQLPHPSlope.Slope12dB_oct;
          break;
        case ProQLPHPSlope.Slope24dB_oct:
          band.LPHPSlope = ProQLPHPSlope.Slope24dB_oct;
          break;
        case ProQLPHPSlope.Slope48dB_oct:
          band.LPHPSlope = ProQLPHPSlope.Slope48dB_oct;
          break;
        default:
          throw new Error(`Filter slope is outside range: ${filterSlope}`);
      }

      // 0 = Left, 1 = Right, 2 = Stereo
      const filterStereoPlacement = bf.binaryReader?.readFloat32();
      switch (filterStereoPlacement) {
        case ProQStereoPlacement.LeftOrMid:
          band.StereoPlacement = ProQStereoPlacement.LeftOrMid;
          break;
        case ProQStereoPlacement.RightOrSide:
          band.StereoPlacement = ProQStereoPlacement.RightOrSide;
          break;
        case ProQStereoPlacement.Stereo:
          band.StereoPlacement = ProQStereoPlacement.Stereo;
          break;
        default:
          throw new Error(
            `Filter stereo placement is outside range: ${filterStereoPlacement}`
          );
      }

      // always 1.0 ?
      const unknown = bf.binaryReader?.readFloat32();

      // check if band is enabled
      if (numActiveBands > 0 && numActiveBands > i) {
        band.Enabled = true;
      }

      this.Bands.push(band);
    }

    // read the remaining floats
    try {
      this.OutputGain = bf.binaryReader?.readFloat32() || 0; // -1 to 1 (- Infinity to +36 dB , 0 = 0 dB)
      this.OutputPan = bf.binaryReader?.readFloat32() || 0; // -1 to 1 (0 = middle)
      this.DisplayRange = bf.binaryReader?.readFloat32() || 0; // 0 = 6dB, 1 = 12dB, 2 = 30dB, 3 = 3dB
      this.ProcessMode = bf.binaryReader?.readFloat32() || 0; // 0 = zero latency, 1 = lin.phase.low - medium - high - maximum
      this.ChannelMode = bf.binaryReader?.readFloat32() || 0; // 0 = Left/Right, 1 = Mid/Side
      this.Bypass = bf.binaryReader?.readFloat32() || 0; // 0 = No bypass
      this.ReceiveMidi = bf.binaryReader?.readFloat32() || 0; // 0 = Enabled?
      this.Analyzer = bf.binaryReader?.readFloat32() || 0; // 0 = Off, 1 = Pre, 2 = Post, 3 = Pre+Post
      this.AnalyzerResolution = bf.binaryReader?.readFloat32() || 0; // 0 - 3 : low - medium[x] - high - maximum
      this.AnalyzerSpeed = bf.binaryReader?.readFloat32() || 0; // 0 - 3 : very slow, slow, medium[x], fast
      this.SoloBand = bf.binaryReader?.readFloat32() || 0; // -1
    } catch (e) {
      console.error("Error reading additional floats:", e);
    }

    // check if mid/side
    if (this.ChannelMode === 1) {
      this.Bands.forEach(b => (b.ChannelMode = ProQChannelMode.MidSide));
    }

    return true;
  }

  public writeFFP(): Uint8Array | undefined {
    const bf = new BinaryFile(undefined, ByteOrder.LittleEndian);

    // Write the header
    bf.binaryWriter?.writeString("FPQr");
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

  public WriteFXP(): Uint8Array | undefined {
    const bf = new BinaryFile();

    // Write the header
    bf.binaryWriter?.writeString("FPQr");
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

    const uint8Array = new Uint8Array(buffer);
    const fxpUint8Array = FXP.WriteRaw2FXP(uint8Array, "FQ3p");

    return fxpUint8Array;
  }

  private getBandsContent(): ArrayBuffer | undefined {
    const bf = new BinaryFile(undefined, ByteOrder.LittleEndian);

    bf.binaryWriter?.writeUInt32(24 * 7 + 12);
    const enabledBandCount = this.Bands.filter(b => b.Enabled).length;
    bf.binaryWriter?.writeFloat32(enabledBandCount);

    for (let i = 0; i < 24; i++) {
      if (i < this.Bands.length) {
        const band = this.Bands[i];

        const freq = FabfilterProQBase.freqConvert(band.Frequency);
        bf.binaryWriter?.writeFloat32(freq);

        bf.binaryWriter?.writeFloat32(band.Gain);

        const q = FabfilterProQBase.qConvert(band.Q);
        bf.binaryWriter?.writeFloat32(q);

        bf.binaryWriter?.writeFloat32(band.Shape);
        bf.binaryWriter?.writeFloat32(band.LPHPSlope);
        bf.binaryWriter?.writeFloat32(band.StereoPlacement);
        bf.binaryWriter?.writeFloat32(1);
      } else {
        bf.binaryWriter?.writeFloat32(FabfilterProQBase.freqConvert(1000));
        bf.binaryWriter?.writeFloat32(0);
        bf.binaryWriter?.writeFloat32(FabfilterProQBase.qConvert(1));
        bf.binaryWriter?.writeFloat32(ProQShape.Bell);
        bf.binaryWriter?.writeFloat32(ProQLPHPSlope.Slope24dB_oct);
        bf.binaryWriter?.writeFloat32(ProQStereoPlacement.Stereo);
        bf.binaryWriter?.writeFloat32(1);
      }
    }

    bf.binaryWriter?.writeFloat32(this.OutputGain);
    bf.binaryWriter?.writeFloat32(this.OutputPan);
    bf.binaryWriter?.writeFloat32(this.DisplayRange);
    bf.binaryWriter?.writeFloat32(this.ProcessMode);
    bf.binaryWriter?.writeFloat32(this.ChannelMode);
    bf.binaryWriter?.writeFloat32(this.Bypass);
    bf.binaryWriter?.writeFloat32(this.ReceiveMidi);
    bf.binaryWriter?.writeFloat32(this.Analyzer);
    bf.binaryWriter?.writeFloat32(this.AnalyzerResolution);
    bf.binaryWriter?.writeFloat32(this.AnalyzerSpeed);
    bf.binaryWriter?.writeFloat32(this.SoloBand);

    return bf.binaryWriter?.getBuffer();
  }
}
