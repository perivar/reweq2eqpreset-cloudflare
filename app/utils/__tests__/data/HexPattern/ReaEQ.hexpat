#pragma endian big
import std.mem;
import std.string;
import std.sys;
import std.io;
import std.ctype;

// ReaEQ Filter Types enum for reference
enum ReaEQFilterType : u32 {
  LowShelf = 0,
  HighShelf = 1,
  Band = 8,
  LowPass = 3,
  HighPass = 4,
  AllPass = 5,
  Notch = 6,
  BandPass = 7,
  Band_alt = 9,
  Band_alt2 = 2
};

// FXP Header
struct FXPHeader {
    char chunkMagic[4] [[assert(this == "CcnK")]];
    u32 byteSize;
    char fxMagic[4] [[assert(this == "FPCh")]];
};

// VST2 Version Info
struct VST2VersionInfo {
    u32 version;
    char fxID[4] [[assert(this == "reeq")]];
    u32 fxVersion [[assert(this == 1100)]];
};

// FXP Body for FPCh
struct FXPBody {
    VST2VersionInfo version_info;
    u32 numPrograms [[assert(this == 1)]];
    char name[28];
    u32 chunkSize;
};

// Switch to little endian for chunk data
#pragma endian little

// ReaEQ Band Structure
struct ReaEQBand {
    u32 FilterType;           // ReaEQFilterType enum value
    u32 Enabled;              // 1 for enabled, 0 for disabled
    double Frequency;         // Filter frequency in Hz
    double GainRatio;         // Gain as amplitude ratio (10^(dB/20))
    double BandwidthOct;      // Bandwidth in octaves
    u8 LogScaleAutoFreq;      // 1 for true, 0 for false
};

// ReaEQ FXP Chunk Structure
struct ReaEQFXPData {
    u32 Version [[assert(this == 33)]];              // Version number (typically 33)
    u32 BandCount;            // Number of bands
    ReaEQBand bands[BandCount]; // Dynamic array of bands
    u32 Unknown1 [[assert(this == 1)]];            // Typically 1
    u32 Unknown2 [[assert(this == 1)]];            // Typically 1
    double OutputGainRatio [[assert(this == 1.0)]];   // Output gain as amplitude ratio (typically 1.0 for 0dB)
    u32 Unknown3 [[assert(this == 0)]];            // Typically 0
};

// Place the structures at offsets
FXPHeader header @0x00;
FXPBody body @0x0C;
ReaEQFXPData chunkData @0x3C; // 0x0C + sizeof(FXPBody) = 0x0C + 48 = 0x3C