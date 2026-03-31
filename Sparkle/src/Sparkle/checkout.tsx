import { useState, useEffect } from 'react';
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
      .catch(() => console.error("Order fetch failed"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px', color: '#888' }}>
      <div style={{ fontSize: '40px', marginBottom: '12px' }}>⏳</div>
      <p style={{ fontWeight: '600' }}>Orders is loading...</p>
    </div>
  );

  return (
    <div style={{ padding: '40px 24px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button onClick={onBack} style={{
          background: 'none', border: '1.5px solid #e5e7eb', borderRadius: '10px',
          padding: '8px 16px', cursor: 'pointer', color: '#333', fontWeight: '600'
        }}>← Back</button>
        <h2 style={{ fontSize: '26px', fontWeight: '800', margin: 0 }}>My Orders</h2>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#aaa' }}>
          <div style={{ fontSize: '56px' }}>📦</div>
          <p>Abhi tak koi order nahi hai.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map(order => {
            const sc = statusColors[order.status] || statusColors.Placed;
            const isExp = expanded === order._id;
            return (
              <div key={order._id} style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '16px', overflow: 'hidden' }}>
                <div onClick={() => setExpanded(isExp ? null : order._id)} style={{ padding: '18px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#888' }}>Order #{order._id.slice(-8).toUpperCase()}</div>
                    <div style={{ fontWeight: '700' }}>₹{order.totalAmount} ({order.items.length} items)</div>
                  </div>
                  <span style={{ background: sc.bg, color: sc.color, padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>{order.status}</span>
                </div>
                {isExp && (
                  <div style={{ padding: '16px', borderTop: '1px solid #f0f0f0', background: '#fafafa' }}>
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                        <span>{item.emoji} {item.name} (x{item.qty})</span>
                        <span>₹{item.price * item.qty}</span>
                      </div>
                    ))}
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

  // ✅ ERROR FIX: Ensure cartItems is an array. If undefined, it becomes [].
  const safeCart = Array.isArray(cartItems) ? cartItems : [];

  // ✅ CALCULATION FIX: Use safeCart so .reduce never fails
  const subtotal = safeCart.reduce((sum: number, i: any) => sum + (Number(i.price || 0) * Number(i.qty || 1)), 0);
  const delivery = (subtotal > 999 || subtotal === 0) ? 0 : 99;
  const total = subtotal + delivery;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.phone.match(/^[0-9]{10}$/)) e.phone = '10 digit number';
    if (!form.street.trim()) e.street = 'Required';
    if (!form.pincode.match(/^[0-9]{6}$/)) e.pincode = '6 digit pin';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await API.post('/orders', {
        items: safeCart.map((i: any) => ({
          productId: i._id || i.id,
          name: i.name, price: i.price, emoji: i.emoji, qty: i.qty || 1,
        })),
        address: form,
        totalAmount: total,
        paymentMethod: 'COD',
      });
      setOrderId(res.data.orderId || res.data._id);
      setStep('success');
      onOrderSuccess();
      showToast('Order placed! 🎉', 'success');
    } catch (err: any) {
      showToast('Order failed!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field: string) => ({
    width: '100%', padding: '12px', borderRadius: '10px', fontSize: '14px',
    border: `1.5px solid ${errors[field] ? '#ef4444' : '#e5e7eb'}`,
    marginBottom: '10px', boxSizing: 'border-box' as const, outline: 'none'
  });

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 10000, backdropFilter: 'blur(4px)' }} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '420px', maxWidth: '90vw', background: '#fff', borderRadius: '24px', zIndex: 11000, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
        <div style={{ background: '#0d6efd', padding: '20px', color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>
          {step === 'address' ? '📦 Checkout' : step === 'confirm' ? '✅ Confirm' : '🎉 Success'}
        </div>
        
        <div style={{ padding: '24px' }}>
          {step === 'address' && (
            <div>
              <input style={inputStyle('name')} placeholder="Name" onChange={e => setForm({...form, name: e.target.value})} />
              <input style={inputStyle('phone')} placeholder="Phone" onChange={e => setForm({...form, phone: e.target.value})} />
              <input style={inputStyle('street')} placeholder="Address" onChange={e => setForm({...form, street: e.target.value})} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <input style={inputStyle('city')} placeholder="City" onChange={e => setForm({...form, city: e.target.value})} />
                <input style={inputStyle('pincode')} placeholder="Pincode" onChange={e => setForm({...form, pincode: e.target.value})} />
              </div>
              <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '12px', marginTop: '5px' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}><span>Total Items:</span><span>{safeCart.length}</span></div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px', marginTop: '5px', color: '#0d6efd' }}><span>Total:</span><span>₹{total}</span></div>
              </div>
              <button onClick={() => validate() && setStep('confirm')} style={{ width: '100%', background: '#0d6efd', color: '#fff', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', marginTop: '15px' }}>Next Step</button>
            </div>
          )}

          {step === 'confirm' && (
            <div style={{ textAlign: 'center' }}>
              <p>Confirm order for <strong>₹{total}</strong>?</p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button onClick={() => setStep('address')} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #ddd', background: 'none' }}>Back</button>
                <button onClick={handlePlaceOrder} disabled={loading} style={{ flex: 2, background: '#10b981', color: '#fff', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 'bold' }}>
                  {loading ? 'Processing...' : 'Confirm Order'}
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '50px' }}>✅</div>
              <h3>Order Placed Successfully!</h3>
              <p style={{ color: '#666' }}>Order ID: #{orderId?.slice(-8).toUpperCase()}</p>
              <button onClick={onClose} style={{ width: '100%', background: '#0d6efd', color: '#fff', border: 'none', padding: '12px', borderRadius: '10px', marginTop: '15px', cursor: 'pointer' }}>Close</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// ✅ Named exports exactly as needed in App.tsx
export { Checkout, OrderHistory };
export default Checkout;