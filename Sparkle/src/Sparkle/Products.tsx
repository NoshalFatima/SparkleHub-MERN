import React, { useState, useEffect } from 'react';
import API from '../api'; // Ensure your API instance includes headers with the token
import { Checkout } from './RatingModel'; 

const categories = ['All', 'Face Wash', 'Moisturizer', 'Serum', 'Sunscreen', 'Toner', 'Mask', 'Kit'];

const Products = ({ onAddToCart, searchQuery, user, onLoginOpen, cartItems, onOrderSuccess }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    const [addedIds, setAddedIds] = useState([]);
    
    // Modals Control
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [ratingProduct, setRatingProduct] = useState(null); 
    const [hoverRating, setHoverRating] = useState(0);

    // 1. Fetch Products from DB
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await API.get('/products');
            setProducts(response.data);
        } catch (err) {
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // 2. ⭐ RATING SUBMIT (DATABASE SYNC)
    const handleRatingSubmit = async (productId, starCount) => {
        if (!user) {
            onLoginOpen();
            return;
        }

        try {
            // ✅ EXACT MATCH WITH BACKEND: Sending 'stars' and 'review'
            const response = await API.post(`/products/${productId}/rate`, {
                stars: Number(starCount),
                review: "Amazing product!" 
            });

            if (response.data) {
                alert(response.data.message || "Rating save ho gayi! ❤️");
                setRatingProduct(null);
                
                // Real-time UI update: Refresh products to show new average rating
                fetchProducts(); 
            }
        } catch (err) {
            console.error("Rating Error:", err.response?.data);
            const msg = err.response?.data?.message || "Rating save nahi hui!";
            alert(msg);
        }
    };

    const handleAdd = (product) => {
        onAddToCart(product);
        setAddedIds(prev => [...prev, product._id]);
        setTimeout(() => setAddedIds(prev => prev.filter(id => id !== product._id)), 1500);
    };

    // Filter Logic
    let filtered = products.filter(p => {
        const matchCat = activeCategory === 'All' || p.category === activeCategory;
        const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCat && matchSearch;
    });

    if (loading) return <div style={{ textAlign: 'center', padding: '100px', fontSize: '20px', color: '#666' }}>⏳ Loading SparkleHub...</div>;

    return (
        <div style={{ padding: '40px 24px', maxWidth: '1200px', margin: '0 auto' }}>
            
            {/* Header Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#1a1a2e' }}>Our Products</h2>
                
                {cartItems?.length > 0 && (
                    <button 
                        onClick={() => user ? setIsCheckoutOpen(true) : onLoginOpen()}
                        style={{ background: '#10b981', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}
                    >
                        🛒 Checkout (₹{cartItems.reduce((s, i) => s + (i.price * i.qty), 0)})
                    </button>
                )}
            </div>
            
            {/* Category Filter Bar */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
                {categories.map(cat => (
                    <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                        padding: '8px 20px', borderRadius: '25px', cursor: 'pointer', border: '1px solid #ddd',
                        background: activeCategory === cat ? '#0d6efd' : '#fff',
                        color: activeCategory === cat ? '#fff' : '#333', fontWeight: '600'
                    }}>{cat}</button>
                ))}
            </div>

            {/* Products Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
                {filtered.map(product => (
                    <div key={product._id} style={{ border: '1px solid #eee', borderRadius: '20px', padding: '20px', background: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                        <div style={{ fontSize: '60px', textAlign: 'center', background: '#f8f9fa', borderRadius: '15px', padding: '20px', marginBottom: '15px' }}>{product.emoji}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                           <h3 style={{ margin: '0' }}>{product.name}</h3>
                           <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>⭐ {product.rating}</span>
                        </div>
                        <p style={{ color: '#666', fontSize: '12px' }}>{product.reviews} reviews</p>
                        <p style={{ color: '#0d6efd', fontWeight: '800', fontSize: '22px', margin: '10px 0' }}>₹{product.price}</p>
                        
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => handleAdd(product)} style={{ 
                                flex: 2, background: addedIds.includes(product._id) ? '#10b981' : '#1a1a2e', 
                                color: '#fff', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700' 
                            }}>
                                {addedIds.includes(product._id) ? '✓ Added' : 'Add to Cart'}
                            </button>

                            <button onClick={() => setRatingProduct(product)} style={{ 
                                flex: 1, background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer' 
                            }}>⭐ Rate</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ✅ Checkout Modal */}
            {isCheckoutOpen && (
                <Checkout 
                    cartItems={cartItems} 
                    onClose={() => setIsCheckoutOpen(false)} 
                    onOrderSuccess={() => { setIsCheckoutOpen(false); onOrderSuccess(); }}
                    showToast={(msg) => alert(msg)} 
                />
            )}

            {/* ✅ Rating Modal (Database Ready) */}
            {ratingProduct && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 30000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
                   <div style={{ background: '#fff', padding: '30px', borderRadius: '24px', textAlign: 'center', width: '350px' }}>
                        <div style={{ fontSize: '50px' }}>{ratingProduct.emoji}</div>
                        <h3>Rate {ratingProduct.name}</h3>
                        <div style={{ margin: '20px 0' }}>
                            {[1, 2, 3, 4, 5].map(star => (
                                <span 
                                    key={star} 
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => handleRatingSubmit(ratingProduct._id, star)}
                                    style={{ 
                                        fontSize: '40px', cursor: 'pointer', 
                                        color: (hoverRating || 0) >= star ? '#f59e0b' : '#e5e7eb' 
                                    }}
                                >⭐</span>
                            ))}
                        </div>
                        <button onClick={() => setRatingProduct(null)} style={{ background: '#eee', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer' }}>Cancel</button>
                   </div>
                </div>
            )}
        </div>
    );
};

export default Products;