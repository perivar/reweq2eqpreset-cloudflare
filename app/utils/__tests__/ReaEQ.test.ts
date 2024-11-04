import * as fs from "fs";
import * as path from "path";

import { Convert2ReaEQ } from "../ReaEQ";
import { REWEQ } from "../REWEQ";

// set this to true to debug the outputs as objects
const DO_DEBUG_OBJECT = false;

test("Convert2ReaEQ", () => {
  const filePath = path.join(
    __dirname,
    "data/genelec eq filters 6 Generic max boost.txt"
  );
  const fileContent = fs.readFileSync(filePath, "utf8");
  const filters = REWEQ.readREWEQFiltersFromString(fileContent, ",");
  const fxp = filters && Convert2ReaEQ(filters);
  const uint8Array = fxp?.writeFile();

  // if (DO_DEBUG_OBJECT) console.log(JSON.stringify(actual, null, 2));

  if (uint8Array) {
    // const filePathWrite = path.join(
    //   __dirname,
    //   "data/genelec eq filters 6 Generic max boost_tmp.fxp"
    // );
    // fs.writeFileSync(filePathWrite, uint8Array);

    expect(uint8Array.length > 0).toBe(true);
  }
});
