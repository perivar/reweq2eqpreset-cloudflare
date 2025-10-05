#pragma endian little
import std.mem;
import std.string;
import std.sys;
import std.io;
import std.ctype;

// VST3 Preset Header
struct VST3Header {
   char magic[4];        // "VST3"
   u32 version;          // Version number (1)
   char class_id[32];    // ASCII-encoded class ID
   u64 list_offset;      // Offset to chunk list
};

// Generic Chunk Data
struct VST3Chunk<auto len> {
   char chunk_id[4];     // Chunk identifier
   u8 chunk_data[len];   // Raw chunk data

   std::print(std::format("chunk_id: '{}': chunk_data len: {}", chunk_id, len));
};

// Chunk Entry in List
struct VST3ChunkEntry {
   char id[4];           // Chunk ID ("Info", "Comp", "Cont")
   u64 offset;           // Offset to chunk data
   u64 size;             // Size of chunk data
   
   std::print(std::format("id: '{}': offset: {}, size: {}", id, offset, size));
   VST3Chunk<size> data @ offset;
};

// Chunk List
struct VST3ChunkList {
   char list_id[4];      // "List"
   u32 count;            // Number of chunks
   VST3ChunkEntry chunks[count];
};

// Main VST3 Preset Structure
struct VST3Preset {
   VST3Header header;

   // Validate header magic
   str value = header.magic;
   str expectedValue = "VST3";
   std::assert(
      value == expectedValue,
      std::format(
         "Invalid header value! Expected {}, got {} at position 0x{:X}",
         expectedValue, value, $ - std::string::length(expectedValue)));

   // Chunk list at specified offset
   VST3ChunkList chunk_list @header.list_offset;
};

VST3Preset preset @0x00;
