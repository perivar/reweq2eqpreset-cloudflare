// app/routes/_index.tsx

import { FormEvent, useState } from "react";
import { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/react";
import i18next from "~/i18n/i18n.server";
import { REWEQ, REWEQFilters } from "~/utils/REWEQ";
import { toFabfilterProQ } from "~/utils/REWToFabfilter";
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

export default function Index() {
  const { t } = useTranslation();
  const { toast } = useToast();

  const [rewFilters, setREWFilters] = useState<REWEQFilters | null>();
  const [decimalSeparator, setDecimalSeparator] = useState(".");
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
            "Could not read file, check file and make sure you are using the correcrt decimal separator"
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

      const fabfilterPreset = toFabfilterProQ(rewFilters);
      const presetData = fabfilterPreset?.writeFFP();

      if (!presetData) throw new Error("Failed generating preset");

      const blob = new Blob([presetData], {
        type: "application/octet-stream",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "preset.fxp";
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
        <CardTitle>FXP Preset Generator</CardTitle>
        <CardDescription>
          Upload a REW EQ Preset file and convert to different types of EQ
          presets
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
                : "Drag and drop a file here, or click to select a file"}
            </p>
          </div>
          <aside>
            <h4 className="text-base">Files:</h4>
            <ul className="text-sm">{files}</ul>
          </aside>
          <div className="mt-4">
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
      </CardContent>
      <CardFooter className="flex flex-col items-stretch">
        <Button
          type="submit"
          onClick={generateFXP}
          className="w-full"
          disabled={!rewFilters}>
          Generate and Download FXP
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
