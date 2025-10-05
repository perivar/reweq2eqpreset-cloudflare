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

// Enums for ProQ3
enum ProQ3Shape : u32 {
   Bell = 0,  // (default)
   LowShelf = 1,
   LowCut = 2,
   HighShelf = 3,
   HighCut = 4,
   Notch = 5,
   BandPass = 6,
   TiltShelf = 7,
   FlatTilt = 8,
};

enum ProQ3Slope : u32 {
   Slope6dB_oct = 0,
   Slope12dB_oct = 1,
   Slope18dB_oct = 2,
   Slope24dB_oct = 3,  // (default)
   Slope30dB_oct = 4,
   Slope36dB_oct = 5,
   Slope48dB_oct = 6,
   Slope72dB_oct = 7,
   Slope96dB_oct = 8,
   SlopeBrickwall = 9,
};

enum ProQ3StereoPlacement : u32 {
   Left = 0,
   Right = 1,
   Stereo = 2,  // (default)
   Mid = 3,
   Side = 4,
};

enum ProQ3ChannelMode : u32 {
   LeftRight = 0,
   MidSide = 1,
};

// Header
struct FFPHeader {
   char header[4];  // "FQ3p"
   u32 version;
   u32 parameter_count;

   // parameter_count = 334
   // 24 bands with 13 parameters each = 312
   // and then 22 parameters at the end
};

// Band structure for ProQ3
struct FFPBand {
   float enabled;
   float unknown1;
   float frequency;     // value range 10.0 -> 30000.0 Hz
   float gain;          // + or - value in dB
   float dynamicRange;  // + or - value in dB
   float unknown3;
   float dynamicThreshold;               // 1 = auto, or value in dB
   float q;                              // value range 0.025 -> 40.00
   float_enum<ProQ3Shape> filter_shape;  // 0-8: Bell, LowShelf, etc.
   float_enum<ProQ3Slope> filter_slope;  // 0-9: Slope 6dB/oct - Brickwall
   float_enum<ProQ3StereoPlacement>
       stereo_placement;  // 0=Left, 1=Right, 2=Stereo, 3=Mid, 4=Side
   float unknown5;
   float unknown6;
};

// Complete FFP structure for ProQ3
struct FFPData {
   FFPHeader header;

   str value = header.header;
   str expectedValue = "FQ3p";
   std::assert(
       value == expectedValue,
       std::format(
           "Invalid header value! Expected {}, got {} at position 0x{:X}",
           expectedValue, value, $ - std::string::length(expectedValue)));

   // 24 bands
   FFPBand bands[24];

   u32 remainingParameterCount = header.parameter_count - 13 * 24;
   float settings[remainingParameterCount];
};

FFPData data @0x00;