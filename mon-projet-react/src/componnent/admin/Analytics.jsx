import React, { useState } from 'react';

const Analytics = () => {
  const [analyticsData] = useState({
    revenue: { current: '$45,231', growth: '+12.5%' },
    orders: { current: '892', growth: '+8.2%' },
    customers: { current: '1,234', growth: '+5.1%' },
    conversionRate: { current: '3.24%', growth: '+0.5%' },
    topProducts: [
      { name: 'Laptop Pro', sales: 156, revenue: '$156,000' },
      { name: 'Wireless Mouse', sales: 234, revenue: '$6,786' },
      { name: 'USB Cable', sales: 312, revenue: '$2,808' },
      { name: 'Monitor 27"', sales: 89, revenue: '$31,061' },
    ],
    monthlyRevenue: [
      { month: 'Jan', revenue: 32000 },
      { month: 'Feb', revenue: 38000 },
      { month: 'Mar', revenue: 35000 },
      { month: 'Apr', revenue: 42000 },
    ],
  });

  const styles = {
    page: {
      minHeight: '100vh',
      background: '#0b1220',
      color: '#e5e7eb',
      padding: '24px',
      fontFamily: 'system-ui'
    },
    header: {
      marginBottom: 28
    },
    title: {
      fontSize: 28,
      fontWeight: 800
    },
    subtitle: {
      color: '#94a3b8',
      marginTop: 5
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: 16
    },
    card: {
      background: '#111827',
      border: '1px solid #1f2937',
      borderRadius: 16,
      padding: 18,
      boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
      transition: '0.3s'
    },
    metricValue: {
      fontSize: 22,
      fontWeight: 800,
      marginTop: 6
    },
    growth: {
      color: '#22c55e',
      fontSize: 13,
      marginTop: 6
    },
    section: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: 16,
      marginTop: 20
    }
  };

  const maxRevenue = Math.max(...analyticsData.monthlyRevenue.map(m => m.revenue));

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.title}>📊 Analytics Dashboard</div>
        <div style={styles.subtitle}>Track your business performance</div>
      </div>

      {/* STATS */}
      <div style={styles.grid}>
        {[
          { label: 'Revenue', value: analyticsData.revenue.current, growth: analyticsData.revenue.growth, icon: '💰' },
          { label: 'Orders', value: analyticsData.orders.current, growth: analyticsData.orders.growth, icon: '🧾' },
          { label: 'Customers', value: analyticsData.customers.current, growth: analyticsData.customers.growth, icon: '👥' },
          { label: 'Conversion', value: analyticsData.conversionRate.current, growth: analyticsData.conversionRate.growth, icon: '📈' },
        ].map((m, i) => (
          <div
            key={i}
            style={styles.card}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div>{m.icon} {m.label}</div>
            <div style={styles.metricValue}>{m.value}</div>
            <div style={styles.growth}>⬆ {m.growth}</div>
          </div>
        ))}
      </div>

      {/* SECTION */}
      <div style={styles.section}>

        {/* MONTHLY REVENUE */}
        <div style={styles.card}>
          <h3>📊 Monthly Revenue</h3>

          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-around',
            height: 240,
            marginTop: 20,
            gap: 10
          }}>
            {analyticsData.monthlyRevenue.map((m, i) => {
              const height = (m.revenue / maxRevenue) * 180;

              return (
                <div key={i} style={{ textAlign: 'center', flex: 1 }}>

                  <div style={{
                    fontSize: 11,
                    marginBottom: 6,
                    color: '#22c55e',
                    fontWeight: 600
                  }}>
                    ${(m.revenue / 1000).toFixed(0)}k
                  </div>

                  <div style={{
                    height: height < 20 ? 20 : height,
                    width: 28,
                    margin: '0 auto',
                    background: 'linear-gradient(180deg,#6366f1,#3b82f6)',
                    borderRadius: '6px 6px 0 0',
                    boxShadow: '0 6px 12px rgba(59,130,246,0.3)',
                    transition: '0.3s'
                  }}></div>

                  <div style={{
                    fontSize: 12,
                    marginTop: 8,
                    color: '#94a3b8'
                  }}>
                    {m.month}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* TOP PRODUCTS */}
        <div style={styles.card}>
          <h3>🏆 Top Products</h3>

          {analyticsData.topProducts.map((p, i) => (
            <div key={i} style={{
              padding: 10,
              borderBottom: i !== analyticsData.topProducts.length - 1
                ? '1px solid #1f2937'
                : 'none'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{p.name}</strong>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>{p.sales} sales</span>
              </div>

              <div style={{
                height: 6,
                background: '#1f2937',
                borderRadius: 10,
                marginTop: 8
              }}>
                <div style={{
                  width: `${(p.sales / 312) * 100}%`,
                  height: '100%',
                  background: '#3b82f6',
                  borderRadius: 10
                }}></div>
              </div>

              <div style={{ fontSize: 12, marginTop: 5, color: '#94a3b8' }}>
                Revenue: <b>{p.revenue}</b>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Analytics;