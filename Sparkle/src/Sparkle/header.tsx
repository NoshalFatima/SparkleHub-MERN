import React, { useState, useEffect } from 'react';

const Header = ({ cartCount, onCartOpen, onLoginOpen, onSearch, currentPage, setCurrentPage, userName, onLogout }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [searchOpen, setSearchOpen] = useState(false); 
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchVal.trim()) return;
    onSearch(searchVal);
    setIsOpen(false);
    setSearchOpen(false);
  };

 
  const navLinks = [
    { label: 'Home', page: 'home' },
    { label: 'Products', page: 'products' },
    { label: 'Our Science', page: 'science' },
    { label: 'Subscriptions', page: 'subscriptions' },
  ];

 
  if (userName) {
    navLinks.push({ label: 'My Orders 📦', page: 'orders' });
  }

  return (
    <>
      {/* ====== MAIN HEADER ====== */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: '70px', backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        zIndex: 1000, display: 'flex', alignItems: 'center',
      }}>
        <div style={{
          width: '100%', padding: '0 20px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          gap: '12px',
        }}>

          {/* Logo */}
          <div onClick={() => setCurrentPage('home')} style={{
            fontWeight: '800', fontSize: '20px', color: '#0d6efd',
            display: 'flex', alignItems: 'center', gap: '8px',
            cursor: 'pointer', flexShrink: 0,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#f59e0b">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
            </svg>
            <span>SparkleHub</span>
          </div>

          {/* Desktop Nav */}
          {!isMobile && (
            <nav style={{ display: 'flex', gap: '4px', flex: 1, justifyContent: 'center' }}>
              {navLinks.map(link => (
                <button key={link.page} onClick={() => setCurrentPage(link.page)} style={{
                  background: currentPage === link.page ? '#f0f4ff' : 'none',
                  border: 'none', cursor: 'pointer', padding: '8px 14px',
                  borderRadius: '8px', fontWeight: '600', fontSize: '13px', 
                  color: currentPage === link.page ? '#0d6efd' : '#333',
                  whiteSpace: 'nowrap',
                }}>{link.label}</button>
              ))}
            </nav>
          )}

          {/* Right Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>

            {/* Search */}
            {!isMobile ? (
              <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                  placeholder="Search..."
                  style={{
                    border: '1px solid #e5e7eb', borderRadius: '20px',
                    padding: '7px 16px', fontSize: '14px', outline: 'none',
                    width: '140px', color: '#333',
                  }}
                />
              </form>
            ) : (
              <button onClick={() => setSearchOpen(!searchOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </button>
            )}

            {/* Login / Logout Icon */}
            <button onClick={userName ? onLogout : onLoginOpen} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '4px', display: 'flex', alignItems: 'center',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={userName ? "#0d6efd" : "#333"} strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </button>

            {/* Cart */}
            <div onClick={onCartOpen} style={{ position: 'relative', cursor: 'pointer' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-6px', right: '-8px',
                  backgroundColor: '#ef4444', color: 'white', borderRadius: '50%',
                  width: '18px', height: '18px', fontSize: '10px', fontWeight: 'bold',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{cartCount}</span>
              )}
            </div>

            {/* Hamburger Mobile */}
            {isMobile && (
              <button onClick={() => setIsOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.2">
                  <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ====== MOBILE SEARCH BAR ====== */}
      <div style={{
        position: 'fixed', top: '70px', left: 0, right: 0,
        backgroundColor: '#fff', borderBottom: '1px solid #e5e7eb',
        maxHeight: searchOpen ? '70px' : '0', overflow: 'hidden',
        transition: 'all 0.3s ease', zIndex: 999,
        padding: searchOpen ? '12px 20px' : '0 20px',
      }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
          <input
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            placeholder="Search products..."
            style={{ flex: 1, border: '1px solid #e5e7eb', borderRadius: '20px', padding: '9px 16px', outline: 'none' }}
          />
        </form>
      </div>

      {/* ====== OVERLAY ====== */}
      {isOpen && <div onClick={() => setIsOpen(false)} style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 8000, backdropFilter: 'blur(3px)',
      }} />}

      {/* ====== SIDEBAR ====== */}
      <div style={{
        position: 'fixed', top: 0, left: isOpen ? '0px' : '-300px',
        width: '270px', height: '100vh', backgroundColor: '#fff',
        zIndex: 9000, transition: '0.38s ease',
        boxShadow: '6px 0 30px rgba(0,0,0,0.1)',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ backgroundColor: '#0d6efd', height: '70px', display: 'flex', alignItems: 'center', padding: '0 20px', color: 'white', fontWeight: 'bold', justifyContent: 'space-between' }}>
          <span>Menu</span>
          <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px' }}>×</button>
        </div>

        {/* User Profile in Sidebar */}
        {userName && (
          <div style={{ padding: '20px', background: '#f8f9fa', borderBottom: '1px solid #eee' }}>
            <div style={{ fontWeight: 'bold' }}>Hi, {userName} 👋</div>
            <div style={{ fontSize: '12px', color: '#888' }}>Welcome back!</div>
          </div>
        )}

        {/* Sidebar Nav Links */}
        <nav style={{ flex: 1 }}>
          {navLinks.map(link => (
            <button key={link.page} onClick={() => { setCurrentPage(link.page); setIsOpen(false); }} style={{
              display: 'block', width: '100%', padding: '18px 22px', border: 'none',
              background: currentPage === link.page ? '#f0f4ff' : 'transparent',
              textAlign: 'left', fontWeight: '600', color: currentPage === link.page ? '#0d6efd' : '#333',
              borderBottom: '1px solid #f9f9f9'
            }}>
              {link.label}
            </button>
          ))}
        </nav>

        {/* Sidebar Bottom */}
        <div style={{ padding: '20px' }}>
          <button onClick={() => { userName ? onLogout() : onLoginOpen(); setIsOpen(false); }} style={{
            width: '100%', padding: '12px', borderRadius: '10px', border: 'none',
            background: userName ? '#ef4444' : '#0d6efd', color: 'white', fontWeight: 'bold'
          }}>
            {userName ? 'Logout' : 'Login / Register'}
          </button>
        </div>
      </div>
    </>
  );
};

export default Header;