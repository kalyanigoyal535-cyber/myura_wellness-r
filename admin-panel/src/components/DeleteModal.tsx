import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import '../styles/DeleteModal.css';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
  isLoading?: boolean;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  isLoading = false,
}: DeleteModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="delete-modal-overlay" onClick={handleBackdropClick}>
      <div className="delete-modal-container">
        <div className="delete-modal-header">
          <div className="delete-modal-icon-wrapper">
            <AlertTriangle className="delete-modal-icon" size={24} />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="delete-modal-close-btn"
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="delete-modal-content">
          <h2 className="delete-modal-title">{title}</h2>
          <p className="delete-modal-message">
            {message}
            {itemName && (
              <span className="delete-modal-item-name"> "{itemName}"</span>
            )}
          </p>
          <p className="delete-modal-warning">
            This action cannot be undone.
          </p>
        </div>

        <div className="delete-modal-actions">
          <button
            type="button"
            onClick={onClose}
            className="delete-modal-cancel-btn"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="delete-modal-confirm-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

