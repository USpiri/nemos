import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const rawVersion = process.argv[2]

if (!rawVersion) {
  console.error('Usage: node scripts/extract-changelog.js <version>')
  console.error('Example: node scripts/extract-changelog.js v1.2.0')
  process.exit(1)
}

const version = rawVersion.replace(/^v/, '')
const changelogPath = resolve(import.meta.dirname, '..', 'CHANGELOG.md')
const changelog = readFileSync(changelogPath, 'utf-8')

const escapedVersion = version.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const heading = new RegExp(`^## v${escapedVersion}\\b.*$`, 'm')
const match = heading.exec(changelog)

if (!match) {
  console.error(`No CHANGELOG.md section found for version ${version}`)
  process.exit(1)
}

const afterHeading = changelog.slice(match.index + match[0].length)
const nextHeading = /^## /m.exec(afterHeading)
const separator = /^---\s*$/m.exec(afterHeading)

let end = afterHeading.length
if (nextHeading) end = Math.min(end, nextHeading.index)
if (separator) end = Math.min(end, separator.index)

const body = (match[0] + afterHeading.slice(0, end)).trim()

if (!body) {
  console.error(`CHANGELOG.md section for version ${version} is empty`)
  process.exit(1)
}

process.stdout.write(`${body}\n`)
