import { useEffect } from 'react'
import { usePinsMigration } from '@/hooks/use-pins-migration'

/**
 * Checks once at boot whether the one-time pin migration prompt is still
 * owed, and opens `PinsMigrationDialog` if so. Mirrors `UpdateChecker`'s
 * check-on-mount pattern.
 */
export const PinsMigrationChecker = () => {
  const { check } = usePinsMigration()

  useEffect(() => {
    check()
  }, [check])

  return null
}
