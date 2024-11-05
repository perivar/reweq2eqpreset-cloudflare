import { BinaryFile, ByteOrder } from "./BinaryFile";
import { FabfilterProQBase } from "./FabfilterProQBase";
import { FXP } from "./FXP";

export enum ProQ3Shape {
  Bell = 0, // (default)
  LowShelf = 1,
  LowCut = 2,
  HighShelf = 3,
  HighCut = 4,
  Notch = 5,
  BandPass = 6,
  TiltShelf = 7,
  FlatTilt = 8,
}

export enum ProQ3Slope {
  Slope6dB_oct = 0,
  Slope12dB_oct = 1,
  Slope18dB_oct = 2,
  Slope24dB_oct = 3, // (default)
  Slope30dB_oct = 4,
  Slope36dB_oct = 5,
  Slope48dB_oct = 6,
  Slope72dB_oct = 7,
  Slope96dB_oct = 8,
  SlopeBrickwall = 9,
}

export enum ProQ3StereoPlacement {
  Left = 0,
  Right = 1,
  Stereo = 2, // (default)
  Mid = 3,
  Side = 4,
}

export enum ProQ2ChannelMode {
  LeftRight = 0,
  MidSide = 1,
}

export class ProQ3Band {
  Enabled: boolean;
  Frequency: number; // value range 10.0 -> 30000.0 Hz
  Gain: number; // + or - value in dB
  DynamicRange: number; // + or - value in dB
  DynamicThreshold: number; // 1 = auto, or value in dB
  Q: number; // value range 0.025 -> 40.00
  Shape: ProQ3Shape;
  Slope: ProQ3Slope;
  StereoPlacement: ProQ3StereoPlacement;

  constructor() {
    this.Enabled = false;
    this.Frequency = FabfilterProQBase.freqConvert(1000); // value range 10.0 -> 30000.0 Hz
    this.Gain = 0; // + or - value in dB
    this.DynamicRange = 0; // + or - value in dB
    this.DynamicThreshold = 0; // 1 = auto, or value in dB
    this.Q = FabfilterProQBase.qConvert(1); // value range 0.025 -> 40.00
    this.Shape = ProQ3Shape.Bell;
    this.Slope = ProQ3Slope.Slope24dB_oct;
    this.StereoPlacement = ProQ3StereoPlacement.Stereo;
  }
}

export class FabfilterProQ3 implements FabfilterProQBase {
  Bands: ProQ3Band[] = [];
  Version: number = 4; // Normally 4
  ParameterCount: number = 334; // Normally 334
  UnknownParameters: number[] = []; // store the parameters we don't understand

  public ReadFFP(data: Uint8Array): boolean {
    const bf = new BinaryFile(data, ByteOrder.LittleEndian);

    const header = bf.binaryReader?.readString(4);
    if (header !== "FQ3p") return false;

    this.Version = bf.binaryReader?.readUInt32() || 0;
    this.ParameterCount = bf.binaryReader?.readUInt32() || 0;

    // parametercount = 334
    // 24 bands with 13 parameters each = 312
    // and then 22 parameters at the end

    this.Bands = [];
    for (let i = 0; i < 24; i++) {
      const band = new ProQ3Band();

      // 1 = Enabled, 2 = Disabled
      band.Enabled = bf.binaryReader?.readFloat32() == 1 ? true : false;

      // unknown 1
      const fUnknown1 = bf.binaryReader?.readFloat32() || 0;

      // frequency
      const fFreq = bf.binaryReader?.readFloat32() || 0;
      band.Frequency = FabfilterProQBase.freqConvertBack(fFreq);

      // gain
      band.Gain = bf.binaryReader?.readFloat32() || 0; // actual gain in dB

      // dynamic range (if band is dynamic)
      const fDynamicRange = bf.binaryReader?.readFloat32() || 0;
      band.DynamicRange = fDynamicRange;

      // unknown 3
      const fUnknown3 = bf.binaryReader?.readFloat32() || 0;

      // dynamic threshold in dB (1 = auto) - don't know how to convert this to dB
      // example numbers:
      // -1 dbFS      0.9833333
      // -90 dbFS     0
      // -20 dbFS     0.6666667
      // -54 dbFS     0.17500602
      const fDynamicThreshold = bf.binaryReader?.readFloat32() || 0;
      band.DynamicThreshold = fDynamicThreshold;

      // Q
      const fQ = bf.binaryReader?.readFloat32() || 0;
      band.Q = FabfilterProQBase.qConvertBack(fQ);

      // 0 - 8
      const fFilterType = bf.binaryReader?.readFloat32();
      switch (fFilterType) {
        case ProQ3Shape.Bell:
          band.Shape = ProQ3Shape.Bell;
          break;
        case ProQ3Shape.LowShelf:
          band.Shape = ProQ3Shape.LowShelf;
          break;
        case ProQ3Shape.LowCut:
          band.Shape = ProQ3Shape.LowCut;
          break;
        case ProQ3Shape.HighShelf:
          band.Shape = ProQ3Shape.HighShelf;
          break;
        case ProQ3Shape.HighCut:
          band.Shape = ProQ3Shape.HighCut;
          break;
        case ProQ3Shape.Notch:
          band.Shape = ProQ3Shape.Notch;
          break;
        case ProQ3Shape.BandPass:
          band.Shape = ProQ3Shape.BandPass;
          break;
        case ProQ3Shape.TiltShelf:
          band.Shape = ProQ3Shape.TiltShelf;
          break;
        case ProQ3Shape.FlatTilt:
          band.Shape = ProQ3Shape.FlatTilt;
          break;
        default:
          throw new Error(`Filter type is outside range: ${fFilterType}`);
      }

      // 0 - 9
      const fFilterSlope = bf.binaryReader?.readFloat32();
      switch (fFilterSlope) {
        case ProQ3Slope.Slope6dB_oct:
          band.Slope = ProQ3Slope.Slope6dB_oct;
          break;
        case ProQ3Slope.Slope12dB_oct:
          band.Slope = ProQ3Slope.Slope12dB_oct;
          break;
        case ProQ3Slope.Slope18dB_oct:
          band.Slope = ProQ3Slope.Slope18dB_oct;
          break;
        case ProQ3Slope.Slope24dB_oct:
          band.Slope = ProQ3Slope.Slope24dB_oct;
          break;
        case ProQ3Slope.Slope30dB_oct:
          band.Slope = ProQ3Slope.Slope30dB_oct;
          break;
        case ProQ3Slope.Slope36dB_oct:
          band.Slope = ProQ3Slope.Slope36dB_oct;
          break;
        case ProQ3Slope.Slope48dB_oct:
          band.Slope = ProQ3Slope.Slope48dB_oct;
          break;
        case ProQ3Slope.Slope72dB_oct:
          band.Slope = ProQ3Slope.Slope72dB_oct;
          break;
        case ProQ3Slope.Slope96dB_oct:
          band.Slope = ProQ3Slope.Slope96dB_oct;
          break;
        case ProQ3Slope.SlopeBrickwall:
          band.Slope = ProQ3Slope.SlopeBrickwall;
          break;
        default:
          throw new Error(`Filter slope is outside range: ${fFilterSlope}`);
      }

      // 0 = Left, 1 = Right, 2 = Stereo, 3 = Mid, 4 = Side
      const fFilterStereoPlacement = bf.binaryReader?.readFloat32();
      switch (fFilterStereoPlacement) {
        case ProQ3StereoPlacement.Left:
          band.StereoPlacement = ProQ3StereoPlacement.Left;
          break;
        case ProQ3StereoPlacement.Right:
          band.StereoPlacement = ProQ3StereoPlacement.Right;
          break;
        case ProQ3StereoPlacement.Stereo:
          band.StereoPlacement = ProQ3StereoPlacement.Stereo;
          break;
        case ProQ3StereoPlacement.Mid:
          band.StereoPlacement = ProQ3StereoPlacement.Mid;
          break;
        case ProQ3StereoPlacement.Side:
          band.StereoPlacement = ProQ3StereoPlacement.Side;
          break;
        default:
          throw new Error(
            `Filter stereo placement is outside range: ${fFilterStereoPlacement}`
          );
      }

      // unknown band parameters
      for (let j = 0; j < 2; j++) {
        const fUnknown = bf.binaryReader?.readFloat32();
      }

      this.Bands.push(band);
    }

    // read the remaining floats
    try {
      const remainingParameterCount =
        this.ParameterCount - 13 * this.Bands.length;
      for (let i = 0; i < remainingParameterCount; i++) {
        const fUnknown = bf.binaryReader?.readFloat32() || 0;
        this.UnknownParameters.push(fUnknown);
      }
    } catch (e) {
      console.error("Error reading additional floats:", e);
    }

    return true;
  }

  public writeFFP(): Uint8Array | undefined {
    const bf = new BinaryFile(undefined, ByteOrder.LittleEndian);

    // Write the header
    bf.binaryWriter?.writeString("FQ3p");
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
    // 24 bands with 13 parameters each = 312
    // pluss the optional parameters at the end
    bf.binaryWriter?.writeUInt32(24 * 13 + this.UnknownParameters.length);

    for (let i = 0; i < 24; i++) {
      if (i < this.Bands.length) {
        const band = this.Bands[i];

        bf.binaryWriter?.writeFloat32(band.Enabled ? 1 : 0);
        bf.binaryWriter?.writeFloat32(1); // unknown 1

        const freq = FabfilterProQBase.freqConvert(band.Frequency);
        bf.binaryWriter?.writeFloat32(freq);

        bf.binaryWriter?.writeFloat32(band.Gain);
        bf.binaryWriter?.writeFloat32(band.DynamicRange);
        bf.binaryWriter?.writeFloat32(1); // unknown 3
        bf.binaryWriter?.writeFloat32(band.DynamicThreshold);

        const q = FabfilterProQBase.qConvert(band.Q);
        bf.binaryWriter?.writeFloat32(q);

        bf.binaryWriter?.writeFloat32(band.Shape);
        bf.binaryWriter?.writeFloat32(band.Slope);
        bf.binaryWriter?.writeFloat32(band.StereoPlacement);

        bf.binaryWriter?.writeFloat32(1); // unknown 5
        bf.binaryWriter?.writeFloat32(0); // unknown 6
      } else {
        bf.binaryWriter?.writeFloat32(0);
        bf.binaryWriter?.writeFloat32(1); // unknown 1
        bf.binaryWriter?.writeFloat32(FabfilterProQBase.freqConvert(1000));
        bf.binaryWriter?.writeFloat32(0); // gain
        bf.binaryWriter?.writeFloat32(0); // dynamic range
        bf.binaryWriter?.writeFloat32(1); // unknown 3
        bf.binaryWriter?.writeFloat32(1); // dynamic threshold
        bf.binaryWriter?.writeFloat32(FabfilterProQBase.qConvert(1));
        bf.binaryWriter?.writeFloat32(ProQ3Shape.Bell);
        bf.binaryWriter?.writeFloat32(ProQ3Slope.Slope24dB_oct);
        bf.binaryWriter?.writeFloat32(ProQ3StereoPlacement.Stereo);
        bf.binaryWriter?.writeFloat32(1); // unknown 5
        bf.binaryWriter?.writeFloat32(0); // unknown 6
      }
    }

    // write the remaining floats
    for (const fUnknown of this.UnknownParameters) {
      bf.binaryWriter?.writeFloat32(fUnknown); // unknown
    }

    return bf.binaryWriter?.getBuffer();
  }

  public WriteFXP(presetName: string): Uint8Array | undefined {
    const bf = new BinaryFile();

    // Write the header
    bf.binaryWriter?.writeString("FFBS");
    bf.binaryWriter?.writeUInt32(1); // this seems to always be a 1, not Version ?!

    // Write the bands content
    const bandsContent = this.getBandsContent();
    if (bandsContent) {
      bf.binaryWriter?.writeBytes(bandsContent);
    } else {
      console.warn("No bands content to write.");
    }

    // add bottom bytes which seems to be mandatory to make the preset actually active
    // if this is not added, the preset seems to load, but stays inactive
    bf.binaryWriter?.writeString("FQ3p");
    bf.binaryWriter?.writeUInt32(1);
    bf.binaryWriter?.writeUInt32(presetName.length);
    bf.binaryWriter?.writeString(presetName);
    bf.binaryWriter?.writeUInt32(-1);
    bf.binaryWriter?.writeUInt32(1);
    const pluginName = "Pro-Q";
    bf.binaryWriter?.writeUInt32(pluginName.length);
    bf.binaryWriter?.writeString(pluginName);

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
}
