import { FXP } from "../FXP";
import { toPlainObject } from "./helpers/testUtils";

// set this to true to debug the outputs as objects
const DO_DEBUG_OBJECT = false;

// Function to get the exact byte array for each float in big-endian format
function getFloatBytes(values: number[]): number[] {
  const floatBytes: number[] = [];

  for (const value of values) {
    // Create a buffer for a single 32-bit float (4 bytes)
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);

    // Set the float in big-endian format
    view.setFloat32(0, value, false); // `false` for big-endian

    // Push each byte from the DataView to the floatBytes array
    for (let j = 0; j < 4; j++) {
      floatBytes.push(view.getUint8(j));
    }
  }

  return floatBytes;
}

test("fxp-FxCk", () => {
  // Define float values that convert to exact values when stored in 4 bytes
  const floatValues = [
    0.0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1.0, 1.125,
  ];

  // Uint8Array initialized with hex values according to the FXP format
  const data = new Uint8Array([
    "C".charCodeAt(0),
    "c".charCodeAt(0),
    "n".charCodeAt(0),
    "K".charCodeAt(0), // 'CcnK' (ChunkMagic)
    0x00,
    0x00,
    0x00,
    48 + 4 * floatValues.length,
    "F".charCodeAt(0),
    "x".charCodeAt(0),
    "C".charCodeAt(0),
    "k".charCodeAt(0), // 'FxCk' (FxMagic)
    0x00,
    0x00,
    0x00,
    0x01, // Version
    "P".charCodeAt(0),
    "n".charCodeAt(0),
    "o".charCodeAt(0),
    "1".charCodeAt(0), // FxID ('Pno1')
    0x00,
    0x00,
    0x00,
    0x01, // FxVersion
    0x00,
    0x00,
    0x00,
    floatValues.length, // numParams (0a = 10 Parameters)
    ..."Acoustic Piano"
      .padEnd(28, "\0")
      .split("")
      .map(char => char.charCodeAt(0)), // prgName (28 bytes)

    ...getFloatBytes(floatValues),
  ]);

  const actualFxp = new FXP(data);
  if (DO_DEBUG_OBJECT) console.log(JSON.stringify(actualFxp, null, 2));
  expect(toPlainObject(actualFxp)).toStrictEqual({
    content: {
      ChunkMagic: "CcnK",
      ByteSize: 88,
      FxMagic: "FxCk",
      Version: 1,
      FxID: "Pno1",
      FxVersion: 1,
      NumParameters: 10,
      ProgramName: "Acoustic Piano",
      Parameters: {
        "0": 0,
        "1": 0.125,
        "2": 0.25,
        "3": 0.375,
        "4": 0.5,
        "5": 0.625,
        "6": 0.75,
        "7": 0.875,
        "8": 1,
        "9": 1.125,
      },
    },
  });
});
