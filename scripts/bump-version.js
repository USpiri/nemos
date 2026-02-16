import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const version = process.argv[2]

if (!version) {
  console.error('Usage: node scripts/bump-version.mjs <version>')
  console.error('Example: node scripts/bump-version.mjs 1.0.0')
  process.exit(1)
}

if (!/^\d+\.\d+\.\d+$/.test(version)) {
  console.error(`Invalid version: "${version}". Expected format: X.Y.Z`)
  process.exit(1)
}

const root = resolve(import.meta.dirname, '..')

const files = [
  {
    path: resolve(root, 'package.json'),
    replace: (content) =>
      content.replace(/"version":\s*".*?"/, `"version": "${version}"`),
  },
  {
    path: resolve(root, 'src-tauri/tauri.conf.json'),
    replace: (content) =>
      content.replace(/"version":\s*".*?"/, `"version": "${version}"`),
  },
]

for (const file of files) {
  const content = readFileSync(file.path, 'utf-8')
  const updated = file.replace(content)

  if (content === updated) {
    console.log(`  (no change) ${file.path}`)
    continue
  }

  writeFileSync(file.path, updated)
  console.log(`  updated ${file.path}`)
}

console.log(`\nBumped to v${version}`)
