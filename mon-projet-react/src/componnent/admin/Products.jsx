import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CATEGORY_API = "http://localhost:8080/api/category/";
const PRODUCT_API  = "http://localhost:8080/api/products";

// ─── Product Image / Fallback Avatar ─────────────────────────────────────────
const ProductImg = ({ src, name }) => {
  const [err, setErr] = useState(false);
  if (src && !err) {
    return <img src={src} onError={() => setErr(true)} alt={name}
      style={{ width:44, height:44, borderRadius:10, objectFit:'cover', border:'1px solid #1e1e2e', background:'#0d0d14', flexShrink:0 }} />;
  }
  const colors = ['#6366f1','#f43f5e','#06d6a0','#f59e0b','#8b5cf6','#3b82f6'];
  const color  = colors[(name?.charCodeAt(0) ?? 0) % colors.length];
  return (
    <div style={{ width:44, height:44, borderRadius:10, background:`${color}18`, border:`1px solid ${color}44`,
      display:'flex', alignItems:'center', justifyContent:'center', color, fontSize:18, fontWeight:800, flexShrink:0 }}>
      {name?.[0]?.toUpperCase() ?? '?'}
    </div>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, color }) => (
  <div style={{ background:'#0f0f1a', borderRadius:16, padding:'20px 24px', border:'1px solid #1e1e2e',
    display:'flex', alignItems:'center', gap:16, transition:'transform .2s, border-color .2s',
    cursor:'default', boxShadow:'0 2px 16px rgba(0,0,0,.3)' }}
    onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.borderColor=color+'55'; }}
    onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)';    e.currentTarget.style.borderColor='#1e1e2e'; }}>
    <div style={{ width:50, height:50, borderRadius:14, background:color+'18', border:`1px solid ${color}30`,
      display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, color }}>
      <i className={icon}></i>
    </div>
    <div>
      <div style={{ fontSize:26, fontWeight:800, color:'#f1f5f9', lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:12, color:'#475569', marginTop:4 }}>{label}</div>
    </div>
  </div>
);

// ─── Badge ────────────────────────────────────────────────────────────────────
const Badge = ({ children, color, bg, border }) => (
  <span style={{ padding:'3px 11px', borderRadius:999, fontSize:11, fontWeight:700, letterSpacing:.8,
    textTransform:'uppercase', color, background:bg, border:`1px solid ${border}`,
    display:'inline-flex', alignItems:'center', gap:5 }}>{children}</span>
);

// ─── Section Label ────────────────────────────────────────────────────────────
const SectionLabel = ({ children }) => (
  <div style={{ fontSize:11, fontWeight:700, color:'#6366f1', textTransform:'uppercase', letterSpacing:1.2,
    margin:'4px 0 14px', display:'flex', alignItems:'center', gap:8 }}>
    {children} <span style={{ flex:1, height:1, background:'#1e1e2e' }} />
  </div>
);

// ─── Field Wrapper ────────────────────────────────────────────────────────────
const Field = ({ label, icon, iconTop, children }) => (
  <div style={{ marginBottom:16 }}>
    <label style={{ fontSize:12, fontWeight:600, color:'#64748b', display:'block', marginBottom:6,
      textTransform:'uppercase', letterSpacing:.8 }}>{label}</label>
    <div style={{ position:'relative' }}>
      {icon && <i className={`bi ${icon}`} style={{ position:'absolute', left:13,
        top: iconTop ? 12 : '50%', transform: iconTop ? 'none' : 'translateY(-50%)',
        color:'#334155', pointerEvents:'none', zIndex:1 }}></i>}
      {children}
    </div>
  </div>
);

const baseInput = {
  width:'100%', borderRadius:10, border:'1px solid #1e1e2e', background:'#0d0d14',
  color:'#e2e8f0', fontSize:14, outline:'none', fontFamily:"'Syne',sans-serif",
  transition:'border-color .2s, box-shadow .2s'
};
const focusStyle = { borderColor:'#6366f1', boxShadow:'0 0 0 3px rgba(99,102,241,.15)' };

// ─── Product Modal (Add / Edit) ───────────────────────────────────────────────
const ProductModal = ({ onClose, onSubmit, categoriesData, error, editProduct }) => {
  const empty = { name:'', price:'', quantite:'', imageUrl:'', description:'', category:'' };

  const [form, setForm] = useState(() => editProduct
    ? { name: editProduct.name ?? '', price: editProduct.price ?? '',
        quantite: editProduct.quantite ?? '', imageUrl: editProduct.imageUrl ?? '',
        description: editProduct.description ?? '', category: editProduct.category ?? '' }
    : empty
  );
  const [focused, setFocused] = useState(null);
  const isEdit = !!editProduct;

  const bind = (name, extra = {}) => ({
    name, value: form[name],
    onChange: e => setForm(f => ({ ...f, [name]: e.target.value })),
    onFocus:  () => setFocused(name),
    onBlur:   () => setFocused(null),
    style: { ...baseInput, padding: extra.noIcon ? '11px 14px' : '11px 14px 11px 38px',
      ...(focused === name ? focusStyle : {}), ...extra.extraStyle },
    ...extra
  });

  return (
    <div style={{ position:'fixed', inset:0, zIndex:1050, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,.75)', backdropFilter:'blur(8px)' }} onClick={onClose} />
      <div style={{ position:'relative', background:'#0f0f1a', borderRadius:20, width:'100%', maxWidth:560,
        margin:'0 16px', boxShadow:'0 24px 64px rgba(0,0,0,.6)', border:'1px solid #1e1e2e',
        animation:'popIn .25s ease', fontFamily:"'Syne',sans-serif",
        maxHeight:'90vh', display:'flex', flexDirection:'column', overflow:'hidden' }}>

        {/* Header */}
        <div style={{ padding:'24px 28px', borderBottom:'1px solid #1e1e2e', display:'flex',
          alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
          <div>
            <h5 style={{ fontWeight:800, margin:0, fontSize:18, color:'#f1f5f9' }}>
              {isEdit ? 'Edit Product' : 'Add New Product'}
            </h5>
            <p style={{ margin:0, fontSize:13, color:'#475569', marginTop:2 }}>
              {isEdit ? 'Update product information' : 'Fill in the product details below'}
            </p>
          </div>
          <button onClick={onClose} style={{ background:'#1e1e2e', border:'1px solid #2d2d3d', borderRadius:10,
            width:36, height:36, cursor:'pointer', fontSize:16, display:'flex', alignItems:'center',
            justifyContent:'center', color:'#64748b' }}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={e => onSubmit(e, form)} style={{ display:'flex', flexDirection:'column', flex:1, overflow:'hidden' }}>
          <div style={{ padding:'20px 28px', overflowY:'auto', flex:1 }}>

            {error && (
              <div style={{ padding:'12px 16px', borderRadius:10, background:'rgba(244,63,94,.1)',
                border:'1px solid rgba(244,63,94,.25)', color:'#f43f5e', fontSize:13, marginBottom:16,
                display:'flex', gap:8, alignItems:'center' }}>
                <i className="bi bi-exclamation-triangle-fill"></i> {error}
              </div>
            )}

            {/* ── Product Info ── */}
            <SectionLabel>Product Info</SectionLabel>

            <Field label="Product Name" icon="bi-box-seam">
              <input {...bind('name')} placeholder="e.g. Wireless Headphones" required />
            </Field>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <Field label="Price ($)" icon="bi-currency-dollar">
                <input {...bind('price', { type:'number', min:0, step:'0.01' })} placeholder="0.00" required />
              </Field>
              <Field label="Quantity" icon="bi-stack">
                <input {...bind('quantite', { type:'number', min:0 })} placeholder="0" required />
              </Field>
            </div>

            <Field label="Description" icon="bi-card-text" iconTop>
              <textarea
                rows={3}
                placeholder="Describe the product…"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                onFocus={() => setFocused('description')}
                onBlur={() => setFocused(null)}
                style={{ ...baseInput, padding:'11px 14px 11px 38px', resize:'none',
                  ...(focused === 'description' ? focusStyle : {}) }}
              />
            </Field>

            {/* ── Category ── */}
            <SectionLabel>Category</SectionLabel>

            <Field label="Category Name" icon="bi-tag">
              <input {...bind('category')} placeholder="e.g. Electronics" required list="cat-list-prd" />
              <datalist id="cat-list-prd">
                {categoriesData.map(c => <option key={c.id} value={c.name} />)}
              </datalist>
            </Field>

            {/* ── Media ── */}
            <SectionLabel>Media</SectionLabel>

            <Field label="Image URL" icon="bi-image">
              <input {...bind('imageUrl')} placeholder="https://..." />
            </Field>

            {/* Image preview */}
            {form.imageUrl && (
              <div style={{ marginTop:-8, marginBottom:16, display:'flex', alignItems:'center', gap:10 }}>
                <img src={form.imageUrl} alt="preview"
                  onError={e => { e.currentTarget.style.display='none'; }}
                  style={{ width:48, height:48, borderRadius:10, objectFit:'cover',
                    border:'1px solid #1e1e2e', background:'#0d0d14' }} />
                <span style={{ fontSize:12, color:'#475569' }}>Image preview</span>
              </div>
            )}

          </div>

          {/* Footer */}
          <div style={{ padding:'16px 28px 20px', display:'flex', gap:10, flexShrink:0, borderTop:'1px solid #1e1e2e' }}>
            <button type="button" onClick={onClose}
              style={{ flex:1, padding:'11px', borderRadius:10, border:'1px solid #1e1e2e',
                background:'#151520', color:'#94a3b8', fontWeight:600, fontSize:14,
                cursor:'pointer', fontFamily:"'Syne',sans-serif" }}>
              Cancel
            </button>
            <button type="submit"
              style={{ flex:1, padding:'11px', borderRadius:10, border:'none',
                background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'#fff', fontWeight:700,
                fontSize:14, cursor:'pointer', fontFamily:"'Syne',sans-serif",
                display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                boxShadow:'0 4px 20px rgba(99,102,241,.4)' }}>
              <i className={`bi ${isEdit ? 'bi-check-lg' : 'bi-plus-lg'}`}></i>
              {isEdit ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const Products = () => {
  const [products, setProducts]             = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [showModal, setShowModal]           = useState(false);
  const [editProduct, setEditProduct]       = useState(null);
  const [searchTerm, setSearchTerm]         = useState('');
  const [error, setError]                   = useState(null);
  const [searchFocused, setSearchFocused]   = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => { await loadCategories(); await loadProducts(); };

  const loadCategories = async () => {
    try { const res = await axios.get(CATEGORY_API); setCategoriesData(res.data); }
    catch (err) { console.error(err); }
  };

  const loadProducts = async () => {
    try {
      const res = await axios.get(CATEGORY_API);
      const flat = [];
      res.data.forEach(cat => {
        (cat.productList || []).forEach(p => flat.push({
          ...p, category: cat.name,
          status: p.quantite > 0 ? 'In Stock' : 'Out of Stock'
        }));
      });
      setProducts(flat);
    } catch (err) { console.error(err); }
  };

  // ── Resolve or create category ──
  const resolveCategory = async (categoryName) => {
    let cat = categoriesData.find(c => c.name.toLowerCase() === categoryName.toLowerCase());
    if (!cat) {
      const res = await axios.post('http://localhost:8080/api/category', { name: categoryName });
      cat = res.data;
      setCategoriesData(prev => [...prev, cat]);
    }
    return cat;
  };

  const openAdd  = () => { setError(null); setEditProduct(null); setShowModal(true); };
  const openEdit = (p) => { setError(null); setEditProduct(p);   setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditProduct(null); setError(null); };

  // ── Add ──
  const handleAddProduct = async (e, form) => {
    e.preventDefault(); setError(null);
    try {
      const cat = await resolveCategory(form.category);
      const payload = {
        name: form.name.trim(), price: Number(form.price), quantite: Number(form.quantite),
        imageUrl: form.imageUrl.trim(), description: form.description.trim(),
        category: { id: cat.id }
      };
      const res = await axios.post(PRODUCT_API, payload);
      setProducts(prev => [...prev, { ...res.data, category: cat.name,
        status: res.data.quantite > 0 ? 'In Stock' : 'Out of Stock' }]);
      closeModal();
    } catch (err) { setError('Error adding product. Check your API.'); }
  };

  // ── Edit ──
  const handleEditProduct = async (e, form) => {
    e.preventDefault(); setError(null);
    try {
      const cat = await resolveCategory(form.category);
      const payload = {
        name: form.name.trim(), price: Number(form.price), quantite: Number(form.quantite),
        imageUrl: form.imageUrl.trim(), description: form.description.trim(),
        category: { id: cat.id }
      };
      const res = await axios.put(`http://localhost:8080/api/products/${editProduct.id}`, payload);
      setProducts(prev => prev.map(p => p.id === editProduct.id
        ? { ...res.data, category: cat.name, status: res.data.quantite > 0 ? 'In Stock' : 'Out of Stock' }
        : p
      ));
      closeModal();
    } catch (err) { setError('Error updating product. Check your API.'); }
  };

  // ── Delete ──
  const deleteProduct = async (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    try { await axios.delete(`${PRODUCT_API}/${id}`); }
    catch (err) { console.error(err); }
  };

  const filteredProducts = products.filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()));
  const inStock = products.filter(p => p.quantite > 0).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap');
        @keyframes popIn  { from { opacity:0; transform:scale(.94) } to { opacity:1; transform:scale(1) } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:translateY(0) } }
        .prd-row { animation: fadeUp .3s ease both; }
        .prd-row:hover { background: #151520 !important; }
        .prd-act { opacity:.5; transition:opacity .15s, transform .15s; }
        .prd-act:hover { opacity:1; transform:scale(1.1); }
        * { font-family:'Syne',sans-serif; box-sizing:border-box; }
        input[type=number]::-webkit-inner-spin-button { opacity:.4; }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-track { background:#0d0d14; }
        ::-webkit-scrollbar-thumb { background:#1e1e2e; border-radius:3px; }
        ::-webkit-scrollbar-thumb:hover { background:#2d2d3d; }
      `}</style>

      {showModal && (
        <ProductModal
          onClose={closeModal}
          onSubmit={editProduct ? handleEditProduct : handleAddProduct}
          categoriesData={categoriesData}
          error={error}
          editProduct={editProduct}
        />
      )}

      <div style={{ background:'#080810', minHeight:'100vh', padding:'32px 24px', position:'relative' }}>

        {/* Ambient glow */}
        <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0,
          background:'radial-gradient(ellipse 70% 40% at 15% 0%, rgba(99,102,241,.07) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 85% 100%, rgba(6,214,160,.05) 0%, transparent 60%)' }} />

        <div style={{ maxWidth:1100, margin:'0 auto', position:'relative', zIndex:1 }}>

          {/* Header */}
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:16, marginBottom:32 }}>
            <div>
              <h1 style={{ fontSize:28, fontWeight:800, color:'#f1f5f9', margin:0, letterSpacing:-.5 }}>Products</h1>
              <p style={{ color:'#475569', fontSize:14, margin:'4px 0 0' }}>Monitor and update your inventory in real-time</p>
            </div>
            <button onClick={openAdd}
              style={{ padding:'11px 22px', borderRadius:12, border:'none', background:'linear-gradient(135deg,#6366f1,#8b5cf6)',
                color:'#fff', fontWeight:700, fontSize:14, cursor:'pointer', display:'flex', alignItems:'center',
                gap:8, boxShadow:'0 4px 20px rgba(99,102,241,.4)', fontFamily:"'Syne',sans-serif" }}>
              <i className="bi bi-plus-lg"></i> Add Product
            </button>
          </div>

          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:24 }}>
            <StatCard icon="bi bi-box-seam-fill"    label="Total Products" value={products.length}           color="#6366f1" />
            <StatCard icon="bi bi-check-circle-fill" label="In Stock"       value={inStock}                   color="#06d6a0" />
            <StatCard icon="bi bi-x-circle-fill"    label="Out of Stock"   value={products.length - inStock}  color="#f43f5e" />
          </div>

          {/* Table Card */}
          <div style={{ background:'#0f0f1a', borderRadius:20, border:'1px solid #1e1e2e', overflow:'hidden', boxShadow:'0 2px 40px rgba(0,0,0,.5)' }}>

            {/* Toolbar */}
            <div style={{ padding:'18px 24px', borderBottom:'1px solid #1e1e2e', display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
              <div style={{ position:'relative', flex:1, minWidth:220 }}>
                <i className="bi bi-search" style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#334155', fontSize:14 }}></i>
                <input
                  type="text" placeholder="Search products by name…" value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
                  style={{ width:'100%', padding:'10px 14px 10px 40px', borderRadius:10,
                    border:`1px solid ${searchFocused ? '#6366f1' : '#1e1e2e'}`, background:'#0d0d14',
                    color:'#e2e8f0', fontSize:14, outline:'none',
                    boxShadow: searchFocused ? '0 0 0 3px rgba(99,102,241,.15)' : 'none',
                    transition:'border-color .2s, box-shadow .2s' }}
                />
              </div>
              <button onClick={loadProducts}
                style={{ padding:'0 16px', height:42, borderRadius:10, border:'1px solid #1e1e2e',
                  background:'#151520', fontWeight:600, fontSize:13, cursor:'pointer',
                  display:'flex', alignItems:'center', gap:6, color:'#64748b', fontFamily:"'Syne',sans-serif" }}>
                <i className="bi bi-arrow-clockwise"></i> Refresh
              </button>
            </div>

            {/* Table */}
            {filteredProducts.length === 0 ? (
              <div style={{ padding:'60px 24px', textAlign:'center' }}>
                <div style={{ width:72, height:72, borderRadius:'50%', background:'rgba(99,102,241,.1)',
                  border:'1px solid rgba(99,102,241,.2)', display:'flex', alignItems:'center',
                  justifyContent:'center', margin:'0 auto 16px' }}>
                  <i className="bi bi-box-seam" style={{ fontSize:32, color:'#6366f1' }}></i>
                </div>
                <h6 style={{ fontWeight:700, color:'#cbd5e1', marginBottom:6 }}>No products found</h6>
                <p style={{ color:'#475569', fontSize:14 }}>
                  {searchTerm ? 'Try a different search term' : 'Add your first product to get started'}
                </p>
              </div>
            ) : (
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:14 }}>
                  <thead>
                    <tr style={{ background:'#0d0d14', borderBottom:'1px solid #1e1e2e' }}>
                      {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map((h, i) => (
                        <th key={h} style={{ padding:'13px 20px', fontWeight:700, color:'#334155', fontSize:11,
                          textTransform:'uppercase', letterSpacing:1, textAlign: i === 5 ? 'center' : 'left', border:'none' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p, i) => (
                      <tr key={p.id} className="prd-row" style={{ animationDelay:`${i*35}ms`, borderBottom:'1px solid #13131f' }}>

                        {/* Product */}
                        <td style={{ padding:'13px 20px', verticalAlign:'middle' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                            <ProductImg src={p.imageUrl} name={p.name} />
                            <div>
                              <div style={{ fontWeight:700, color:'#e2e8f0', lineHeight:1.3 }}>{p.name}</div>
                              {p.description
                                ? <div style={{ fontSize:12, color:'#475569', marginTop:2, maxWidth:220,
                                    overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                                    {p.description}
                                  </div>
                                : <div style={{ fontSize:12, color:'#2d2d3d', marginTop:2, fontStyle:'italic' }}>
                                    No description
                                  </div>
                              }
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td style={{ padding:'13px 20px', verticalAlign:'middle' }}>
                          <Badge color="#818cf8" bg="rgba(99,102,241,.1)" border="rgba(99,102,241,.2)">
                            <i className="bi bi-tag-fill" style={{ fontSize:10 }}></i> {p.category}
                          </Badge>
                        </td>

                        {/* Price */}
                        <td style={{ padding:'13px 20px', verticalAlign:'middle' }}>
                          <span style={{ fontWeight:800, color:'#f1f5f9', fontSize:15 }}>
                            ${Number(p.price).toFixed(2)}
                          </span>
                        </td>

                        {/* Stock */}
                        <td style={{ padding:'13px 20px', verticalAlign:'middle' }}>
                          <span style={{ fontWeight:600, color: p.quantite > 10 ? '#06d6a0' : p.quantite > 0 ? '#f59e0b' : '#f43f5e' }}>
                            {p.quantite}
                          </span>
                          <span style={{ color:'#334155', marginLeft:4, fontSize:12 }}>pcs</span>
                        </td>

                        {/* Status */}
                        <td style={{ padding:'13px 20px', verticalAlign:'middle' }}>
                          {p.status === 'In Stock'
                            ? <Badge color="#06d6a0" bg="rgba(6,214,160,.1)"  border="rgba(6,214,160,.2)">
                                <i className="bi bi-circle-fill" style={{ fontSize:7 }}></i> In Stock
                              </Badge>
                            : <Badge color="#f43f5e" bg="rgba(244,63,94,.1)"  border="rgba(244,63,94,.2)">
                                <i className="bi bi-circle-fill" style={{ fontSize:7 }}></i> Out of Stock
                              </Badge>}
                        </td>

                        {/* Actions */}
                        <td style={{ padding:'13px 20px', verticalAlign:'middle', textAlign:'center' }}>
                          <div style={{ display:'flex', gap:6, justifyContent:'center' }}>
                            <button className="prd-act" title="Edit" onClick={() => openEdit(p)}
                              style={{ width:34, height:34, borderRadius:9, border:'1px solid rgba(251,191,36,.2)',
                                background:'rgba(251,191,36,.08)', color:'#fbbf24', cursor:'pointer',
                                display:'flex', alignItems:'center', justifyContent:'center', fontSize:15 }}>
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button className="prd-act" title="Delete" onClick={() => deleteProduct(p.id)}
                              style={{ width:34, height:34, borderRadius:9, border:'1px solid rgba(244,63,94,.2)',
                                background:'rgba(244,63,94,.08)', color:'#f43f5e', cursor:'pointer',
                                display:'flex', alignItems:'center', justifyContent:'center', fontSize:15 }}>
                              <i className="bi bi-trash3"></i>
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Footer */}
            {filteredProducts.length > 0 && (
              <div style={{ padding:'13px 24px', borderTop:'1px solid #1e1e2e', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:13, color:'#334155' }}>
                  Showing <strong style={{ color:'#64748b' }}>{filteredProducts.length}</strong> of <strong style={{ color:'#64748b' }}>{products.length}</strong> products
                </span>
                <span style={{ fontSize:12, color:'#334155' }}>
                  {inStock} in stock · {products.length - inStock} out
                </span>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default Products;
