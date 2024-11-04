export function toPlainObject(obj: unknown): unknown {
  return JSON.parse(JSON.stringify(obj));
}

export function areTypedArraysEqual<T extends TypedArray>(
  arr1: T,
  arr2: T
): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}
