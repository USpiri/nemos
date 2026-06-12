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

export const readDirAppData = async (path: string) => {
  return readDirectory(path, {
    baseDir: BaseDirectory.AppData,
  })
}

export const readAppData = async (path: string) => {
  return readTextFile(path, {
    baseDir: BaseDirectory.AppData,
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

  const results: (DirEntry & { path: string })[][] = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = `${path}/${entry.name}`
      const current: DirEntry & { path: string } = {
        path: fullPath,
        name: entry.name,
        isDirectory: entry.isDirectory,
        isFile: entry.isFile,
        isSymlink: entry.isSymlink,
      }

      if (entry.isDirectory) {
        const children = await readDirRecursive(fullPath)
        return [current, ...children]
      }

      return [current]
    }),
  )

  return results.flat()
}
