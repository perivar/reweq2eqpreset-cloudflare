import { BinaryFile, ByteOrder } from "./BinaryFile";

/**
 * Base class for reading and writing Fabfilter Pro Q (1 or 2) Preset files.
 */
export abstract class FabfilterProQBase {
  constructor() {}

  // Abstract method for writing Fabfilter Pro Q preset files.
  abstract writeFFP(): ArrayBuffer | undefined;

  /**
   * Reads floats from file content and checks for a specific header.
   * @param data - contents of the file to read.
   * @param headerExpected - Expected file header.
   * @returns An array of floats if the header matches; otherwise, null.
   */
  static readFloats(data: Uint8Array, headerExpected: string): number[] | null {
    const bf = new BinaryFile(data, ByteOrder.LittleEndian);

    const header = bf.binaryReader?.readString(4);
    if (header === headerExpected) {
      const version = bf.binaryReader?.readUInt32() || 0;
      const parameterCount = bf.binaryReader?.readUInt32() || 0;

      const floatArray = new Array<number>(parameterCount);
      try {
        for (let i = 0; i < parameterCount; i++) {
          floatArray[i] = bf.binaryReader?.readFloat32() || 0;
        }
      } catch (e) {
        console.error(`Failed reading floats: ${e}`);
      }

      return floatArray;
    }

    return null;
  }

  /**
   * Converts a float value between 0 and 1 to the Fabfilter float equivalent.
   * @param value - The value to convert.
   * @returns Converted frequency float.
   */
  static ieeeFloatToFrequencyFloat(value: number): number {
    return 11.5507311008828 * value + 3.32193432374016;
  }

  // log and inverse log
  // a ^ x = b
  // x = log(b) / log(a)

  /**
   * Converts a frequency to the Fabfilter equivalent using logarithmic scaling.
   * @param value - The frequency to convert.
   * @returns The converted frequency.
   */
  static freqConvert(value: number): number {
    // =LOG(A1)/LOG(2) (default = 1000 Hz)
    return Math.log10(value) / Math.log10(2);
  }

  /**
   * Converts a Fabfilter frequency value back to the original frequency.
   * @param value - The Fabfilter frequency value.
   * @returns The original frequency.
   */
  static freqConvertBack(value: number): number {
    // =POWER(2; frequency)
    return Math.pow(2, value);
  }

  /**
   * Converts a Q factor value using logarithmic scaling.
   * @param value - The Q factor to convert.
   * @returns The converted Q factor.
   */
  static qConvert(value: number): number {
    // =LOG(F1)*0,312098175+0,5 (default = 1)
    return Math.log10(value) * 0.312098175 + 0.5;
  }

  /**
   * Converts a Fabfilter Q factor value back to the original Q factor.
   * @param value - The Fabfilter Q factor value.
   * @returns The original Q factor.
   */
  static qConvertBack(value: number): number {
    // =POWER(10;((B3-0,5)/0,312098175))
    return Math.pow(10, (value - 0.5) / 0.312098175);
  }
}
