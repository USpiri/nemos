import { getTauriVersion, getVersion } from '@tauri-apps/api/app'
import { ExternalLink } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { APP_INFO } from '@/config/info'
import { openUrl } from '@/lib/opener'
import { cn } from '@/lib/utils'

export const AboutSection = () => {
  const [appVersion, setAppVersion] = useState('')
  const [tauriVersion, setTauriVersion] = useState('')

  useEffect(() => {
    getVersion().then(setAppVersion)
    getTauriVersion().then(setTauriVersion)
  }, [])

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="font-medium text-base">About</h2>
        <p className="text-muted-foreground text-sm">
          Application information and links.
        </p>
      </div>

      <div className="space-y-3">
        <InfoRow label="Version" value={appVersion} />
        <InfoRow label="Tauri" value={tauriVersion} />
        <InfoRow
          label="Author"
          value={
            <LinkRow
              label={APP_INFO.author}
              url={APP_INFO.authorUrl}
              className="text-foreground"
            />
          }
        />
      </div>

      <div className="space-y-3">
        <h3 className="font-medium text-sm">Changelog</h3>
        <LinkRow label="View changelog" url={APP_INFO.changelogUrl} />
      </div>

      <div className="space-y-2">
        <h3 className="font-medium text-sm">Links</h3>
        <div className="flex flex-col items-start gap-1">
          <LinkRow label="Source code" url={APP_INFO.sourceCodeUrl} />
          <LinkRow label="Report an issue" url={APP_INFO.issuesUrl} />
          <LinkRow label="License (MIT)" url={APP_INFO.licenseUrl} />
        </div>
      </div>
    </div>
  )
}

const InfoRow = ({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) => (
  <div className="flex items-center justify-between">
    <span className="text-muted-foreground text-sm">{label}</span>
    <span className="font-mono text-sm">{value || '...'}</span>
  </div>
)

const LinkRow = ({
  label,
  url,
  className,
}: {
  label: string
  url: string
  className?: string
}) => (
  <Button
    onClick={() => openUrl(url)}
    variant="link"
    className={cn(
      'h-4 justify-start p-0 text-muted-foreground text-xs hover:text-foreground',
      className,
    )}
  >
    <ExternalLink className="size-3.5" />
    {label}
  </Button>
)
