// https://github.com/donutteam/binary-rw-ts

//
// Imports
//

import * as DataSizes from "./data-sizes";

//
// Class
//

export class BinaryReader {
  static typedArrayToBuffer(array: Uint8Array): ArrayBuffer {
    return array.buffer.slice(
      array.byteOffset,
      array.byteLength + array.byteOffset
    );
  }

  isLittleEndian: boolean;

  readonly #dataView: DataView;

  #position: number;

  /**
   * @param data The data to read.
   * @param isLittleEndian Whether to read numbers in little-endian format. Defaults to true.
   */
  constructor(data: ArrayBuffer | Uint8Array, isLittleEndian = true) {
    const arrayBuffer =
      data instanceof ArrayBuffer
        ? data
        : BinaryReader.typedArrayToBuffer(data);

    this.#dataView = new DataView(arrayBuffer);

    this.isLittleEndian = isLittleEndian;

    this.#position = 0;
  }

  getPosition(): number {
    return this.#position;
  }

  getLength(): number {
    return this.#dataView.byteLength;
  }

  readBytes(size: number): Uint8Array {
    this.#checkSize(size);

    const bytes = new Uint8Array(size);

    for (let i = 0; i < size; i++) {
      bytes[i] = this.#dataView.getUint8(this.#position + i * DataSizes.UINT8);
    }

    this.#position += size;

    return bytes;
  }

  readFloat32(): number {
    this.#checkSize(DataSizes.FLOAT32);

    const float = this.#dataView.getFloat32(
      this.#position,
      this.isLittleEndian
    );

    this.#position += DataSizes.FLOAT32;

    return float;
  }

  readFloat64(): number {
    this.#checkSize(DataSizes.FLOAT64);

    const float = this.#dataView.getFloat64(
      this.#position,
      this.isLittleEndian
    );

    this.#position += DataSizes.FLOAT64;

    return float;
  }

  readInt8(): number {
    this.#checkSize(DataSizes.INT8);

    const int = this.#dataView.getInt8(this.#position);

    this.#position += DataSizes.INT8;

    return int;
  }

  readInt16(): number {
    this.#checkSize(DataSizes.INT16);

    const int = this.#dataView.getInt16(this.#position, this.isLittleEndian);

    this.#position += DataSizes.INT16;

    return int;
  }

  readInt32(): number {
    this.#checkSize(DataSizes.INT32);

    const int = this.#dataView.getInt32(this.#position, this.isLittleEndian);

    this.#position += DataSizes.INT32;

    return int;
  }

  readInt64(): bigint {
    this.#checkSize(DataSizes.INT64);

    const bigInt = this.#dataView.getBigInt64(
      this.#position,
      this.isLittleEndian
    );

    this.#position += DataSizes.INT64;

    return bigInt;
  }

  readString(length: number): string {
    const bytes = this.readBytes(length);

    return new TextDecoder("utf-8").decode(bytes);
  }

  readUInt8(): number {
    this.#checkSize(DataSizes.UINT8);

    const int = this.#dataView.getUint8(this.#position);

    this.#position += DataSizes.UINT8;

    return int;
  }

  readUInt16(): number {
    this.#checkSize(DataSizes.UINT16);

    const int = this.#dataView.getUint16(this.#position, this.isLittleEndian);

    this.#position += DataSizes.UINT16;

    return int;
  }

  readUInt32(): number {
    this.#checkSize(DataSizes.UINT32);

    const int = this.#dataView.getUint32(this.#position, this.isLittleEndian);

    this.#position += DataSizes.UINT32;

    return int;
  }

  readUInt64(): bigint {
    this.#checkSize(DataSizes.UINT64);

    const bigInt = this.#dataView.getBigUint64(
      this.#position,
      this.isLittleEndian
    );

    this.#position += DataSizes.UINT64;

    return bigInt;
  }

  seek(position: number): void {
    if (position < 0 || position >= this.getLength()) {
      throw new RangeError("Seek position out of range.");
    }

    this.#position = position;
  }

  seekOffset(offset: number): void {
    this.seek(this.#position + offset);
  }

  #checkSize(neededBytes: number): void {
    const availableBytes = this.getLength() - this.#position;

    if (neededBytes > availableBytes) {
      throw new Error(
        "Operation requires an additional " +
          neededBytes +
          " bytes but only " +
          availableBytes +
          " bytes are available."
      );
    }
  }
}
