import { parseFloatWithSeparator, roundToNumber } from "../Math";

// set this to true to debug the outputs as objects
const DO_DEBUG_OBJECT = false;

test("roundToNumber", () => {
  const actual = roundToNumber(3.14159265359, 4);

  if (DO_DEBUG_OBJECT) console.log(actual);
  expect(actual).toStrictEqual(3.1416);
});

test("parseFloatWithSeparator", () => {
  const actual = parseFloatWithSeparator(" as  a4.61g !# ", ".");

  if (DO_DEBUG_OBJECT) console.log(actual);
  expect(actual).toStrictEqual(4.61);
});
