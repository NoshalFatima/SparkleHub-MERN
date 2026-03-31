import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// ── Animated Counter ──────────────────────────────────────────
const Counter = ({ end, suffix = '', duration = 2000 }: { end: number; suffix?: string; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const increment = end / (duration / 16);
        const timer = setInterval(() => {
          start += increment;
          if (start >= end) { setCount(end); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

const Hero = ({ onShopNow, onLoginOpen }: { onShopNow: () => void; onLoginOpen: () => void }) => {
  const [totalOrders, setTotalOrders] = useState(840);
  const [heroVisible, setHeroVisible] = useState(false);

  // Realtime order count
  useEffect(() => {
    axios.get('http://localhost:5000/api/orders/all-count')
      .then(res => setTotalOrders(res.data.count))
      .catch(() => {});
    setTimeout(() => setHeroVisible(true), 80);
  }, []);

  const features = [
    { icon: '🚚', text: 'Free Delivery over ₹999' },
    { icon: '↩️', text: '30-Day Returns' },
    { icon: '💯', text: '100% Authentic' },
    { icon: '🔒', text: 'Secure Payments' },
  ];

  const badges = [
    { icon: '🌿', text: 'Natural Ingredients' },
    { icon: '🔬', text: 'Dermatologist Tested' },
    { icon: '🚫', text: 'Paraben Free' },
    { icon: '♻️', text: 'Eco Packaging' },
  ];

  const stats = [
    { value: 12000 + totalOrders, suffix: '+', label: 'Happy Customers' },
    { value: 4.8, suffix: '★', label: 'Average Rating', noAnim: true },
    { value: 30, suffix: '+', label: 'Products' },
    { value: 100, suffix: '%', label: 'Natural Ingredients' },
  ];

  return (
    <div style={{ fontFamily: "'Sora', system-ui, sans-serif" }}>

      {/* ── Hero Main ── */}
      <div style={{
        minHeight: '92vh',
        background: 'linear-gradient(145deg, #f0f4ff 0%, #fafbff 40%, #fff5f0 70%, #f0fdf4 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '80px 24px 60px', textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background decorative blobs */}
        <div style={{ position: 'absolute', top: '8%', left: '5%', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(13,110,253,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '260px', height: '260px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(13,110,253,0.03) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{
          maxWidth: '720px', position: 'relative', zIndex: 1,
          opacity: heroVisible ? 1 : 0,
          transform: heroVisible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(13,110,253,0.08)', border: '1px solid rgba(13,110,253,0.2)',
            padding: '8px 20px', borderRadius: '50px', fontSize: '13px',
            fontWeight: '700', color: '#0d6efd', marginBottom: '28px',
            letterSpacing: '0.5px',
          }}>
            <span style={{ fontSize: '16px' }}>✨</span>
            SCIENCE-BACKED SKINCARE
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(40px, 7vw, 68px)', fontWeight: '900',
            color: '#1a1a2e', lineHeight: 1.05, marginBottom: '24px',
            letterSpacing: '-2px',
          }}>
            Glow Like You<br />
            <span style={{
              color: '#0d6efd',
              background: 'linear-gradient(135deg, #0d6efd, #7c3aed)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Were Born To</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: '18px', color: '#666', lineHeight: 1.75,
            maxWidth: '520px', margin: '0 auto 40px',
            fontWeight: '400',
          }}>
            Clean, effective skincare made with ingredients your skin actually loves.
            No harsh chemicals — just visible results.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '52px' }}>
            <button onClick={onShopNow} style={{
              background: 'linear-gradient(135deg, #0d6efd, #0056d2)',
              color: '#fff', border: 'none', borderRadius: '50px',
              padding: '17px 40px', fontWeight: '800', fontSize: '16px',
              cursor: 'pointer', boxShadow: '0 8px 32px rgba(13,110,253,0.35)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              letterSpacing: '-0.3px',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(13,110,253,0.45)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(13,110,253,0.35)'; }}
            >
              Shop Now →
            </button>
            <button onClick={onLoginOpen} style={{
              background: '#fff', color: '#0d6efd',
              border: '2px solid #0d6efd', borderRadius: '50px',
              padding: '17px 40px', fontWeight: '800', fontSize: '16px',
              cursor: 'pointer', transition: 'all 0.2s',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#0d6efd'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#fff'; (e.currentTarget as HTMLElement).style.color = '#0d6efd'; }}
            >
              Get Free Samples
            </button>
          </div>

          {/* Trust Badges */}
          <div style={{ display: 'flex', gap: '28px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {badges.map((badge, i) => (
              <div key={badge.text} style={{
                textAlign: 'center',
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? 'translateY(0)' : 'translateY(16px)',
                transition: `opacity 0.6s ease ${0.4 + i * 0.1}s, transform 0.6s ease ${0.4 + i * 0.1}s`,
              }}>
                <div style={{ fontSize: '26px', marginBottom: '6px' }}>{badge.icon}</div>
                <p style={{ fontSize: '11px', fontWeight: '700', color: '#888', margin: 0, letterSpacing: '0.3px' }}>
                  {badge.text.toUpperCase()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Features Strip ── */}
      <div style={{
        background: 'linear-gradient(90deg, #0d6efd, #0056d2)',
        padding: '20px 40px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap', maxWidth: '900px', margin: '0 auto' }}>
          {features.map(f => (
            <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', fontSize: '14px', fontWeight: '600' }}>
              <span style={{ fontSize: '18px' }}>{f.icon}</span>
              {f.text}
            </div>
          ))}
        </div>
      </div>

      {/* ── Realtime Stats ── */}
      <div style={{ padding: '72px 24px', background: '#fff', textAlign: 'center' }}>
        <p style={{ color: '#0d6efd', fontWeight: '700', fontSize: '12px', letterSpacing: '2px', marginBottom: '12px' }}>
          OUR NUMBERS
        </p>
        <h2 style={{ fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: '900', color: '#1a1a2e', marginBottom: '56px', letterSpacing: '-0.5px' }}>
          Trusted by Thousands,<br />Loved by Skin
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap', maxWidth: '800px', margin: '0 auto' }}>
          {stats.map((stat, i) => (
            <div key={stat.label} style={{
              animation: `fadeUp 0.5s ease ${i * 0.1}s both`,
              minWidth: '130px',
            }}>
              <div style={{
                fontSize: 'clamp(32px, 5vw, 46px)', fontWeight: '900',
                background: 'linear-gradient(135deg, #0d6efd, #7c3aed)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                lineHeight: 1, marginBottom: '8px',
              }}>
                {stat.noAnim
                  ? `${stat.value}${stat.suffix}`
                  : <Counter end={stat.value} suffix={stat.suffix} />
                }
              </div>
              <div style={{ fontSize: '13px', color: '#999', fontWeight: '600', letterSpacing: '0.3px' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Featured Products Teaser ── */}
      <div style={{
        background: 'linear-gradient(135deg, #f0f4ff, #fafbff)',
        padding: '64px 24px', textAlign: 'center',
      }}>
        <p style={{ color: '#0d6efd', fontWeight: '700', fontSize: '12px', letterSpacing: '2px', marginBottom: '12px' }}>BESTSELLERS</p>
        <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: '900', color: '#1a1a2e', marginBottom: '16px', letterSpacing: '-0.5px' }}>
          What Everyone's Loving
        </h2>
        <p style={{ color: '#888', marginBottom: '40px', fontSize: '16px' }}>
          Our top-rated formulas, backed by real reviews.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '40px' }}>
          {[
            { emoji: '🧴', name: 'Glow Boost Face Wash', price: '₹899', rating: '4.8★' },
            { emoji: '✨', name: 'Clear Skin Serum', price: '₹1,599', rating: '4.9★' },
            { emoji: '🌙', name: 'Night Repair Cream', price: '₹1,899', rating: '4.9★' },
            { emoji: '💧', name: 'Hydra Surge Moisturizer', price: '₹1,299', rating: '4.7★' },
          ].map((p, i) => (
            <div key={p.name} onClick={onShopNow} style={{
              background: '#fff', borderRadius: '20px', padding: '24px 20px',
              border: '1px solid #f0f0f0', width: '160px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)', cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              animation: `fadeUp 0.5s ease ${i * 0.1}s both`,
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 40px rgba(0,0,0,0.1)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)'; }}
            >
              <div style={{ fontSize: '44px', marginBottom: '12px' }}>{p.emoji}</div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#1a1a2e', marginBottom: '6px', lineHeight: 1.3 }}>{p.name}</div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#0d6efd' }}>{p.price}</div>
              <div style={{ fontSize: '12px', color: '#f59e0b', fontWeight: '700', marginTop: '4px' }}>{p.rating}</div>
            </div>
          ))}
        </div>
        <button onClick={onShopNow} style={{
          background: '#1a1a2e', color: '#fff', border: 'none',
          borderRadius: '50px', padding: '15px 40px',
          fontWeight: '700', fontSize: '15px', cursor: 'pointer',
          transition: 'background 0.2s',
        }}
          onMouseEnter={e => (e.currentTarget.style.background = '#0d6efd')}
          onMouseLeave={e => (e.currentTarget.style.background = '#1a1a2e')}
        >
          View All Products →
        </button>
      </div>

    </div>
  );
};

export default Hero;
