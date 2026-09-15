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

let colorProbe: HTMLElement | null = null

/**
 * Mermaid parses theme colors with `khroma`, which only understands
 * hex/rgb/hsl/keyword syntax — not the oklch()/color-mix() values the app's
 * theme tokens are authored in. Assigning the raw value to an off-DOM
 * element and reading it back through getComputedStyle lets the browser do
 * the color-space conversion, normalizing it to an rgb()/rgba() string
 * Mermaid can parse.
 */
const getCSSColorVariable = (variable: string, fallback: string): string => {
  const raw = getCSSVariable(variable, fallback)
  if (typeof document === 'undefined') return raw

  if (!colorProbe) {
    colorProbe = document.createElement('span')
    colorProbe.style.display = 'none'
    document.body.appendChild(colorProbe)
  }
  colorProbe.style.color = ''
  colorProbe.style.color = raw
  return getComputedStyle(colorProbe).color || fallback
}

export const options: MermaidConfig = {
  theme: 'base',
  securityLevel: 'strict',
  themeVariables: {
    background: getCSSColorVariable('--mermaid-background', '#ffffff'),
    fontFamily: getCSSVariable('--mermaid-font-family', 'inherit'),

    // Core palette
    primaryColor: getCSSColorVariable('--mermaid-primary-color', '#fafafa'),
    primaryTextColor: getCSSColorVariable(
      '--mermaid-primary-text-color',
      '#000',
    ),
    primaryBorderColor: getCSSColorVariable(
      '--mermaid-primary-border-color',
      '#e5e5e5',
    ),
    secondaryColor: getCSSColorVariable(
      '--mermaid-secondary-color',
      '#f4f4f5',
    ),
    secondaryTextColor: getCSSColorVariable(
      '--mermaid-secondary-text-color',
      '#000',
    ),
    secondaryBorderColor: getCSSColorVariable(
      '--mermaid-secondary-border-color',
      '#e5e5e5',
    ),
    tertiaryColor: getCSSColorVariable('--mermaid-tertiary-color', '#ffffff'),
    tertiaryTextColor: getCSSColorVariable(
      '--mermaid-tertiary-text-color',
      '#000',
    ),
    tertiaryBorderColor: getCSSColorVariable(
      '--mermaid-tertiary-border-color',
      '#e5e5e5',
    ),
    lineColor: getCSSColorVariable('--mermaid-line-color', '#a1a1a1'),
    textColor: getCSSColorVariable('--mermaid-text-color', '#000'),
    titleColor: getCSSColorVariable('--mermaid-title-color', '#000'),

    // Flowchart / ER diagram
    mainBkg: getCSSColorVariable('--mermaid-main-bkg', '#fafafa'),
    nodeBorder: getCSSColorVariable('--mermaid-node-border', '#e5e5e5'),
    clusterBkg: getCSSColorVariable('--mermaid-cluster-bkg', '#f4f4f5'),
    clusterBorder: getCSSColorVariable('--mermaid-cluster-border', '#e5e5e5'),
    defaultLinkColor: getCSSColorVariable(
      '--mermaid-default-link-color',
      '#a1a1a1',
    ),
    edgeLabelBackground: getCSSColorVariable(
      '--mermaid-edge-label-background',
      '#ffffff',
    ),
    edgeLabelColor: getCSSColorVariable('--mermaid-edge-label-color', '#000'),
    errorBkgColor: getCSSColorVariable('--mermaid-error-bkg-color', '#ffffff'),
    errorTextColor: getCSSColorVariable(
      '--mermaid-error-text-color',
      '#dc2626',
    ),
    noteBkgColor: getCSSColorVariable('--mermaid-note-bkg-color', '#f4f4f5'),
    noteTextColor: getCSSColorVariable('--mermaid-note-text-color', '#000'),
    noteBorderColor: getCSSColorVariable(
      '--mermaid-note-border-color',
      '#e5e5e5',
    ),
    rowOdd: getCSSColorVariable('--mermaid-row-odd', '#ffffff'),
    rowEven: getCSSColorVariable('--mermaid-row-even', '#f4f4f5'),

    // Sequence diagram
    actorBkg: getCSSColorVariable('--mermaid-actor-bkg', '#fafafa'),
    actorBorder: getCSSColorVariable('--mermaid-actor-border', '#e5e5e5'),
    actorTextColor: getCSSColorVariable('--mermaid-actor-text-color', '#000'),
    actorLineColor: getCSSColorVariable(
      '--mermaid-actor-line-color',
      '#e5e5e5',
    ),
    signalColor: getCSSColorVariable('--mermaid-signal-color', '#000'),
    signalTextColor: getCSSColorVariable(
      '--mermaid-signal-text-color',
      '#000',
    ),
    labelBoxBkgColor: getCSSColorVariable(
      '--mermaid-label-box-bkg-color',
      '#fafafa',
    ),
    labelBoxBorderColor: getCSSColorVariable(
      '--mermaid-label-box-border-color',
      '#e5e5e5',
    ),
    labelTextColor: getCSSColorVariable('--mermaid-label-text-color', '#000'),
    loopTextColor: getCSSColorVariable('--mermaid-loop-text-color', '#000'),
    activationBorderColor: getCSSColorVariable(
      '--mermaid-activation-border-color',
      '#e5e5e5',
    ),
    activationBkgColor: getCSSColorVariable(
      '--mermaid-activation-bkg-color',
      '#f4f4f5',
    ),
    sequenceNumberColor: getCSSColorVariable(
      '--mermaid-sequence-number-color',
      '#000',
    ),
    personBkg: getCSSColorVariable('--mermaid-person-bkg', '#fafafa'),
    personBorder: getCSSColorVariable('--mermaid-person-border', '#e5e5e5'),

    // State diagram
    stateBkg: getCSSColorVariable('--mermaid-state-bkg', '#fafafa'),
    stateLabelColor: getCSSColorVariable(
      '--mermaid-state-label-color',
      '#000',
    ),
    transitionColor: getCSSColorVariable(
      '--mermaid-transition-color',
      '#a1a1a1',
    ),
    transitionLabelColor: getCSSColorVariable(
      '--mermaid-transition-label-color',
      '#000',
    ),
    labelBackgroundColor: getCSSColorVariable(
      '--mermaid-label-background-color',
      '#ffffff',
    ),
    compositeBackground: getCSSColorVariable(
      '--mermaid-composite-background',
      '#f4f4f5',
    ),
    compositeTitleBackground: getCSSColorVariable(
      '--mermaid-composite-title-background',
      '#fafafa',
    ),
    compositeBorder: getCSSColorVariable(
      '--mermaid-composite-border',
      '#e5e5e5',
    ),
    innerEndBackground: getCSSColorVariable(
      '--mermaid-inner-end-background',
      '#000',
    ),
    specialStateColor: getCSSColorVariable(
      '--mermaid-special-state-color',
      '#000',
    ),

    // Class diagram
    classText: getCSSColorVariable('--mermaid-class-text', '#000'),
    relationColor: getCSSColorVariable(
      '--mermaid-relation-color',
      '#a1a1a1',
    ),
    relationLabelBackground: getCSSColorVariable(
      '--mermaid-relation-label-background',
      '#ffffff',
    ),
    relationLabelColor: getCSSColorVariable(
      '--mermaid-relation-label-color',
      '#000',
    ),

    // Gantt chart
    sectionBkgColor: getCSSColorVariable(
      '--mermaid-section-bkg-color',
      '#f4f4f5',
    ),
    altSectionBkgColor: getCSSColorVariable(
      '--mermaid-alt-section-bkg-color',
      '#ffffff',
    ),
    taskBorderColor: getCSSColorVariable(
      '--mermaid-task-border-color',
      '#e5e5e5',
    ),
    taskBkgColor: getCSSColorVariable('--mermaid-task-bkg-color', '#fafafa'),
    taskTextColor: getCSSColorVariable('--mermaid-task-text-color', '#000'),
    taskTextLightColor: getCSSColorVariable(
      '--mermaid-task-text-light-color',
      '#000',
    ),
    taskTextOutsideColor: getCSSColorVariable(
      '--mermaid-task-text-outside-color',
      '#000',
    ),
    taskTextClickableColor: getCSSColorVariable(
      '--mermaid-task-text-clickable-color',
      '#2563eb',
    ),
    activeTaskBorderColor: getCSSColorVariable(
      '--mermaid-active-task-border-color',
      '#2563eb',
    ),
    activeTaskBkgColor: getCSSColorVariable(
      '--mermaid-active-task-bkg-color',
      '#dbeafe',
    ),
    gridColor: getCSSColorVariable('--mermaid-grid-color', '#e5e5e5'),
    doneTaskBkgColor: getCSSColorVariable(
      '--mermaid-done-task-bkg-color',
      '#f4f4f5',
    ),
    doneTaskBorderColor: getCSSColorVariable(
      '--mermaid-done-task-border-color',
      '#e5e5e5',
    ),
    critBorderColor: getCSSColorVariable(
      '--mermaid-crit-border-color',
      '#dc2626',
    ),
    critBkgColor: getCSSColorVariable('--mermaid-crit-bkg-color', '#fee2e2'),
    todayLineColor: getCSSColorVariable(
      '--mermaid-today-line-color',
      '#2563eb',
    ),

    // Pie chart
    pie1: getCSSColorVariable('--mermaid-pie-1', '#60a5fa'),
    pie2: getCSSColorVariable('--mermaid-pie-2', '#3b82f6'),
    pie3: getCSSColorVariable('--mermaid-pie-3', '#2563eb'),
    pie4: getCSSColorVariable('--mermaid-pie-4', '#1d4ed8'),
    pie5: getCSSColorVariable('--mermaid-pie-5', '#1e40af'),
    pieTitleTextColor: getCSSColorVariable(
      '--mermaid-pie-title-text-color',
      '#000',
    ),
    pieSectionTextColor: getCSSColorVariable(
      '--mermaid-pie-section-text-color',
      '#000',
    ),
    pieLegendTextColor: getCSSColorVariable(
      '--mermaid-pie-legend-text-color',
      '#000',
    ),
    pieStrokeColor: getCSSColorVariable(
      '--mermaid-pie-stroke-color',
      '#e5e5e5',
    ),
    pieOuterStrokeColor: getCSSColorVariable(
      '--mermaid-pie-outer-stroke-color',
      '#e5e5e5',
    ),
    pieOpacity: getCSSVariable('--mermaid-pie-opacity', '0.9'),
  },
}
