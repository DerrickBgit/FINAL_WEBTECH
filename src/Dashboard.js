import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Package, 
  Layers, 
  AlertTriangle, 
  ShoppingCart, 
  TrendingUp, 
  DollarSign,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Activity,
  LogOut,
  BarChart3
} from 'lucide-react';
import { api } from './utils/api';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalItems: 0,
    totalCategories: 0,
    lowStockItems: 0,
    totalSales: 0,
    totalRevenue: 0,
    recentItems: [],
    recentSales: [],
    monthlySales: []
  });

  const groupSalesByMonth = useCallback((sales) => {
    const monthlyData = {};
    
    sales.forEach(sale => {
      const saleDate = new Date(sale.saleDate || sale.createdAt || sale.date);
      const monthKey = `${saleDate.getFullYear()}-${String(saleDate.getMonth() + 1).padStart(2, '0')}`;
      const monthName = saleDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthName,
          monthKey: monthKey,
          total: 0,
          count: 0
        };
      }
      
      monthlyData[monthKey].total += parseFloat(sale.totalPrice || sale.totalAmount || 0);
      monthlyData[monthKey].count += 1;
    });

    return Object.values(monthlyData)
      .sort((a, b) => b.monthKey.localeCompare(a.monthKey))
      .slice(0, 12); // Last 12 months
  }, []);

  const fetchDashboardData = useCallback(async () => {
      try {
      setIsLoading(true);
      const [items, categories, sales, allSales] = await Promise.all([
          api.getItems(),
          api.getCategories(),
        api.getSales({ limit: 10 }),
          api.getSales()
        ]);

        const lowStockItems = items.filter(item => item.currentStock <= item.minStock).length;
      const totalRevenue = allSales.reduce((sum, sale) => sum + (parseFloat(sale.totalPrice) || parseFloat(sale.totalAmount) || 0), 0);
      
      const recentItems = [...items]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      const recentSales = sales.slice(0, 5);

      const monthlySalesData = groupSalesByMonth(allSales);

        setStats({
          totalItems: items.length,
          totalCategories: categories.length,
          lowStockItems,
        totalSales: allSales.length,
        totalRevenue,
        recentItems,
        recentSales,
        monthlySales: monthlySalesData
        });
      } catch (error) {
      console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
  }, [groupSalesByMonth]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    if (location.pathname === '/dashboard') {
      fetchDashboardData();
    }
  }, [location.pathname, fetchDashboardData]);

  useEffect(() => {
    const handleFocus = () => {
      fetchDashboardData();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchDashboardData]);

  const getDisplayName = () => {
    if (user?.firstName) {
      return user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1).toLowerCase();
    }
    if (user?.email) {
      const emailName = user.email.split('@')[0];
      return emailName.charAt(0).toUpperCase() + emailName.slice(1).toLowerCase();
    }
    return 'there';
  };

  const displayName = getDisplayName();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className={`dashboard-wrapper ${isLoading ? 'loading' : ''}`}>
      <div className="dashboard-header">
        <div className="header-content">
        <div className="header-left">
            <h1>Dashboard</h1>
            <p className="header-subtitle">Welcome back, {displayName}</p>
        </div>
        <div className="header-right">
            <button onClick={handleLogout} className="logout-button-header">
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card blue-card">
            <div className="stat-icon blue">
              <Package size={24} />
            </div>
            <div className="stat-content">
                <div className="stat-value">{stats.totalItems}</div>
              <div className="stat-label stat-label-total-items">Total Items</div>
              <div className="stat-change positive">
                <ArrowUpRight size={12} />
                <span>All items</span>
              </div>
            </div>
          </div>

          <div className="stat-card orange-card">
            <div className="stat-icon orange">
              <AlertTriangle size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.lowStockItems}</div>
              <div className="stat-label stat-label-low-stock">Low Stock</div>
              <div className="stat-change negative">
                <ArrowDownRight size={12} />
                <span>Needs attention</span>
              </div>
            </div>
          </div>

          <div className="stat-card highlight gradient-card">
            <div className="stat-icon gradient">
              <DollarSign size={24} />
              </div>
            <div className="stat-content">
              <div className="stat-value">{formatCurrency(stats.totalRevenue)}</div>
              <div className="stat-label stat-label-total-revenue">Total Revenue</div>
              <div className="stat-change positive">
                <TrendingUp size={12} />
                <span>All time</span>
              </div>
              </div>
            </div>
          </div>

        <div className="content-grid">
          <div className="activity-card">
            <div className="card-header">
              <div className="card-title">
                <Clock size={20} />
                <h2>Recent Activity</h2>
              </div>
              <div className="card-stats">
                <div className="inline-stat-card purple-card">
                  <div className="inline-stat-icon purple">
                    <Layers size={18} />
                  </div>
                  <div className="inline-stat-content">
                    <div className="inline-stat-value">{stats.totalCategories}</div>
                    <div className="inline-stat-label">Categories</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="activity-list">
              {stats.recentItems.length > 0 ? (
                stats.recentItems.map((item, index) => (
                  <div key={item.id || index} className="activity-item">
                    <div className="activity-icon">
                      <Plus size={16} />
                    </div>
                    <div className="activity-content">
                      <div className="activity-text">
                        <span className="activity-action">Added</span>
                        <span className="activity-name">{item.name}</span>
                      </div>
                      <div className="activity-meta">
                        <span className="activity-time">{formatDate(item.createdAt)}</span>
                        <span className="activity-stock">Stock: {item.currentStock}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">No recent items added</div>
              )}
            </div>
          </div>

          <div className="sales-card">
            <div className="card-header">
              <div className="card-title">
                <ShoppingCart size={20} />
                <h2>Recent Sales</h2>
              </div>
              <div className="card-stats">
                <div className="inline-stat-card green-card">
                  <div className="inline-stat-icon green">
                    <ShoppingCart size={18} />
                  </div>
                  <div className="inline-stat-content">
                    <div className="inline-stat-value">{stats.totalSales}</div>
                    <div className="inline-stat-label">Total Sales</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="sales-list">
              {stats.recentSales.length > 0 ? (
                stats.recentSales.map((sale, index) => (
                  <div key={sale.id || index} className="sales-item">
                    <div className="sales-info">
                      <div className="sales-item-name">
                        {sale.items && sale.items.length > 0 
                          ? sale.items.map(item => item.itemName || item.name).join(', ')
                          : 'Sale #' + (sale.id || index + 1)
                        }
                      </div>
                      <div className="sales-meta">
                        <span className="sales-time">{formatDate(sale.createdAt || sale.date)}</span>
                        {sale.quantity && (
                          <span className="sales-quantity">Qty: {sale.quantity}</span>
                        )}
                      </div>
                    </div>
                    <div className="sales-amount">
                      {formatCurrency(sale.totalAmount || sale.amount || 0)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">No recent sales</div>
              )}
            </div>
          </div>
        </div>

        <div className="sales-chart-card">
          <div className="card-header">
            <div className="card-title">
              <BarChart3 size={20} />
              <h2>Monthly Sales</h2>
            </div>
          </div>
          <div className="chart-container">
            {stats.monthlySales.length > 0 ? (
              <>
                <div className="chart-wrapper">
                  <div className="chart-y-axis">
                    {(() => {
                      const maxValue = Math.max(...stats.monthlySales.map(m => m.total));
                      const roundedMax = Math.ceil(maxValue * 1.1);
                      const steps = 5;
                      const stepValue = roundedMax / steps;
                      const scaleValues = [];
                      
                      for (let i = steps; i >= 0; i--) {
                        scaleValues.push(Math.round(stepValue * i));
                      }
                      
                      return scaleValues.map((value, index) => (
                        <div key={index} className="y-axis-label">
                          {formatCurrency(value)}
                        </div>
                      ));
                    })()}
                  </div>
                  <div className="chart-bars-container">
                    <div className="chart-grid-lines">
                      {(() => {
                        const lines = 5;
                        const gridLines = [];
                        for (let i = 0; i <= lines; i++) {
                          gridLines.push(
                            <div key={i} className="grid-line" style={{ bottom: `${(i / lines) * 100}%` }}></div>
                          );
                        }
                        return gridLines;
                      })()}
                    </div>
                    <div className="chart-bars">
                      {stats.monthlySales.map((monthData, index) => {
                        const maxValue = Math.max(...stats.monthlySales.map(m => m.total));
                        const roundedMax = Math.ceil(maxValue * 1.1);
                        const heightPercentage = roundedMax > 0 ? (monthData.total / roundedMax) * 100 : 0;
                        
                        return (
                          <div key={monthData.monthKey} className="chart-bar-wrapper">
                            <div className="chart-bar-container">
                              <div 
                                className="chart-bar"
                                style={{ height: `${heightPercentage}%` }}
                                title={formatCurrency(monthData.total)}
                              >
                                <span className="chart-bar-value">{formatCurrency(monthData.total)}</span>
                              </div>
                            </div>
                            <div className="chart-bar-label">{monthData.month}</div>
                            <div className="chart-bar-count">{monthData.count} sales</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="chart-legend">
                  <div className="legend-item">
                    <span className="legend-color"></span>
                    <span>Total Revenue per Month</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="empty-state">No sales data available</div>
            )}
          </div>
        </div>

        <div className="quick-stats-section">
          <div className="quick-stat">
            <div className="quick-stat-label">Items Added This Month</div>
            <div className="quick-stat-value">
              {stats.recentItems.filter(item => {
                const itemDate = new Date(item.createdAt);
                const now = new Date();
                return itemDate.getMonth() === now.getMonth() && 
                       itemDate.getFullYear() === now.getFullYear();
              }).length}
            </div>
          </div>
          <div className="quick-stat">
            <div className="quick-stat-label">Average Stock Level</div>
            <div className="quick-stat-value">
              {stats.totalItems > 0 
                ? Math.round(
                    stats.recentItems.reduce((sum, item) => sum + (item.currentStock || 0), 0) / 
                    Math.min(stats.recentItems.length, stats.totalItems)
                  )
                : 0
              }
            </div>
          </div>
          <div className="quick-stat">
            <div className="quick-stat-label">Sales This Month</div>
            <div className="quick-stat-value">
              {stats.recentSales.filter(sale => {
                const saleDate = new Date(sale.createdAt || sale.date);
                const now = new Date();
                return saleDate.getMonth() === now.getMonth() && 
                       saleDate.getFullYear() === now.getFullYear();
              }).length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
