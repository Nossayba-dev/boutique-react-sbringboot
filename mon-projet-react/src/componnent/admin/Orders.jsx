import React, { useState } from 'react';

const Orders = () => {
  const [darkMode] = useState(true);

  const [orders] = useState([
    { id: 'ORD001', customer: 'John Doe', amount: '$299.99', items: 3, status: 'Completed', date: '2026-04-06', priority: 'Normal' },
    { id: 'ORD002', customer: 'Jane Smith', amount: '$599.99', items: 5, status: 'Pending', date: '2026-04-07', priority: 'High' },
    { id: 'ORD003', customer: 'Bob Wilson', amount: '$199.99', items: 2, status: 'Shipped', date: '2026-04-07', priority: 'Normal' },
    { id: 'ORD004', customer: 'Alice Brown', amount: '$799.99', items: 8, status: 'Completed', date: '2026-04-05', priority: 'Low' },
    { id: 'ORD005', customer: 'Charlie Davis', amount: '$449.49', items: 4, status: 'Processing', date: '2026-04-07', priority: 'High' },
    { id: 'ORD006', customer: 'Emma Wilson', amount: '$349.99', items: 3, status: 'Delivered', date: '2026-04-04', priority: 'Normal' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const statuses = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Completed'];

  const filteredOrders = orders.filter(order => {
    return (
      (order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus === 'All' || order.status === filterStatus)
    );
  });

  const statusIcon = (status) => {
    switch (status) {
      case 'Completed':
      case 'Delivered':
        return 'bi-check-circle-fill';
      case 'Pending':
        return 'bi-hourglass-split';
      case 'Processing':
        return 'bi-gear-fill';
      case 'Shipped':
        return 'bi-truck';
      default:
        return 'bi-question-circle';
    }
  };

  const priorityIcon = (p) => {
    switch (p) {
      case 'High':
        return 'bi-exclamation-triangle-fill';
      case 'Normal':
        return 'bi-dash-circle';
      default:
        return 'bi-arrow-down-circle';
    }
  };

  const statusClass = (status) => {
    switch (status) {
      case 'Completed':
      case 'Delivered':
        return 'st-success';
      case 'Pending':
        return 'st-warning';
      case 'Processing':
        return 'st-info';
      case 'Shipped':
        return 'st-purple';
      default:
        return 'st-muted';
    }
  };

  const priorityClass = (p) => {
    switch (p) {
      case 'High':
        return 'pr-high';
      case 'Normal':
        return 'pr-normal';
      default:
        return 'pr-low';
    }
  };

  return (
    <>
      {/* STYLE + DARK MODE */}
      <style>{`
        :root {
          --bg: #0f172a;
          --card: #1e293b;
          --text: #e2e8f0;
          --muted: #94a3b8;
          --border: #334155;
          --primary: #6366f1;
        }

        body { background: var(--bg); }

        .page {
          padding: 24px;
          font-family: 'DM Sans', sans-serif;
          color: var(--text);
        }

        .header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .title { font-size: 26px; font-weight: 800; }
        .subtitle { color: var(--muted); font-size: 14px; }

        .grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 16px;
        }

        @media (max-width: 900px) {
          .grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 600px) {
          .grid { grid-template-columns: 1fr; }
        }

        .card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 14px;
        }

        .input, .select {
          width: 100%;
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: var(--card);
          color: var(--text);
        }

        table {
          width: 100%;
          min-width: 800px;
          border-collapse: collapse;
        }

        th, td {
          padding: 14px;
          border-bottom: 1px solid var(--border);
        }

        th {
          font-size: 11px;
          color: var(--muted);
          text-transform: uppercase;
        }

        tr:hover {
          background: rgba(99,102,241,0.08);
        }

        .badge {
          padding: 5px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .st-success { background: rgba(34,197,94,0.15); color: #22c55e; }
        .st-warning { background: rgba(245,158,11,0.15); color: #f59e0b; }
        .st-info { background: rgba(59,130,246,0.15); color: #60a5fa; }
        .st-purple { background: rgba(168,85,247,0.15); color: #a855f7; }

        .pr-high { background: rgba(239,68,68,0.15); color: #ef4444; }
        .pr-normal { background: rgba(148,163,184,0.15); color: #94a3b8; }
        .pr-low { background: rgba(34,197,94,0.10); color: #22c55e; }
      `}</style>

      <div className="page">

        {/* HEADER */}
        <div className="header">
          <div>
            <div className="title">
              <i className="bi bi-box-seam me-2"></i>
              Orders Management
            </div>
            <div className="subtitle">Track and manage all orders</div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid">
          <div className="card"><i className="bi bi-list-ul me-2"></i>Total: {orders.length}</div>
          <div className="card"><i className="bi bi-hourglass me-2"></i>Pending: {orders.filter(o => o.status === 'Pending').length}</div>
          <div className="card"><i className="bi bi-truck me-2"></i>Shipped: {orders.filter(o => o.status === 'Shipped').length}</div>
          <div className="card"><i className="bi bi-check-circle me-2"></i>Completed: {orders.filter(o => o.status === 'Completed').length}</div>
        </div>

        {/* FILTERS */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="grid" style={{ gridTemplateColumns: "2fr 1fr" }}>
            <div style={{ position: "relative" }}>
              <i className="bi bi-search" style={{ position: "absolute", left: 12, top: 12, color: "#94a3b8" }}></i>
              <input
                className="input"
                style={{ paddingLeft: 35 }}
                placeholder="Search orders..."
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select className="select" onChange={(e) => setFilterStatus(e.target.value)}>
              {statuses.map(s => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className="card">
          <table>
            <thead>
              <tr>
                <th><i className="bi bi-hash"></i> Order</th>
                <th><i className="bi bi-person"></i> Customer</th>
                <th><i className="bi bi-currency-dollar"></i> Amount</th>
                <th><i className="bi bi-box"></i> Items</th>
                <th><i className="bi bi-info-circle"></i> Status</th>
                <th><i className="bi bi-flag"></i> Priority</th>
                <th><i className="bi bi-calendar"></i> Date</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.amount}</td>
                  <td>{order.items}</td>

                  <td>
                    <span className={`badge ${statusClass(order.status)}`}>
                      <i className={`bi ${statusIcon(order.status)}`}></i>
                      {order.status}
                    </span>
                  </td>

                  <td>
                    <span className={`badge ${priorityClass(order.priority)}`}>
                      <i className={`bi ${priorityIcon(order.priority)}`}></i>
                      {order.priority}
                    </span>
                  </td>

                  <td>
                    <i className="bi bi-clock me-1"></i>
                    {order.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </>
  );
};

export default Orders;