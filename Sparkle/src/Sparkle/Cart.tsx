

const Cart = ({ isOpen, onClose, cartItems, onRemove, onQtyChange, onCheckout, isLoggedIn }: any) => {
  const subtotal = cartItems.reduce((sum: number, item: any) => sum + item.price * item.qty, 0);
  const delivery = subtotal > 999 ? 0 : 99;
  const total = subtotal + delivery;

  return (
    <>
      {/* Overlay */}
      <div onClick={onClose} style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 8000,
        opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none',
        transition: 'opacity 0.3s ease', backdropFilter: 'blur(3px)',
      }} />

      {/* Cart Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: isOpen ? '0' : '-400px',
        width: '360px', height: '100vh', backgroundColor: '#fff',
        zIndex: 9000, transition: 'right 0.38s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: '-6px 0 30px rgba(0,0,0,0.15)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#1a1a2e', height: '70px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 20px', flexShrink: 0,
        }}>
          <div style={{ color: '#fff', fontWeight: '700', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            My Cart ({cartItems.length})
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#aaa' }}>
              <div style={{ fontSize: '56px', marginBottom: '16px' }}>🛒</div>
              <p style={{ fontSize: '17px', fontWeight: '600', color: '#555' }}>Cart is open</p>
              <p style={{ fontSize: '14px', marginTop: '8px' }}>Add the Product!</p>
            </div>
          ) : (
            cartItems.map((item: any) => (
              <div key={item._id || item.id} style={{
                display: 'flex', gap: '14px', padding: '14px',
                background: '#f9fafb', borderRadius: '12px', marginBottom: '12px',
                border: '1px solid #f0f0f0',
              }}>
                <div style={{
                  width: '60px', height: '60px', background: '#fff',
                  borderRadius: '10px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '28px', flexShrink: 0,
                  border: '1px solid #f0f0f0',
                }}>{item.emoji}</div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: '700', fontSize: '14px', color: '#1a1a2e', margin: '0 0 4px', lineHeight: '1.3' }}>{item.name}</p>
                  <p style={{ fontSize: '16px', fontWeight: '800', color: '#0d6efd', margin: '0 0 8px' }}>₹{item.price}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button onClick={() => onQtyChange(item._id || item.id, -1)} style={{ width: '28px', height: '28px', borderRadius: '8px', border: '1.5px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontWeight: '700', fontSize: '16px', color: '#333' }}>−</button>
                    <span style={{ fontWeight: '700', minWidth: '20px', textAlign: 'center' }}>{item.qty}</span>
                    <button onClick={() => onQtyChange(item._id || item.id, 1)} style={{ width: '28px', height: '28px', borderRadius: '8px', border: '1.5px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontWeight: '700', fontSize: '16px', color: '#333' }}>+</button>
                  </div>
                </div>

                <button onClick={() => onRemove(item._id || item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', alignSelf: 'flex-start', padding: '2px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div style={{ padding: '20px', borderTop: '1px solid #f0f0f0', flexShrink: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: '#888', fontSize: '14px' }}>Subtotal</span>
              <span style={{ fontWeight: '700', fontSize: '14px' }}>₹{subtotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ color: '#888', fontSize: '14px' }}>Delivery</span>
              <span style={{ fontWeight: '700', fontSize: '14px', color: delivery === 0 ? '#10b981' : '#333' }}>
                {delivery === 0 ? 'FREE' : `₹${delivery}`}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #f0f0f0', marginBottom: '16px' }}>
              <span style={{ fontWeight: '800', fontSize: '17px' }}>Total</span>
              <span style={{ fontWeight: '800', fontSize: '17px', color: '#0d6efd' }}>₹{total}</span>
            </div>

            {subtotal < 999 && (
              <p style={{ fontSize: '12px', color: '#f59e0b', textAlign: 'center', marginBottom: '12px', fontWeight: '600' }}>
                ₹{999 - subtotal} more add for free delivery!
              </p>
            )}

            {/* Checkout button — login check */}
            <button
              onClick={() => {
                if (!isLoggedIn) {
                  alert('Firstly,Login for Checkup!');
                  return;
                }
                onClose();
                onCheckout();
              }}
              style={{
                width: '100%', backgroundColor: '#0d6efd', color: '#fff',
                border: 'none', borderRadius: '12px', padding: '15px',
                fontWeight: '700', fontSize: '16px', cursor: 'pointer',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              {isLoggedIn ? 'Checkout →' : '🔒 Firstly,Login then Checkout'}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;