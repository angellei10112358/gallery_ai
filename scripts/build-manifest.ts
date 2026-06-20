import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs'
import { join, extname, parse } from 'path'
import sharp from 'sharp'
import { glob } from 'glob'

interface ImageMeta {
  title?: string
  description?: string
  tags?: string[]
  prompt?: string
  model?: string
  date?: string
}

interface ManifestEntry {
  id: string
  filename: string
  title: string
  description: string
  tags: string[]
  prompt: string
  model: string
  date: string
  width: number
  height: number
  aspectRatio: number
  fileSize: number
  modifiedTime: string
  formats: {
    webp: string[]
    avif: string[]
    original: string[]
  }
  lqip: string
}

interface GalleryConfig {
  siteTitle: string
  author: string
  bio: string
  githubUrl: string
  defaultTheme: string
  layout: string
  watermark: { enabled: boolean; text: string }
  disableRightClick: boolean
  sortDefault: string
}

const IMAGES_DIR = join(import.meta.dirname, '..', 'src', 'images')
const PUBLIC_IMAGES_DIR = join(import.meta.dirname, '..', 'public', 'images')
const CONFIG_PATH = join(import.meta.dirname, '..', 'gallery.config.json')

const SIZES = [
  { name: 'thumb', width: 400 },
  { name: 'medium', width: 800 },
  { name: 'large', width: 1600 },
]

function beautifyFilename(name: string): string {
  return name
    .replace(extname(name), '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function loadSidecar(path: string): ImageMeta | null {
  try {
    const data = readFileSync(path, 'utf-8')
    return JSON.parse(data)
  } catch {
    return null
  }
}

function fileHash(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

async function generateLQIP(buffer: Buffer): Promise<string> {
  const tiny = await sharp(buffer).resize(20).webp({ quality: 20 }).toBuffer()
  return `data:image/webp;base64,${tiny.toString('base64')}`
}

async function processImage(filePath: string): Promise<ManifestEntry> {
  const parsed = parse(filePath)
  const ext = extname(filePath).toLowerCase()
  const hash = fileHash()

  const metadata = await sharp(filePath).metadata()
  const width = metadata.width!
  const height = metadata.height!
  const aspectRatio = width / height
  const stat = existsSync(filePath) ? await import('fs').then((fs) => fs.promises.stat(filePath)) : null

  const sidecarPath = join(parsed.dir, `${parsed.name}.json`)
  const sidecar = loadSidecar(sidecarPath)

  const originalBuffer = await sharp(filePath).toBuffer()
  const lqip = await generateLQIP(originalBuffer)

  const formats: ManifestEntry['formats'] = { webp: [], avif: [], original: [] }

  for (const size of SIZES) {
    const webpPath = join(PUBLIC_IMAGES_DIR, `${parsed.name}_${size.name}_${hash}.webp`)
    const avifPath = join(PUBLIC_IMAGES_DIR, `${parsed.name}_${size.name}_${hash}.avif`)
    const originalResizedPath = join(PUBLIC_IMAGES_DIR, `${parsed.name}_${size.name}_${hash}${ext}`)

    const resized = sharp(filePath).resize(size.width, undefined, { fit: 'inside', withoutEnlargement: true })

    await resized.clone().webp({ quality: 80 }).toFile(webpPath)
    await resized.clone().avif({ quality: 70 }).toFile(avifPath)
    await resized.clone().toFile(originalResizedPath)

    formats.webp.push(`images/${parsed.name}_${size.name}_${hash}.webp`)
    formats.avif.push(`images/${parsed.name}_${size.name}_${hash}.avif`)
    formats.original.push(`images/${parsed.name}_${size.name}_${hash}${ext}`)
  }

  return {
    id: `${parsed.name}-${hash}`,
    filename: parsed.base,
    title: sidecar?.title ?? beautifyFilename(parsed.name),
    description: sidecar?.description ?? '',
    tags: sidecar?.tags ?? [],
    prompt: sidecar?.prompt ?? '',
    model: sidecar?.model ?? '',
    date: sidecar?.date ?? (stat ? stat.mtime.toISOString().split('T')[0] : ''),
    width,
    height,
    aspectRatio,
    fileSize: stat?.size ?? 0,
    modifiedTime: stat?.mtime.toISOString() ?? '',
    formats,
    lqip,
  }
}

async function main() {
  if (!existsSync(PUBLIC_IMAGES_DIR)) {
    mkdirSync(PUBLIC_IMAGES_DIR, { recursive: true })
  }

  const config: GalleryConfig = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'))

  const imageFiles = await glob('**/*.{png,jpg,jpeg}', { cwd: IMAGES_DIR, nodir: true })

  if (imageFiles.length === 0) {
    console.log('No images found in src/images/')
    writeFileSync(
      join(import.meta.dirname, '..', 'public', 'manifest.json'),
      JSON.stringify({ images: [], config, generatedAt: new Date().toISOString() }, null, 2),
    )
    return
  }

  const entries: ManifestEntry[] = []

  for (const relPath of imageFiles) {
    const absPath = join(IMAGES_DIR, relPath)
    const entry = await processImage(absPath)
    entries.push(entry)
    console.log(`Processed: ${relPath}`)
  }

  entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  writeFileSync(
    join(import.meta.dirname, '..', 'public', 'manifest.json'),
    JSON.stringify({ images: entries, config, generatedAt: new Date().toISOString() }, null, 2),
  )

  console.log(`Manifest generated: ${entries.length} images`)
}

main().catch(console.error)
