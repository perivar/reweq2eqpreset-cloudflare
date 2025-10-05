/**
 * Amplitude ratio to dB conversion
 *
 * For amplitude of waves like voltage, current and sound pressure level:
 * ```
 * GdB = 20 * log10(A2 / A1)
 * ```
 * Where:
 * - A2 is the amplitude level
 * - A1 is the referenced amplitude level
 * - GdB is the amplitude ratio or gain in dB
 *
 * @param value The amplitude ratio to convert (A2/A1)
 * @returns The gain in decibels (dB). Returns -Infinity for values <= 0
 */
export function amplitudeRatio2Decibel(value: number): number {
  if (value <= 0) return -Infinity; // Avoid log(0) or log(-ve)
  return 20 * Math.log10(value);
}

/**
 * dB to amplitude ratio conversion
 *
 * For amplitude of waves like voltage, current and sound pressure level:
 * ```
 * A2 = A1 * 10^(GdB / 20)
 * ```
 * Where:
 * - A2 is the amplitude level
 * - A1 is the referenced amplitude level
 * - GdB is the amplitude ratio or gain in dB
 *
 * @param value The decibel value to convert
 * @returns The amplitude ratio (A2/A1)
 */
export function decibel2AmplitudeRatio(value: number): number {
  return Math.pow(10, value / 20);
}
