#pragma endian big

// Hex-pat for VST2 Preset (.fxp) and Bank (.fxb) files
// This version uses a fully encapsulated structure with all types defined at the
// top level, which is the correct and required syntax.
// Author: A helpful AI
// Version: 7.0 (Corrected with invaluable user expertise)

// ===================================================================
//  1. DEFINE ALL DATA TYPE BLUEPRINTS AT THE TOP LEVEL
// ===================================================================

// --- Component Structs ---
struct VST2_VersionInfo {
    u32 version;
    char fxID[4] [[name("Plugin FourCC ID")]];
    u32 fxVersion [[name("Plugin Version")]];
};

struct Bank_Program_Entry {
    char chunkMagic[4]  [[name("Program Magic"), assert(this == "CcnK")]];
    u32  byteSize       [[name("Program Block Size")]];
    char fxMagic[4]     [[name("Program Format Magic"), assert(this == "FxCk")]];
    u32  version;
    char fxID[4];
    u32  fxVersion;
    u32  numParams      [[name("Number of Parameters")]];
    char prgName[28]    [[name("Program Name")]];
    float params[this.numParams] [[name("Parameters"), color("cyan")]];
};

// --- Body Structs ---
struct Body_Preset_Params {
    VST2_VersionInfo version_info;
    u32      numParams [[name("Number of Parameters")]];
    char     prgName[28] [[name("Program Name")]];
    float    params[this.numParams] [[name("Parameters"), color("cyan")]];
};

struct Body_Preset_Chunk {
    VST2_VersionInfo version_info;
    u32      numPrograms [[name("Number of Programs")]];
    char     name[28] [[name("Program Name")]];
    u32      chunkSize [[name("Chunk Size (bytes)")]];
    u8       chunkData[this.chunkSize] [[name("Opaque Chunk Data"), color("teal")]];
};

struct Body_Bank_Params {
    VST2_VersionInfo version_info;
    u32      numPrograms [[name("Number of Programs")]];
    u8       future[128] [[name("Reserved")]];
    Bank_Program_Entry programs[this.numPrograms] [[name("Programs")]];
};

struct Body_Bank_Chunk {
    VST2_VersionInfo version_info;
    u32      numPrograms [[name("Number of Programs")]];
    u8       future[128] [[name("Reserved")]];
    u32      chunkSize [[name("Chunk Size (bytes)")]];
    u8       chunkData[this.chunkSize] [[name("Opaque Chunk Data"), color("teal")]];
};

// --- Header Struct ---
struct Header {
    char chunkMagic[4] [[name("File Magic"), color("red"), assert(this == "CcnK")]];
    u32  byteSize [[name("Body Size (in bytes)")]];
    char fxMagic[4] [[name("Format Magic"), color("orange")]];
};

// --- Body Union ---
// This union will interpret the file data based on the magic number
// read by the Header struct.
union Body {
    // Inside this union, `this.parent` refers to the `VST2_File` instance.
    // This allows us to access the `header` member that was just parsed.
    if (this.parent.header.fxMagic == "FxCk")
        Body_Preset_Params preset_params;
    else if (this.parent.header.fxMagic == "FxBk")
        Body_Bank_Params bank_params;
    else if (this.parent.header.fxMagic == "FPCh")
        Body_Preset_Chunk preset_chunk;
    else if (this.parent.header.fxMagic == "FBCh")
        Body_Bank_Chunk bank_chunk;
    else
        // The body size is specified in the header.
        u8 unknown_data[this.parent.header.byteSize];
};


// ===================================================================
//  2. COMPOSE THE BLUEPRINTS IN THE MAIN FILE STRUCT
// ===================================================================

struct VST2_File {
    Header header [[name("File Header")]];

    // The Body union will now parse the rest of the file.
    // Its behavior is controlled by the `header.fxMagic` value.
    Body   body   [[name("File Body")]];
};


// ===================================================================
//  3. DEFINE THE ENTRY POINT
// ===================================================================

// Apply the single, all-encompassing struct to the start of the file.
VST2_File file @ 0x00;