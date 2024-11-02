import { cn } from "../utils";

// set this to true to debug the outputs as objects
const DO_DEBUG_OBJECT = false;

test("cn", () => {
  const className = "w-full";
  const actual = cn(
    "rounded-lg border bg-card text-card-foreground shadow-sm",
    className
  );
  if (DO_DEBUG_OBJECT) console.log(JSON.stringify(actual, null, 2));
  expect(actual).toStrictEqual(
    "rounded-lg border bg-card text-card-foreground shadow-sm w-full"
  );
});
