import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Header from './Sparkle/header';
import Hero from './Sparkle/Hero';
import Products from './Sparkle/Products';
import Login from './Sparkle/Login';
import Cart from './Sparkle/Cart';
import Footer from './Sparkle/Footer';
import SciencePage from './Sparkle/SciencePage';
import SubscriptionsPage from './Sparkle/SubscriptionsPage';
import { Checkout, OrderHistory } from './Sparkle/checkout';

// ── Toast ─────────────────────────────────────────────────────
const Toast = ({ toasts }: { toasts: any[] }) => (
  <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 99999, display: 'flex', flexDirection: 'column', gap: '10px' }}>
    {toasts.map(t => (
      <div key={t.id} style={{
        background: t.type === 'success' ? '#10b981' : t.type === 'error' ? '#ef4444' : '#1a1a2e',
        color: '#fff', padding: '14px 22px', borderRadius: '16px', fontWeight: '700', fontSize: '14px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)', animation: 'slideInRight 0.35s ease',
        display: 'flex', alignItems: 'center', gap: '10px', minWidth: '220px',
      }}>
        <span>{t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : 'ℹ️'}</span>
        {t.message}
      </div>
    ))}
  </div>
);

// ── Page Fade Wrapper ─────────────────────────────────────────
const PageWrapper = ({ children, pageKey }: { children: React.ReactNode; pageKey: string }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 30);
    return () => clearTimeout(t);
  }, [pageKey]);
  return (
    <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(10px)', transition: 'opacity 0.35s ease, transform 0.35s ease' }}>
      {children}
    </div>
  );
};

// ── Main App ──────────────────────────────────────────────────
function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [totalOrdersCount, setTotalOrdersCount] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [toasts, setToasts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<any>(() => {
    try { return JSON.parse(localStorage.getItem('sparkle_user') || 'null'); } catch { return null; }
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setDbProducts(res.data))
      .catch(() => console.error("Products not load"));

    axios.get('http://localhost:5000/api/orders/all-count')
      .then(res => setTotalOrdersCount(res.data.count))
      .catch(() => setTotalOrdersCount(840));
  }, []);

  const showToast = useCallback((message: string, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  const handlePageChange = useCallback((page: string) => {
    setCurrentPage(page);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleAddToCart = useCallback((product: any) => {
    const productId = product._id || product.id;
    setCartItems(prev => {
      const existing = prev.find(i => (i._id || i.id) === productId);
      if (existing) return prev.map(i => (i._id || i.id) === productId ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    setCartOpen(true);
    showToast(`${product.name} add in cart!`);
  }, [showToast]);

  const handleRatingUpdate = useCallback(({ productId, newRating, newReviews }: any) => {
    setDbProducts(prev => prev.map(p => p._id === productId ? { ...p, rating: newRating, reviews: newReviews } : p));
    showToast('Rating is submit!Thanks ⭐');
  }, [showToast]);

  const handleLogout = useCallback(() => {
    localStorage.clear();
    setUser(null);
    setCartItems([]);
    showToast('Logout ho gaye! 👋', 'info');
    handlePageChange('home');
  }, [showToast, handlePageChange]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap');
        @keyframes slideInRight { from { opacity:0; transform:translateX(40px); } to { opacity:1; transform:translateX(0); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; background: #fff; }
        #root { width:100%; max-width:100%; margin:0; padding:0; display:block; }
        button:active { transform: scale(0.97); }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #f9f9f9; }
        ::-webkit-scrollbar-thumb { background: #ddd; border-radius: 3px; }
      `}</style>

      <div style={{ minHeight: '100vh', fontFamily: "'Sora', system-ui, sans-serif" }}>
        <Header
          cartCount={cartItems.reduce((sum, i) => sum + i.qty, 0)}
          onCartOpen={() => setCartOpen(true)}
          onLoginOpen={() => setLoginOpen(true)}
          onSearch={(q: string) => { setSearchQuery(q); handlePageChange('products'); }}
          currentPage={currentPage}
          setCurrentPage={handlePageChange}
          userName={user?.name}
          onLogout={handleLogout}
        />

        <div style={{ paddingTop: '70px' }}>
          <PageWrapper pageKey={currentPage}>
            {currentPage === 'home' && (
              <Hero onShopNow={() => handlePageChange('products')} onLoginOpen={() => setLoginOpen(true)} />
            )}
            {currentPage === 'products' && (
              <Products
                onAddToCart={handleAddToCart}
                searchQuery={searchQuery}
                dbProducts={dbProducts}
                user={user}
                onLoginOpen={() => setLoginOpen(true)}
                onRatingUpdate={handleRatingUpdate}
              />
            )}
            {currentPage === 'science' && (
              <SciencePage totalOrders={totalOrdersCount} />
            )}
            {currentPage === 'subscriptions' && (
              <SubscriptionsPage showToast={showToast} />
            )}
            {currentPage === 'orders' && (
              <OrderHistory onBack={() => handlePageChange('home')} />
            )}
          </PageWrapper>
        </div>

        {/* ✅ Footer full width — setCurrentPage bhi pass */}
        <Footer totalOrders={totalOrdersCount} setCurrentPage={handlePageChange} />

        <Cart
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          cartItems={cartItems}
          onRemove={(id: any) => { setCartItems(prev => prev.filter(i => (i._id || i.id) !== id)); showToast('Item Removed', 'info'); }}
          onQtyChange={(id: string, delta: number) => setCartItems(prev => prev.map(i => (i._id === id || i.id === id) ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0))}
          onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }}
          isLoggedIn={!!user}
        />

        <Login
          isOpen={loginOpen}
          onClose={() => setLoginOpen(false)}
          onLoginSuccess={(u: any) => { setUser(u); setLoginOpen(false); showToast(`Welcome, ${u.name}! 👋`); }}
        />

        {checkoutOpen && (
          <Checkout
            cartItems={cartItems}
            onClose={() => setCheckoutOpen(false)}
            onOrderSuccess={() => {
              setCartItems([]);
              setCheckoutOpen(false);
              setTotalOrdersCount(prev => prev + 1);
              showToast('Order place ho gaya! 🎉');
            }}
            showToast={showToast}
          />
        )}

        <Toast toasts={toasts} />
      </div>
    </>
  );
}

export default App;
