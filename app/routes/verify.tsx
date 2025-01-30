import { useState } from "react";
import { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/react";
import i18next from "~/i18n/i18n.server";
import { FabfilterProQ } from "~/utils/FabfilterProQ";
import { FabfilterProQ2 } from "~/utils/FabfilterProQ2";
import { FabfilterProQ3 } from "~/utils/FabfilterProQ3";
import { ReaEQ, ReaEQBand } from "~/utils/ReaEQ";
import { Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export async function loader({ request }: LoaderFunctionArgs) {
  const t = await i18next.getFixedT(request);
  return json({ title: t("title"), description: t("description") });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.title },
    { name: "description", content: data?.description },
  ];
};

export default function Verify() {
  const [filterData, setFilterData] = useState<string | null>();
  const [detectedPreset, setDetectedPreset] = useState<string | null>();
  const [error, setError] = useState<string | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        setError(null);
        try {
          const content = e.target?.result as ArrayBuffer;
          const data = new Uint8Array(content);

          // Check file extension
          const isFFP = file.name.toLowerCase().endsWith(".ffp");
          const isFXP = file.name.toLowerCase().endsWith(".fxp");

          if (!isFFP && !isFXP) {
            throw new Error(
              "Unsupported file format. Please upload a .ffp or .fxp file."
            );
          }

          if (isFFP) {
            const decoder = new TextDecoder();
            const header = decoder.decode(data.slice(0, 4));

            let filters;
            let presetType;
            switch (header) {
              case "FPQr":
                filters = new FabfilterProQ();
                presetType = "FabFilter Pro-Q";
                break;
              case "FQ2p":
                filters = new FabfilterProQ2();
                presetType = "FabFilter Pro-Q 2";
                break;
              case "FQ3p":
                filters = new FabfilterProQ3();
                presetType = "FabFilter Pro-Q 3";
                break;
              default:
                throw new Error(`Unknown FFP file format: ${header}`);
            }

            if (filters.ReadFFP(data)) {
              setFilterData(
                filters.Bands.map(
                  (band, index) => `Band ${index + 1}: ${band.toString()}`
                ).join("\n")
              );
              setDetectedPreset(presetType);
            } else {
              throw new Error("Failed to read FFP file");
            }
          } else {
            // Handle ReaEQ FXP file
            const reaEQ = new ReaEQ();
            if (reaEQ.ReadFXP(data)) {
              setFilterData(
                reaEQ.Bands.map(
                  (band: ReaEQBand, index: number) =>
                    `Band ${index + 1}: ${band.toString()}`
                ).join("\n")
              );
              setDetectedPreset("ReaEQ");
            } else {
              throw new Error("Failed to read ReaEQ FXP file");
            }
          }
        } catch (err) {
          setError(
            `Error reading file: ${err instanceof Error ? err.message : "Unknown error"}`
          );
          console.error(err);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      onDrop,
      accept: {
        "application/octet-stream": [".ffp", ".fxp"],
      },
      multiple: false,
    });

  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <Card className="mx-auto mt-6 w-full p-2">
      <CardHeader>
        <CardTitle>EQ Preset Verifier</CardTitle>
        <CardDescription>
          Upload a FabFilter FFP or ReaEQ FXP preset file to verify and view its
          contents
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div>
          <div
            {...getRootProps()}
            className={`mb-4 cursor-pointer rounded-lg border-2 border-dashed p-4 text-center ${
              isDragActive ? "border-primary bg-primary/10" : "border-gray-300"
            }`}>
            <input {...getInputProps()} />
            <Upload className="mx-auto size-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">
              {isDragActive
                ? "Drop the file here"
                : "Drag and drop a .ffp or .fxp file here, or click to select a file"}
            </p>
          </div>
          <aside>
            <h4 className="text-base">Files:</h4>
            <ul className="text-sm">{files}</ul>
          </aside>
          {detectedPreset && filterData && (
            <div className="mt-4">
              <h4 className="text-base">Detected Preset Type:</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                {detectedPreset}
              </p>
              <h4 className="mt-4 text-base">Filter Data:</h4>
              <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words rounded bg-secondary p-4 text-sm">
                {filterData}
              </pre>
            </div>
          )}
        </div>
      </CardContent>
      {error && (
        <CardFooter>
          <p className="text-center text-red-500" role="alert">
            {error}
          </p>
        </CardFooter>
      )}
    </Card>
  );
}
