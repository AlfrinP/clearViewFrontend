export function formatBytes(bytes: number | null | undefined): string {
  if (bytes == null || Number.isNaN(bytes)) {
    return "—"
  }
  if (bytes === 0) {
    return "0 B"
  }
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB", "TB"]
  const i = Math.min(
    sizes.length - 1,
    Math.floor(Math.log(bytes) / Math.log(k))
  )
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(i === 0 ? 0 : 2))} ${sizes[i]}`
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) {
    return "—"
  }
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso))
  } catch {
    return iso
  }
}
