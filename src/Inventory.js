import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, LogOut, User, Plus, Search, AlertTriangle, TrendingUp, TrendingDown, Edit, Trash2 } from 'lucide-react';
import { api } from './utils/api';
import ItemModal from './components/ItemModal';
import CategoryModal from './components/CategoryModal';
import StockMovementModal from './components/StockMovementModal';
import SaleModal from './components/SaleModal';

export default function Inventory() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showLowStock, setShowLowStock] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    loadData();
  }, []);

  useEffect(() => {
    filterItems();
  }, [items, searchTerm, selectedCategory, showLowStock]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [itemsData, categoriesData] = await Promise.all([
        api.getItems(),
        api.getCategories()
      ]);
      setItems(itemsData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = [...items];

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(item => item.categoryId === parseInt(selectedCategory));
    }

    if (showLowStock) {
      filtered = filtered.filter(item => item.currentStock <= item.minStock);
    }

    setFilteredItems(filtered);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      await api.deleteItem(id);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    
    try {
      await api.deleteCategory(id);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const lowStockCount = items.filter(item => item.currentStock <= item.minStock).length;

  return (
    <div className={`inventory-wrapper ${isLoading ? 'loading' : ''}`}>
      <div className="inventory-container">
        <div className="inventory-header">
          <div className="header-content">
          <div className="header-left">
            <h1>Inventory Management</h1>
          </div>
          <div className="header-right">
              <button onClick={handleLogout} className="logout-button-header">
              <LogOut size={18} />
                <span>Logout</span>
            </button>
            </div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card blue-card">
            <div className="stat-icon blue">
              <Package size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{items.length}</div>
              <div className="stat-label stat-label-total-items">Total Items</div>
            </div>
          </div>
          <div className="stat-card orange-card">
            <div className="stat-icon orange">
              <AlertTriangle size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{lowStockCount}</div>
              <div className="stat-label stat-label-low-stock">Low Stock</div>
            </div>
          </div>
          <div className="stat-card purple-card">
            <div className="stat-icon purple">
              <TrendingUp size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{categories.length}</div>
              <div className="stat-label stat-label-categories">Categories</div>
            </div>
          </div>
        </div>

        <div className="controls-bar">
          <div className="filters">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-filter"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={showLowStock}
                onChange={(e) => setShowLowStock(e.target.checked)}
              />
              Low Stock Only
            </label>
          </div>
            <div className="actions">
              <button onClick={() => setShowCategoryModal(true)} className="btn-secondary">
                <Plus size={18} />
                Add Category
              </button>
              <button onClick={() => { setSelectedItem(null); setShowItemModal(true); }} className="btn-primary">
                <Plus size={18} />
                Add Item
              </button>
            </div>
        </div>

        {error && (
          <div className="error-banner">
            {error}
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        <div className="items-table-container">
          <table className="items-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Min Stock</th>
                <th>Unit Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="empty-state">
                    No items found
                  </td>
                </tr>
              ) : (
                filteredItems.map(item => (
                  <tr key={item.id} className={item.currentStock <= item.minStock ? 'low-stock' : ''}>
                    <td>{item.name}</td>
                    <td>{item.sku || '-'}</td>
                    <td>{item.category?.name || '-'}</td>
                    <td>
                      <span className={`stock-value ${item.currentStock <= item.minStock ? 'low' : ''}`}>
                        {item.currentStock}
                      </span>
                    </td>
                    <td>{item.minStock}</td>
                    <td>${parseFloat(item.unitPrice).toFixed(2)}</td>
                    <td>
                      {item.currentStock <= item.minStock ? (
                        <span className="status-badge warning">Low Stock</span>
                      ) : (
                        <span className="status-badge success">In Stock</span>
                      )}
                    </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => { setSelectedItem(item); setShowStockModal(true); }}
                            className="btn-icon"
                            title="Adjust Stock"
                          >
                            <TrendingUp size={16} />
                          </button>
                          <button
                            onClick={() => { setSelectedItem(item); setShowSaleModal(true); }}
                            className="btn-icon"
                            title="Record Sale"
                          >
                            <TrendingDown size={16} />
                          </button>
                          <button
                            onClick={() => { setSelectedItem(item); setShowItemModal(true); }}
                            className="btn-icon"
                            title="Edit"
                          >
                          <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="btn-icon delete"
                            title="Delete"
                          >
                          <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

          <div className="categories-section">
            <h2>Categories</h2>
            <div className="categories-grid">
              {categories.map(cat => (
                <div key={cat.id} className="category-card">
                  <div className="category-info">
                    <h3>{cat.name}</h3>
                    {cat.description && <p>{cat.description}</p>}
                  </div>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="btn-icon delete"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
      </div>

      {showItemModal && (
        <ItemModal
          item={selectedItem}
          categories={categories}
          onClose={() => { setShowItemModal(false); setSelectedItem(null); }}
          onSave={loadData}
        />
      )}

      {showCategoryModal && (
        <CategoryModal
          onClose={() => setShowCategoryModal(false)}
          onSave={loadData}
        />
      )}

      {showStockModal && selectedItem && (
        <StockMovementModal
          item={selectedItem}
          onClose={() => { setShowStockModal(false); setSelectedItem(null); }}
          onSave={loadData}
        />
      )}

      {showSaleModal && selectedItem && (
        <SaleModal
          item={selectedItem}
          onClose={() => { setShowSaleModal(false); setSelectedItem(null); }}
          onSave={loadData}
        />
      )}

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .inventory-wrapper {
          min-height: 100vh;
          background: #e2e8f0;
          background-image: 
            radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.05) 0%, transparent 50%);
          font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
          animation: fadeIn 0.6s ease-in-out;
          position: relative;
        }

        .inventory-wrapper.loading {
          opacity: 0.7;
          pointer-events: none;
        }

        .inventory-wrapper.loading::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.5);
          z-index: 1;
          pointer-events: none;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .inventory-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0;
        }

        .inventory-header {
          background: #ffffff;
          border-bottom: 2px solid #cbd5e1;
          padding: 2rem 2.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .header-left h1 {
          color: #000000;
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin: 0;
        }

        .header-right {
          display: flex;
          align-items: center;
          margin-left: auto;
        }

        .logout-button-header {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1.25rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #dc2626;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.2s ease;
          backdrop-filter: blur(10px);
        }

        .logout-button-header:hover {
          background: rgba(239, 68, 68, 0.2);
          border-color: rgba(239, 68, 68, 0.5);
          color: #b91c1c;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.2);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin: 2rem 2.5rem;
        }

        .stat-card {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: #cbd5e1;
          transition: width 0.2s ease;
        }

        .stat-card:hover {
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
          border-color: #94a3b8;
        }

        .stat-card:hover::before {
          width: 6px;
        }

        .stat-card.blue-card::before {
          background: #3b82f6;
        }

        .stat-card.purple-card::before {
          background: #8b5cf6;
        }

        .stat-card.orange-card::before {
          background: #f97316;
        }

        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .stat-icon.blue {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: #ffffff;
        }

        .stat-icon.orange {
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          color: #ffffff;
        }

        .stat-icon.purple {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          color: #ffffff;
        }

        .stat-content {
          flex: 1;
          min-width: 0;
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 900;
          color: #000000 !important;
          margin-bottom: 0.25rem;
          line-height: 1.2;
        }

        .stat-label {
          font-size: 0.95rem;
          color: #000000 !important;
          font-weight: 800;
          margin-bottom: 0.5rem;
        }

        .stat-label-total-items,
        .stat-label-low-stock,
        .stat-label-categories {
          color: #000000 !important;
        }

        .controls-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 0 2.5rem 2rem 2.5rem;
          flex-wrap: wrap;
          gap: 15px;
        }

        .filters {
          display: flex;
          gap: 15px;
          align-items: center;
          flex-wrap: wrap;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #ffffff;
          padding: 10px 15px;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .search-box input {
          background: transparent;
          border: none;
          outline: none;
          color: #000000;
          width: 250px;
        }

        .search-box input::placeholder {
          color: #94a3b8;
        }

        .category-filter {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #000000;
          padding: 10px 15px;
          border-radius: 8px;
          cursor: pointer;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #000000;
          cursor: pointer;
          font-weight: 500;
        }

        .actions {
          display: flex;
          gap: 10px;
        }

        .btn-primary, .btn-secondary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-primary {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
        }

        .btn-secondary {
          background: #ffffff;
          color: #000000;
          border: 1px solid #cbd5e1;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .btn-primary:hover, .btn-secondary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .error-banner {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #dc2626;
          padding: 15px;
          border-radius: 8px;
          margin: 0 2.5rem 20px 2.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .items-table-container {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          overflow: hidden;
          margin: 0 2.5rem 30px 2.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .items-table {
          width: 100%;
          border-collapse: collapse;
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .items-table thead {
          background: #f8fafc;
        }

        .items-table th {
          padding: 15px;
          text-align: left;
          color: #000000;
          font-weight: 700;
          border-bottom: 2px solid #cbd5e1;
        }

        .items-table td {
          padding: 15px;
          color: #000000;
          border-bottom: 1px solid #e2e8f0;
        }

        .items-table tr.low-stock {
          background: rgba(239, 68, 68, 0.05);
        }

        .items-table tr:hover {
          background: #f8fafc;
        }

        .stock-value.low {
          color: #dc2626;
          font-weight: 700;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.85em;
          font-weight: 600;
        }

        .status-badge.warning {
          background: rgba(239, 68, 68, 0.15);
          color: #dc2626;
        }

        .status-badge.success {
          background: rgba(34, 197, 94, 0.15);
          color: #16a34a;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .btn-icon {
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          color: #000000;
          padding: 6px 10px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-icon:hover {
          background: #e2e8f0;
          border-color: #94a3b8;
        }

        .btn-icon.delete:hover {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.3);
          color: #dc2626;
        }

        .empty-state {
          text-align: center;
          padding: 40px;
          color: #64748b;
          background: #ffffff;
          border-radius: 12px;
          margin: 2rem 2.5rem;
        }

        .categories-section {
          margin: 2rem 2.5rem;
        }

        .categories-section h2 {
          color: #000000;
          margin-bottom: 20px;
          font-weight: 700;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 15px;
        }

        .category-card {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          padding: 20px;
          border-radius: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .category-info h3 {
          color: #000000;
          margin-bottom: 5px;
          font-weight: 700;
        }

        .category-info p {
          color: #64748b;
          font-size: 0.9em;
        }
      `}</style>
    </div>
  );
}

