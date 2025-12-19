import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, LogOut, User, TrendingDown, AlertTriangle, CheckCircle, Calendar, BarChart3 } from 'lucide-react';
import { api } from './utils/api';

export default function Forecasts() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [forecasts, setForecasts] = useState([]);
  const [filteredForecasts, setFilteredForecasts] = useState([]);
  const [filter, setFilter] = useState('all'); // all, atRisk, willRunOut, lowRisk
  const [forecastDays, setForecastDays] = useState(30);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    loadForecasts();
  }, [forecastDays]);

  useEffect(() => {
    filterForecasts();
  }, [forecasts, filter]);

  const loadForecasts = async () => {
    try {
      setIsLoading(true);
      const data = await api.getForecasts(forecastDays);
      setForecasts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filterForecasts = () => {
    let filtered = [...forecasts];

    switch (filter) {
      case 'atRisk':
        filtered = filtered.filter(f => f.risk.willRunOut || f.risk.willRunOutBeforeMonthEnd);
        break;
      case 'willRunOut':
        filtered = filtered.filter(f => f.risk.willRunOutBeforeMonthEnd);
        break;
      case 'lowRisk':
        filtered = filtered.filter(f => 
          !f.risk.willRunOut && 
          !f.risk.willRunOutBeforeMonthEnd && 
          !f.risk.isLowRisk &&
          f.item.currentStock > f.item.minStock
        );
        break;
      default:
        break;
    }

    filtered.sort((a, b) => {
      if (a.risk.willRunOutBeforeMonthEnd && !b.risk.willRunOutBeforeMonthEnd) return -1;
      if (!a.risk.willRunOutBeforeMonthEnd && b.risk.willRunOutBeforeMonthEnd) return 1;
      if (a.risk.willRunOut && !b.risk.willRunOut) return -1;
      if (!a.risk.willRunOut && b.risk.willRunOut) return 1;
      return a.projections.projectedStockEndOfMonth - b.projections.projectedStockEndOfMonth;
    });

    setFilteredForecasts(filtered);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getRiskColor = (forecast) => {
    if (forecast.risk.willRunOutBeforeMonthEnd) return '#ef4444';
    if (forecast.risk.willRunOut) return '#f59e0b';
    if (forecast.risk.isLowRisk) return '#10b981';
    return '#3b82f6';
  };

  const getRiskLabel = (forecast) => {
    if (forecast.risk.willRunOutBeforeMonthEnd) return 'Critical';
    if (forecast.risk.willRunOut) return 'At Risk';
    if (forecast.risk.isLowRisk) return 'Low Risk';
    return 'Normal';
  };

  const atRiskCount = forecasts.filter(f => f.risk.willRunOut || f.risk.willRunOutBeforeMonthEnd).length;
  const willRunOutCount = forecasts.filter(f => f.risk.willRunOutBeforeMonthEnd).length;

  return (
    <div className={`forecasts-wrapper ${isLoading ? 'loading' : ''}`}>
      <div className="forecasts-container">
        <div className="forecasts-header">
          <div className="header-content">
          <div className="header-left">
            <h1>Stock Forecasts</h1>
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
              <div className="stat-value">{forecasts.length}</div>
              <div className="stat-label stat-label-total-items">Total Items</div>
            </div>
          </div>
          <div className="stat-card orange-card">
            <div className="stat-icon orange">
              <AlertTriangle size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{atRiskCount}</div>
              <div className="stat-label stat-label-low-stock">At Risk</div>
            </div>
          </div>
          <div className="stat-card red-card">
            <div className="stat-icon red">
              <TrendingDown size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{willRunOutCount}</div>
              <div className="stat-label stat-label-low-stock">Will Run Out</div>
            </div>
          </div>
          <div className="stat-card green-card">
            <div className="stat-icon green">
              <Calendar size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{forecastDays}</div>
              <div className="stat-label stat-label-total-sales">Forecast Days</div>
            </div>
          </div>
        </div>

        <div className="controls-bar">
          <div className="filters">
            <button
              onClick={() => setFilter('all')}
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            >
              All Items
            </button>
            <button
              onClick={() => setFilter('atRisk')}
              className={`filter-btn ${filter === 'atRisk' ? 'active' : ''}`}
            >
              At Risk
            </button>
            <button
              onClick={() => setFilter('willRunOut')}
              className={`filter-btn ${filter === 'willRunOut' ? 'active' : ''}`}
            >
              Will Run Out
            </button>
            <button
              onClick={() => setFilter('lowRisk')}
              className={`filter-btn ${filter === 'lowRisk' ? 'active' : ''}`}
            >
              Low Risk
            </button>
          </div>
          <div className="forecast-period">
            <label>Forecast Period:</label>
            <select
              value={forecastDays}
              onChange={(e) => setForecastDays(parseInt(e.target.value))}
              className="period-select"
            >
              <option value="7">7 days</option>
              <option value="14">14 days</option>
              <option value="30">30 days</option>
              <option value="60">60 days</option>
              <option value="90">90 days</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="error-banner">
            {error}
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        <div className="forecasts-list">
          {filteredForecasts.length === 0 ? (
            <div className="empty-state">
              <p>No forecasts match your filter criteria</p>
            </div>
          ) : (
            filteredForecasts.map((forecast) => {
              const riskColor = getRiskColor(forecast);
              const riskLabel = getRiskLabel(forecast);
              const stockPercentage = forecast.item.currentStock > 0
                ? (forecast.projections.projectedStockEndOfMonth / forecast.item.currentStock) * 100
                : 0;

              return (
                <div key={forecast.item.id} className="forecast-card" style={{ borderLeftColor: riskColor }}>
                  <div className="forecast-header">
                    <div className="item-info">
                      <h3>{forecast.item.name}</h3>
                      <div className="item-meta">
                        {forecast.item.sku && <span className="sku">SKU: {forecast.item.sku}</span>}
                        <span className="category">{forecast.item.category?.name}</span>
                      </div>
                    </div>
                    <div className="risk-badge" style={{ backgroundColor: `${riskColor}20`, color: riskColor }}>
                      {riskLabel}
                    </div>
                  </div>

                  <div className="forecast-content">
                    <div className="stock-info">
                      <div className="stock-item">
                        <span className="label">Current Stock:</span>
                        <span className="value">{forecast.item.currentStock}</span>
                      </div>
                      <div className="stock-item">
                        <span className="label">Min Stock:</span>
                        <span className="value">{forecast.item.minStock}</span>
                      </div>
                      <div className="stock-item">
                        <span className="label">End of Month Projection:</span>
                        <span className={`value ${forecast.risk.willRunOut ? 'warning' : ''}`}>
                          {forecast.projections.projectedStockEndOfMonth}
                        </span>
                      </div>
                      <div className="stock-item">
                        <span className="label">Projected ({forecastDays} days):</span>
                        <span className={`value ${forecast.projections.projectedStock < 0 ? 'danger' : ''}`}>
                          {forecast.projections.projectedStock}
                        </span>
                      </div>
                    </div>

                    <div className="projection-bar">
                      <div className="bar-label">
                        <span>Stock Projection</span>
                        <span>{Math.round(stockPercentage)}% remaining</span>
                      </div>
                      <div className="bar-container">
                        <div
                          className="bar-fill"
                          style={{
                            width: `${Math.min(100, Math.max(0, stockPercentage))}%`,
                            backgroundColor: riskColor
                          }}
                        />
                      </div>
                    </div>

                    <div className="forecast-details">
                      <div className="detail-item">
                        <TrendingDown size={16} />
                        <span>Avg Daily Sales: <strong>{forecast.historicalData.averageDailySales}</strong></span>
                      </div>
                      <div className="detail-item">
                        <Calendar size={16} />
                        <span>
                          {forecast.projections.daysUntilOutOfStock !== null
                            ? `Runs out in: ${forecast.projections.daysUntilOutOfStock} days`
                            : 'No sales data'}
                        </span>
                      </div>
                      <div className="detail-item">
                        <BarChart3 size={16} />
                        <span>Total Sold (30d): <strong>{forecast.historicalData.totalQuantitySold}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .forecasts-wrapper {
          min-height: 100vh;
          background: #e2e8f0;
          background-image: 
            radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.05) 0%, transparent 50%);
          font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
          animation: fadeIn 0.6s ease-in-out;
          position: relative;
        }

        .forecasts-wrapper.loading {
          opacity: 0.7;
          pointer-events: none;
        }

        .forecasts-wrapper.loading::after {
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

        .forecasts-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .forecasts-header {
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

        .stat-card.orange-card::before {
          background: #f97316;
        }

        .stat-card.red-card::before {
          background: #ef4444;
        }

        .stat-card.green-card::before {
          background: #22c55e;
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

        .stat-icon.red {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: #ffffff;
        }

        .stat-icon.green {
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
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
        .stat-label-total-sales {
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
          gap: 10px;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 10px 20px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #000000;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .filter-btn:hover {
          background: #f8fafc;
          border-color: #94a3b8;
        }

        .filter-btn.active {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          border-color: transparent;
          color: #ffffff;
        }

        .forecast-period {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #000000;
          font-weight: 500;
        }

        .period-select {
          padding: 10px 15px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #000000;
          border-radius: 8px;
          cursor: pointer;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
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

        .forecasts-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin: 0 2.5rem 2rem 2.5rem;
        }

        .forecast-card {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-left: 4px solid;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .forecast-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .item-info h3 {
          color: #000000;
          font-size: 1.3em;
          margin-bottom: 8px;
          font-weight: 700;
        }

        .item-meta {
          display: flex;
          gap: 15px;
          color: #64748b;
          font-size: 0.9em;
          font-weight: 500;
        }

        .risk-badge {
          padding: 6px 16px;
          border-radius: 20px;
          font-weight: 700;
          font-size: 0.9em;
          color: #ffffff;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .forecast-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .stock-info {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }

        .stock-item {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .stock-item .label {
          color: #64748b;
          font-size: 0.9em;
          font-weight: 500;
        }

        .stock-item .value {
          color: #000000;
          font-size: 1.3em;
          font-weight: 700;
        }

        .stock-item .value.warning {
          color: #f97316;
        }

        .stock-item .value.danger {
          color: #dc2626;
        }

        .projection-bar {
          margin-top: 10px;
        }

        .bar-label {
          display: flex;
          justify-content: space-between;
          color: #000000;
          margin-bottom: 8px;
          font-size: 0.9em;
          font-weight: 600;
        }

        .bar-container {
          height: 12px;
          background: #e2e8f0;
          border-radius: 6px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          transition: width 0.3s ease;
          border-radius: 6px;
        }

        .forecast-details {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          padding-top: 15px;
          border-top: 1px solid #cbd5e1;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #000000;
          font-size: 0.9em;
          font-weight: 500;
        }

        .detail-item strong {
          color: #000000;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #64748b;
          font-size: 1.1em;
          background: #ffffff;
          border-radius: 12px;
          border: 1px solid #cbd5e1;
        }
      `}</style>
    </div>
  );
}

