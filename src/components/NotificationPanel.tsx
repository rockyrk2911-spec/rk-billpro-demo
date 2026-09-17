import {
  Bell,
  CheckCheck,
  Package,
  ShoppingCart,
  AlertTriangle,
  X,
} from 'lucide-react'

type NotificationPanelProps = {
  onClose: () => void
}

export default function NotificationPanel({
  onClose,
}: NotificationPanelProps) {
  return (
    <div className="notification-panel">

      <div className="notification-panel-header">
        <div>
          <h3>Notifications</h3>
          <p>Recent RK BillPro activity</p>
        </div>

        <button
          type="button"
          className="notification-close"
          onClick={onClose}
          aria-label="Close notifications"
        >
          <X size={18} />
        </button>
      </div>

      <div className="notification-actions">
        <span>3 New Notifications</span>

        <button type="button">
          <CheckCheck size={15} />
          Mark all read
        </button>
      </div>

      <div className="notification-list">

        <div className="notification-item unread">
          <div className="notification-item-icon warning">
            <AlertTriangle size={18} />
          </div>

          <div className="notification-item-content">
            <div className="notification-item-title">
              Low Stock Alert
            </div>

            <p>
              Some products have reached their minimum
              stock level.
            </p>

            <span>Just now</span>
          </div>

          <span className="notification-unread-dot" />
        </div>

        <div className="notification-item unread">
          <div className="notification-item-icon sale">
            <ShoppingCart size={18} />
          </div>

          <div className="notification-item-content">
            <div className="notification-item-title">
              New Sale Completed
            </div>

            <p>
              A new billing transaction was completed
              successfully.
            </p>

            <span>10 minutes ago</span>
          </div>

          <span className="notification-unread-dot" />
        </div>

        <div className="notification-item unread">
          <div className="notification-item-icon stock">
            <Package size={18} />
          </div>

          <div className="notification-item-content">
            <div className="notification-item-title">
              Inventory Updated
            </div>

            <p>
              Product inventory has been updated after
              a purchase.
            </p>

            <span>1 hour ago</span>
          </div>

          <span className="notification-unread-dot" />
        </div>

      </div>

      <div className="notification-panel-footer">
        <Bell size={15} />
        Demo notifications
      </div>

    </div>
  )
}