import React, { useState, useEffect } from 'react';
import API from '../api';

const OrderHistory = ({ onBack }: { onBack: () => void }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Status Colors Logic
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Delivered': return { bg: '#dcfce7', color: '#166534' };
      case 'Shipped': return { bg: '#e0f2fe', color: '#0369a1' };
      case 'Processing': return { bg: '#fef3c7', color: '#92400e' };
      default: return { bg: '#f3f4f6', color: '#374151' };
    }
  };

  useEffect(() => {
    API.get('/orders/my-orders')
      .then(res => setOrders(res.data))
      .catch(err => console.error("Orders fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '100px', fontSize: '18px' }}>⏳ Loading your orders...</div>;

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <button 
        onClick={onBack} 
        style={{ marginBottom: '20px', cursor: 'pointer', padding: '10px 20px', borderRadius: '10px', border: '1px solid #ddd', background: '#fff', fontWeight: '600' }}
      >
        ← Back to Shop
      </button>
      
      <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '25px' }}>My Orders</h2>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: '#f9fafb', borderRadius: '24px', border: '1px dashed #ccc' }}>
          <p style={{ fontSize: '18px', color: '#666' }}>You dont't place any order. 📦</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map((order) => {
            const style = getStatusStyle(order.status);
            return (
              <div key={order._id} style={{ border: '1px solid #eee', borderRadius: '20px', padding: '24px', background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <div>
                    <span style={{ fontSize: '12px', color: '#888', letterSpacing: '0.5px' }}>ORDER #{order._id.slice(-8).toUpperCase()}</span>
                    <div style={{ fontWeight: '800', fontSize: '22px', marginTop: '4px' }}>₹{order.totalAmount}</div>
                  </div>
                  {/* Fixed the span/div tag mismatch here */}
                  <span style={{ background: style.bg, color: style.color, padding: '8px 16px', borderRadius: '30px', fontSize: '12px', fontWeight: 'bold' }}>
                    {order.status}
                  </span>
                </div>

                <div style={{ borderTop: '1px solid #f8f9fa', paddingTop: '15px', marginTop: '5px' }}>
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} style={{ fontSize: '15px', color: '#444', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '20px' }}>{item.emoji}</span> 
                      <span>{item.name} <b style={{ color: '#999' }}>x{item.qty}</b></span>
                    </div>
                  ))}
                </div>
                
                <div style={{ marginTop: '20px', fontSize: '13px', color: '#aaa', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Placed on: {new Date(order.createdAt).toLocaleDateString()}</span>
                  <span>Payment: {order.paymentMethod || 'COD'}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;