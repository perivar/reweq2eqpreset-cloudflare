#pragma endian little
import std.mem;
import std.string;
import std.sys;
import std.io;
import std.ctype;

// Struct for converting float to u32 while maintaining the value
struct float_enum<T> {
   float as_float;
   u32 as_u32 = as_float;  // cast to u32
   T as_enum = as_u32;     // cast to enum
}[[ static, format("format_float_enum") ]];

fn format_float_enum(auto value) { return std::format("{}", value.as_enum); };

// Enums
enum ProQShape : u32 {
   Bell = 0,
   LowShelf = 1,
   LowCut = 2,
   HighShelf = 3,
   HighCut = 4,
   Notch = 5
};

enum ProQLPHPSlope : u32 {
   Slope6dB_oct = 0,
   Slope12dB_oct = 1,
   Slope24dB_oct = 2,
   Slope48dB_oct = 3
};

enum ProQStereoPlacement : u32 { LeftOrMid = 0, RightOrSide = 1, Stereo = 2 };

enum ProQChannelMode : u32 { LeftRight = 0, MidSide = 1 };

// Header
struct FFPHeader {
   char header[4];  // "FPQr"
   u32 version;
   u32 parameter_count;
   float num_active_bands;
};

// Band structure
struct FFPBand {
   float frequency;                    // Converted back using freqConvertBack
   float gain;                         // Actual gain in dB
   float q;                            // Converted back using qConvertBack
   float_enum<ProQShape> filter_type;  // 0-5: Bell, LowShelf, etc.
   float_enum<ProQLPHPSlope> filter_slope;  // 0-3: Slope 6dB/oct - 48dB/oct
   float_enum<ProQStereoPlacement>
       stereo_placement;  // 0=Left/Mid, 1=Right/Side, 2=Stereo
   float unknown;         // Always 1.0?
};

// ProQ Settings
struct FFPSettings {
   float output_gain;    // -1 to 1 (mapped to -Infinity to +36dB)
   float output_pan;     // -1 to 1 (0 = middle)
   float display_range;  // 0=6dB, 1=12dB, 2=30dB, 3=3dB
   float process_mode;   // 0=Zero Latency, 1=Linear Phase
   float_enum<ProQChannelMode> channel_mode;  // 0=Left/Right, 1=Mid/Side
   float bypass;                              // 0=No bypass
   float receive_midi;                        // 0=Enabled?
   float analyzer_mode;        // 0=Off, 1=Pre, 2=Post, 3=Pre+Post
   float analyzer_resolution;  // 0-3: Low to Max
   float analyzer_speed;       // 0-3: Very Slow to Fast
   float solo_band;            // -1 if no solo
};

// Complete FFP structure
struct FFPData {
   FFPHeader header;

   str value = header.header;
   str expectedValue = "FPQr";
   std::assert(
       value == expectedValue,
       std::format(
           "Invalid header value! Expected {}, got {} at position 0x{:X}",
           expectedValue, value, $ - std::string::length(expectedValue)));

   // 24 bands
   FFPBand bands[24];

   FFPSettings settings;
};

FFPData data @0x00;