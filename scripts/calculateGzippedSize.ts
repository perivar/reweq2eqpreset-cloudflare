import fs from "fs";
import path from "path";
import zlib from "zlib";

/**
 * Recursively calculates the total size and gzipped size of all files in a directory.
 * @param dirPath - The path to the directory to calculate.
 * @returns An object containing totalSize and gzippedSize in bytes.
 */
function calculateSizes(dirPath: string): {
  totalSize: number;
  gzippedSize: number;
} {
  let totalSize = 0;
  let gzippedSize = 0;

  // Read all entries (files and directories) in the directory
  const files = fs.readdirSync(dirPath, { withFileTypes: true });

  files.forEach(file => {
    const fullPath = path.join(dirPath, file.name);

    if (file.isDirectory()) {
      // Recursively calculate sizes for subdirectories
      const subdirSizes = calculateSizes(fullPath);
      totalSize += subdirSizes.totalSize;
      gzippedSize += subdirSizes.gzippedSize;
    } else {
      // Read file content
      const content = fs.readFileSync(fullPath);
      totalSize += content.length;

      // Calculate gzipped size
      const gzipped = zlib.gzipSync(content);
      gzippedSize += gzipped.length;
    }
  });

  return { totalSize, gzippedSize };
}

// Get directory from command-line arguments
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Please provide a directory path as an argument.");
  process.exit(1);
}

const dirPath = path.resolve(args[0]);

// Check if the provided path exists and is a directory
if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
  console.error("The provided path is not a valid directory:", dirPath);
  process.exit(1);
}

try {
  const { totalSize, gzippedSize } = calculateSizes(dirPath);

  // Convert sizes to KiB and format the output
  const totalSizeKiB = (totalSize / 1024).toFixed(2);
  const gzippedSizeKiB = (gzippedSize / 1024).toFixed(2);

  console.log(
    `Total Upload: ${totalSizeKiB} KiB / gzip: ${gzippedSizeKiB} KiB`
  );
} catch (error) {
  console.error("Error calculating sizes:", error);
}
