export type SupportedLanguage = {
  id: string
  name: string
  match: string[]
}

export const supportedLanguages: SupportedLanguage[] = [
  { id: 'text', name: 'Text', match: ['text', 'txt', 'plaintext'] },
  { id: 'arduino', name: 'Arduino', match: ['arduino', 'ino'] },
  { id: 'bash', name: 'Bash', match: ['bash', 'sh', 'zsh'] },
  { id: 'c', name: 'C', match: ['c', 'h'] },
  {
    id: 'cpp',
    name: 'C++',
    match: ['cpp', 'cc', 'c++', 'h++', 'hpp', 'hh', 'hxx', 'cxx'],
  },
  { id: 'csharp', name: 'C#', match: ['csharp', 'cs', 'c#'] },
  { id: 'css', name: 'CSS', match: ['css'] },
  { id: 'go', name: 'Go', match: ['go', 'golang'] },
  { id: 'http', name: 'HTTP', match: ['http', 'https'] },
  { id: 'ini', name: 'TOML / INI', match: ['ini', 'toml'] },
  { id: 'java', name: 'Java', match: ['java', 'jsp'] },
  {
    id: 'javascript',
    name: 'JavaScript',
    match: ['javascript', 'js', 'jsx', 'mjs', 'cjs'],
  },
  { id: 'json', name: 'JSON', match: ['json', 'jsonc'] },
  {
    id: 'markdown',
    name: 'Markdown',
    match: ['markdown', 'md', 'mkdown', 'mkd'],
  },
  {
    id: 'python',
    name: 'Python',
    match: ['python', 'py', 'gyp', 'ipyhton'],
  },
  { id: 'rust', name: 'Rust', match: ['rust', 'rs'] },
  {
    id: 'shell',
    name: 'Shell / Console',
    match: ['shell', 'console', 'shellsession'],
  },
  { id: 'sql', name: 'SQL', match: ['sql'] },
  {
    id: 'typescript',
    name: 'TypeScript',
    match: ['typescript', 'ts', 'tsx', 'mts', 'cts'],
  },
  {
    id: 'xml',
    name: 'HTML / XML',
    match: [
      'xml',
      'html',
      'xhtml',
      'rss',
      'atom',
      'xjb',
      'xsd',
      'xsl',
      'plist',
      'wsf',
      'svg',
    ],
  },
  { id: 'yaml', name: 'YAML', match: ['yaml', 'yml'] },
]
