import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const API = 'http://localhost:8080/users';

// ─── Toast ───────────────────────────────────────────────────────────────────
const Toast = ({ toasts, remove }) => (
  <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10 }}>
    {toasts.map(t => (
      <div key={t.id}
        style={{
          minWidth: 300, borderRadius: 12, border: 'none', animation: 'slideIn .3s ease',
          fontFamily: "'Syne', sans-serif", padding: '14px 16px',
          background: t.type === 'success' ? 'rgba(6,214,160,.12)' : 'rgba(239,68,68,.12)',
          border: `1px solid ${t.type === 'success' ? 'rgba(6,214,160,.3)' : 'rgba(239,68,68,.3)'}`,
          color: t.type === 'success' ? '#06d6a0' : '#ef4444',
          display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: '0 8px 32px rgba(0,0,0,.4)',
          backdropFilter: 'blur(12px)'
        }}>
        <i className={`bi ${t.type === 'success' ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}`}></i>
        <span className="flex-grow-1">{t.message}</span>
        <button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', opacity: .7, fontSize: 14 }} onClick={() => remove(t.id)}>
          <i className="bi bi-x-lg"></i>
        </button>
      </div>
    ))}
  </div>
);

// ─── Avatar ───────────────────────────────────────────────────────────────────
const Avatar = ({ firstName, lastName, size = 38 }) => {
  const initials = `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
  const colors = ['#6366f1', '#ec4899', '#06d6a0', '#f59e0b', '#3b82f6', '#8b5cf6', '#10b981', '#f43f5e'];
  const color = colors[(firstName?.charCodeAt(0) ?? 0) % colors.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `${color}22`,
      border: `1.5px solid ${color}55`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: color, fontWeight: 800, fontSize: size * 0.36,
      fontFamily: "'Syne', sans-serif", flexShrink: 0, letterSpacing: 1
    }}>
      {initials || <i className="bi bi-person-fill" style={{ fontSize: size * 0.5 }}></i>}
    </div>
  );
};

// ─── Role Badge ───────────────────────────────────────────────────────────────
const RoleBadge = ({ role }) => (
  <span style={{
    padding: '3px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700,
    letterSpacing: 1, textTransform: 'uppercase', fontFamily: "'Syne', sans-serif",
    background: role === 'ADMIN' ? 'rgba(244,63,94,.12)' : 'rgba(99,102,241,.12)',
    color: role === 'ADMIN' ? '#f43f5e' : '#818cf8',
    border: `1px solid ${role === 'ADMIN' ? 'rgba(244,63,94,.3)' : 'rgba(99,102,241,.3)'}`
  }}>
    {role === 'ADMIN'
      ? <><i className="bi bi-shield-fill me-1"></i>Admin</>
      : <><i className="bi bi-person-fill me-1"></i>User</>}
  </span>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, color }) => (
  <div className="col-6 col-lg-3">
    <div style={{
      background: '#151520', borderRadius: 16, padding: '20px 24px',
      boxShadow: '0 2px 16px rgba(0,0,0,.3)',
      border: '1px solid #1e1e2e',
      display: 'flex', alignItems: 'center', gap: 16,
      transition: 'transform .2s, border-color .2s', cursor: 'default'
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = color + '44'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#1e1e2e'; }}
    >
      <div style={{ width: 48, height: 48, borderRadius: 14, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${color}30` }}>
        <i className={`bi ${icon}`} style={{ fontSize: 22, color }}></i>
      </div>
      <div>
        <div style={{ fontSize: 24, fontWeight: 800, color: '#f1f5f9', fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 12, color: '#64748b', marginTop: 4, fontFamily: "'Syne', sans-serif" }}>{label}</div>
      </div>
    </div>
  </div>
);

// ─── Section Divider ──────────────────────────────────────────────────────────
const SectionDivider = ({ label }) => (
  <div className="col-12">
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      fontSize: 11, fontWeight: 700, color: '#6366f1',
      textTransform: 'uppercase', letterSpacing: 1.2, margin: '4px 0'
    }}>
      {label}
      <span style={{ flex: 1, height: 1, background: '#1e1e2e', display: 'block' }} />
    </div>
  </div>
);

// ─── Info Row (ViewModal) ─────────────────────────────────────────────────────
const InfoRow = ({ icon, label, val }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #1e1e2e' }}>
    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(99,102,241,.12)', border: '1px solid rgba(99,102,241,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <i className={`bi ${icon}`} style={{ color: '#818cf8' }}></i>
    </div>
    <div>
      <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{val || '—'}</div>
    </div>
  </div>
);

// ─── Input style helper ───────────────────────────────────────────────────────
const inputStyle = {
  paddingLeft: 36, borderRadius: 10,
  border: '1px solid #1e1e2e',
  background: '#0d0d14',
  color: '#e2e8f0',
  fontSize: 14,
  outline: 'none'
};

// ─── User Modal (Add / Edit) ──────────────────────────────────────────────────
const UserModal = ({ show, onClose, onSubmit, editUser, form, handleChange }) => {
  if (!show) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.75)', backdropFilter: 'blur(8px)' }} onClick={onClose} />
      <div style={{
        position: 'relative', background: '#0f0f1a', borderRadius: 20, width: '100%', maxWidth: 520,
        margin: '0 16px', boxShadow: '0 24px 64px rgba(0,0,0,.6)',
        border: '1px solid #1e1e2e',
        animation: 'popIn .25s ease',
        fontFamily: "'Syne', sans-serif", overflow: 'hidden',
        maxHeight: '90vh', display: 'flex', flexDirection: 'column'
      }}>

        {/* Header */}
        <div style={{ padding: '24px 28px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <h5 style={{ fontWeight: 800, margin: 0, fontSize: 18, color: '#f1f5f9' }}>
              {editUser ? 'Edit User' : 'Add New User'}
            </h5>
            <p style={{ margin: 0, fontSize: 13, color: '#475569', marginTop: 2 }}>
              {editUser ? 'Update user information' : 'Fill in the details below'}
            </p>
          </div>
          <button onClick={onClose} style={{ background: '#1e1e2e', border: '1px solid #2d2d3d', borderRadius: 10, width: 36, height: 36, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div style={{ padding: '20px 28px 0', overflowY: 'auto', flex: 1 }}>
            <div className="row g-3">

              <SectionDivider label="Account Info" />

              <div className="col-6">
                <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6, display: 'block' }}>First Name</label>
                <div style={{ position: 'relative' }}>
                  <i className="bi bi-person" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#475569' }}></i>
                  <input className="form-control" name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} required style={inputStyle} />
                </div>
              </div>

              <div className="col-6">
                <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6, display: 'block' }}>Last Name</label>
                <div style={{ position: 'relative' }}>
                  <i className="bi bi-person" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#475569' }}></i>
                  <input className="form-control" name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} required style={inputStyle} />
                </div>
              </div>

              <div className="col-12">
                <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6, display: 'block' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <i className="bi bi-envelope" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#475569' }}></i>
                  <input className="form-control" name="email" type="email" placeholder="user@example.com" value={form.email} onChange={handleChange} required style={inputStyle} />
                </div>
              </div>

              {!editUser && (
                <div className="col-12">
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6, display: 'block' }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <i className="bi bi-lock" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#475569' }}></i>
                    <input className="form-control" name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} required style={inputStyle} />
                  </div>
                </div>
              )}

              <div className="col-12">
                <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6, display: 'block' }}>Role</label>
                <div style={{ position: 'relative' }}>
                  <i className="bi bi-shield-check" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#475569', zIndex: 1 }}></i>
                  <select className="form-select" name="role" value={form.role} onChange={handleChange} style={inputStyle}>
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
              </div>

              <SectionDivider label="Profile Info" />

              <div className="col-12">
                <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6, display: 'block' }}>Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <i className="bi bi-telephone" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#475569' }}></i>
                  <input className="form-control" name="phone" type="tel" placeholder="+212 6XX XXX XXX" value={form.phone} onChange={handleChange} style={inputStyle} />
                </div>
              </div>

              <div className="col-12">
                <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6, display: 'block' }}>City</label>
                <div style={{ position: 'relative' }}>
                  <i className="bi bi-geo-alt" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#475569' }}></i>
                  <input className="form-control" name="city" placeholder="Casablanca" value={form.city} onChange={handleChange} style={inputStyle} />
                </div>
              </div>

              <div className="col-12" style={{ marginBottom: 4 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6, display: 'block' }}>Address</label>
                <div style={{ position: 'relative' }}>
                  <i className="bi bi-house" style={{ position: 'absolute', left: 12, top: 11, color: '#475569' }}></i>
                  <textarea className="form-control" name="address" rows={2} placeholder="123 Rue Mohammed V, Quartier..." value={form.address} onChange={handleChange} style={{ ...inputStyle, resize: 'none' }} />
                </div>
              </div>

            </div>
          </div>

          <div style={{ padding: '16px 28px 20px', display: 'flex', gap: 10, justifyContent: 'flex-end', flexShrink: 0, borderTop: '1px solid #1e1e2e', marginTop: 8 }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 22px', borderRadius: 10, border: '1px solid #1e1e2e', background: '#151520', color: '#94a3b8', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: "'Syne', sans-serif" }}>
              Cancel
            </button>
            <button type="submit" style={{ padding: '10px 28px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: "'Syne', sans-serif", display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 20px rgba(99,102,241,.4)' }}>
              <i className="bi bi-check-lg"></i>
              {editUser ? 'Update' : 'Add User'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

// ─── View Modal ───────────────────────────────────────────────────────────────
const ViewModal = ({ user, onClose }) => {
  if (!user) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.75)', backdropFilter: 'blur(8px)' }} onClick={onClose} />
      <div style={{
        position: 'relative', background: '#0f0f1a', borderRadius: 20, width: '100%', maxWidth: 420,
        margin: '0 16px', boxShadow: '0 24px 64px rgba(0,0,0,.6)',
        border: '1px solid #1e1e2e',
        animation: 'popIn .25s ease',
        fontFamily: "'Syne', sans-serif", overflow: 'hidden',
        maxHeight: '90vh', display: 'flex', flexDirection: 'column'
      }}>
        <div style={{ background: 'linear-gradient(135deg, #1e1b4b, #2d1b69)', padding: '32px 28px 24px', textAlign: 'center', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
          {/* Decorative glow */}
          <div style={{ position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,.3) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <Avatar firstName={user.firstName} lastName={user.lastName} size={72} />
          <h5 style={{ color: '#f1f5f9', fontWeight: 800, margin: '12px 0 4px', fontSize: 20 }}>{user.firstName} {user.lastName}</h5>
          <RoleBadge role={user.role} />
        </div>

        <div style={{ padding: '8px 28px', overflowY: 'auto', flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: 1.2, padding: '14px 0 6px' }}>Account</div>
          <InfoRow icon="bi-envelope" label="Email"   val={user.email} />
          <InfoRow icon="bi-hash"     label="User ID" val={`#${user.id}`} />

          <div style={{ fontSize: 11, fontWeight: 700, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: 1.2, padding: '14px 0 6px' }}>Profile</div>
          <InfoRow icon="bi-telephone" label="Phone"   val={user.profile?.phone} />
          <InfoRow icon="bi-geo-alt"   label="City"    val={user.profile?.city} />
          <InfoRow icon="bi-house"     label="Address" val={user.profile?.adresse} />
        </div>

        <div style={{ padding: '16px 28px 20px', flexShrink: 0, borderTop: '1px solid #1e1e2e' }}>
          <button onClick={onClose} style={{ width: '100%', padding: '12px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: "'Syne', sans-serif", boxShadow: '0 4px 20px rgba(99,102,241,.35)' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Delete Confirm ───────────────────────────────────────────────────────────
const DeleteModal = ({ user, onClose, onConfirm, loading }) => {
  if (!user) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.75)', backdropFilter: 'blur(8px)' }} onClick={onClose} />
      <div style={{
        position: 'relative', background: '#0f0f1a', borderRadius: 20, width: '100%', maxWidth: 380,
        margin: '0 16px', boxShadow: '0 24px 64px rgba(0,0,0,.6)', padding: '32px 28px',
        border: '1px solid #1e1e2e',
        textAlign: 'center', fontFamily: "'Syne', sans-serif", animation: 'popIn .25s ease'
      }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(244,63,94,.12)', border: '1px solid rgba(244,63,94,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <i className="bi bi-trash3-fill" style={{ fontSize: 28, color: '#f43f5e' }}></i>
        </div>
        <h5 style={{ fontWeight: 800, fontSize: 18, color: '#f1f5f9', marginBottom: 8 }}>Delete User</h5>
        <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>
          Are you sure you want to delete <strong style={{ color: '#cbd5e1' }}>{user.firstName} {user.lastName}</strong>? This action cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '11px', borderRadius: 10, border: '1px solid #1e1e2e', background: '#151520', color: '#94a3b8', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: "'Syne', sans-serif" }}>
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading} style={{ flex: 1, padding: '11px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #e11d48, #f43f5e)', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: "'Syne', sans-serif", boxShadow: '0 4px 20px rgba(244,63,94,.35)' }}>
            {loading ? <span className="spinner-border spinner-border-sm"></span> : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const Users = () => {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [viewUser, setViewUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  const emptyForm = { firstName: '', lastName: '', email: '', password: '', role: 'USER', phone: '', city: '', address: '' };
  const [form, setForm] = useState(emptyForm);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };
  const removeToast = id => setToasts(prev => prev.filter(t => t.id !== id));

  const loadUsers = useCallback(async () => {
    try {
      const res = await axios.get(API);
      setUsers(res.data);
    } catch (e) {
      console.log(e);
      addToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const openAddModal = () => { setForm(emptyForm); setEditUser(null); setShowModal(true); };

  const openEditModal = (user) => {
    setEditUser(user);
    setForm({ firstName: user.firstName, lastName: user.lastName, email: user.email, password: '', role: user.role, phone: user.profile?.phone || '', city: user.profile?.city || '', address: user.profile?.adresse || '' });
    setShowModal(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      firstName: form.firstName, lastName: form.lastName, email: form.email, role: form.role,
      profile: { phone: form.phone, city: form.city, adresse: form.address }
    };
    if (!editUser) payload.password = form.password;
    try {
      if (editUser) { await axios.put(`${API}/${editUser.id}`, payload); addToast('User updated successfully'); }
      else { await axios.post(`${API}/register`, payload); addToast('User added successfully'); }
      setShowModal(false);
      loadUsers();
    } catch (err) {
      console.log(err);
      addToast(editUser ? 'Failed to update user' : 'Failed to add user', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget?.id) return;
    setDeleteLoading(true);
    try {
      await axios.delete(`${API}/${deleteTarget.id}`);
      addToast(`${deleteTarget.firstName} deleted successfully`);
      setDeleteTarget(null);
      loadUsers();
    } catch (err) {
      console.log(err);
      addToast('Failed to delete user', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredUsers = users.filter(u =>
    u.firstName?.toLowerCase().includes(search.toLowerCase()) ||
    u.lastName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const admins = users.filter(u => u.role === 'ADMIN').length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap');
        @keyframes slideIn { from { opacity:0; transform:translateX(20px) } to { opacity:1; transform:translateX(0) } }
        @keyframes popIn  { from { opacity:0; transform:scale(.94) }        to { opacity:1; transform:scale(1) } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px) }  to { opacity:1; transform:translateY(0) } }
        .user-row { animation: fadeUp .3s ease both; }
        .user-row:hover { background: #151520 !important; }
        .action-btn { opacity:.5; transition:opacity .15s,transform .15s; }
        .action-btn:hover { opacity:1; transform:scale(1.1); }
        .search-input:focus { border-color:#6366f1 !important; box-shadow:0 0 0 3px rgba(99,102,241,.15) !important; }
        * { font-family:'Syne',sans-serif; }
        .form-control, .form-select {
          background-color: #0d0d14 !important;
          color: #e2e8f0 !important;
          border-color: #1e1e2e !important;
        }
        .form-control::placeholder { color: #334155 !important; }
        .form-control:focus, .form-select:focus {
          background-color: #0d0d14 !important;
          color: #e2e8f0 !important;
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 3px rgba(99,102,241,.15) !important;
        }
        .form-select option { background: #0f0f1a; color: #e2e8f0; }
        .table { color: #e2e8f0 !important; border-color: #1e1e2e !important; }
        .table > :not(caption) > * > * { background-color: transparent !important; color: inherit !important; border-color: #13131f !important; box-shadow: none !important; }
        .table-responsive { background: transparent; }
        .table thead th { color: #334155 !important; background-color: #0d0d14 !important; border-color: #1e1e2e !important; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0d0d14; }
        ::-webkit-scrollbar-thumb { background: #1e1e2e; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #2d2d3d; }
      `}</style>

      <Toast toasts={toasts} remove={removeToast} />

      <UserModal show={showModal} onClose={() => setShowModal(false)} onSubmit={handleSubmit} editUser={editUser} form={form} handleChange={handleChange} />
      <ViewModal user={viewUser} onClose={() => setViewUser(null)} />
      <DeleteModal user={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleteLoading} />

      <div style={{ background: '#080810', minHeight: '100vh', padding: '32px 24px' }}>
        {/* Ambient background glow */}
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0,
          background: 'radial-gradient(ellipse 80% 50% at 10% 0%, rgba(99,102,241,.08) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 90% 100%, rgba(139,92,246,.06) 0%, transparent 60%)'
        }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', margin: 0, letterSpacing: -.5 }}>
                User Management
              </h1>
              <p style={{ color: '#475569', fontSize: 14, margin: '4px 0 0' }}>Manage your team and their permissions</p>
            </div>
            <button
              onClick={openAddModal}
              style={{ padding: '11px 22px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 20px rgba(99,102,241,.4)', fontFamily: "'Syne', sans-serif" }}
            >
              <i className="bi bi-plus-lg"></i> Add User
            </button>
          </div>

          {/* Stats */}
          <div className="row g-3 mb-4">
            <StatCard icon="bi-people-fill"       label="Total Users"    value={users.length}          color="#6366f1" />
            <StatCard icon="bi-shield-fill"       label="Admins"         value={admins}                color="#f43f5e" />
            <StatCard icon="bi-person-check-fill" label="Regular Users"  value={users.length - admins} color="#06d6a0" />
            <StatCard icon="bi-search"            label="Search Results" value={filteredUsers.length}  color="#f59e0b" />
          </div>

          {/* Table Card */}
          <div style={{ background: '#0f0f1a', borderRadius: 20, boxShadow: '0 2px 40px rgba(0,0,0,.5)', overflow: 'hidden', border: '1px solid #1e1e2e' }}>

            {/* Toolbar */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #1e1e2e', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
                <i className="bi bi-search" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#334155', fontSize: 15 }}></i>
                <input
                  className="form-control search-input"
                  placeholder="Search by name or email…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ paddingLeft: 40, borderRadius: 10, border: '1px solid #1e1e2e', fontSize: 14, height: 42, background: '#0d0d14', color: '#e2e8f0' }}
                />
              </div>
              <button
                onClick={loadUsers}
                style={{ padding: '0 16px', height: 42, borderRadius: 10, border: '1px solid #1e1e2e', background: '#151520', fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontFamily: "'Syne', sans-serif" }}
              >
                <i className="bi bi-arrow-clockwise"></i> Refresh
              </button>
            </div>

            {/* Table */}
            {loading ? (
              <div style={{ padding: 60, textAlign: 'center' }}>
                <div className="spinner-border" style={{ color: '#6366f1', width: 40, height: 40 }} role="status"></div>
                <p style={{ marginTop: 16, color: '#475569', fontSize: 14 }}>Loading users…</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div style={{ padding: '60px 24px', textAlign: 'center' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(99,102,241,.1)', border: '1px solid rgba(99,102,241,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <i className="bi bi-people" style={{ fontSize: 32, color: '#6366f1' }}></i>
                </div>
                <h6 style={{ fontWeight: 700, color: '#cbd5e1', marginBottom: 6 }}>No users found</h6>
                <p style={{ color: '#475569', fontSize: 14 }}>{search ? 'Try a different search term' : 'Add your first user to get started'}</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table mb-0" style={{ fontSize: 14 }}>
                  <thead>
                    <tr style={{ background: '#0d0d14', borderBottom: '1px solid #1e1e2e' }}>
                      {['User', 'Email', 'Phone', 'City', 'Role', 'ID', 'Actions'].map((h, i) => (
                        <th key={h} style={{
                          padding: '14px 20px', fontWeight: 700, color: '#334155',
                          fontSize: 11, textTransform: 'uppercase', letterSpacing: 1,
                          textAlign: i === 6 ? 'center' : 'left', border: 'none',
                          background: 'transparent'
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, i) => (
                      <tr key={user.id} className="user-row" style={{ animationDelay: `${i * 40}ms`, borderBottom: '1px solid #13131f' }}>

                        <td style={{ padding: '14px 20px', verticalAlign: 'middle' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <Avatar firstName={user.firstName} lastName={user.lastName} />
                            <div style={{ fontWeight: 700, color: '#e2e8f0', lineHeight: 1.2 }}>
                              {user.firstName} {user.lastName}
                            </div>
                          </div>
                        </td>

                        <td style={{ padding: '14px 20px', verticalAlign: 'middle', color: '#64748b' }}>{user.email}</td>

                        <td style={{ padding: '14px 20px', verticalAlign: 'middle', color: '#64748b' }}>
                          {user.profile?.phone
                            ? <><i className="bi bi-telephone me-1" style={{ color: '#334155' }}></i>{user.profile.phone}</>
                            : <span style={{ color: '#1e2a3a' }}>—</span>}
                        </td>

                        <td style={{ padding: '14px 20px', verticalAlign: 'middle', color: '#64748b' }}>
                          {user.profile?.city
                            ? <><i className="bi bi-geo-alt me-1" style={{ color: '#334155' }}></i>{user.profile.city}</>
                            : <span style={{ color: '#1e2a3a' }}>—</span>}
                        </td>

                        <td style={{ padding: '14px 20px', verticalAlign: 'middle' }}><RoleBadge role={user.role} /></td>

                        <td style={{ padding: '14px 20px', verticalAlign: 'middle', color: '#334155', fontSize: 13 }}>#{user.id}</td>

                        <td style={{ padding: '14px 20px', verticalAlign: 'middle', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                            {[
                              { icon: 'bi-eye',    color: '#818cf8', bg: 'rgba(99,102,241,.12)',  border: 'rgba(99,102,241,.2)',  action: () => setViewUser(user),      title: 'View'   },
                              { icon: 'bi-pencil', color: '#fbbf24', bg: 'rgba(251,191,36,.1)',   border: 'rgba(251,191,36,.2)',  action: () => openEditModal(user),    title: 'Edit'   },
                              { icon: 'bi-trash3', color: '#f43f5e', bg: 'rgba(244,63,94,.1)',    border: 'rgba(244,63,94,.2)',   action: () => setDeleteTarget(user),  title: 'Delete' },
                            ].map(({ icon, color, bg, border, action, title }) => (
                              <button key={icon} onClick={action} title={title} className="action-btn"
                                style={{ width: 34, height: 34, borderRadius: 9, border: `1px solid ${border}`, background: bg, color, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>
                                <i className={`bi ${icon}`}></i>
                              </button>
                            ))}
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!loading && filteredUsers.length > 0 && (
              <div style={{ padding: '14px 24px', borderTop: '1px solid #1e1e2e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: '#334155' }}>
                  Showing <strong style={{ color: '#64748b' }}>{filteredUsers.length}</strong> of <strong style={{ color: '#64748b' }}>{users.length}</strong> users
                </span>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default Users;