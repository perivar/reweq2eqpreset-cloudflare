import { BinaryReader } from "./BinaryReader";
import { BinaryWriter } from "./BinaryWriter";

export enum ByteOrder {
  LittleEndian,
  BigEndian,
}

export class BinaryFile {
  public byteOrder: ByteOrder = ByteOrder.LittleEndian;
  public position: number = 0;
  public binaryReader?: BinaryReader = undefined;
  public binaryWriter?: BinaryWriter = undefined;

  constructor(
    values?: ArrayBuffer | Uint8Array,
    byteOrder: ByteOrder = ByteOrder.LittleEndian
  ) {
    if (values) {
      this.binaryReader = new BinaryReader(
        values,
        byteOrder == ByteOrder.LittleEndian
      );
    } else {
      this.binaryWriter = new BinaryWriter(byteOrder == ByteOrder.LittleEndian);
    }

    // Set position to the beginning of the stream.
    this.position = 0;

    this.byteOrder = byteOrder;
  }

  readStringNull(encoding: string = "utf-8"): string {
    if (!this.binaryReader) throw new Error("binaryReader is null");

    const decoder = new TextDecoder(encoding);
    const bytes: number[] = [];

    let byte = this.binaryReader.readInt8();
    while (byte !== 0) {
      bytes.push(byte);
      byte = this.binaryReader.readInt8();
    }

    return decoder.decode(new Uint8Array(bytes));
  }

  writeStringNull(text: string): number {
    if (!this.binaryWriter) throw new Error("binaryWriter is null");
    if (!text) throw new Error("Text is null");

    const encoder = new TextEncoder();
    const contentBytes = encoder.encode(text);

    contentBytes.forEach(byte => this.binaryWriter!.writeInt8(byte));
    this.binaryWriter.writeInt8(0); // Write null terminator

    return contentBytes.length + 1;
  }

  writeStringPadded(text: string, totalCount: number): number {
    if (!this.binaryWriter) throw new Error("binaryWriter is null");

    const count = this.writeStringNull(text);
    const remaining = totalCount - count;

    for (let i = 0; i < remaining; i++) {
      this.binaryWriter.writeInt8(0); // Pad with zeroes
    }

    return totalCount;
  }
}
