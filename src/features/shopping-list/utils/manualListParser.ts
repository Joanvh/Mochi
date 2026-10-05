export function parseManualListInput(value: string): string[] {
  return value
    .split(/[\n,]+/)
    .map((term) => term.trim())
    .filter(Boolean)
}
