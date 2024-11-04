import { BinaryFile, ByteOrder } from "./BinaryFile";
import { FabfilterProQBase } from "./FabfilterProQBase";

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
  channelMode: ProQChannelMode;
  frequency: number;
  gain: number;
  q: number;
  shape: ProQShape;
  lphpSlope: ProQLPHPSlope;
  stereoPlacement: ProQStereoPlacement;
  enabled: boolean;

  constructor() {
    this.channelMode = ProQChannelMode.LeftRight;
    this.frequency = FabfilterProQBase.freqConvert(1000);
    this.gain = 0;
    this.q = FabfilterProQBase.qConvert(1);
    this.shape = ProQShape.Bell;
    this.lphpSlope = ProQLPHPSlope.Slope24dB_oct;
    this.stereoPlacement = ProQStereoPlacement.Stereo;
    this.enabled = false;
  }
}

export class FabfilterProQ implements FabfilterProQBase {
  bands: ProQBand[] = [];
  version: number = 2;
  parameterCount: number = 190;
  outputGain: number = 0;
  outputPan: number = 0;
  displayRange: number = 0;
  processMode: number = 0;
  channelMode: number = 0;
  bypass: number = 0;
  receiveMidi: number = 0;
  analyzer: number = 0;
  analyzerResolution: number = 0;
  analyzerSpeed: number = 0;
  soloBand: number = -1;

  public ReadFFP(data: Uint8Array): boolean {
    const bf = new BinaryFile(data, ByteOrder.LittleEndian);

    const header = bf.binaryReader?.readString(4);
    if (header !== "FPQr") return false;

    this.version = bf.binaryReader?.readUInt32() || 0;
    this.parameterCount = bf.binaryReader?.readUInt32() || 0;

    // Read in how many bands are enabled
    const numActiveBands = bf.binaryReader?.readFloat32() || 0;

    this.bands = [];
    for (let i = 0; i < 24; i++) {
      const band = new ProQBand();

      const freq = bf.binaryReader?.readFloat32() || 0;
      band.frequency = FabfilterProQBase.freqConvertBack(freq);

      band.gain = bf.binaryReader?.readFloat32() || 0; // actual gain in dB

      const q = bf.binaryReader?.readFloat32() || 0;
      band.q = FabfilterProQBase.qConvertBack(q);

      // 0 - 5
      const filterType = bf.binaryReader?.readFloat32();
      switch (filterType) {
        case ProQShape.Bell:
          band.shape = ProQShape.Bell;
          break;
        case ProQShape.LowShelf:
          band.shape = ProQShape.LowShelf;
          break;
        case ProQShape.LowCut:
          band.shape = ProQShape.LowCut;
          break;
        case ProQShape.HighShelf:
          band.shape = ProQShape.HighShelf;
          break;
        case ProQShape.HighCut:
          band.shape = ProQShape.HighCut;
          break;
        case ProQShape.Notch:
          band.shape = ProQShape.Notch;
          break;
        default:
          throw new Error(`Filter type is outside range: ${filterType}`);
      }

      // 0 = 6 dB/oct, 1 = 12 dB/oct, 2 = 24 dB/oct, 3 = 48 dB/oct
      const filterSlope = bf.binaryReader?.readFloat32();
      switch (filterSlope) {
        case ProQLPHPSlope.Slope6dB_oct:
          band.lphpSlope = ProQLPHPSlope.Slope6dB_oct;
          break;
        case ProQLPHPSlope.Slope12dB_oct:
          band.lphpSlope = ProQLPHPSlope.Slope12dB_oct;
          break;
        case ProQLPHPSlope.Slope24dB_oct:
          band.lphpSlope = ProQLPHPSlope.Slope24dB_oct;
          break;
        case ProQLPHPSlope.Slope48dB_oct:
          band.lphpSlope = ProQLPHPSlope.Slope48dB_oct;
          break;
        default:
          throw new Error(`Filter slope is outside range: ${filterSlope}`);
      }

      // 0 = Left, 1 = Right, 2 = Stereo
      const filterStereoPlacement = bf.binaryReader?.readFloat32();
      switch (filterStereoPlacement) {
        case ProQStereoPlacement.LeftOrMid:
          band.stereoPlacement = ProQStereoPlacement.LeftOrMid;
          break;
        case ProQStereoPlacement.RightOrSide:
          band.stereoPlacement = ProQStereoPlacement.RightOrSide;
          break;
        case ProQStereoPlacement.Stereo:
          band.stereoPlacement = ProQStereoPlacement.Stereo;
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
        band.enabled = true;
      }

      this.bands.push(band);
    }

    // read the remaining floats
    try {
      this.outputGain = bf.binaryReader?.readFloat32() || 0; // -1 to 1 (- Infinity to +36 dB , 0 = 0 dB)
      this.outputPan = bf.binaryReader?.readFloat32() || 0; // -1 to 1 (0 = middle)
      this.displayRange = bf.binaryReader?.readFloat32() || 0; // 0 = 6dB, 1 = 12dB, 2 = 30dB, 3 = 3dB
      this.processMode = bf.binaryReader?.readFloat32() || 0; // 0 = zero latency, 1 = lin.phase.low - medium - high - maximum
      this.channelMode = bf.binaryReader?.readFloat32() || 0; // 0 = Left/Right, 1 = Mid/Side
      this.bypass = bf.binaryReader?.readFloat32() || 0; // 0 = No bypass
      this.receiveMidi = bf.binaryReader?.readFloat32() || 0; // 0 = Enabled?
      this.analyzer = bf.binaryReader?.readFloat32() || 0; // 0 = Off, 1 = Pre, 2 = Post, 3 = Pre+Post
      this.analyzerResolution = bf.binaryReader?.readFloat32() || 0; // 0 - 3 : low - medium[x] - high - maximum
      this.analyzerSpeed = bf.binaryReader?.readFloat32() || 0; // 0 - 3 : very slow, slow, medium[x], fast
      this.soloBand = bf.binaryReader?.readFloat32() || 0; // -1
    } catch (e) {
      console.error("Error reading additional floats:", e);
    }

    // check if mid/side
    if (this.channelMode === 1) {
      this.bands.forEach(b => (b.channelMode = ProQChannelMode.MidSide));
    }

    return true;
  }

  public writeFFP(): Uint8Array | undefined {
    const bf = new BinaryFile(undefined, ByteOrder.LittleEndian);

    // Write the header
    bf.binaryWriter?.writeString("FPQr");
    bf.binaryWriter?.writeUInt32(this.version);

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

    bf.binaryWriter?.writeUInt32(24 * 7 + 12);
    const enabledBandCount = this.bands.filter(b => b.enabled).length;
    bf.binaryWriter?.writeFloat32(enabledBandCount);

    for (let i = 0; i < 24; i++) {
      if (i < this.bands.length) {
        const band = this.bands[i];

        const freq = FabfilterProQBase.freqConvert(band.frequency);
        bf.binaryWriter?.writeFloat32(freq);

        bf.binaryWriter?.writeFloat32(band.gain);

        const q = FabfilterProQBase.qConvert(band.q);
        bf.binaryWriter?.writeFloat32(q);

        bf.binaryWriter?.writeFloat32(band.shape);
        bf.binaryWriter?.writeFloat32(band.lphpSlope);
        bf.binaryWriter?.writeFloat32(band.stereoPlacement);
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

    bf.binaryWriter?.writeFloat32(this.outputGain);
    bf.binaryWriter?.writeFloat32(this.outputPan);
    bf.binaryWriter?.writeFloat32(this.displayRange);
    bf.binaryWriter?.writeFloat32(this.processMode);
    bf.binaryWriter?.writeFloat32(this.channelMode);
    bf.binaryWriter?.writeFloat32(this.bypass);
    bf.binaryWriter?.writeFloat32(this.receiveMidi);
    bf.binaryWriter?.writeFloat32(this.analyzer);
    bf.binaryWriter?.writeFloat32(this.analyzerResolution);
    bf.binaryWriter?.writeFloat32(this.analyzerSpeed);
    bf.binaryWriter?.writeFloat32(this.soloBand);

    return bf.binaryWriter?.getBuffer();
  }
}
