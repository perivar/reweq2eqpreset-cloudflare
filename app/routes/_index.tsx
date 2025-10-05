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
import { ChevronDown, ChevronUp, Upload } from "lucide-react";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { EqualizerBandTable } from "~/components/EqualizerBandTable";

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
  const [rewFilters, setREWFilters] = useState<REWEQFilters | null>();
  const [rewFilterInfo, setRewFilterInfo] = useState<{
    totalBands: number;
    enabledBands: number;
  } | null>(null);
  const [decimalSeparator, setDecimalSeparator] = useState(
    getDecimalSeparator()
  );
  const [presetType, setPresetType] = useState<PresetType>("Generic");
  const [error, setError] = useState<string | null>(null);
  const [hoveredFrequency, setHoveredFrequency] = useState<number | null>(null);
  const [isBandDetailsOpen, setIsBandDetailsOpen] = useState(true); // State for band details collapsible

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

        if (filters) {
          const totalBands = filters.EqBands.length;
          const enabledBands = filters.EqBands.filter(
            band => band.Enabled
          ).length;
          setRewFilterInfo({ totalBands, enabledBands });
        } else {
          setRewFilterInfo(null);
          setError(t("errors.fileReadError"));
        }
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

      const blob = new Blob([presetData as BlobPart], {
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
      setError(t("errors.generationError"));
      console.error(err);
    }
  };

  return (
    <Card className="mx-auto mt-6 w-full max-w-6xl">
      <CardHeader>
        <CardTitle>{t("card.title")}</CardTitle>
        <CardDescription>{t("card.description")}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="mb-4 space-y-4">
          <div>
            <Label htmlFor="preset-type">{t("labels.presetType")}</Label>
            <Select
              onValueChange={(value: PresetType) => setPresetType(value)}
              defaultValue={presetType}>
              <SelectTrigger id="preset-type">
                <SelectValue placeholder={t("labels.selectPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Generic">
                  {t("presetTypes.generic")}
                </SelectItem>
                <SelectItem value="ReaEQ">{t("presetTypes.reaEQ")}</SelectItem>
                <SelectItem value="FabFilterProQ1">
                  {t("presetTypes.fabFilterProQ1")}
                </SelectItem>
                <SelectItem value="FabFilterProQ2">
                  {t("presetTypes.fabFilterProQ2")}
                </SelectItem>
                <SelectItem value="FabFilterProQ3">
                  {t("presetTypes.fabFilterProQ3")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="decimal-separator">
              {t("labels.decimalSeparator")}
            </Label>
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
                ? t("dropzone.dropHere")
                : t("dropzone.dragOrClick")}
            </p>
          </div>
          <aside>
            <h4 className="text-base">{t("files")}</h4>
            <ul className="text-sm">{files}</ul>
          </aside>
          {rewFilterInfo && (
            <div className="mt-4 rounded-lg border border-accent-foreground bg-accent p-3">
              <h4 className="text-base font-medium text-accent-foreground">
                {t("filterInfo.title")}
              </h4>
              <p className="text-sm text-primary">
                {t("filterInfo.totalBands")} {rewFilterInfo.totalBands}
                {" | "}
                {t("filterInfo.enabledBands")} {rewFilterInfo.enabledBands}
              </p>
            </div>
          )}
          {rewFilters && (
            <div className="mt-4 overflow-x-auto">
              <Collapsible
                open={isBandDetailsOpen}
                onOpenChange={setIsBandDetailsOpen}>
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between">
                    <h4
                      className={`text-sm font-semibold ${isBandDetailsOpen ? "font-bold" : ""}`}>
                      {t("fileInfo.bandDetails")}:
                    </h4>
                    <Button variant="outline" size="sm" className="w-9 p-0">
                      {isBandDetailsOpen ? (
                        <ChevronUp className="size-4" />
                      ) : (
                        <ChevronDown className="size-4" />
                      )}
                      <span className="sr-only">Toggle</span>
                    </Button>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <EqualizerBandTable
                    filters={rewFilters}
                    hoveredFrequency={hoveredFrequency}
                  />
                </CollapsibleContent>
              </Collapsible>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch">
        <Button
          type="submit"
          onClick={generateFXP}
          className="w-full"
          disabled={!rewFilters}>
          {t("button.generateDownload")}
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
