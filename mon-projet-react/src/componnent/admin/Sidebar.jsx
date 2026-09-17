import React, { useState, useEffect } from 'react';

/* ═══════════════════════════════════════════════════════════
   STYLES — injected once into <head> via useEffect
═══════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css');

:root {
  --adm-bg-from:      #0f1b2d;
  --adm-bg-to:        #1a2e4a;
  --adm-width:        270px;
  --adm-collapsed:    72px;
  --adm-accent:       #4f8ef7;
  --adm-accent-soft:  rgba(79,142,247,0.15);
  --adm-accent-glow:  rgba(79,142,247,0.35);
  --adm-text:         #e8edf5;
  --adm-muted:        #7b93b4;
  --adm-divider:      rgba(255,255,255,0.07);
  --adm-hover:        rgba(255,255,255,0.06);
  --adm-ease:         0.25s cubic-bezier(0.4,0,0.2,1);
  --adm-font:         'DM Sans', sans-serif;
}

/* ── Shell ─────────────────────────────────────────────── */
.adm-sidebar {
  font-family: var(--adm-font);
  display: flex;
  flex-direction: column;
  width: var(--adm-width);
  min-height: 100vh;
  background: linear-gradient(175deg, var(--adm-bg-from) 0%, var(--adm-bg-to) 100%);
  box-shadow: 4px 0 30px rgba(0,0,0,0.35);
  position: fixed;
  left: 0; top: 0;
  z-index: 100;
  transition: width var(--adm-ease);
  overflow: hidden;
  border-right: 1px solid var(--adm-divider);
}
.adm-sidebar.collapsed { width: var(--adm-collapsed); }
.adm-sidebar::before {
  content: '';
  position: absolute;
  top: -80px; left: -60px;
  width: 240px; height: 240px;
  background: radial-gradient(circle, rgba(79,142,247,0.12) 0%, transparent 70%);
  pointer-events: none;
}

/* ── Header ────────────────────────────────────────────── */
.adm-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 16px 16px;
  border-bottom: 1px solid var(--adm-divider);
  min-height: 68px;
  flex-shrink: 0;
}
.adm-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
  overflow: hidden;
  opacity: 1;
  transition: opacity var(--adm-ease), transform var(--adm-ease);
}
.collapsed .adm-brand {
  opacity: 0;
  transform: translateX(-8px);
  pointer-events: none;
  width: 0;
}
.adm-brand-icon {
  display: flex; align-items: center; justify-content: center;
  width: 34px; height: 34px;
  background: var(--adm-accent);
  border-radius: 8px;
  color: #fff;
  font-size: 1.1rem;
  flex-shrink: 0;
  box-shadow: 0 4px 12px var(--adm-accent-glow);
}
.adm-brand-name {
  font-size: 1rem; font-weight: 700;
  color: var(--adm-text);
  letter-spacing: 0.02em;
}
.adm-brand-sub {
  font-size: 0.65rem; font-weight: 500;
  color: var(--adm-muted);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  display: block; line-height: 1; margin-top: 1px;
}

/* ── Toggle ────────────────────────────────────────────── */
.adm-toggle {
  display: flex; align-items: center; justify-content: center;
  width: 30px; height: 30px;
  background: rgba(255,255,255,0.06);
  border: 1px solid var(--adm-divider);
  border-radius: 8px;
  color: var(--adm-muted);
  cursor: pointer;
  transition: background var(--adm-ease), color var(--adm-ease), border-color var(--adm-ease);
  flex-shrink: 0;
}
.adm-toggle:hover {
  background: var(--adm-accent-soft);
  color: var(--adm-accent);
  border-color: var(--adm-accent-soft);
}
.adm-toggle i { font-size: 0.8rem; }
.collapsed .adm-toggle { margin: 0 auto; }

/* ── Section Label ─────────────────────────────────────── */
.adm-section-label {
  display: block;
  font-size: 0.6rem; font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--adm-muted);
  padding: 20px 20px 6px;
  white-space: nowrap; overflow: hidden;
  transition: opacity var(--adm-ease), height var(--adm-ease), padding var(--adm-ease);
}
.collapsed .adm-section-label { opacity: 0; height: 0; padding: 0; }

/* ── Nav List ──────────────────────────────────────────── */
.adm-nav {
  list-style: none;
  margin: 0;
  padding: 8px 10px 0;
  flex: 1;
  overflow-y: auto; overflow-x: hidden;
  scrollbar-width: none;
}
.adm-nav::-webkit-scrollbar { display: none; }
.adm-nav li { margin-bottom: 2px; }

/* ── Nav Button ────────────────────────────────────────── */
.adm-nav-btn {
  display: flex; align-items: center; gap: 12px;
  width: 100%;
  padding: 10px 12px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: var(--adm-muted);
  cursor: pointer;
  text-align: left;
  font-family: var(--adm-font);
  font-size: 0.875rem; font-weight: 500;
  position: relative;
  transition: background var(--adm-ease), color var(--adm-ease), padding var(--adm-ease);
  white-space: nowrap; overflow: hidden;
}
.collapsed .adm-nav-btn { justify-content: center; padding: 10px; }
.adm-nav-btn:hover { background: var(--adm-hover); color: var(--adm-text); }
.adm-nav-btn.active { background: var(--adm-accent-soft); color: var(--adm-accent); font-weight: 600; }
.adm-nav-btn.active::before {
  content: '';
  position: absolute;
  left: 0; top: 20%;
  height: 60%; width: 3px;
  background: var(--adm-accent);
  border-radius: 0 3px 3px 0;
}

/* ── Icon ──────────────────────────────────────────────── */
.adm-icon {
  display: flex; align-items: center; justify-content: center;
  width: 32px; height: 32px;
  border-radius: 8px;
  flex-shrink: 0;
  background: rgba(255,255,255,0.04);
  font-size: 1.1rem;
  transition: background var(--adm-ease), color var(--adm-ease), box-shadow var(--adm-ease);
}
.adm-nav-btn:hover .adm-icon { background: rgba(255,255,255,0.08); }
.adm-nav-btn.active .adm-icon {
  background: var(--adm-accent);
  color: #fff;
  box-shadow: 0 4px 12px var(--adm-accent-glow);
}

/* ── Nav Label ─────────────────────────────────────────── */
.adm-nav-label {
  flex: 1;
  transition: opacity var(--adm-ease), transform var(--adm-ease);
  white-space: nowrap;
}
.collapsed .adm-nav-label { opacity: 0; transform: translateX(-6px); width: 0; overflow: hidden; }

/* ── Badge ─────────────────────────────────────────────── */
.adm-badge {
  font-size: 0.6rem; font-weight: 700;
  background: var(--adm-accent);
  color: #fff;
  border-radius: 20px;
  padding: 2px 7px;
  letter-spacing: 0.03em;
  transition: opacity var(--adm-ease);
}
.collapsed .adm-badge { opacity: 0; width: 0; padding: 0; overflow: hidden; }

/* ── Divider ───────────────────────────────────────────── */
.adm-divider { height: 1px; background: var(--adm-divider); margin: 10px 0; }

/* ── Footer ────────────────────────────────────────────── */
.adm-footer {
  padding: 12px 10px 16px;
  border-top: 1px solid var(--adm-divider);
  flex-shrink: 0;
}
.adm-user {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  margin-bottom: 8px;
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--adm-divider);
  overflow: hidden;
  transition: background var(--adm-ease);
  cursor: default;
}
.adm-user:hover { background: rgba(255,255,255,0.06); }
.collapsed .adm-user { justify-content: center; padding: 8px; }
.adm-avatar {
  width: 32px; height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--adm-accent) 0%, #7b5ea7 100%);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.75rem; font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}
.adm-user-info {
  overflow: hidden;
  transition: opacity var(--adm-ease), transform var(--adm-ease);
  white-space: nowrap;
}
.collapsed .adm-user-info { opacity: 0; transform: translateX(-6px); width: 0; }
.adm-user-name { font-size: 0.8rem; font-weight: 600; color: var(--adm-text); line-height: 1.2; }
.adm-user-role { font-size: 0.68rem; color: var(--adm-muted); font-weight: 500; }

/* ── Logout ────────────────────────────────────────────── */
.adm-logout {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%;
  padding: 9px 12px;
  background: rgba(239,68,68,0.08);
  border: 1px solid rgba(239,68,68,0.15);
  border-radius: 8px;
  color: #f87171;
  cursor: pointer;
  font-family: var(--adm-font);
  font-size: 0.85rem; font-weight: 600;
  transition: background var(--adm-ease), border-color var(--adm-ease), color var(--adm-ease);
  white-space: nowrap; overflow: hidden;
}
.adm-logout:hover {
  background: rgba(239,68,68,0.18);
  border-color: rgba(239,68,68,0.35);
  color: #fca5a5;
}
.adm-logout i { font-size: 1.1rem; flex-shrink: 0; }
.collapsed .adm-logout-label { opacity: 0; width: 0; overflow: hidden; }
`;

/* ═══════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════ */
const Sidebar = ({ activePage, setActivePage }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Inject styles once into <head>
  useEffect(() => {
    const id = 'adm-sidebar-styles';
    if (!document.getElementById(id)) {
      const tag = document.createElement('style');
      tag.id = id;
      tag.textContent = CSS;
      document.head.appendChild(tag);
    }
    return () => document.getElementById(id)?.remove();
  }, []);

  const menuItems = [
    { id: 'dashboard',  label: 'Dashboard',  icon: 'bi-speedometer2' },
    { id: 'users',      label: 'Users',       icon: 'bi-people',    badge: '24' },
    { id: 'products',   label: 'Products',    icon: 'bi-box-seam' },
    { id: 'orders',     label: 'Orders',      icon: 'bi-receipt',   badge: '5' },
    { id: 'categories', label: 'Categories',  icon: 'bi-tags' },
    { id: 'analytics',  label: 'Analytics',   icon: 'bi-bar-chart' },
    { id: 'settings',   label: 'Settings',    icon: 'bi-gear' },
  ];

  return (
    <nav className={`adm-sidebar${isCollapsed ? ' collapsed' : ''}`}>

      {/* ── Header ───────────────────────────────── */}
      <div className="adm-header">
        <div className="adm-brand">
          <div className="adm-brand-icon">
            <i className="bi bi-speedometer2"></i>
          </div>
          <div>
            <span className="adm-brand-name">AdminHub</span>
            <span className="adm-brand-sub">Pro Suite</span>
          </div>
        </div>
        <button
          className="adm-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <i className={`bi ${isCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
        </button>
      </div>

      {/* ── Main Navigation ──────────────────────── */}
      <span className="adm-section-label">Main Menu</span>

      <ul className="adm-nav">
        {menuItems.slice(0, 5).map((item) => (
          <li key={item.id}>
            <button
              className={`adm-nav-btn${activePage === item.id ? ' active' : ''}`}
              onClick={() => setActivePage(item.id)}
              title={isCollapsed ? item.label : ''}
            >
              <span className="adm-icon"><i className={`bi ${item.icon}`}></i></span>
              <span className="adm-nav-label">{item.label}</span>
              {item.badge && <span className="adm-badge">{item.badge}</span>}
            </button>
          </li>
        ))}

        <li><div className="adm-divider"></div></li>
        <span className="adm-section-label" style={{ paddingTop: '4px' }}>System</span>

        {menuItems.slice(5).map((item) => (
          <li key={item.id}>
            <button
              className={`adm-nav-btn${activePage === item.id ? ' active' : ''}`}
              onClick={() => setActivePage(item.id)}
              title={isCollapsed ? item.label : ''}
            >
              <span className="adm-icon"><i className={`bi ${item.icon}`}></i></span>
              <span className="adm-nav-label">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>

      {/* ── Footer ───────────────────────────────── */}
      <div className="adm-footer">
        <div className="adm-user">
          <div className="adm-avatar">JD</div>
          <div className="adm-user-info">
            <div className="adm-user-name">Jane Doe</div>
            <div className="adm-user-role">Super Admin</div>
          </div>
        </div>
        <button
          className="adm-logout"
          onClick={() => console.log('Logout')}
          title={isCollapsed ? 'Logout' : ''}
        >
          <i className="bi bi-box-arrow-right"></i>
          <span className="adm-logout-label">Logout</span>
        </button>
      </div>

    </nav>
  );
};

export default Sidebar;
