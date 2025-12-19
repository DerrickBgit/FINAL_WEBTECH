import React, { useState } from 'react';
import { X } from 'lucide-react';
import { api } from '../utils/api';

export default function SaleModal({ item, onClose, onSave }) {
  const [formData, setFormData] = useState({
    quantity: 1,
    unitPrice: parseFloat(item.unitPrice) || 0,
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalPrice = formData.quantity * formData.unitPrice;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.createSale({
        itemId: item.id,
        quantity: formData.quantity,
        unitPrice: formData.unitPrice,
        notes: formData.notes
      });
      onSave();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Record Sale - {item.name}</h2>
          <button onClick={onClose} className="close-btn">
            <X size={20} />
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Available Stock</label>
            <div className="current-stock">{item.currentStock}</div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Quantity *</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                min="1"
                max={item.currentStock}
                required
              />
            </div>

            <div className="form-group">
              <label>Unit Price *</label>
              <input
                type="number"
                step="0.01"
                value={formData.unitPrice}
                disabled
                readOnly
                min="0"
                required
                className="readonly-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Total Price</label>
            <div className="total-price">${totalPrice.toFixed(2)}</div>
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows="3"
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={loading || formData.quantity > item.currentStock}>
              {loading ? 'Processing...' : 'Record Sale'}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: #1e293b;
          border-radius: 12px;
          width: 100%;
          max-width: 500px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .modal-header h2 {
          color: white;
          font-size: 1.5em;
        }

        .close-btn {
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
          padding: 5px;
        }

        .error-message {
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.5);
          color: #fca5a5;
          padding: 12px 20px;
          margin: 0 20px 20px;
          border-radius: 8px;
        }

        form {
          padding: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        label {
          display: block;
          color: white;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .current-stock, .total-price {
          padding: 10px;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: white;
          font-size: 1.2em;
          font-weight: 700;
        }

        .total-price {
          color: #4ade80;
        }

        input, textarea {
          width: 100%;
          padding: 10px;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: white;
          font-size: 1em;
        }

        input:focus, textarea:focus {
          outline: none;
          border-color: #60a5fa;
        }

        input:disabled, input.readonly-input {
          opacity: 0.7;
          cursor: not-allowed;
          background: rgba(15, 23, 42, 0.4);
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }

        .btn-cancel, .btn-save {
          padding: 10px 20px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: 600;
        }

        .btn-cancel {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .btn-save {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          color: white;
        }

        .btn-save:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

