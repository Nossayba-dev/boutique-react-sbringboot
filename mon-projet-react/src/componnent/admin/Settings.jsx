import React, { useState } from 'react';

const Settings = () => {
  const [settings, setSettings] = useState({
    storeName: 'My Store',
    storeEmail: 'contact@mystore.com',
    storePhone: '+1 234-567-8900',
    address: '123 Business Street, City, Country',
    timezone: 'UTC-05:00',
    currency: 'USD',
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      weeklyReport: true,
    },
    security: {
      twoFactorAuth: true,
      passwordExpiry: '90 days',
    },
  });

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const toggleNotif = (key) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key],
      },
    });
  };

  return (
    <div className="settings-root">

      <style>{`
        :root{
          --bg:#0a0f1c;
          --panel:#0f172a;
          --card:#111c33;
          --stroke:#1f2a44;
          --text:#e5e7eb;
          --muted:#94a3b8;
          --primary:#6366f1;
          --green:#22c55e;
          --red:#ef4444;
        }

        .settings-root{
          min-height:100vh;
          background: radial-gradient(circle at top, #111c33, #0a0f1c);
          color:var(--text);
          padding:28px;
          font-family: 'Inter', sans-serif;
        }

        /* HEADER */
        .header{
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:24px;
        }

        .title{
          font-size:22px;
          font-weight:800;
        }

        .subtitle{
          font-size:13px;
          color:var(--muted);
        }

        /* LAYOUT */
        .grid{
          display:grid;
          grid-template-columns:260px 1fr;
          gap:18px;
        }

        /* SIDEBAR */
        .sidebar{
          background:linear-gradient(145deg,#0f172a,#0b1220);
          border:1px solid var(--stroke);
          border-radius:16px;
          padding:14px;
        }

        .nav-item{
          display:flex;
          align-items:center;
          gap:10px;
          padding:10px 12px;
          border-radius:10px;
          color:var(--muted);
          cursor:pointer;
          transition:.2s;
        }

        .nav-item:hover{
          background:#1e293b;
          color:white;
          transform:translateX(3px);
        }

        /* CARDS */
        .card{
          background:linear-gradient(145deg,#111c33,#0d1426);
          border:1px solid var(--stroke);
          border-radius:16px;
          padding:18px;
          margin-bottom:16px;
          transition:.25s;
        }

        .card:hover{
          transform:translateY(-3px);
          box-shadow:0 10px 30px rgba(99,102,241,.15);
        }

        .section-title{
          font-size:12px;
          letter-spacing:1px;
          text-transform:uppercase;
          color:#a5b4fc;
          margin-bottom:14px;
          display:flex;
          align-items:center;
          gap:8px;
        }

        /* INPUTS */
        .input{
          width:100%;
          padding:10px 12px;
          border-radius:10px;
          border:1px solid var(--stroke);
          background:#0b1220;
          color:var(--text);
          outline:none;
          transition:.2s;
        }

        .input:focus{
          border-color:var(--primary);
          box-shadow:0 0 0 3px rgba(99,102,241,.15);
        }

        /* SWITCH */
        .switch{
          width:42px;
          height:22px;
          appearance:none;
          background:#334155;
          border-radius:20px;
          position:relative;
          cursor:pointer;
          transition:.2s;
        }

        .switch:checked{
          background:var(--primary);
        }

        .switch::before{
          content:'';
          width:18px;
          height:18px;
          background:white;
          position:absolute;
          border-radius:50%;
          top:2px;
          left:2px;
          transition:.2s;
        }

        .switch:checked::before{
          transform:translateX(20px);
        }

        /* RESPONSIVE */
        @media(max-width:900px){
          .grid{grid-template-columns:1fr;}
        }
      `}</style>

      {/* HEADER */}
      <div className="header">
        <div>
          <div className="title">
            <i className="bi bi-gear-fill" style={{ marginRight: 8, color: "#6366f1" }}></i>
            Settings Panel
          </div>
          <div className="subtitle">Manage system configuration & preferences</div>
        </div>

        <button style={{
          background:"#6366f1",
          border:"none",
          padding:"10px 14px",
          borderRadius:10,
          color:"#fff",
          fontWeight:600
        }}>
          Save Changes
        </button>
      </div>

      <div className="grid">

        {/* SIDEBAR */}
        <div className="sidebar">
          <div className="section-title">
            <i className="bi bi-sliders"></i> Navigation
          </div>

          <div className="nav-item"><i className="bi bi-gear"></i> General</div>
          <div className="nav-item"><i className="bi bi-bell"></i> Notifications</div>
          <div className="nav-item"><i className="bi bi-shield-lock"></i> Security</div>
          <div className="nav-item"><i className="bi bi-credit-card"></i> Billing</div>
        </div>

        {/* CONTENT */}
        <div>

          {/* GENERAL */}
          <div className="card">
            <div className="section-title">
              <i className="bi bi-building"></i> General Settings
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <input className="input" name="storeName" value={settings.storeName} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <input className="input" name="storeEmail" value={settings.storeEmail} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <input className="input" name="storePhone" value={settings.storePhone} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <input className="input" name="address" value={settings.address} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* NOTIFICATIONS */}
          <div className="card">
            <div className="section-title">
              <i className="bi bi-bell"></i> Notifications
            </div>

            {Object.entries(settings.notifications).map(([key, value]) => (
              <div key={key} className="d-flex justify-content-between align-items-center mb-3">
                <span style={{ color:"#cbd5e1" }}>
                  {key.replace(/([A-Z])/g, ' $1')}
                </span>

                <input
                  type="checkbox"
                  className="switch"
                  checked={value}
                  onChange={() => toggleNotif(key)}
                />
              </div>
            ))}
          </div>

          {/* SECURITY */}
          <div className="card">
            <div className="section-title">
              <i className="bi bi-shield-lock"></i> Security
            </div>

            <div className="d-flex justify-content-between mb-3">
              <span>Two Factor Authentication</span>
              <input type="checkbox" className="switch" checked={settings.security.twoFactorAuth} readOnly />
            </div>

            <input className="input" value={settings.security.passwordExpiry} readOnly />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;