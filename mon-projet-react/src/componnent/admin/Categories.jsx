import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const[totalProducts,setTotalProducts]=useState(0);
  const [totalCategories,setTotalCategories]=useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

useEffect(()=>{
  loadcategories();
  loadTotalProducts();
  loadTotalCategories();
},[]);

  const loadcategories=async()=>{
    try{
      const response = await axios.get('http://localhost:8080/api/category/');
      setCategories(response.data);
    }catch(error){
      console.error('Error loading categories:', error);
    }
  }
  const loadTotalCategories= async()=>{
    try{
      const response = await axios.get('http://localhost:8080/api/category/product-count-by-category')
      setTotalCategories(response.data);
    }catch(error){
      console.error('Error loading total categories:', error);
    }
  }
  const loadTotalProducts=async()=>{
    try{
      const ressponce = await axios.get('http://localhost:8080/api/products/totalQuantite');
      setTotalProducts(ressponce.data);
    }catch(error){
      console.error('Error loading total products:', error);
    }
  }

  const handelDelete=async(id)=>{
    try{
      await axios.delete(`http://localhost:8080/api/category/${id}`);
      loadcategories();
      setCategories(categories.filter(cat => cat.id !== id));
    }catch(error){
      console.error('Error deleting category:', error);
    }
  }


  const getCountByCategory = (name) => {
  const found = totalCategories.find(
    (c) => c.category.toLowerCase() === name.toLowerCase()
  );
  return found ? found.count : 0;
};

  const filteredCategories = categories.filter(cat => {
  const matchSearch = cat.name
    .toLowerCase()
    .includes(searchTerm.toLowerCase());

  const count = getCountByCategory(cat.name);
  const status = count > 0 ? 'Active' : 'Inactive';

  const matchStatus =
    filterStatus === 'All' || status === filterStatus;

  return matchSearch && matchStatus;
});

  return (
    <div style={styles.container}>

      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            <i className="bi bi-grid-3x3-gap-fill" style={{ marginRight: 10 }}></i>
            Categories Management
          </h1>
          <p style={styles.subtitle}>Organize and manage product categories</p>
        </div>
      </div>

      {/* STATS */}
      <div style={styles.statsGrid}>

        <div style={styles.statCard}>
          <i className="bi bi-grid-3x3-gap-fill" style={styles.icon}></i>
          <div>
            <h2 style={styles.statValue}>{categories.length}</h2>
            <p style={styles.statLabel}>Total Categories</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <i className="bi bi-check-circle-fill" style={{ ...styles.icon, color: '#22c55e' }}></i>
          <div>
            <h2 style={styles.statValue}>{filteredCategories.filter(cat => getCountByCategory(cat.name) ).length}</h2>
            <p style={styles.statLabel}>Active</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <i className="bi bi-box-seam" style={{ ...styles.icon, color: '#38bdf8' }}></i>
          <div>
            <h2 style={styles.statValue}>
              {totalProducts}
            </h2>
            <p style={styles.statLabel}>Total Products</p>
          </div>
        </div>

      </div>

      {/* SEARCH + FILTER */}
      <div style={styles.filterCard}>

        <div style={styles.searchWrapper}>
          <i className="bi bi-search" style={styles.searchIcon}></i>
          <input
            style={styles.input}
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          style={styles.input}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <button style={styles.addBtn}>
          <i className="bi bi-plus-lg"></i> Add Category
        </button>

      </div>

      {/* GRID */}
<div style={styles.grid}>
{filteredCategories.map(cat => {
  const count = getCountByCategory(cat.name);
  const isActive = count > 0;

  return (
    <div key={cat.id} style={styles.card}>
      
      <div style={styles.cardHeader}>
        <h3>{cat.name}</h3>

        <span
          style={{
            ...styles.badge,
            background: isActive ? '#14532d' : '#eb1506',
            color: isActive ? '#22c55e' : '#ced5df'
          }}
        >
          {isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      <p style={styles.desc}>{cat.description}</p>

      <div style={styles.infoRow}>
        <div>
          <p style={styles.small}>Products</p>
          <strong>{count}</strong>
        </div>

        <div>
          <p style={styles.small}>Created</p>
          <strong>{cat.createdDate}</strong>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div style={styles.actions}>
        <button
          style={styles.editBtn}
          onClick={() => handleEdit(cat)}
        >
          <i className="bi bi-pencil"></i> Edit
        </button>

        <button
          style={styles.deleteBtn}
          onClick={() => handelDelete(cat.id)}
        >
          <i className="bi bi-trash"></i>
        </button>
      </div>

    </div>
  );
})}
</div>
      </div>
    
  );
};

const styles = {
  container: {
    background: '#0f172a',
    minHeight: '100vh',
    padding: 24,
    color: '#e2e8f0',
    fontFamily: 'system-ui'
  },

  header: {
    marginBottom: 20
  },

  title: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 26,
    fontWeight: 800
  },

  subtitle: {
    color: '#94a3b8'
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 16,
    marginBottom: 20
  },

  statCard: {
    background: '#111827',
    border: '1px solid #1f2937',
    borderRadius: 16,
    padding: 16,
    display: 'flex',
    gap: 12,
    alignItems: 'center'
  },

  icon: {
    fontSize: 22,
    color: '#60a5fa'
  },

  statValue: {
    margin: 0,
    fontSize: 22
  },

  statLabel: {
    margin: 0,
    fontSize: 12,
    color: '#94a3b8'
  },

  filterCard: {
    background: '#111827',
    border: '1px solid #1f2937',
    padding: 16,
    borderRadius: 16,
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
    marginBottom: 20
  },

  searchWrapper: {
    flex: 1,
    position: 'relative'
  },

  searchIcon: {
    position: 'absolute',
    left: 10,
    top: 12,
    color: '#64748b'
  },

  input: {
    width: '100%',
    padding: 12,
    paddingLeft: 35,
    borderRadius: 12,
    border: '1px solid #1f2937',
    background: '#0b1220',
    color: '#e2e8f0',
    outline: 'none'
  },

  addBtn: {
    padding: '12px 16px',
    borderRadius: 12,
    border: 'none',
    background: '#3b82f6',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 6
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 16
  },

  card: {
    background: '#111827',
    border: '1px solid #1f2937',
    borderRadius: 16,
    padding: 16
  },

  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 10
  },

  badge: {
    padding: '4px 10px',
    borderRadius: 20,
    fontSize: 12
  },

  desc: {
    color: '#94a3b8',
    fontSize: 13
  },

  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 10,
    fontSize: 13,
    color: '#94a3b8'
  },

  small: {
    margin: 0,
    fontSize: 12
  },

  actions: {
    marginTop: 12,
    display: 'flex',
    gap: 10
  },

  editBtn: {
    flex: 1,
    padding: 8,
    borderRadius: 10,
    border: '1px solid #1f2937',
    background: '#0b1220',
    color: '#60a5fa',
    cursor: 'pointer'
  },

  deleteBtn: {
    width: 42,
    borderRadius: 10,
    border: '1px solid #1f2937',
    background: '#0b1220',
    color: '#ef4444',
    cursor: 'pointer'
  }
};

export default Categories;