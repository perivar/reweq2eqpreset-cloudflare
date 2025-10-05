import {
  getDecimalSeparator,
  parseFloatWithSeparator,
  roundToNumber,
} from "./Math";

export enum REWEQFilterType {
  PK = 0, // PK for a peaking (parametric) filter
  LP = 1, // LP for a 12dB/octave Low Pass filter (Q=0.7071)
  HP = 2, // HP for a 12dB/octave High Pass filter (Q=0.7071)
  LS = 3, // LS for a Low Shelf filter
  HS = 4, // HS for a High Shelf filter
  NO = 5, // NO for a notch filter
  MO = 6, // Modal for a Modal filter
  LS6dB = 7, // LS 6dB for a 6dB/octave Low Shelf filter
  HS6dB = 8, // HS 6dB for a 6dB/octave High Shelf filter
  LS12dB = 9, // LS 12dB for a 12dB/octave Low Shelf filter
  HS12dB = 10, // HS 12dB for a 12dB/octave High Shelf filter
  LPQ = 11, // LPQ, a 12dB/octave Low Pass filter with adjustable Q
  HPQ = 12, // HPQ, a 12dB/octave High Pass filter with adjustable Q
}

export class REWEQBand {
  FilterType: REWEQFilterType;
  Enabled: boolean;
  FilterFreq: number; // Hz
  FilterGain: number; // dB
  FilterQ: number; // Q value
  FilterBWOct: number; // Bandwidth per Octave
  FilterBWHz: number; // Bandwidth in Hz

  constructor() {
    this.FilterType = REWEQFilterType.PK;
    this.Enabled = false;
    this.FilterFreq = 0;
    this.FilterGain = 0;
    this.FilterQ = 0;
    this.FilterBWOct = 0;
    this.FilterBWHz = 0;
  }

  getFilterTypeName(): string {
    return REWEQFilterType[this.FilterType]; // Converts the enum value to its name
  }

  toString(): string {
    return `${this.getFilterTypeName()}: ${this.FilterFreq.toFixed(2)} Hz ${this.FilterGain.toFixed(2)} dB Q: ${this.FilterQ.toFixed(4)} BWOct: ${this.FilterBWOct.toFixed(4)} BWHz: ${this.FilterBWHz.toFixed(2)}`;
  }
}

export class REWEQFilters {
  EqBands: REWEQBand[];

  constructor() {
    this.EqBands = [];
  }

  toString(): string {
    const outputLines: string[] = [];
    for (const band of this.EqBands) {
      outputLines.push(band.toString());
    }
    return outputLines.join("\n");
  }
}

export class REWEQ {
  /**
   * Parse REW filters from a string
   * @param fileContent - content of the filter data
   * @returns a REW EQ filter object
   */
  static readREWEQFiltersFromString(
    fileContent: string,
    decimalSeparator?: string
  ): REWEQFilters | null {
    const filters = new REWEQFilters();

    if (!decimalSeparator) {
      decimalSeparator = getDecimalSeparator();
    }

    const lines = fileContent.split(/\r?\n/);

    let headerLineOffset = 0;
    if (lines[0].trim() === "Notes:") {
      headerLineOffset = 1;
    }
    // Check if this is the new format by verifying key column names
    const isNewFormat =
      lines[headerLineOffset].trim() === "Generic" &&
      lines.length > headerLineOffset + 1 &&
      lines[headerLineOffset + 1].includes("Number") &&
      lines[headerLineOffset + 1].includes("Enabled") &&
      lines[headerLineOffset + 1].includes("Type") &&
      lines[headerLineOffset + 1].includes("Frequency");

    if (isNewFormat) {
      // Get the header line
      const headerLine = lines[headerLineOffset + 1];
      // Determine delimiter: if header contains commas, use comma with optional spaces, else use whitespace
      const delimiter = headerLine.includes(",") ? /,\s*/ : /\s+/;
      // Split header with delimiter, trim each part, and filter out empty strings
      const headers = headerLine
        .split(delimiter)
        .map(h => h.trim())
        .filter(h => h !== "");
      const bandwidthColumnIndex = headers.findIndex(
        h => h === "Bandwidth(Hz)"
      );

      // Skip header lines
      for (let i = headerLineOffset + 2; i < lines.length; i++) {
        const line = lines[i].trim();

        // Stop when we hit the compound filters section or empty line
        if (line === "Compound_filters" || line === "") break;

        // Skip empty lines or lines with "None" filter type
        if (line.includes("None")) continue;

        // Parse values with the same delimiter, trim, and filter empty
        const parts = line
          .split(delimiter)
          .map(p => p.trim())
          .filter(p => p !== "");
        if (parts.length >= 8) {
          // We need at least 8 parts for a valid filter

          const band = new REWEQBand();
          band.Enabled = parts[1].toLowerCase() === "true";
          band.FilterType =
            parts[3] === "PK" ? REWEQFilterType.PK : REWEQFilterType.NO;
          band.FilterFreq = parseFloatWithSeparator(parts[4], decimalSeparator);
          band.FilterGain = parseFloatWithSeparator(parts[5], decimalSeparator);
          band.FilterQ = parseFloatWithSeparator(parts[6], decimalSeparator);

          band.FilterBWOct = roundToNumber(REWEQ.Q2BWOct(band.FilterQ), 4);

          // Calculate bandwidth in Hz
          band.FilterBWHz = roundToNumber(
            REWEQ.Q2BWHz(band.FilterFreq, band.FilterQ),
            4
          );

          // Verify against file's bandwidth value if available
          if (
            bandwidthColumnIndex !== -1 &&
            bandwidthColumnIndex < parts.length &&
            parts[bandwidthColumnIndex]
          ) {
            const fileBandwidth = parseFloatWithSeparator(
              parts[bandwidthColumnIndex],
              decimalSeparator
            );

            // Check if calculated bandwidth matches file's bandwidth within a small margin of error
            const marginOfError = 0.01; // 1% error margin
            const difference =
              Math.abs(fileBandwidth - band.FilterBWHz) / fileBandwidth;
            if (difference > marginOfError) {
              console.warn(
                `Bandwidth mismatch for filter at ${band.FilterFreq}Hz: ` +
                  `calculated ${band.FilterBWHz.toFixed(2)}Hz vs ` +
                  `file ${fileBandwidth.toFixed(2)}Hz`
              );
            }
          }

          filters.EqBands.push(band);
        }
      }
      return filters;
    }

    // Old format parsing logic
    let regexpPattern = /^Filter\s+\d+/;
    let usingBWOct = false;

    for (const line of lines) {
      if (line.startsWith("Equaliser:")) {
        // find out what filter parse rule to use
        if (line === "Equaliser: FBQ2496") {
          // Filter  1: ON  PEQ      Fc    64,0 Hz  Gain  -5,0 dB  BW Oct 0,167
          regexpPattern = new RegExp(
            `^Filter\\s+\\d+:\\s(\\w+)\\s+(\\w+)\\s+Fc ([\\D\\d${decimalSeparator}]+) Hz  Gain ([\\s\\d${decimalSeparator}\\-]+) dB  BW Oct ([\\s\\d${decimalSeparator}]+)$`
          );
          usingBWOct = true;
        } else if (line === "Equaliser: Generic") {
          // Filter  1: ON  PK       Fc    63,8 Hz  Gain  -5,0 dB  Q  8,06
          regexpPattern = new RegExp(
            `^Filter\\s+\\d+:\\s(\\w+)\\s+(\\w+)\\s+Fc ([\\D\\d${decimalSeparator}]+) Hz  Gain ([\\s\\d${decimalSeparator}\\-]+) dB  Q ([\\s\\d${decimalSeparator}]+)$`
          );
          usingBWOct = false;
        } else {
          console.error("No known equaliser format!", line);
          return null;
        }
      }

      if (line.match(/^Filter\s+\d+:/)) {
        const sanitizedLine = line.replace(String.fromCharCode(160), " "); // Replace non-breaking spaces with regular spaces

        if (/^Filter\s+\d+:\s+ON\s+None/.test(sanitizedLine)) continue; // Skip if filter type is "None"

        const match = sanitizedLine.match(regexpPattern);
        if (match) {
          const enabled = match[1].trim() === "ON";
          const type = match[2].trim();
          const freq = match[3].trim();
          const gain = match[4].trim();
          const q = match[5].trim();

          const band = new REWEQBand();
          band.Enabled = enabled;
          band.FilterType =
            type === "PEQ" || type === "PK"
              ? REWEQFilterType.PK
              : REWEQFilterType.NO;
          band.FilterFreq = parseFloatWithSeparator(freq, decimalSeparator);
          band.FilterGain = parseFloatWithSeparator(gain, decimalSeparator);

          if (usingBWOct) {
            band.FilterBWOct = parseFloatWithSeparator(q, decimalSeparator);
            band.FilterQ = roundToNumber(REWEQ.BWOct2Q(band.FilterBWOct), 4);
          } else {
            band.FilterQ = parseFloatWithSeparator(q, decimalSeparator);
            band.FilterBWOct = roundToNumber(REWEQ.Q2BWOct(band.FilterQ), 4);
          }

          band.FilterBWHz = roundToNumber(
            REWEQ.Q2BWHz(band.FilterFreq, band.FilterQ),
            4
          );

          filters.EqBands.push(band);
        } else {
          console.error("Could not parse line:", line);
          return null;
        }
      }
    }

    return filters;
  }

  /**
   * Converts a Q factor to bandwidth per octave.
   *
   * @param Qin - The Q factor to convert.
   * @returns The bandwidth per octave corresponding to the given Q factor.
   */
  static Q2BWOct(Qin: number): number {
    // Calculate the bandwidth per octave using the formula
    const Q2bw1st = (2 * Qin * Qin + 1) / (2 * Qin * Qin);
    const Q2bw2nd = Math.pow(2 * Q2bw1st, 2) / 4;
    const Q2bw3rd = Math.sqrt(Q2bw2nd - 1);
    const Q2bw4th = Q2bw1st + Q2bw3rd;
    return Math.log(Q2bw4th) / Math.log(2); // Convert to logarithmic scale (base 2)
  }

  /**
   * Converts bandwidth per octave to a Q factor.
   *
   * @param bwOct - The bandwidth per octave to convert.
   * @returns The Q factor corresponding to the given bandwidth per octave.
   */
  static BWOct2Q(bwOct: number): number {
    // Calculate the Q factor using the formula
    return Math.sqrt(Math.pow(2, bwOct)) / (Math.pow(2, bwOct) - 1);
  }

  /**
   * Calculate bandwidth in Hz from center frequency and Q factor
   * BW = Fc / Q where:
   * - Fc is the center frequency in Hz
   * - Q is the quality factor
   *
   * @param freq - Center frequency in Hz
   * @param q - Q factor
   * @returns Bandwidth in Hz
   */
  static Q2BWHz(freq: number, q: number): number {
    return freq / q;
  }
}
