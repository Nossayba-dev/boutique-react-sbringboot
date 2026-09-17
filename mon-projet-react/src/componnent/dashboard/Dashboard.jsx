import React, { useState, useEffect } from "react";
import './Dashboard.css';
import axios from "axios";

const Dashboard = () => {
    // --- ÉTATS ---
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [activeMenu, setActiveMenu] = useState('accueil');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [notification, setNotification] = useState(null);
    const [isAdding, setIsAdding] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const CURRENT_USER_ID = 1;
    const API_BASE = "http://localhost:8080/api";

    // --- CHARGEMENT DES DONNÉES ---
    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                const [prodRes, catRes, cartRes] = await Promise.all([
                    axios.get(`${API_BASE}/products`),
                    axios.get(`${API_BASE}/category/`),
                    axios.get(`${API_BASE}/cart/${CURRENT_USER_ID}`)
                ]);

                setProducts(prodRes.data || []);
                setCategories(catRes.data || []);
                
                // Extraction sécurisée des items du panier
                const items = cartRes.data?.items || cartRes.data || [];
                setCartItems(Array.isArray(items) ? items : []);
            } catch (error) {
                console.error("Erreur de synchronisation:", error);
                showNotification("Erreur de connexion au serveur");
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    // --- ACTIONS PANIER ---
    const addToCart = async (product) => {
        setIsAdding(product.id);
        try {
            await axios.post(`${API_BASE}/cart/add`, {
                userId: CURRENT_USER_ID,
                productId: product.id,
                quantity: 1
            });
            const updatedCart = await axios.get(`${API_BASE}/cart/${CURRENT_USER_ID}`);
            const items = updatedCart.data?.items || updatedCart.data || [];
            setCartItems(items);
            showNotification(`${product.name} ajouté !`);
        } catch (err) {
            showNotification("Impossible d'ajouter l'article.");
        } finally {
            setIsAdding(null);
        }
    };

    const removeFromCart = async (productId) => {
        try {
            await axios.delete(`${API_BASE}/cart/remove/${CURRENT_USER_ID}/${productId}`);
            setCartItems(prev => prev.filter(item => item.product?.id !== productId));
            showNotification("Article supprimé.");
        } catch (err) {
            showNotification("Erreur lors de la suppression.");
        }
    };

    const clearCart = async () => {
        if (!window.confirm("Vider tout le panier ?")) return;
        try {
            await axios.delete(`${API_BASE}/cart/clear/${CURRENT_USER_ID}`);
            setCartItems([]);
            showNotification("Panier vidé.");
        } catch (err) {
            showNotification("Erreur lors du vidage.");
        }
    };

    const showNotification = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 2800);
    };

    // --- LOGIQUE DE FILTRAGE FIXÉE ---
    const filteredProducts = products.filter(p => {
        // Comparaison stricte en convertissant en String pour éviter les conflits types
        const matchesCategory = 
            selectedCategory === 'all' || 
            String(p.category?.id) === String(selectedCategory);

        const matchesSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase());
        
        return matchesCategory && matchesSearch;
    });

    // --- CALCULS ---
    const cartTotal = cartItems.reduce((acc, item) => acc + ((item.product?.price || 0) * item.quantity), 0);
    const cartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0);

    if (loading) return (
        <div className="loader-screen">
            <div className="loader-inner">
                <div className="loader-ring"></div>
                <span>Chargement de AN Shop...</span>
            </div>
        </div>
    );

    return (
        <div className="app">
            {/* NAVBAR */}
            <header className="navbar">
                <div className="navbar-left">
                    <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <span></span><span></span><span></span>
                    </button>
                    <div className="logo" onClick={() => { setActiveMenu('accueil'); setSelectedCategory('all'); }}>
                        <span className="logo-icon">🛒</span>
                        <span className="logo-text">AN <strong>Shop</strong></span>
                    </div>
                </div>

                <div className="navbar-center">
                    <div className="search-bar">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                        <input
                            type="text"
                            placeholder="Rechercher un produit..."
                            value={searchQuery}
                            onChange={e => { setSearchQuery(e.target.value); setActiveMenu('accueil'); }}
                        />
                    </div>
                </div>

                <div className="navbar-right">
                    <button className={`cart-trigger ${activeMenu === 'panier' ? 'active' : ''}`} onClick={() => setActiveMenu('panier')}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                    </button>
                    <div className="avatar">U</div>
                </div>
            </header>

            <div className="body-wrap">
                {/* SIDEBAR AVEC FILTRES FIXÉS */}
                <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                    <nav className="sidebar-nav">
                        <button className={`nav-item ${activeMenu === 'accueil' ? 'active' : ''}`} onClick={() => { setActiveMenu('accueil'); setSidebarOpen(false); }}>
                            <span>Boutique</span>
                        </button>
                        <button className={`nav-item ${activeMenu === 'panier' ? 'active' : ''}`} onClick={() => { setActiveMenu('panier'); setSidebarOpen(false); }}>
                            <span>Mon Panier</span>
                        </button>
                    </nav>

                    <div className="sidebar-footer">
                        <div className="sidebar-divider"></div>
                        <p className="sidebar-label">Catégories</p>
                        <button 
                            className={`cat-item ${selectedCategory === 'all' ? 'active' : ''}`} 
                            onClick={() => { setSelectedCategory('all'); setActiveMenu('accueil'); setSidebarOpen(false); }}
                        >
                            Tout voir
                        </button>
                        {categories.map(c => (
                            <button 
                                key={c.id} 
                                className={`cat-item ${String(selectedCategory) === String(c.id) ? 'active' : ''}`} 
                                onClick={() => { setSelectedCategory(c.id); setActiveMenu('accueil'); setSidebarOpen(false); }}
                            >
                                {c.name}
                            </button>
                        ))}
                    </div>
                </aside>

                {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

                <main className="main">
                    {activeMenu === 'panier' ? (
                        <div className="page-cart fade-in">
                            <div className="page-header">
                                <h1>Mon Panier</h1>
                                {cartItems.length > 0 && <button className="btn-ghost-danger" onClick={clearCart}>Vider le panier</button>}
                            </div>

                            {cartItems.length === 0 ? (
                                <div className="empty-state">
                                    <p>Votre panier est vide</p>
                                    <button className="btn-primary" onClick={() => setActiveMenu('accueil')}>Boutique</button>
                                </div>
                            ) : (
                                <div className="cart-layout">
                                    <div className="cart-items">
                                        {cartItems.map(item => (
                                            <div key={item.id} className="cart-row">
                                                <div className="cart-img">
                                                    {item.product?.imageUrl ? <img src={item.product.imageUrl} alt={item.product.name} /> : <span>📦</span>}
                                                </div>
                                                <div className="cart-info">
                                                    <p className="cart-name">{item.product?.name || "Produit inconnu"}</p>
                                                    <p className="cart-qty">Quantité : {item.quantity}</p>
                                                </div>
                                                <div className="cart-price">${((item.product?.price || 0) * item.quantity).toFixed(2)}</div>
                                                <button className="remove-btn" onClick={() => removeFromCart(item.product?.id)}>×</button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="cart-summary">
                                        <div className="summary-card">
                                            <h3>Total: ${cartTotal.toFixed(2)}</h3>
                                            <button className="btn-primary checkout-btn">Passer commande</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="page-shop fade-in">
                            <div className="page-header">
                                <h1>Boutique</h1>
                                <p className="result-count">{filteredProducts.length} produits trouvés</p>
                            </div>

                            <div className="product-grid">
                                {filteredProducts.map(product => (
                                    <div key={product.id} className="product-card">
                                        <div className="product-img">
                                            {product.imageUrl ? <img src={product.imageUrl} alt={product.name} /> : <span>📱</span>}
                                        </div>
                                        <div className="product-body">
                                            <span className="product-tag">{product.category?.name || 'Général'}</span>
                                            <h3 className="product-name">{product.name}</h3>
                                            <div className="product-footer">
                                                <span className="product-price">${product.price}</span>
                                                <button 
                                                    className={`add-btn ${isAdding === product.id ? 'loading' : ''}`}
                                                    onClick={() => addToCart(product)}
                                                    disabled={isAdding === product.id}
                                                >
                                                    {isAdding === product.id ? "..." : "Ajouter"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>
            {notification && <div className="toast">{notification}</div>}
        </div>
    );
};

export default Dashboard;