import {
  WifiOff,
  Database,
} from 'lucide-react'

import {
  useBackup,
} from '../context/BackupContext'

export default function OfflineBanner() {
  const {
    connectionStatus,
    pendingChanges,
  } = useBackup()

  if (
    connectionStatus !==
    'Offline'
  ) {
    return null
  }

  return (
    <div
      className="offline-banner"
      role="status"
      aria-live="polite"
    >
      <div className="offline-banner-icon">
        <WifiOff size={18} />
      </div>

      <div className="offline-banner-content">

        <strong>
          You're working offline
        </strong>

        <span>
          Billing and other operations
          continue normally. Changes are
          saved locally and will sync when
          you're back online.
        </span>

      </div>

      {pendingChanges > 0 && (
        <div className="offline-banner-pending">

          <Database size={15} />

          <span>
            {pendingChanges}{' '}
            {pendingChanges === 1
              ? 'change'
              : 'changes'}{' '}
            pending
          </span>

        </div>
      )}
    </div>
  )
}