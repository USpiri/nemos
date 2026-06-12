export function resolveSettings<T extends object>(
  global: T,
  workspace: Partial<T>,
): T {
  return { ...global, ...workspace }
}
