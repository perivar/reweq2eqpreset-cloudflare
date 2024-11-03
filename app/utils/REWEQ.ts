import {
  getDecimalSeparator,
  parseFloatWithSeparator,
  roundToNumber,
} from "./Math";

enum REWEQFilterType {
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

class REWEQBand {
  FilterType: REWEQFilterType;
  Enabled: boolean;
  FilterFreq: number; // Hz
  FilterGain: number; // dB
  FilterQ: number; // Q value
  FilterBWOct: number; // Bandwidth per Octave

  constructor() {
    this.FilterType = REWEQFilterType.PK;
    this.Enabled = false;
    this.FilterFreq = 0;
    this.FilterGain = 0;
    this.FilterQ = 0;
    this.FilterBWOct = 0;
  }

  toString(): string {
    return `${this.FilterType}: ${this.FilterFreq.toFixed(2)} Hz ${this.FilterGain.toFixed(2)} dB Q: ${this.FilterQ.toFixed(4)} BWOct: ${this.FilterBWOct.toFixed(4)}`;
  }
}

class REWEQFilters {
  EqBands: REWEQBand[];

  constructor() {
    this.EqBands = [];
  }

  get Count(): number {
    return this.EqBands.length;
  }

  *[Symbol.iterator]() {
    yield* this.EqBands;
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

    let filterCount = 0;
    let regexpPattern = /^Filter\s+\d+/;
    let usingBWOct = false;

    const lines = fileContent.split(/\r?\n/);

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
        const sanitizedLine = line.replace(/\u00A0/g, ""); // Remove non-breaking spaces

        if (/^Filter\s+\d+:\s+ON\s+None/.test(sanitizedLine)) continue; // Skip if filter type is "None"

        const match = sanitizedLine.match(regexpPattern);
        if (match) {
          filterCount++;
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
}
