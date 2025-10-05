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
enum ProQ2Shape : u32 {
   Bell = 0,
   LowShelf = 1,
   LowCut = 2,
   HighShelf = 3,
   HighCut = 4,
   Notch = 5,
   BandPass = 6,
   TiltShelf = 7,
};

enum ProQ2Slope : u32 {
   Slope6dB_oct = 0,
   Slope12dB_oct = 1,
   Slope18dB_oct = 2,
   Slope24dB_oct = 3,
   Slope30dB_oct = 4,
   Slope36dB_oct = 5,
   Slope48dB_oct = 6,
   Slope72dB_oct = 7,
   Slope96dB_oct = 8,
};

enum ProQ2StereoPlacement : u32 {
   LeftOrMid = 0,
   RightOrSide = 1,
   Stereo = 2,
};

enum ProQ2ChannelMode : u32 {
   LeftRight = 0,
   MidSide = 1,
};

// Header
struct FFPHeader {
   char header[4];  // "FQ2p"
   u32 version;
   u32 parameter_count;
};

// Band structure
struct FFPBand {
   float enabled;
   float frequency;                      // Converted back using freqConvertBack
   float gain;                           // Actual gain in dB
   float q;                              // Converted back using qConvertBack
   float_enum<ProQ2Shape> filter_type;   // 0-7: Bell, LowShelf, etc.
   float_enum<ProQ2Slope> filter_slope;  // 0-8: Slope 6dB/oct - 96dB/oct
   float_enum<ProQ2StereoPlacement>
       stereo_placement;  // 0=Left/Mid, 1=Right/Side, 2=Stereo
};

// ProQ2 Settings
struct FFPSettings {
   float processingMode;        // Zero Latency: 0.0, Natural Phase: 1.0, Linear
                                // Phase: 2.0
   float processingResolution;  // 0 - 4, Medium
   float channelMode;           // 0 = Left/Right, 1 = Mid/Side
   float gainScale;             // 100%
   float outputLevel;  // 0.0 dB, -1 to 1 (- Infinity to +36 dB , 0 = 0 dB)
   float outputPan;    // Left 0 dB, Right: 0 dB, -1 to 1 (0 = middle)
   float byPass;       // Not Bypassed
   float outputInvertPhase;           // Normal
   float autoGain;                    // Off
   float analyzerShowPreProcessing;   // Disabled - 0: Off, 1: On
   float analyzerShowPostProcessing;  // Disabled - 0: Off, 1: On
   float analyzerShowSidechain;       // Disabled - 0: Off, 1: On
   float
       analyzerRange;  // Analyzer Range in dB. 0.0: 60dB, 1.0: 90dB, 2.0: 120dB
   float analyzerResolution;  // Analyzer Resolution. 0.0: Low, 1.0:
                              // Medium, 2.0: High, 3.00: Maximum
   float analyzerSpeed;       // Analyzer Speed. 0.0: Very Slow, 1.0: Slow, 2.0:
                              // Medium, 3.0 Fast, 4.0: Very Fast
   float analyzerTilt;        // Analyzer Tilt in dB/oct. 0.0:
                              // 0.0, 1.0: 1.5, 2.0: 3.0, 3.0: 4.5, 4.0: 6.0
   float analyzerFreeze;      // 0: Off, 1: On
   float spectrumGrab;        // Enabled
   float displayRange;        // 12dB
   float receiveMidi;         // Enabled
   float soloBand;            // -1
   float soloGain;            // 0.00
};

// Complete FFP structure
struct FFPData {
   FFPHeader header;

   str value = header.header;
   str expectedValue = "FQ2p";
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