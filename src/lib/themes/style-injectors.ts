export const THEME_ATTR = 'data-nemos-theme'
export const GLOBAL_ATTR = 'data-nemos-snippet-global'
export const WORKSPACE_ATTR = 'data-nemos-snippet-workspace'

export function applyThemeCSS(css: string | null) {
  const existing = document.querySelector(`[${THEME_ATTR}]`)
  if (!css) {
    existing?.remove()
    return
  }
  if (existing) {
    existing.textContent = css
  } else {
    const style = document.createElement('style')
    style.setAttribute(THEME_ATTR, '')
    style.textContent = css
    document.head.appendChild(style)
  }
}

export function injectSnippetStyle(attr: string, id: string, css: string) {
  const existing = document.querySelector(`[${attr}="${id}"]`)
  if (existing) {
    existing.textContent = css
    return
  }
  const style = document.createElement('style')
  style.setAttribute(attr, id)
  style.textContent = css
  document.head.appendChild(style)
}

export function removeStaleSnippets(attr: string, activeIds: Set<string>) {
  document.querySelectorAll(`[${attr}]`).forEach((el) => {
    if (!activeIds.has(el.getAttribute(attr)!)) el.remove()
  })
}
