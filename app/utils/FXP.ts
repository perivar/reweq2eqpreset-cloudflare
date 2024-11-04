import { BinaryFile, ByteOrder } from "./BinaryFile";

export interface FxContent {
  ChunkMagic: string; // 'CcnK'
  ByteSize: number; // of this chunk, excl. magic + ByteSize
  FxMagic: string; // 'FPCh', 'FBCh', 'FxCk', 'FxBk'
  Version: number;
  FxID: string; // fx unique id
  FxVersion: number;
}

export class FxProgramSet implements FxContent {
  ChunkMagic: string;
  ByteSize: number;
  FxMagic: string;
  Version: number;
  FxID: string;
  FxVersion: number;

  NumPrograms: number;
  Name: string; // length: 28 chars
  ChunkSize: number;
  ChunkData: Uint8Array; // length: ChunkSize

  constructor() {
    this.ChunkMagic = "CcnK";
    this.ByteSize = 0;
    this.FxMagic = "FPCh";
    this.Version = 0;
    this.FxID = "";
    this.FxVersion = 0;
    this.NumPrograms = 0;
    this.Name = "";
    this.ChunkSize = 0;
    this.ChunkData = new Uint8Array();
  }
}

export class FxChunkSet implements FxContent {
  ChunkMagic: string;
  ByteSize: number;
  FxMagic: string;
  Version: number;
  FxID: string;
  FxVersion: number;

  NumPrograms: number;
  Future: string; // length: 128
  ChunkSize: number;
  ChunkData: Uint8Array; // length: ChunkSize

  constructor() {
    this.ChunkMagic = "CcnK";
    this.ByteSize = 0;
    this.FxMagic = "FBCh";
    this.Version = 0;
    this.FxID = "";
    this.FxVersion = 0;
    this.NumPrograms = 0;
    this.Future = "";
    this.ChunkSize = 0;
    this.ChunkData = new Uint8Array();
  }
}

export class FxSet implements FxContent {
  ChunkMagic: string;
  ByteSize: number;
  FxMagic: string;
  Version: number;
  FxID: string;
  FxVersion: number;

  NumPrograms: number;
  Future: string; // length: 128
  Programs: FxProgram[]; // array of Programs

  constructor() {
    this.ChunkMagic = "CcnK";
    this.ByteSize = 0;
    this.FxMagic = "FxBk";
    this.Version = 0;
    this.FxID = "";
    this.FxVersion = 0;
    this.NumPrograms = 0;
    this.Future = "";
    this.Programs = [];
  }
}

export class FxProgram implements FxContent {
  ChunkMagic: string;
  ByteSize: number;
  FxMagic: string;
  Version: number;
  FxID: string;
  FxVersion: number;

  NumParameters: number;
  ProgramName: string; // length: 28
  Parameters: Float32Array; // FxCk = float[NumParameters]

  constructor() {
    this.ChunkMagic = "CcnK";
    this.ByteSize = 0;
    this.FxMagic = "FxCk";
    this.Version = 0;
    this.FxID = "";
    this.FxVersion = 0;
    this.NumParameters = 0;
    this.ProgramName = "";
    this.Parameters = new Float32Array();
  }
}

export class FXP {
  // Preset (Program) (.fxp) with chunk (magic = 'FPCh')
  // typedef struct
  // {
  //     char chunkMagic[4];     // 'CcnK'
  //     long byteSize;          // of this chunk, excl. magic + ByteSize
  //     char fxMagic[4];        // 'FPCh'
  //     long version;
  //     char fxID[4];           // fx unique id
  //     long fxVersion;
  //     long numPrograms;
  //     char name[28];
  //     long chunkSize;
  //     unsigned char chunkData[ChunkSize];
  // } fxProgramSet;

  // Bank (.fxb) with chunk (magic = 'FBCh')
  // typedef struct
  // {
  //     char chunkMagic[4];     // 'CcnK'
  //     long byteSize;          // of this chunk, excl. magic + ByteSize
  //     char fxMagic[4];        // 'FBCh'
  //     long version;
  //     char fxID[4];           // fx unique id
  //     long fxVersion;
  //     long numPrograms;
  //     char future[128];
  //     long chunkSize;
  //     unsigned char chunkData[ChunkSize];
  // } fxChunkSet;

  // For Preset (Program) (.fxp) without chunk (magic = 'FxCk')
  // typedef struct {
  //     char chunkMagic[4];     // 'CcnK'
  //     long byteSize;          // of this chunk, excl. magic + ByteSize
  //     char fxMagic[4];        // 'FxCk'
  //     long version;
  //     char fxID[4];           // fx unique id
  //     long fxVersion;
  //     long numParams;
  //     char prgName[28];
  //     float params[numParams];        // variable no. of Parameters
  // } fxProgram;

  // For Bank (.fxb) without chunk (magic = 'FxBk')
  // typedef struct {
  //     char chunkMagic[4];     // 'CcnK'
  //     long byteSize;          // of this chunk, excl. magic + ByteSize
  //     char fxMagic[4];        // 'FxBk'
  //     long version;
  //     char fxID[4];           // fx unique id
  //     long fxVersion;
  //     long numPrograms;
  //     char future[128];
  //     fxProgram programs[NumPrograms];  // variable no. of Programs
  // } fxSet;

  public content:
    | FxContent
    | FxProgramSet
    | FxChunkSet
    | FxProgram
    | FxSet
    | undefined;
  public xmlDocument: XMLDocument | undefined;

  constructor(data?: Uint8Array) {
    if (data) {
      const bf = new BinaryFile(data, ByteOrder.BigEndian);
      const fxp = FXP.readFXP(bf);
      this.content = fxp.content;
      this.xmlDocument = fxp.xmlDocument;
    }
  }

  public writeFile(): Uint8Array | undefined {
    const bf = new BinaryFile(undefined, ByteOrder.BigEndian);
    FXP.write(bf, this.content, this.xmlDocument);

    // Retrieve the buffer and convert it to Uint8Array
    const buffer = bf.binaryWriter?.getBuffer();
    if (!buffer) {
      console.error("Failed to get buffer from binary writer.");
      return undefined; // Explicitly return undefined if the buffer is not available
    }

    return new Uint8Array(buffer);
  }

  private static write(
    bf: BinaryFile,
    content?: FxContent,
    xmlDocument?: XMLDocument
  ): void {
    if (!content) {
      console.error("Error writing file. Missing preset content.");
      return;
    }

    // Determine if the chunk data should be saved as XML
    let writeXMLChunkData = false;
    let xmlChunkData = "";
    if (xmlDocument) {
      const serializer = new XMLSerializer();
      xmlChunkData = serializer
        .serializeToString(xmlDocument)
        .replace(/'/g, "&apos;");
      writeXMLChunkData = true;

      if (content instanceof FxProgramSet) {
        content.ChunkSize = xmlChunkData.length;
      } else if (content instanceof FxChunkSet) {
        content.ChunkSize = xmlChunkData.length;
      }
    }

    if (content.ChunkMagic !== "CcnK") {
      console.error(
        "Cannot save the preset file. Missing preset header information."
      );
      return;
    }

    bf.binaryWriter?.writeString(content.ChunkMagic); // ChunkMagic, 4

    // Check the type of preset we're saving
    if (content.FxMagic === "FBCh") {
      // Bank (.fxb) with chunk (magic = 'FBCh')
      const chunkSet = content as FxChunkSet;
      chunkSet.ByteSize = 152 + chunkSet.ChunkSize;

      bf.binaryWriter?.writeInt32(chunkSet.ByteSize); // ByteSize = 4
      bf.binaryWriter?.writeString(chunkSet.FxMagic); // FxMagic, 4
      bf.binaryWriter?.writeInt32(chunkSet.Version); // Version, 4
      bf.binaryWriter?.writeString(chunkSet.FxID); // FxID, 4
      bf.binaryWriter?.writeInt32(chunkSet.FxVersion); // FxVersion, 4
      bf.binaryWriter?.writeInt32(chunkSet.NumPrograms); // NumPrograms, 4
      bf.binaryWriter?.writeString(chunkSet.Future.padEnd(128)); // Future, 128
      bf.binaryWriter?.writeInt32(chunkSet.ChunkSize); // ChunkSize, 4

      if (writeXMLChunkData) {
        bf.binaryWriter?.writeString(xmlChunkData); // ChunkData, <ChunkSize>
      } else {
        // Even though the main FXP is BigEndian format the preset chunk is saved in LittleEndian format
        bf.binaryWriter?.writeBytes(chunkSet.ChunkData.reverse());
      }
    } else if (content.FxMagic === "FPCh") {
      // Preset (Program) (.fxp) with chunk (magic = 'FPCh')
      const programSet = content as FxProgramSet;
      programSet.ByteSize = 52 + programSet.ChunkSize;

      bf.binaryWriter?.writeInt32(programSet.ByteSize); // ByteSize = 4
      bf.binaryWriter?.writeString(programSet.FxMagic); // FxMagic, 4
      bf.binaryWriter?.writeInt32(programSet.Version); // Version, 4
      bf.binaryWriter?.writeString(programSet.FxID); // FxID, 4
      bf.binaryWriter?.writeInt32(programSet.FxVersion); // FxVersion, 4
      bf.binaryWriter?.writeInt32(programSet.NumPrograms); // NumPrograms, 4
      bf.binaryWriter?.writeString(programSet.Name.padEnd(28)); // Name, 28
      bf.binaryWriter?.writeInt32(programSet.ChunkSize); // ChunkSize, 4

      if (writeXMLChunkData) {
        bf.binaryWriter?.writeString(xmlChunkData); // ChunkData, <ChunkSize>
      } else {
        // Even though the main FXP is BigEndian format the preset chunk is saved in LittleEndian format
        bf.binaryWriter?.writeBytes(programSet.ChunkData.reverse());
      }
    } else if (content.FxMagic === "FxCk") {
      // For Preset (Program) (.fxp) without chunk (magic = 'FxCk')
      const program = content as FxProgram;
      program.ByteSize = 48 + 4 * program.NumParameters;

      bf.binaryWriter?.writeInt32(program.ByteSize); // ByteSize = 4
      bf.binaryWriter?.writeString(program.FxMagic); // FxMagic, 4
      bf.binaryWriter?.writeInt32(program.Version); // Version, 4
      bf.binaryWriter?.writeString(program.FxID); // FxID, 4
      bf.binaryWriter?.writeInt32(program.FxVersion); // FxVersion, 4
      bf.binaryWriter?.writeInt32(program.NumParameters); // NumParameters, 4
      bf.binaryWriter?.writeString(program.ProgramName.padEnd(28)); // Name, 28

      // variable number of Parameters
      for (let i = 0; i < program.NumParameters; i++) {
        bf.binaryWriter?.writeFloat32(program.Parameters[i]);
      }
    } else if (content.FxMagic === "FxBk") {
      // For bank (.fxb) without chunk (magic = 'FxBk')
      const set = content as FxSet;

      // Variable number of Programs
      let ByteSize = 48;
      for (let i = 0; i < set.NumPrograms; i++) {
        const program = set.Programs[i];
        ByteSize += 4 * program.NumParameters;
      }
      set.ByteSize = 156 + ByteSize;

      bf.binaryWriter?.writeInt32(set.ByteSize); // ByteSize = 4
      bf.binaryWriter?.writeString(set.FxMagic); // FxMagic, 4
      bf.binaryWriter?.writeInt32(set.Version); // Version, 4
      bf.binaryWriter?.writeString(set.FxID); // FxID, 4
      bf.binaryWriter?.writeInt32(set.FxVersion); // FxVersion, 4
      bf.binaryWriter?.writeInt32(set.NumPrograms); // NumPrograms, 4
      bf.binaryWriter?.writeString(set.Future.padEnd(128)); // Future, 128

      // Variable number of Programs
      for (let i = 0; i < set.NumPrograms; i++) {
        const program = set.Programs[i];
        FXP.write(bf, program, undefined);
      }
    }
  }

  public readFile(data: ArrayBuffer | Uint8Array): void {
    const bf = new BinaryFile(data, ByteOrder.BigEndian);
    const fxp = FXP.readFXP(bf);
    this.content = fxp.content;
    this.xmlDocument = fxp.xmlDocument;
  }

  private static readFXP(bf: BinaryFile): FXP {
    const chunkMagic = bf.binaryReader?.readString(4) || "";
    if (chunkMagic !== "CcnK") {
      throw new Error(
        `Error reading file. Missing preset header information ${chunkMagic}`
      );
    }

    const fxp = new FXP();
    const byteSize = bf.binaryReader?.readInt32() || 0;
    const fxMagic = bf.binaryReader?.readString(4) || "";

    if (fxMagic === "FBCh") {
      // Bank (.fxb) with chunk (magic = 'FBCh')
      const chunkSet = new FxChunkSet();
      chunkSet.ChunkMagic = chunkMagic;
      chunkSet.ByteSize = byteSize;
      chunkSet.FxMagic = fxMagic;

      chunkSet.Version = bf.binaryReader?.readInt32() || 0;
      chunkSet.FxID = bf.binaryReader?.readString(4) || "";
      chunkSet.FxVersion = bf.binaryReader?.readInt32() || 0;
      chunkSet.NumPrograms = bf.binaryReader?.readInt32() || 0;
      chunkSet.Future =
        bf.binaryReader?.readString(128).replace(/\0+$/, "") || "";
      chunkSet.ChunkSize = bf.binaryReader?.readInt32() || 0;

      // Even though the main FXP is BigEndian format the preset chunk is saved in LittleEndian format
      chunkSet.ChunkData =
        bf.binaryReader?.readBytes(chunkSet.ChunkSize).reverse() ||
        new Uint8Array(0);

      // Read the XML chunk into memory
      try {
        if (chunkSet.ChunkData) {
          const chunkAsString = new TextDecoder("utf-8").decode(
            chunkSet.ChunkData
          );
          const parser = new DOMParser();
          const xmlDocument = parser.parseFromString(
            chunkAsString,
            "application/xml"
          );
          fxp.xmlDocument = xmlDocument;
        }
      } catch (error) {
        console.error("Failed to parse XML:", error);
      }

      fxp.content = chunkSet;
    } else if (fxMagic === "FPCh") {
      // Preset (Program) (.fxp) with chunk (magic = 'FPCh')
      const programSet = new FxProgramSet();
      programSet.ChunkMagic = chunkMagic;
      programSet.ByteSize = byteSize;
      programSet.FxMagic = fxMagic;

      programSet.Version = bf.binaryReader?.readInt32() || 0;
      programSet.FxID = bf.binaryReader?.readString(4) || "";
      programSet.FxVersion = bf.binaryReader?.readInt32() || 0;
      programSet.NumPrograms = bf.binaryReader?.readInt32() || 0;
      programSet.Name =
        bf.binaryReader?.readString(28).replace(/\0+$/, "") || "";
      programSet.ChunkSize = bf.binaryReader?.readInt32() || 0;

      // Even though the main FXP is BigEndian format the preset chunk is saved in LittleEndian format
      programSet.ChunkData =
        bf.binaryReader?.readBytes(programSet.ChunkSize).reverse() ||
        new Uint8Array(0);

      // Read the XML chunk into memory
      try {
        if (programSet.ChunkData) {
          const chunkAsString = new TextDecoder("utf-8").decode(
            programSet.ChunkData
          );
          const parser = new DOMParser();
          const xmlDocument = parser.parseFromString(
            chunkAsString,
            "application/xml"
          );
          fxp.xmlDocument = xmlDocument;
        }
      } catch (error) {
        console.error("Failed to parse XML:", error);
      }

      fxp.content = programSet;
    } else if (fxMagic === "FxCk") {
      // For Preset (Program) (.fxp) without chunk (magic = 'FxCk')
      const program = new FxProgram();
      program.ChunkMagic = chunkMagic;
      program.ByteSize = byteSize;
      program.FxMagic = fxMagic;

      program.Version = bf.binaryReader?.readInt32() || 0;
      program.FxID = bf.binaryReader?.readString(4) || "";
      program.FxVersion = bf.binaryReader?.readInt32() || 0;
      program.NumParameters = bf.binaryReader?.readInt32() || 0;
      program.ProgramName =
        bf.binaryReader?.readString(28).replace(/\0+$/, "") || "";

      // variable no. of Parameters
      program.Parameters = new Float32Array(program.NumParameters);

      for (let i = 0; i < program.NumParameters; i++) {
        program.Parameters[i] = bf.binaryReader?.readFloat32() || 0;
      }

      fxp.content = program;
    } else if (fxMagic === "FxBk") {
      // For bank (.fxb) without chunk (magic = 'FxBk')
      const set = new FxSet();
      set.ChunkMagic = chunkMagic;
      set.ByteSize = byteSize;
      set.FxMagic = fxMagic;

      set.Version = bf.binaryReader?.readInt32() || 0;
      set.FxID = bf.binaryReader?.readString(4) || "";
      set.FxVersion = bf.binaryReader?.readInt32() || 0;
      set.NumPrograms = bf.binaryReader?.readInt32() || 0;
      set.Future = bf.binaryReader?.readString(128).replace(/\0+$/, "") || "";

      // Read variable number of Programs
      set.Programs = Array.from({ length: set.NumPrograms }, () => {
        const content = FXP.readFXP(bf).content;
        return content instanceof FxProgram ? content : null;
      }).filter(Boolean) as FxProgram[]; // Ensure only FxProgram instances are kept

      fxp.content = set;
    }

    return fxp;
  }

  public static WriteRaw2FXP(
    chunkData: Uint8Array,
    fxID: string
  ): Uint8Array | undefined {
    const fxp = new FXP();
    const fxpContent = new FxProgramSet();
    fxp.content = fxpContent;
    fxpContent.ChunkMagic = "CcnK";
    fxpContent.ByteSize = 0; // will be set correctly by FXP class
    fxpContent.FxMagic = "FPCh"; // FPCh = FXP (preset), FBCh = FXB (bank)
    fxpContent.Version = 1; // Format Version (should be 1)
    fxpContent.FxID = fxID.substring(0, 4);
    fxpContent.FxVersion = 1;
    fxpContent.NumPrograms = 1;
    fxpContent.Name = "";
    fxpContent.ChunkSize = chunkData.length;
    fxpContent.ChunkData = chunkData;

    return fxp.writeFile();
  }
}
