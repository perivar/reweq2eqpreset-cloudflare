// app/routes/_index.tsx

import { FormEvent, useState } from "react";
import { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/react";
import i18next from "~/i18n/i18n.server";
import { getDecimalSeparator } from "~/utils/Math";
import { Convert2ReaEQ } from "~/utils/ReaEQ";
import { REWEQ, REWEQFilters } from "~/utils/REWEQ";
import {
  toFabfilterProQ,
  toFabfilterProQ2,
  toFabfilterProQ3,
} from "~/utils/REWToFabfilter";
import { Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useToast } from "~/components/ui/use-toast";

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

type PresetType =
  | "ReaEQ"
  | "FabFilterProQ1"
  | "FabFilterProQ2"
  | "FabFilterProQ3"
  | "Generic";

export default function Index() {
  const { t } = useTranslation();
  const { toast } = useToast();

  const [rewFilters, setREWFilters] = useState<REWEQFilters | null>();
  const [decimalSeparator, setDecimalSeparator] = useState(
    getDecimalSeparator()
  );
  const [presetType, setPresetType] = useState<PresetType>("Generic");
  const [error, setError] = useState<string | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        setError(null);
        const content = e.target?.result as string;
        const filters = REWEQ.readREWEQFiltersFromString(
          content,
          decimalSeparator
        );
        setREWFilters(filters);
        if (!filters)
          setError(
            "Could not read file! Check file and make sure you are using the correct decimal separator"
          );
      };
      reader.readAsText(file);
    }
  };

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      onDrop,
      accept: {
        "text/plain": [".txt"],
      },
      multiple: false,
    });

  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  const handleDecimalSeparatorChange = (value: string) => {
    if (value.length <= 1) {
      setDecimalSeparator(value);
    }
  };

  const generateFXP = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (!rewFilters) throw new Error("No REW filter data found");

      let fileName: string | undefined = undefined;
      let presetData: Uint8Array | undefined = undefined;
      switch (presetType) {
        case "ReaEQ":
          const fxp = Convert2ReaEQ(rewFilters);
          presetData = fxp?.writeFile();
          fileName = "ReaEq.fxp";
          break;
        case "FabFilterProQ1":
          const fabfilterPresetQ1 = toFabfilterProQ(rewFilters);
          presetData = fabfilterPresetQ1?.writeFFP();
          fileName = "FabFilterProQ1.ffp";
          break;
        case "FabFilterProQ2":
          const fabfilterPresetQ2 = toFabfilterProQ2(rewFilters);
          presetData = fabfilterPresetQ2?.writeFFP();
          fileName = "FabFilterProQ2.ffp";
          break;
        case "FabFilterProQ3":
          const fabfilterPresetQ3 = toFabfilterProQ3(rewFilters);
          presetData = fabfilterPresetQ3?.writeFFP();
          fileName = "FabFilterProQ3.ffp";
          break;
        default: // Generic
          const filtersAsString = rewFilters.toString();
          const encoder = new TextEncoder();
          presetData = encoder.encode(filtersAsString);
          fileName = "Generic.txt";
      }

      if (!presetData) throw new Error("Failed generating preset");

      const blob = new Blob([presetData], {
        type: "application/octet-stream",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(
        "An error occurred while generating the FXP file. Please try again."
      );
      console.error(err);
    }
  };

  return (
    <Card className="mx-auto mt-6 w-full max-w-md">
      <CardHeader>
        <CardTitle>REW 2 Preset Generator</CardTitle>
        <CardDescription>
          Upload a REW EQ Preset file and convert to different types of EQ
          presets
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="mb-4 space-y-4">
          <div>
            <Label htmlFor="preset-type">Preset Type to generate</Label>
            <Select
              onValueChange={(value: PresetType) => setPresetType(value)}
              defaultValue={presetType}>
              <SelectTrigger id="preset-type">
                <SelectValue placeholder="Select preset type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Generic">Generic Text File</SelectItem>
                <SelectItem value="ReaEQ">ReaEQ</SelectItem>
                <SelectItem value="FabFilterProQ1">FabFilterProQ1</SelectItem>
                <SelectItem value="FabFilterProQ2">FabFilterProQ2</SelectItem>
                <SelectItem value="FabFilterProQ3">FabFilterProQ3</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="decimal-separator">Decimal Separator</Label>
            <Input
              id="decimal-separator"
              value={decimalSeparator}
              onChange={e => handleDecimalSeparatorChange(e.target.value)}
              className="w-16"
              maxLength={1}
            />
          </div>
        </div>
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
                : "Drag and drop a file here, or click to select a file"}
            </p>
          </div>
          <aside>
            <h4 className="text-base">Files:</h4>
            <ul className="text-sm">{files}</ul>
          </aside>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch">
        <Button
          type="submit"
          onClick={generateFXP}
          className="w-full"
          disabled={!rewFilters}>
          Generate and Download Preset
        </Button>
        {error && (
          <p className="mt-2 text-center text-red-500" role="alert">
            {error}
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
