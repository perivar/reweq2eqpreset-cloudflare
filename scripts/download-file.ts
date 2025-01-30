import * as fs from "fs";
import * as https from "https";
import * as path from "path";

// Get URL and output path from command-line arguments
const urlArg: string | undefined = process.argv[2];
const outputPathArg: string | undefined = process.argv[3];

// Validate the URL
if (!urlArg) {
  console.error("URL is required. Please pass the URL as the first argument.");
  process.exit(1);
}

// Extract filename from the URL if no output path is provided
const defaultFileName: string = path.basename(urlArg);
const outputFile: string = outputPathArg
  ? path.resolve(outputPathArg)
  : path.resolve(__dirname, `../public/assets/${defaultFileName}`);

/**
 * Downloads a file from the given URL and saves it to the specified output path
 *
 * @param url - The URL of the file to download
 * @param outputPath - The local file path where the file will be saved
 */
function downloadFile(url: string, outputPath: string): void {
  const file = fs.createWriteStream(outputPath);

  https
    .get(url, response => {
      if (response.statusCode !== 200) {
        console.error(`Failed to get '${url}' (${response.statusCode})`);
        return;
      }

      // Pipe the response stream to the file
      response.pipe(file);

      file.on("finish", () => {
        file.close();
        console.log(`File downloaded and saved to ${outputPath}`);
      });
    })
    .on("error", (err: Error) => {
      fs.unlink(outputPath, () => {}); // Delete the file if there's an error
      console.error(`Error downloading the file: ${err.message}`);
    });
}

// Start the download
downloadFile(urlArg, outputFile);
