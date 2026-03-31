import  { useState, useEffect } from 'react';
import API from '../api';

// ── Status badge colors ───────────────────────────────────────
const statusColors: Record<string, { bg: string; color: string }> = {
  Placed:     { bg: '#e0f2fe', color: '#0369a1' },
  Processing: { bg: '#fef3c7', color: '#92400e' },
  Shipped:    { bg: '#ede9fe', color: '#5b21b6' },
  Delivered:  { bg: '#dcfce7', color: '#166534' },
  Cancelled:  { bg: '#fee2e2', color: '#991b1b' },
};

// ── Order History Page ────────────────────────────────────────
const OrderHistory = ({ onBack }: { onBack: () => void }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    API.get('/orders/my-orders')
      .then(res => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px', color: '#888' }}>
      <div style={{ fontSize: '40px', marginBottom: '12px' }}>⏳</div>
      <p style={{ fontWeight: '600' }}>Orders load ho rahe hain...</p>
    </div>
  );

  return (
    <div style={{ padding: '40px 24px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button onClick={onBack} style={{
          background: 'none', border: '1.5px solid #e5e7eb', borderRadius: '10px',
          padding: '8px 16px', cursor: 'pointer', color: '#333', fontWeight: '600', fontSize: '14px',
        }}>← Back</button>
        <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#1a1a2e', margin: 0 }}>My Orders</h2>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#aaa' }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>📦</div>
          <p style={{ fontSize: '18px', fontWeight: '600', color: '#555' }}>No order till now </p>
          <p style={{ fontSize: '14px' }}>Buy Product then order show there!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map(order => {
            const sc = statusColors[order.status] || statusColors.Placed;
            const isExp = expanded === order._id;
            return (
              <div key={order._id} style={{
                background: '#fff', border: '1px solid #f0f0f0', borderRadius: '16px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.05)', overflow: 'hidden',
                transition: 'box-shadow 0.2s',
              }}>
                {/* Order Header */}
                <div
                  onClick={() => setExpanded(isExp ? null : order._id)}
                  style={{
                    padding: '18px 22px', cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    flexWrap: 'wrap', gap: '12px',
                    background: isExp ? '#f8faff' : '#fff',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>
                      Order #{order._id.slice(-8).toUpperCase()} · {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a2e' }}>
                      {order.items.length} item{order.items.length > 1 ? 's' : ''} · ₹{order.totalAmount}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                      background: sc.bg, color: sc.color,
                      padding: '5px 14px', borderRadius: '20px',
                      fontSize: '12px', fontWeight: '700',
                    }}>{order.status}</span>
                    <span style={{ color: '#aaa', fontSize: '18px' }}>{isExp ? '▲' : '▼'}</span>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExp && (
                  <div style={{ padding: '0 22px 22px', borderTop: '1px solid #f0f0f0' }}>
                    {/* Items */}
                    <div style={{ marginTop: '16px', marginBottom: '16px' }}>
                      {order.items.map((item: any, idx: number) => (
                        <div key={idx} style={{
                          display: 'flex', alignItems: 'center', gap: '14px',
                          padding: '10px 0', borderBottom: '1px solid #f9f9f9',
                        }}>
                          <span style={{ fontSize: '28px' }}>{item.emoji}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '600', fontSize: '14px', color: '#1a1a2e' }}>{item.name}</div>
                            <div style={{ fontSize: '13px', color: '#888' }}>Qty: {item.qty}</div>
                          </div>
                          <div style={{ fontWeight: '700', color: '#0d6efd' }}>₹{item.price * item.qty}</div>
                        </div>
                      ))}
                    </div>

                    {/* Address + Payment */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
                      <div style={{ background: '#f9fafb', borderRadius: '10px', padding: '14px' }}>
                        <div style={{ fontSize: '11px', fontWeight: '700', color: '#888', marginBottom: '6px', letterSpacing: '0.5px' }}>DELIVERY ADDRESS</div>
                        <div style={{ fontSize: '13px', color: '#333', lineHeight: '1.6' }}>
                          {order.address.name}<br />
                          {order.address.street}<br />
                          {order.address.city} - {order.address.pincode}<br />
                          📞 {order.address.phone}
                        </div>
                      </div>
                      <div style={{ background: '#f9fafb', borderRadius: '10px', padding: '14px' }}>
                        <div style={{ fontSize: '11px', fontWeight: '700', color: '#888', marginBottom: '6px', letterSpacing: '0.5px' }}>PAYMENT</div>
                        <div style={{ fontSize: '13px', color: '#333' }}>
                          💵 {order.paymentMethod}<br />
                          <span style={{ color: '#10b981', fontWeight: '700' }}>Total: ₹{order.totalAmount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ── Main Checkout Component ───────────────────────────────────
const Checkout = ({ cartItems, onClose, onOrderSuccess, showToast }: any) => {
  const [step, setStep] = useState<'address' | 'confirm' | 'success'>('address');
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', street: '', city: '', pincode: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = cartItems.reduce((sum: number, i: any) => sum + i.price * i.qty, 0);
  const delivery = subtotal > 999 ? 0 : 99;
  const total = subtotal + delivery;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim())    e.name    = 'Naam zaroori hai';
    if (!form.phone.match(/^[0-9]{10}$/)) e.phone = '10 digit phone number daalo';
    if (!form.street.trim())  e.street  = 'Ghar ka address daalo';
    if (!form.city.trim())    e.city    = 'City daalo';
    if (!form.pincode.match(/^[0-9]{6}$/)) e.pincode = '6 digit pincode daalo';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await API.post('/orders', {
        items: cartItems.map((i: any) => ({
          productId: i._id || i.id,
          name: i.name, price: i.price,
          emoji: i.emoji, qty: i.qty,
        })),
        address: form,
        paymentMethod: 'COD',
      });
      setOrderId(res.data.orderId);
      setStep('success');
      onOrderSuccess();
      showToast('Order place ho gaya! 🎉', 'success');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Order nahi hua — dobara try karo!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field: string) => ({
    width: '100%', padding: '11px 16px', borderRadius: '10px', fontSize: '14px',
    border: `1.5px solid ${errors[field] ? '#ef4444' : '#e5e7eb'}`,
    outline: 'none', color: '#333', boxSizing: 'border-box' as const,
    background: '#fff', marginBottom: '4px',
  });

  return (
    <>
      {/* Overlay */}
      <div onClick={onClose} style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        background: 'rgba(0,0,0,0.5)', zIndex: 10000, backdropFilter: 'blur(4px)',
      }} />

      {/* Modal */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '520px', maxWidth: '95vw', maxHeight: '90vh',
        background: '#fff', borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        zIndex: 11000, display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        animation: 'fadeUp 0.3s ease',
      }}>
        {/* Modal Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e, #0d6efd)',
          padding: '20px 24px', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center', flexShrink: 0,
        }}>
          <div style={{ color: '#fff', fontWeight: '800', fontSize: '18px' }}>
            {step === 'address' ? '📦 Checkout' : step === 'confirm' ? '✅ Confirm Order' : '🎉 Order Placed!'}
          </div>
          {step !== 'success' && (
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>

        <div style={{ overflowY: 'auto', flex: 1 }}>

          {/* ── Step 1: Address Form ─────────────────────────── */}
          {step === 'address' && (
            <div style={{ padding: '24px' }}>
              <p style={{ fontSize: '13px', color: '#888', margin: '0 0 20px', fontWeight: '600' }}>DELIVERY ADDRESS</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ gridColumn: '1/-1' }}>
                  <input style={inputStyle('name')} placeholder="Poora naam *" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })} />
                  {errors.name && <p style={{ color: '#ef4444', fontSize: '12px', margin: '0 0 8px' }}>{errors.name}</p>}
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <input style={inputStyle('phone')} placeholder="Phone number (10 digits) *" value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })} />
                  {errors.phone && <p style={{ color: '#ef4444', fontSize: '12px', margin: '0 0 8px' }}>{errors.phone}</p>}
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <input style={inputStyle('street')} placeholder="Ghar/flat number, street, area *" value={form.street}
                    onChange={e => setForm({ ...form, street: e.target.value })} />
                  {errors.street && <p style={{ color: '#ef4444', fontSize: '12px', margin: '0 0 8px' }}>{errors.street}</p>}
                </div>
                <div>
                  <input style={inputStyle('city')} placeholder="City *" value={form.city}
                    onChange={e => setForm({ ...form, city: e.target.value })} />
                  {errors.city && <p style={{ color: '#ef4444', fontSize: '12px', margin: '0 0 8px' }}>{errors.city}</p>}
                </div>
                <div>
                  <input style={inputStyle('pincode')} placeholder="Pincode *" value={form.pincode}
                    onChange={e => setForm({ ...form, pincode: e.target.value })} />
                  {errors.pincode && <p style={{ color: '#ef4444', fontSize: '12px', margin: '0 0 8px' }}>{errors.pincode}</p>}
                </div>
              </div>

              {/* Order Summary */}
              <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '16px', marginTop: '20px' }}>
                <p style={{ fontSize: '12px', fontWeight: '700', color: '#888', margin: '0 0 12px', letterSpacing: '0.5px' }}>ORDER SUMMARY</p>
                {cartItems.map((item: any) => (
                  <div key={item._id || item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                    <span style={{ color: '#555' }}>{item.emoji} {item.name} × {item.qty}</span>
                    <span style={{ fontWeight: '600' }}>₹{item.price * item.qty}</span>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid #e5e7eb', marginTop: '10px', paddingTop: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                    <span style={{ color: '#888' }}>Delivery</span>
                    <span style={{ color: delivery === 0 ? '#10b981' : '#333', fontWeight: '600' }}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '800', color: '#0d6efd' }}>
                    <span>Total</span><span>₹{total}</span>
                  </div>
                </div>
              </div>

              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '12px 16px', marginTop: '12px', fontSize: '13px', color: '#92400e' }}>
                💵 Payment Method: <strong>Cash on Delivery (COD)</strong>
              </div>

              <button onClick={() => validate() && setStep('confirm')} style={{
                width: '100%', background: '#0d6efd', color: '#fff',
                border: 'none', borderRadius: '12px', padding: '14px',
                fontWeight: '700', fontSize: '16px', cursor: 'pointer',
                marginTop: '20px', transition: 'opacity 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >Continue →</button>
            </div>
          )}

          {/* ── Step 2: Confirm ──────────────────────────────── */}
          {step === 'confirm' && (
            <div style={{ padding: '24px' }}>
              <div style={{ background: '#f0f4ff', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
                <p style={{ fontSize: '12px', fontWeight: '700', color: '#0d6efd', margin: '0 0 8px' }}>DELIVERING TO</p>
                <p style={{ fontSize: '14px', color: '#1a1a2e', margin: 0, lineHeight: '1.7' }}>
                  <strong>{form.name}</strong><br />
                  {form.street}, {form.city} - {form.pincode}<br />
                  📞 {form.phone}
                </p>
              </div>

              {cartItems.map((item: any) => (
                <div key={item._id || item.id} style={{ display: 'flex', gap: '12px', padding: '12px 0', borderBottom: '1px solid #f0f0f0', alignItems: 'center' }}>
                  <span style={{ fontSize: '28px' }}>{item.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>{item.name}</div>
                    <div style={{ fontSize: '13px', color: '#888' }}>Qty: {item.qty}</div>
                  </div>
                  <div style={{ fontWeight: '700', color: '#0d6efd' }}>₹{item.price * item.qty}</div>
                </div>
              ))}

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0 0', fontSize: '18px', fontWeight: '800', color: '#1a1a2e' }}>
                <span>Total</span><span style={{ color: '#0d6efd' }}>₹{total}</span>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button onClick={() => setStep('address')} style={{
                  flex: 1, background: 'none', border: '1.5px solid #e5e7eb',
                  borderRadius: '12px', padding: '14px', fontWeight: '700',
                  fontSize: '15px', cursor: 'pointer', color: '#333',
                }}>← Edit</button>
                <button onClick={handlePlaceOrder} disabled={loading} style={{
                  flex: 2, background: loading ? '#93c5fd' : '#10b981',
                  color: '#fff', border: 'none', borderRadius: '12px',
                  padding: '14px', fontWeight: '700', fontSize: '15px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}>
                  {loading ? 'Placing...' : '✅ Place Order (COD)'}
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: Success ──────────────────────────────── */}
          {step === 'success' && (
            <div style={{ padding: '40px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px', animation: 'fadeUp 0.5s ease' }}>🎉</div>
              <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#1a1a2e', margin: '0 0 8px' }}>Order Place Ho Gaya!</h3>
              <p style={{ color: '#666', marginBottom: '8px', fontSize: '15px' }}>Shukriya aapka! Jaldi aayega. 🚚</p>
              <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '10px', padding: '12px', margin: '16px 0', display: 'inline-block' }}>
                <span style={{ fontSize: '13px', color: '#166534', fontWeight: '700' }}>
                  Order ID: #{orderId.slice(-8).toUpperCase()}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'center' }}>
                <button onClick={onClose} style={{
                  background: '#0d6efd', color: '#fff', border: 'none',
                  borderRadius: '12px', padding: '13px 28px',
                  fontWeight: '700', fontSize: '15px', cursor: 'pointer',
                }}>Shopping Continue Karo</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export { Checkout, OrderHistory };
export default Checkout;