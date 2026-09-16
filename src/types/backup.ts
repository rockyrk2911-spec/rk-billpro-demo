export type BackupFrequency =
  | 'Every 6 Hours'
  | 'Daily'
  | 'Weekly'

export type SyncStatus =
  | 'Synced'
  | 'Pending'
  | 'Syncing'
  | 'Offline'

export type ConnectionStatus =
  | 'Online'
  | 'Offline'

export type PendingChangeType =
  | 'Sale'
  | 'Purchase'
  | 'Expense'
  | 'Customer'
  | 'Supplier'
  | 'Product'
  | 'Settings'

export type PendingChange = {
  id: string
  type: PendingChangeType
  description: string
  createdAt: string
}

export type BackupSettings = {
  autoBackup: boolean
  backupFrequency: BackupFrequency
  syncEnabled: boolean
  lastBackupAt: string | null
  lastSyncAt: string | null
}

export type BackupFile = {
  app: 'RK BillPro'
  version: 1
  exportedAt: string
  data: Record<string, unknown>
}