import {
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  CheckCircle2,
  Cloud,
  X,
} from 'lucide-react'

import {
  useBackup,
} from '../context/BackupContext'

export default function SyncNotification() {
  const {
    syncStatus,
    pendingChanges,
    connectionStatus,
  } = useBackup()

  const [
    visible,
    setVisible,
  ] = useState(false)

  const [
    syncedCount,
    setSyncedCount,
  ] = useState(0)

  const previousStatus =
    useRef(syncStatus)

  const pendingBeforeSync =
    useRef(0)

  useEffect(() => {
    /*
      Remember how many changes existed
      immediately before synchronization.
    */

    if (
      syncStatus === 'Pending' ||
      syncStatus === 'Offline'
    ) {
      if (
        pendingChanges > 0
      ) {
        pendingBeforeSync.current =
          pendingChanges
      }
    }

    /*
      When synchronization begins,
      preserve the number of changes
      being synchronized.
    */

    if (
      syncStatus === 'Syncing' &&
      pendingChanges > 0
    ) {
      pendingBeforeSync.current =
        pendingChanges
    }

    /*
      Show success only when we actually
      moved from Syncing -> Synced.

      This prevents the notification from
      appearing when the app first loads.
    */

    if (
      previousStatus.current ===
        'Syncing' &&
      syncStatus === 'Synced' &&
      connectionStatus ===
        'Online'
    ) {
      setSyncedCount(
        pendingBeforeSync.current
      )

      setVisible(true)

      const timer =
        window.setTimeout(
          () => {
            setVisible(false)
          },
          4500
        )

      previousStatus.current =
        syncStatus

      return () => {
        window.clearTimeout(
          timer
        )
      }
    }

    previousStatus.current =
      syncStatus
  }, [
    syncStatus,
    pendingChanges,
    connectionStatus,
  ])

  if (!visible) {
    return null
  }

  return (
    <div
      className="sync-notification"
      role="status"
      aria-live="polite"
    >
      <div className="sync-notification-icon">
        <CheckCircle2
          size={24}
        />
      </div>

      <div className="sync-notification-content">
        <div className="sync-notification-title">
          Sync Complete
        </div>

        <div className="sync-notification-message">
          {syncedCount > 0
            ? `${syncedCount} offline ${
                syncedCount === 1
                  ? 'change'
                  : 'changes'
              } synchronized successfully.`
            : 'Your local data is synchronized.'}
        </div>

        <div className="sync-notification-cloud">
          <Cloud size={14} />

          <span>
            RK BillPro data is up to date
          </span>
        </div>
      </div>

      <button
        type="button"
        className="sync-notification-close"
        onClick={() =>
          setVisible(false)
        }
        aria-label="Close sync notification"
      >
        <X size={18} />
      </button>
    </div>
  )
}