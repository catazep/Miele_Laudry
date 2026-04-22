export function formatDate(d: Date, format: string): string {
  return format
    .replace('dd', String(d.getDate()).padStart(2, '0'))
    .replace('MM', String(d.getMonth() + 1).padStart(2, '0'))
    .replace('yyyy', String(d.getFullYear()));
}

export function formatTime(d: Date): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
