import React, { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Users from './Users';
import Products from './Products';
import Orders from './Orders';
import Categories from './Categories';
import Analytics from './Analytics';
import Settings from './Settings';
import './AdminDashboard.css';

const DashboardLayout = () => {
  const [activePage, setActivePage] = useState('dashboard');

  const renderContent = () => {
    switch (activePage) {
      case 'users':
        return <Users />;
      case 'products':
        return <Products />;
      case 'orders':
        return <Orders />;
      case 'categories':
        return <Categories />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="d-flex vh-100">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-grow-1 d-flex flex-column" style={{overflow: 'hidden'}}>
        <Navbar />
        <main className="flex-grow-1" style={{overflowY: 'auto'}}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   MINI BAR CHART (no external dep)
───────────────────────────────────────────────────────────── */
const SalesChart = () => {
  const months   = ['Jan','Feb','Mar','Apr','May','Jun','Jul'];
  const current  = [55, 72, 60, 85, 70, 92, 78];
  const previous = [40, 55, 48, 65, 52, 70, 60];
  const max = Math.max(...current, ...previous);
  const H = 180;

  return (
    <>
      <div className="chart-area">
        <div className="chart-y-lines">
          {[0,1,2,3,4].map(i => <div key={i} className="chart-y-line" />)}
        </div>
        {months.map((m, i) => (
          <div key={m} className="chart-bar-group">
            <div className="chart-bars">
              <div
                className="cbar primary"
                style={{ height: `${(current[i] / max) * H}px` }}
                title={`This year: $${current[i]}k`}
              />
              <div
                className="cbar secondary"
                style={{ height: `${(previous[i] / max) * H}px` }}
                title={`Last year: $${previous[i]}k`}
              />
            </div>
            <span className="chart-label">{m}</span>
          </div>
        ))}
      </div>
      <div className="chart-legend">
        <div className="legend-item"><span className="legend-dot primary" />This year</div>
        <div className="legend-item"><span className="legend-dot secondary" />Last year</div>
      </div>
    </>
  );
};

/* ─────────────────────────────────────────────────────────────
   DASHBOARD PAGE
───────────────────────────────────────────────────────────── */
const Dashboard = () => {

  const stats = [
    { label: 'Total Users',    value: '1,234', change: '+8.2%',  up: true,  icon: 'bi-people',    color: 'blue'  },
    { label: 'Total Products', value: '567',   change: '+3.1%',  up: true,  icon: 'bi-box-seam',  color: 'teal'  },
    { label: 'Total Orders',   value: '892',   change: '-1.4%',  up: false, icon: 'bi-receipt',   color: 'amber' },
    { label: 'Revenue',        value: '$45,231',change: '+12.5%',up: true,  icon: 'bi-cash-coin', color: 'rose'  },
  ];

  const activities = [
    { color: 'blue',  icon: 'bi-person-plus', title: 'New user registered', sub: 'Lucas Martin joined',        time: '2 min ago'  },
    { color: 'teal',  icon: 'bi-receipt',     title: 'New order received',  sub: 'Order #ORD005 — $349.99',    time: '15 min ago' },
    { color: 'amber', icon: 'bi-exclamation', title: 'Low stock alert',     sub: '"AirMax Pro" — 3 units left', time: '1h ago'     },
  ];

  const orders = [
    { id: '#ORD001', customer: 'John Doe',    initials: 'JD', amount: '$299.99', status: 'Completed', date: '2026-04-06' },
    { id: '#ORD002', customer: 'Jane Smith',  initials: 'JS', amount: '$599.99', status: 'Pending',   date: '2026-04-07' },
    { id: '#ORD003', customer: 'Bob Wilson',  initials: 'BW', amount: '$199.99', status: 'Shipped',   date: '2026-04-07' },
    { id: '#ORD004', customer: 'Alice Brown', initials: 'AB', amount: '$799.99', status: 'Completed', date: '2026-04-05' },
  ];

  const statusKey = { Completed: 'completed', Pending: 'pending', Shipped: 'shipped' };

  return (
    <div className="container-fluid p-4 dashboard-container">

      {/* ── Header ─────────────────────────────── */}
      <div className="mb-4">
        <h1 className="h3 fw-bold mb-1" style={{ color: '#0f172a', letterSpacing: '-0.03em' }}>Dashboard</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
          Welcome back, Admin! Here's what's happening in your store today.
        </p>
      </div>

      {/* ── Stats ──────────────────────────────── */}
      <div className="row mb-4">
        {stats.map((s, idx) => (
          <div key={idx} className="col-lg-3 col-md-6 mb-3">
            <div className="stat-card">
              <div className={`stat-card-icon ${s.color}`}>
                <i className={`bi ${s.icon}`} />
              </div>
              <div className="stat-card-label">{s.label}</div>
              <div className="stat-card-value">{s.value}</div>
              <div className="stat-card-footer">
                <span className={`stat-badge ${s.up ? 'up' : 'down'}`}>
                  <i className={`bi bi-arrow-${s.up ? 'up' : 'down'}-short`} />
                  {s.change}
                </span>
                vs last month
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Chart + Activities ──────────────────── */}
      <div className="row mb-4">

        {/* Sales chart */}
        <div className="col-lg-8 mb-3">
          <div className="card border-0">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Sales Overview</h5>
              <span style={{
                fontSize: '0.72rem', fontWeight: 600, padding: '4px 12px',
                background: '#eff6ff', color: '#2563eb',
                borderRadius: 20, cursor: 'pointer'
              }}>Export</span>
            </div>
            <div className="card-body">
              <SalesChart />
            </div>
          </div>
        </div>

        {/* Recent activities */}
        <div className="col-lg-4 mb-3">
          <div className="card border-0 h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Recent Activities</h5>
              <span style={{
                fontSize: '0.72rem', fontWeight: 600, padding: '4px 12px',
                background: '#f1f5f9', color: '#64748b',
                borderRadius: 20, cursor: 'pointer'
              }}>View all</span>
            </div>
            <div className="card-body" style={{ padding: '0 1.25rem' }}>
              {activities.map((a, i) => (
                <div key={i} className="activity-item">
                  <div className={`activity-dot ${a.color}`}>
                    <i className={`bi ${a.icon}`} />
                  </div>
                  <div>
                    <div className="activity-title">{a.title}</div>
                    <div className="activity-sub">{a.sub}</div>
                    <div className="activity-time">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Recent Orders ───────────────────────── */}
      <div className="card border-0">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Recent Orders</h5>
          <span style={{
            fontSize: '0.72rem', fontWeight: 600, padding: '4px 12px',
            background: '#eff6ff', color: '#2563eb',
            borderRadius: 20, cursor: 'pointer'
          }}>View all orders</span>
        </div>
        <div className="table-responsive">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o, idx) => (
                <tr key={idx}>
                  <td><span className="td-id">{o.id}</span></td>
                  <td>
                    <span className="td-customer">
                      <span className="customer-avatar">{o.initials}</span>
                      {o.customer}
                    </span>
                  </td>
                  <td><span className="td-amount">{o.amount}</span></td>
                  <td><span className={`status-badge ${statusKey[o.status]}`}>{o.status}</span></td>
                  <td style={{ color: '#64748b', fontSize: '0.8125rem' }}>{o.date}</td>
                  <td><button className="btn-view">View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default DashboardLayout;
