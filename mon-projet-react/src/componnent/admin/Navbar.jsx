import React, { useState, useEffect } from 'react';

const Navbar = ({ isSidebarOpen }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <style>{`
        /* =========================
           DARK NAVBAR MODERN UI
        ========================= */

        .navbar-custom {
          background: rgba(15, 23, 42, 0.75) !important;
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(148, 163, 184, 0.1);
          transition: all 0.3s ease;
          z-index: 1000;
        }

        .navbar-scrolled {
          box-shadow: 0 10px 30px rgba(0,0,0,0.4);
          background: rgba(15, 23, 42, 0.92) !important;
        }

        /* SEARCH */
        .search-container {
          background: rgba(30, 41, 59, 0.8);
          border-radius: 12px;
          border: 1px solid rgba(148, 163, 184, 0.15);
          transition: 0.2s;
        }

        .search-container:focus-within {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
          background: rgba(30, 41, 59, 1);
        }

        .search-container input {
          color: #e2e8f0 !important;
        }

        .search-container input::placeholder {
          color: #94a3b8;
        }

        /* ICON BUTTONS */
        .nav-icon-btn {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          color: #94a3b8;
          border: 1px solid rgba(148, 163, 184, 0.1);
          background: rgba(30, 41, 59, 0.6);
          transition: 0.2s;
        }

        .nav-icon-btn:hover {
          background: rgba(99, 102, 241, 0.15);
          color: #818cf8;
          transform: translateY(-1px);
        }

        /* NOTIFICATION */
        .notification-badge {
          width: 9px;
          height: 9px;
          background: #ef4444;
          border: 2px solid #0f172a;
          border-radius: 50%;
          position: absolute;
          top: 9px;
          right: 9px;
        }

        /* DROPDOWN */
        .notif-dropdown {
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(148, 163, 184, 0.15);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }

        .notif-item {
          transition: 0.2s;
        }

        .notif-item:hover {
          background: rgba(99, 102, 241, 0.1);
        }

        /* PROFILE */
        .profile-img {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          border: 2px solid rgba(99, 102, 241, 0.5);
          cursor: pointer;
          transition: 0.2s;
        }

        .profile-img:hover {
          transform: scale(1.05);
        }

        /* TEXT */
        .text-dark {
          color: #e2e8f0 !important;
        }

        .text-muted {
          color: #94a3b8 !important;
        }

        /* RESPONSIVE */
        @media (max-width: 991px) {
          .search-container {
            max-width: 200px;
          }
        }
      `}</style>

      <nav
        className={`navbar navbar-expand navbar-custom sticky-top px-3 py-3 ${
          scrolled ? 'navbar-scrolled' : ''
        }`}
        style={{
          marginLeft: window.innerWidth > 991 ? '270px' : '0',
          transition: 'margin-left 0.3s'
        }}
      >
        <div className="container-fluid gap-3">

          {/* SEARCH */}
          <div className="d-flex flex-grow-1">
            <div className="search-container d-flex align-items-center px-3 py-2 w-100">
              <i className="bi bi-search text-muted me-2"></i>
              <input
                type="text"
                className="form-control border-0 bg-transparent shadow-none"
                placeholder="Search..."
              />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="d-flex align-items-center gap-3">

            {/* Messages */}
            <button className="nav-icon-btn d-none d-sm-flex">
              <i className="bi bi-chat-left-text fs-5"></i>
            </button>

            {/* Notifications */}
            <div className="position-relative">
              <button
                className="nav-icon-btn"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <i className="bi bi-bell fs-5"></i>
                <span className="notification-badge"></span>
              </button>

              {showNotifications && (
                <div
                  className="position-absolute end-0 mt-3 notif-dropdown"
                  style={{ width: '320px' }}
                >
                  <div className="p-3 border-bottom border-secondary d-flex justify-content-between">
                    <strong className="text-dark">Notifications</strong>
                    <span className="badge bg-primary">3</span>
                  </div>

                  <div>
                    {[
                      { icon: 'bi-person-plus', color: '#6366f1', text: 'New user registered', time: '2 min ago' },
                      { icon: 'bi-box-seam', color: '#10b981', text: 'Order completed', time: '1h ago' },
                      { icon: 'bi-exclamation-triangle', color: '#f59e0b', text: 'Low stock alert', time: '5h ago' }
                    ].map((n, i) => (
                      <div
                        key={i}
                        className="notif-item px-3 py-3 d-flex gap-3 border-bottom border-secondary"
                      >
                        <div
                          className="d-flex align-items-center justify-content-center rounded-3"
                          style={{
                            width: 36,
                            height: 36,
                            background: `${n.color}20`,
                            color: n.color
                          }}
                        >
                          <i className={`bi ${n.icon}`}></i>
                        </div>

                        <div>
                          <div className="text-dark small fw-semibold">{n.text}</div>
                          <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                            {n.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-2 text-center">
                    <button className="btn btn-sm btn-link text-primary">
                      View all
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* PROFILE */}
            <div className="d-flex align-items-center gap-2 ps-2 ms-1 border-start border-secondary">
              <div className="d-none d-md-flex flex-column text-end">
                <span className="text-dark fw-bold" style={{ fontSize: '0.85rem' }}>
                  Admin Nexus
                </span>
                <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                  Super Admin
                </span>
              </div>

              <img
                src="https://ui-avatars.com/api/?name=Admin+Nexus&background=6366f1&color=fff"
                className="profile-img"
                alt="profile"
              />
            </div>

          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;