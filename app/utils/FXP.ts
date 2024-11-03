import { BinaryFile, ByteOrder } from "./BinaryFile";

interface FxContent {
  chunkMagic: string; // 'CcnK'
  byteSize: number; // of this chunk, excl. magic + byteSize
  fxMagic: string; // 'FPCh', 'FBCh', 'FxCk', 'FxBk'
  version: number;
  fxID: string; // fx unique id
  fxVersion: number;
}

class FxProgramSet implements FxContent {
  chunkMagic: string;
  byteSize: number;
  fxMagic: string;
  version: number;
  fxID: string;
  fxVersion: number;

  numPrograms: number;
  name: string; // length: 28 chars
  chunkSize: number;
  chunkData: Uint8Array; // length: chunkSize

  constructor() {
    this.chunkMagic = "CcnK";
    this.byteSize = 0;
    this.fxMagic = "FPCh";
    this.version = 0;
    this.fxID = "";
    this.fxVersion = 0;
    this.numPrograms = 0;
    this.name = "";
    this.chunkSize = 0;
    this.chunkData = new Uint8Array();
  }
}

class FxChunkSet implements FxContent {
  chunkMagic: string;
  byteSize: number;
  fxMagic: string;
  version: number;
  fxID: string;
  fxVersion: number;

  numPrograms: number;
  future: string; // length: 128
  chunkSize: number;
  chunkData: Uint8Array; // length: chunkSize

  constructor() {
    this.chunkMagic = "CcnK";
    this.byteSize = 0;
    this.fxMagic = "FBCh";
    this.version = 0;
    this.fxID = "";
    this.fxVersion = 0;
    this.numPrograms = 0;
    this.future = "";
    this.chunkSize = 0;
    this.chunkData = new Uint8Array();
  }
}

class FxSet implements FxContent {
  chunkMagic: string;
  byteSize: number;
  fxMagic: string;
  version: number;
  fxID: string;
  fxVersion: number;

  numPrograms: number;
  future: string; // length: 128
  programs: FxProgram[]; // array of programs

  constructor() {
    this.chunkMagic = "CcnK";
    this.byteSize = 0;
    this.fxMagic = "FxBk";
    this.version = 0;
    this.fxID = "";
    this.fxVersion = 0;
    this.numPrograms = 0;
    this.future = "";
    this.programs = [];
  }
}

class FxProgram implements FxContent {
  chunkMagic: string;
  byteSize: number;
  fxMagic: string;
  version: number;
  fxID: string;
  fxVersion: number;

  numParameters: number;
  programName: string; // length: 28
  parameters: Float32Array; // FxCk = float[numParameters]

  constructor() {
    this.chunkMagic = "CcnK";
    this.byteSize = 0;
    this.fxMagic = "FxCk";
    this.version = 0;
    this.fxID = "";
    this.fxVersion = 0;
    this.numParameters = 0;
    this.programName = "";
    this.parameters = new Float32Array();
  }
}

export class FXP {
  // Preset (Program) (.fxp) with chunk (magic = 'FPCh')
  // typedef struct
  // {
  //     char chunkMagic[4];     // 'CcnK'
  //     long byteSize;          // of this chunk, excl. magic + byteSize
  //     char fxMagic[4];        // 'FPCh'
  //     long version;
  //     char fxID[4];           // fx unique id
  //     long fxVersion;
  //     long numPrograms;
  //     char name[28];
  //     long chunkSize;
  //     unsigned char chunkData[chunkSize];
  // } fxProgramSet;

  // Bank (.fxb) with chunk (magic = 'FBCh')
  // typedef struct
  // {
  //     char chunkMagic[4];     // 'CcnK'
  //     long byteSize;          // of this chunk, excl. magic + byteSize
  //     char fxMagic[4];        // 'FBCh'
  //     long version;
  //     char fxID[4];           // fx unique id
  //     long fxVersion;
  //     long numPrograms;
  //     char future[128];
  //     long chunkSize;
  //     unsigned char chunkData[chunkSize];
  // } fxChunkSet;

  // For Preset (Program) (.fxp) without chunk (magic = 'FxCk')
  // typedef struct {
  //     char chunkMagic[4];     // 'CcnK'
  //     long byteSize;          // of this chunk, excl. magic + byteSize
  //     char fxMagic[4];        // 'FxCk'
  //     long version;
  //     char fxID[4];           // fx unique id
  //     long fxVersion;
  //     long numParams;
  //     char prgName[28];
  //     float params[numParams];        // variable no. of parameters
  // } fxProgram;

  // For Bank (.fxb) without chunk (magic = 'FxBk')
  // typedef struct {
  //     char chunkMagic[4];     // 'CcnK'
  //     long byteSize;          // of this chunk, excl. magic + byteSize
  //     char fxMagic[4];        // 'FxBk'
  //     long version;
  //     char fxID[4];           // fx unique id
  //     long fxVersion;
  //     long numPrograms;
  //     char future[128];
  //     fxProgram programs[numPrograms];  // variable no. of programs
  // } fxSet;

  // public chunkMagic: string; // 'CcnK'
  // public byteSize: number; // of this chunk, excl. magic + byteSize
  // public fxMagic: string; // 'FxCk', 'FxBk', 'FBCh' or 'FPCh'
  // public version: number;
  // public fxID: string;
  // public fxVersion: number;
  // public numPrograms: number; // FPCh = numProgams
  // public numParameters: number; // FxCk = numParams
  // public parameters: number[]; // FxCk = float[numParameters]
  // public name: string; // if FPCh
  // public future: string; // if FBCh
  // public chunkSize: number;
  // public chunkData: string;
  // public chunkDataByteArray: Uint8Array;
  // public xmlDocument: Document | null;

  // public programs: unknown; // public FxProgram[] Programs { get; set; }

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

  writeFile(): void {
    const bf = new BinaryFile(undefined, ByteOrder.BigEndian);
    FXP.write(bf, this.content, this.xmlDocument);
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
        content.chunkSize = xmlChunkData.length;
      } else if (content instanceof FxChunkSet) {
        content.chunkSize = xmlChunkData.length;
      }
    }

    if (content.chunkMagic !== "CcnK") {
      console.error(
        "Cannot save the preset file. Missing preset header information."
      );
      return;
    }

    bf.binaryWriter?.writeString(content.chunkMagic); // chunkMagic, 4

    // Check the type of preset we're saving
    if (content.fxMagic === "FBCh") {
      // Bank (.fxb) with chunk (magic = 'FBCh')
      const chunkSet = content as FxChunkSet;
      chunkSet.byteSize = 152 + chunkSet.chunkSize;

      bf.binaryWriter?.writeInt32(chunkSet.byteSize); // byteSize = 4
      bf.binaryWriter?.writeString(chunkSet.fxMagic); // fxMagic, 4
      bf.binaryWriter?.writeInt32(chunkSet.version); // version, 4
      bf.binaryWriter?.writeString(chunkSet.fxID); // fxID, 4
      bf.binaryWriter?.writeInt32(chunkSet.fxVersion); // fxVersion, 4
      bf.binaryWriter?.writeInt32(chunkSet.numPrograms); // numPrograms, 4
      bf.binaryWriter?.writeString(chunkSet.future.padEnd(128)); // future, 128
      bf.binaryWriter?.writeInt32(chunkSet.chunkSize); // chunkSize, 4

      if (writeXMLChunkData) {
        bf.binaryWriter?.writeString(xmlChunkData); // chunkData, <chunkSize>
      } else {
        // Even though the main FXP is BigEndian format the preset chunk is saved in LittleEndian format
        bf.binaryWriter?.writeBytes(chunkSet.chunkData.reverse());
      }
    } else if (content.fxMagic === "FPCh") {
      // Preset (Program) (.fxp) with chunk (magic = 'FPCh')
      const programSet = content as FxProgramSet;
      programSet.byteSize = 52 + programSet.chunkSize;

      bf.binaryWriter?.writeInt32(programSet.byteSize); // byteSize = 4
      bf.binaryWriter?.writeString(programSet.fxMagic); // fxMagic, 4
      bf.binaryWriter?.writeInt32(programSet.version); // version, 4
      bf.binaryWriter?.writeString(programSet.fxID); // fxID, 4
      bf.binaryWriter?.writeInt32(programSet.fxVersion); // fxVersion, 4
      bf.binaryWriter?.writeInt32(programSet.numPrograms); // numPrograms, 4
      bf.binaryWriter?.writeString(programSet.name.padEnd(28)); // name, 28
      bf.binaryWriter?.writeInt32(programSet.chunkSize); // chunkSize, 4

      if (writeXMLChunkData) {
        bf.binaryWriter?.writeString(xmlChunkData); // chunkData, <chunkSize>
      } else {
        // Even though the main FXP is BigEndian format the preset chunk is saved in LittleEndian format
        bf.binaryWriter?.writeBytes(programSet.chunkData.reverse());
      }
    } else if (content.fxMagic === "FxCk") {
      // For Preset (Program) (.fxp) without chunk (magic = 'FxCk')
      const program = content as FxProgram;
      program.byteSize = 48 + 4 * program.numParameters;

      bf.binaryWriter?.writeInt32(program.byteSize); // byteSize = 4
      bf.binaryWriter?.writeString(program.fxMagic); // fxMagic, 4
      bf.binaryWriter?.writeInt32(program.version); // version, 4
      bf.binaryWriter?.writeString(program.fxID); // fxID, 4
      bf.binaryWriter?.writeInt32(program.fxVersion); // fxVersion, 4
      bf.binaryWriter?.writeInt32(program.numParameters); // numParameters, 4
      bf.binaryWriter?.writeString(program.programName.padEnd(28)); // name, 28

      // variable number of parameters
      for (let i = 0; i < program.numParameters; i++) {
        bf.binaryWriter?.writeFloat32(program.parameters[i]);
      }
    } else if (content.fxMagic === "FxBk") {
      // For bank (.fxb) without chunk (magic = 'FxBk')
      const set = content as FxSet;

      // Variable number of programs
      let byteSize = 48;
      for (let i = 0; i < set.numPrograms; i++) {
        const program = set.programs[i];
        byteSize += 4 * program.numParameters;
      }
      set.byteSize = 156 + byteSize;

      bf.binaryWriter?.writeInt32(set.byteSize); // byteSize = 4
      bf.binaryWriter?.writeString(set.fxMagic); // fxMagic, 4
      bf.binaryWriter?.writeInt32(set.version); // version, 4
      bf.binaryWriter?.writeString(set.fxID); // fxID, 4
      bf.binaryWriter?.writeInt32(set.fxVersion); // fxVersion, 4
      bf.binaryWriter?.writeInt32(set.numPrograms); // numPrograms, 4
      bf.binaryWriter?.writeString(set.future.padEnd(128)); // future, 128

      // Variable number of programs
      for (let i = 0; i < set.numPrograms; i++) {
        const program = set.programs[i];
        FXP.write(bf, program, undefined);
      }
    }
  }

  readFile(data: ArrayBuffer | Uint8Array): void {
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
      chunkSet.chunkMagic = chunkMagic;
      chunkSet.byteSize = byteSize;
      chunkSet.fxMagic = fxMagic;

      chunkSet.version = bf.binaryReader?.readInt32() || 0;
      chunkSet.fxID = bf.binaryReader?.readString(4) || "";
      chunkSet.fxVersion = bf.binaryReader?.readInt32() || 0;
      chunkSet.numPrograms = bf.binaryReader?.readInt32() || 0;
      chunkSet.future =
        bf.binaryReader?.readString(128).replace(/\0+$/, "") || "";
      chunkSet.chunkSize = bf.binaryReader?.readInt32() || 0;

      // Even though the main FXP is BigEndian format the preset chunk is saved in LittleEndian format
      chunkSet.chunkData =
        bf.binaryReader?.readBytes(chunkSet.chunkSize).reverse() ||
        new Uint8Array(0);

      // Read the XML chunk into memory
      try {
        if (chunkSet.chunkData) {
          const chunkAsString = new TextDecoder("utf-8").decode(
            chunkSet.chunkData
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
      programSet.chunkMagic = chunkMagic;
      programSet.byteSize = byteSize;
      programSet.fxMagic = fxMagic;

      programSet.version = bf.binaryReader?.readInt32() || 0;
      programSet.fxID = bf.binaryReader?.readString(4) || "";
      programSet.fxVersion = bf.binaryReader?.readInt32() || 0;
      programSet.numPrograms = bf.binaryReader?.readInt32() || 0;
      programSet.name =
        bf.binaryReader?.readString(28).replace(/\0+$/, "") || "";
      programSet.chunkSize = bf.binaryReader?.readInt32() || 0;

      // Even though the main FXP is BigEndian format the preset chunk is saved in LittleEndian format
      programSet.chunkData =
        bf.binaryReader?.readBytes(programSet.chunkSize).reverse() ||
        new Uint8Array(0);

      // Read the XML chunk into memory
      try {
        if (programSet.chunkData) {
          const chunkAsString = new TextDecoder("utf-8").decode(
            programSet.chunkData
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
      program.chunkMagic = chunkMagic;
      program.byteSize = byteSize;
      program.fxMagic = fxMagic;

      program.version = bf.binaryReader?.readInt32() || 0;
      program.fxID = bf.binaryReader?.readString(4) || "";
      program.fxVersion = bf.binaryReader?.readInt32() || 0;
      program.numParameters = bf.binaryReader?.readInt32() || 0;
      program.programName =
        bf.binaryReader?.readString(28).replace(/\0+$/, "") || "";

      // variable no. of parameters
      program.parameters = new Float32Array(program.numParameters);

      for (let i = 0; i < program.numParameters; i++) {
        program.parameters[i] = bf.binaryReader?.readFloat32() || 0;
      }

      fxp.content = program;
    } else if (fxMagic === "FxBk") {
      // For bank (.fxb) without chunk (magic = 'FxBk')
      const set = new FxSet();
      set.chunkMagic = chunkMagic;
      set.byteSize = byteSize;
      set.fxMagic = fxMagic;

      set.version = bf.binaryReader?.readInt32() || 0;
      set.fxID = bf.binaryReader?.readString(4) || "";
      set.fxVersion = bf.binaryReader?.readInt32() || 0;
      set.numPrograms = bf.binaryReader?.readInt32() || 0;
      set.future = bf.binaryReader?.readString(128).replace(/\0+$/, "") || "";

      // Read variable number of programs
      set.programs = Array.from({ length: set.numPrograms }, () => {
        const content = FXP.readFXP(bf).content;
        return content instanceof FxProgram ? content : null;
      }).filter(Boolean) as FxProgram[]; // Ensure only FxProgram instances are kept

      fxp.content = set;
    }

    return fxp;
  }
}
