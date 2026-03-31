import { useState, useEffect } from 'react';

const AnimatedNumber = ({ value, suffix = '+', trigger }: { value: number; suffix?: string; trigger: boolean }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) { setCount(value); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [trigger, value]);
  return <>{count.toLocaleString()}{suffix}</>;
};

const Footer = ({ totalOrders, setCurrentPage }: {
  totalOrders: number;
  setCurrentPage?: (p: string) => void;
}) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const navGroups = [
    {
      title: 'Shop',
      links: [
        { label: 'All Products', page: 'products' },
        { label: 'Subscriptions', page: 'subscriptions' },
      ],
    },
    {
      title: 'Learn',
      links: [
        { label: 'Our Science', page: 'science' },
        { label: 'Ingredients', page: 'science' },
      ],
    },
    {
      title: 'Account',
      links: [
        { label: 'My Orders', page: 'orders' },
        { label: 'Login / Register', page: 'login' },
      ],
    },
  ];

  const stats = [
    { value: 12000 + totalOrders, suffix: '+', label: 'Customers' },
    { value: 4, suffix: '.9★', label: 'Avg Rating', noAnim: true },
    { value: 500, suffix: '+', label: 'Derms Trust Us' },
    { value: 100, suffix: '%', label: 'Vegan' },
  ];

  return (
    // ✅ footer = full width — margin/padding sab inside se control
    <footer style={{
      width: '100%',
      background: '#0f0c29',
      color: '#fff',
      boxSizing: 'border-box',
      fontFamily: "'Sora', system-ui, sans-serif",
    }}>

      {/* ── Stats Strip ── */}
      <div style={{
        background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
        padding: '24px 40px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '16px',
        textAlign: 'center',
      }}>
        {stats.map((s) => (
          <div key={s.label}>
            <div style={{ fontSize: '28px', fontWeight: '900', color: '#1a1a2e', lineHeight: 1 }}>
              {s.noAnim ? `${s.value}${s.suffix}` : <AnimatedNumber value={s.value} suffix={s.suffix} trigger={visible} />}
            </div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(26,26,46,0.6)', marginTop: '4px', letterSpacing: '0.8px' }}>
              {s.label.toUpperCase()}
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Footer Body ── */}
      <div style={{ padding: '64px 40px 48px', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '48px', marginBottom: '56px' }}>

          {/* Brand Column */}
          <div>
            <div style={{ fontSize: '26px', fontWeight: '900', color: '#f59e0b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ✨ SparkleHub
            </div>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', lineHeight: 1.8, marginBottom: '24px', maxWidth: '280px' }}>
              Dermatologist-approved, science-backed skincare that's 100% vegan and cruelty-free. Real ingredients, real results.
            </p>

            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {[
                { label: 'Instagram', icon: '📸' },
                { label: 'TikTok', icon: '🎵' },
                { label: 'Twitter', icon: '🐦' },
              ].map(s => (
                <button key={s.label} title={s.label} style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff', fontSize: '18px', cursor: 'pointer',
                  transition: 'background 0.2s, border-color 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(245,158,11,0.15)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,158,11,0.3)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'; }}
                >{s.icon}</button>
              ))}
            </div>
          </div>

          {/* Nav Groups */}
          {navGroups.map(group => (
            <div key={group.title}>
              <div style={{ fontSize: '12px', fontWeight: '800', color: '#f59e0b', letterSpacing: '1.5px', marginBottom: '20px' }}>
                {group.title.toUpperCase()}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {group.links.map(link => (
                  <button key={link.label} onClick={() => setCurrentPage && setCurrentPage(link.page)} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'rgba(255,255,255,0.5)', fontSize: '14px', fontWeight: '500',
                    textAlign: 'left', padding: 0, transition: 'color 0.2s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                  >{link.label}</button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges Row */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.07)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          padding: '24px 0',
          display: 'flex', justifyContent: 'center',
          gap: '32px', flexWrap: 'wrap', marginBottom: '32px',
        }}>
          {[
            { icon: '🏆', text: 'ISO Certified' },
            { icon: '🐰', text: 'Cruelty Free' },
            { icon: '🌿', text: 'Vegan' },
            { icon: '♻️', text: 'Eco Pack' },
            { icon: '🔬', text: 'Lab Tested' },
            { icon: '🚚', text: 'Free Delivery ₹999+' },
          ].map(b => (
            <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.4)', fontSize: '13px', fontWeight: '600' }}>
              <span style={{ fontSize: '16px' }}>{b.icon}</span> {b.text}
            </div>
          ))}
        </div>

        {/* Bottom Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.25)', margin: 0 }}>
            © 2026 SparkleHub Skincare. Formulated in Lab, Inspired by Nature.
          </p>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['Privacy Policy', 'Terms of Service', 'Contact Us'].map(l => (
              <a key={l} href="#" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#f59e0b')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
              >{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;