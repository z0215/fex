/**
 * @example
 * const size = byteToSize(1024); // Outputs: "1KB"
 * console.log(size);
 *
 * const formattedSize = byteToSize(1536, (value, unit) => `${value.toFixed(2)} ${unit}`); // Outputs: "1.50 KB"
 * console.log(formattedSize);
 *
 * const anotherFormattedSize = byteToSize(1000, (value, unit) => `${value.toFixed(1)} ${unit}`); // Outputs: "1.0 KB"
 * console.log(anotherFormattedSize);
 */
export const byteToSize = (bytes: number, formatter?: (value: number, unit: string) => string) => {
  const base = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  if (bytes === 0) {
    const value = bytes
    const unit = sizes[bytes]
    return formatter?.(value, unit) ?? `${value.toFixed(0)}${unit}`
  }
  const index = Math.floor(Math.log(bytes) / Math.log(base))
  const value = bytes / base ** index
  const unit = sizes[index]
  return formatter?.(value, unit) ?? `${value.toFixed(0)}${unit}`
}
