import fs from "node:fs"
import path from "node:path"

/**
 * A photo the site expects. `file` is the path under /public where Adrian drops
 * the image; until that file exists, the slot renders as a highlighted
 * "Add photo" placeholder that names the path.
 */
export type PhotoSpec = {
  file: string
  alt: string
  label: string
  // "contain" shows the whole image (posters, graphics with text) instead of cropping it.
  fit?: "contain"
}

export type Photo = PhotoSpec & { ready: boolean }

// Runs on the server at build or revalidate time only.
export function resolvePhoto(spec: PhotoSpec): Photo {
  const onDisk = path.join(process.cwd(), "public", spec.file)
  return { ...spec, ready: fs.existsSync(onDisk) }
}
