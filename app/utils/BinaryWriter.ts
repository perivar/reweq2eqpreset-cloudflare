// https://github.com/donutteam/binary-rw-ts

//
// Imports
//

import * as DataSizes from "./data-sizes";

//
// Class
//

export class BinaryWriter {
  readonly isLittleEndian: boolean;

  readonly expandSize: number;

  #dataView: DataView;

  #length: number;

  #position: number;

  /**
   * @param isLittleEndian Whether to write numbers in little-endian format. Defaults to true.
   * @param bufferSize The default buffer size. The buffer will also expand by multiples of this size when it runs out of space. Defaults to 65536.
   */
  constructor(isLittleEndian = true, bufferSize = 65536) {
    this.isLittleEndian = isLittleEndian;

    this.expandSize = bufferSize;

    const arrayBuffer = new ArrayBuffer(bufferSize);

    this.#dataView = new DataView(arrayBuffer);

    this.#length = 0;

    this.#position = 0;
  }

  getBuffer(): ArrayBuffer {
    return this.#dataView.buffer.slice(0, this.#length);
  }

  getPosition(): number {
    return this.#position;
  }

  getLength(): number {
    return this.#length;
  }

  seek(pos: number): void {
    if (pos < 0 || pos >= this.#length) {
      throw new RangeError("Seek position out of range.");
    }

    this.#position = pos;
  }

  seekOffset(offset: number): void {
    this.seek(this.#position + offset);
  }

  writeBytes(bytes: Uint8Array | ArrayBuffer): void {
    const bytesToWrite =
      bytes instanceof ArrayBuffer ? new Uint8Array(bytes) : bytes;

    this.#checkSize(bytesToWrite.length);

    for (let i = 0; i < bytesToWrite.length; i++) {
      this.#dataView.setUint8(this.#position + i, bytesToWrite[i]!);
    }

    this.#position += bytesToWrite.length;

    this.#length = Math.max(this.#length, this.#position);
  }

  writeFloat32(num: number): void {
    this.#checkSize(DataSizes.FLOAT32);

    this.#dataView.setFloat32(this.#position, num, this.isLittleEndian);

    this.#position += DataSizes.FLOAT32;

    this.#length = Math.max(this.#length, this.#position);
  }

  writeFloat64(num: number): void {
    this.#checkSize(DataSizes.FLOAT64);

    this.#dataView.setFloat64(this.#position, num, this.isLittleEndian);

    this.#position += DataSizes.FLOAT64;

    this.#length = Math.max(this.#length, this.#position);
  }

  writeInt8(num: number): void {
    this.#checkSize(DataSizes.INT8);

    this.#dataView.setInt8(this.#position, num);

    this.#position += DataSizes.INT8;

    this.#length = Math.max(this.#length, this.#position);
  }

  writeInt16(num: number): void {
    this.#checkSize(DataSizes.INT16);

    this.#dataView.setInt16(this.#position, num, this.isLittleEndian);

    this.#position += DataSizes.INT16;

    this.#length = Math.max(this.#length, this.#position);
  }

  writeInt32(num: number): void {
    this.#checkSize(DataSizes.INT32);

    this.#dataView.setInt32(this.#position, num, this.isLittleEndian);

    this.#position += DataSizes.INT32;

    this.#length = Math.max(this.#length, this.#position);
  }

  writeInt64(num: bigint): void {
    this.#checkSize(DataSizes.INT64);

    this.#dataView.setBigInt64(this.#position, num, this.isLittleEndian);

    this.#position += DataSizes.INT64;

    this.#length = Math.max(this.#length, this.#position);
  }

  writeString(str: string): void {
    const textEncoder = new TextEncoder();

    const bytes = textEncoder.encode(str);

    // Note: writeBytes updates the length and position
    this.writeBytes(bytes);
  }

  writeUInt8(num: number): void {
    this.#checkSize(DataSizes.UINT8);

    this.#dataView.setUint8(this.#position, num);

    this.#position += DataSizes.UINT8;

    this.#length = Math.max(this.#length, this.#position);
  }

  writeUInt16(num: number): void {
    this.#checkSize(DataSizes.UINT16);

    this.#dataView.setUint16(this.#position, num, this.isLittleEndian);

    this.#position += DataSizes.UINT16;

    this.#length = Math.max(this.#length, this.#position);
  }

  writeUInt32(num: number): void {
    this.#checkSize(DataSizes.UINT32);

    this.#dataView.setUint32(this.#position, num, this.isLittleEndian);

    this.#position += DataSizes.UINT32;

    this.#length = Math.max(this.#length, this.#position);
  }

  writeUInt64(num: bigint): void {
    this.#checkSize(DataSizes.UINT64);

    this.#dataView.setBigUint64(this.#position, num, this.isLittleEndian);

    this.#position += DataSizes.UINT64;

    this.#length = Math.max(this.#length, this.#position);
  }

  #checkSize(size: number): void {
    const requiredSize = size + this.#position;

    if (requiredSize > this.#dataView.byteLength) {
      this.#expand(requiredSize);
    }
  }

  #expand(requiredSize: number): void {
    let newSize = this.#dataView.byteLength + this.expandSize;

    while (newSize < requiredSize) {
      newSize += this.expandSize;
    }

    const newBuffer = new Uint8Array(newSize);

    newBuffer.set(new Uint8Array(this.#dataView.buffer));

    this.#dataView = new DataView(newBuffer.buffer);
  }
}
