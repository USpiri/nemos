import {
  BaseDirectory,
  DirEntry,
  readDir as readDirectory,
  readTextFile,
} from '@tauri-apps/plugin-fs'

export const read = async (path: string) => {
  return readTextFile(path, {
    baseDir: BaseDirectory.Document,
  })
}

export const readJson = async <T = unknown>(path: string) => {
  return read(path).then((data) => JSON.parse(data) as T)
}

export const readDir = async (path: string) => {
  return readDirectory(path, {
    baseDir: BaseDirectory.Document,
  })
}

export const readDirRecursive = async (path: string) => {
  const entries = await readDir(path)
  const results: (DirEntry & { path: string })[] = []

  for (const entry of entries) {
    const fullPath = `${path}/${entry.name}`
    const current = {
      path: fullPath,
      name: entry.name,
      isDirectory: entry.isDirectory,
      isFile: entry.isFile,
      isSymlink: entry.isSymlink,
    }

    results.push(current)
    if (entry.isDirectory) {
      results.push(...(await readDirRecursive(fullPath)))
    }
  }

  return results
}
