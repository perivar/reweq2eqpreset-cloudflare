import { REWEQFilters, REWEQFilterType } from "~/utils/REWEQ";
import { CheckCircle2, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

interface EqualizerBandTableProps {
  filters: REWEQFilters;
  hoveredFrequency: number | null;
}

export function EqualizerBandTable({
  filters,
  hoveredFrequency,
}: EqualizerBandTableProps) {
  const { t } = useTranslation();

  return (
    <div className="mt-4 w-full overflow-x-auto">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>{t("fileInfo.type")}</TableHead>
            <TableHead>{t("fileInfo.frequency")}</TableHead>
            <TableHead>{t("fileInfo.gain")}</TableHead>
            <TableHead>{t("fileInfo.q")}</TableHead>
            <TableHead>{t("fileInfo.bandWidth")} (Hz)</TableHead>
            <TableHead>{t("fileInfo.bandWidth")} (Oct)</TableHead>
            <TableHead className="w-[100px] text-center">
              {t("fileInfo.enabled")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filters.EqBands.map((band, index) => (
            <TableRow
              key={index}
              className={
                hoveredFrequency &&
                Math.abs(hoveredFrequency - band.FilterFreq) < 1
                  ? "bg-primary/20 ring-1 ring-inset ring-primary"
                  : undefined
              }>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{REWEQFilterType[band.FilterType]}</TableCell>
              <TableCell>{band.FilterFreq.toFixed(1)} Hz</TableCell>
              <TableCell>{band.FilterGain.toFixed(2)} dB</TableCell>
              <TableCell>{band.FilterQ.toFixed(2)}</TableCell>
              <TableCell>{band.FilterBWHz.toFixed(2)}</TableCell>
              <TableCell>{band.FilterBWOct.toFixed(2)}</TableCell>
              <TableCell className="text-center">
                {band.Enabled ? (
                  <CheckCircle2 className="mx-auto size-4 text-green-500" />
                ) : (
                  <XCircle className="mx-auto size-4 text-red-500" />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
