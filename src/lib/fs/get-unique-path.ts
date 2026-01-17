import { exists } from './exists'

interface Options {
  separator?: 'paren' | 'dash'
  startAt?: number
}

export const getUniquePath = async (path: string, options?: Options) => {
  const { separator = 'paren', startAt = 1 } = options || {}

  if (!(await exists(path))) return path

  const lastSlashIndex = path.lastIndexOf('/')
  const directory = path.substring(0, lastSlashIndex + 1)
  const filename = path.substring(lastSlashIndex + 1)

  const lastDotIndex = filename.lastIndexOf('.')
  const basename =
    lastDotIndex > 0 ? filename.substring(0, lastDotIndex) : filename
  const extension = lastDotIndex > 0 ? filename.substring(lastDotIndex) : ''

  let counter = startAt
  let newPath: string

  do {
    if (separator === 'paren') {
      newPath = `${directory}${basename} (${counter})${extension}`
    } else {
      newPath = `${directory}${basename}-${counter}${extension}`
    }
    counter++
  } while (await exists(newPath))

  return newPath
}
