import { MermaidConfig } from 'mermaid'

/**
 * This is used to get the CSS variables from the document element
 * and use them in the Mermaid config adn allow to override the default values
 * using the CSS variables.
 */
const getCSSVariable = (variable: string, fallback: string): string => {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    return (
      getComputedStyle(document.documentElement)
        .getPropertyValue(variable)
        .trim() || fallback
    )
  }
  return fallback
}

export const options: MermaidConfig = {
  theme: 'base',
  securityLevel: 'strict',
  themeVariables: {
    primaryColor: getCSSVariable('--mermaid-primary-color', '#BB2528'),
    primaryTextColor: getCSSVariable('--mermaid-primary-text-color', '#fff'),
    primaryBorderColor: getCSSVariable(
      '--mermaid-primary-border-color',
      '#7C0000',
    ),
    lineColor: getCSSVariable('--mermaid-line-color', '#F8B229'),
    secondaryColor: getCSSVariable('--mermaid-secondary-color', '#006100'),
    tertiaryColor: getCSSVariable('--mermaid-tertiary-color', '#fff'),
    edgeLabelBackground: getCSSVariable(
      '--mermaid-edge-label-background',
      '#fff',
    ),
    edgeLabelColor: getCSSVariable('--mermaid-edge-label-color', '#000'),
  },
}
