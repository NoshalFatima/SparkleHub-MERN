import { useState, useRef, useEffect } from 'react';

const useInView = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, inView };
};

const SubscriptionsPage = ({ showToast }: { showToast: (msg: string, type?: string) => void }) => {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const cardsRef = useInView();
  const faqRef = useInView();

  const plans = [
    {
      name: 'Starter',
      monthlyPrice: 499,
      yearlyPrice: 399,
      desc: 'Perfect for beginners',
      emoji: '🌱',
      color: '#f8faff',
      textColor: '#1a1a2e',
      accentColor: '#0d6efd',
      features: [
        { text: '2 full-size products', included: true },
        { text: 'Monthly delivery', included: true },
        { text: 'Free shipping', included: true },
        { text: 'Early access deals', included: false },
        { text: 'Derm consultation', included: false },
        { text: 'Gift on birthday', included: false },
      ],
      popular: false,
      badge: '',
    },
    {
      name: 'Glow Pro',
      monthlyPrice: 999,
      yearlyPrice: 799,
      desc: 'Our most loved plan',
      emoji: '✨',
      color: '#0d6efd',
      textColor: '#fff',
      accentColor: '#fff',
      features: [
        { text: '4 premium products', included: true },
        { text: 'Monthly delivery', included: true },
        { text: 'Free express shipping', included: true },
        { text: 'Early access deals', included: true },
        { text: 'Derm consultation', included: false },
        { text: 'Gift on birthday', included: true },
      ],
      popular: true,
      badge: 'MOST POPULAR',
    },
    {
      name: 'Ultimate',
      monthlyPrice: 1799,
      yearlyPrice: 1449,
      desc: 'Complete luxury routine',
      emoji: '👑',
      color: '#1a1a2e',
      textColor: '#fff',
      accentColor: '#f59e0b',
      features: [
        { text: '7 full-size products', included: true },
        { text: 'Bi-weekly delivery', included: true },
        { text: 'Free same-day shipping', included: true },
        { text: 'Early access + discounts', included: true },
        { text: 'Monthly derm consultation', included: true },
        { text: 'Birthday gift box', included: true },
      ],
      popular: false,
      badge: 'PREMIUM',
    },
  ];

  const faqs = [
    { q: 'When cancel this?', a: 'Any Time :No hidden fees koi & no commentment. Cancel by one click from account.' },
    { q: 'Can Products Change?', a: 'Yes! Before Delivery u can customize your box accordin to preferences.' },
    { q: 'How much Saving in Yearly plan?', a: '20% saving and first delivery of product is free .' },
    { q: 'How much time take for deliverly?', a: 'Standard 3-5 business days. 2 Days at Glow Pro , At Ultimate available at same day.' },
  ];

  return (
    <div style={{ fontFamily: "'Sora', system-ui, sans-serif", background: '#fafafa' }}>

      {/* ── Hero ── */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #0d1b4b 100%)',
        padding: '80px 24px 60px', textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(13,110,253,0.12)', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(245,158,11,0.1)', filter: 'blur(30px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-block', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '20px', padding: '6px 18px', fontSize: '12px', color: '#f59e0b', fontWeight: '700', letterSpacing: '1.5px', marginBottom: '20px' }}>
            📦 MONTHLY GLOW PLANS
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900', color: '#fff', margin: '0 0 16px', letterSpacing: '-1px' }}>
            Never Run Out of<br /><span style={{ color: '#f59e0b' }}>Your Favorites</span>
          </h1>
          <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.6)', marginBottom: '36px', maxWidth: '480px', margin: '0 auto 36px' }}>
            Curated skincare delivered to your door. Save more, stress less.
          </p>

          {/* Billing Toggle */}
          <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.08)', borderRadius: '50px', padding: '4px', border: '1px solid rgba(255,255,255,0.12)' }}>
            {(['monthly', 'yearly'] as const).map(b => (
              <button key={b} onClick={() => setBilling(b)} style={{
                padding: '10px 28px', borderRadius: '50px', border: 'none',
                background: billing === b ? '#fff' : 'none',
                color: billing === b ? '#1a1a2e' : 'rgba(255,255,255,0.6)',
                fontWeight: '700', fontSize: '14px', cursor: 'pointer',
                transition: 'all 0.25s',
              }}>
                {b === 'monthly' ? 'Monthly' : 'Yearly'} {b === 'yearly' && <span style={{ background: '#10b981', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '10px', marginLeft: '6px' }}>-20%</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Plan Cards ── */}
      <div ref={cardsRef.ref} style={{ padding: '60px 24px', maxWidth: '1060px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', alignItems: 'start' }}>
          {plans.map((plan, i) => {
            const price = billing === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
            return (
              <div key={plan.name} style={{
                background: plan.color,
                borderRadius: '28px',
                padding: '36px 28px',
                border: plan.popular ? '2.5px solid #f59e0b' : `1px solid ${plan.textColor === '#fff' ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}`,
                position: 'relative',
                transition: 'transform 0.25s, box-shadow 0.25s',
                animation: cardsRef.inView ? `fadeUp 0.5s ease ${i * 0.12}s both` : 'none',
                marginTop: plan.popular ? '0' : '12px',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-8px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 24px 60px rgba(0,0,0,0.15)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
              >
                {plan.badge && (
                  <div style={{
                    position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
                    background: plan.popular ? '#f59e0b' : '#1a1a2e',
                    color: '#fff', padding: '5px 18px', borderRadius: '20px',
                    fontSize: '11px', fontWeight: '800', letterSpacing: '1px', whiteSpace: 'nowrap',
                  }}>{plan.badge}</div>
                )}

                {/* Plan Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '14px',
                    background: plan.textColor === '#fff' ? 'rgba(255,255,255,0.12)' : '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px',
                  }}>{plan.emoji}</div>
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '20px', color: plan.textColor }}>{plan.name}</div>
                    <div style={{ fontSize: '13px', color: plan.textColor, opacity: 0.6 }}>{plan.desc}</div>
                  </div>
                </div>

                {/* Price */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '42px', fontWeight: '900', color: plan.accentColor, lineHeight: 1 }}>₹{price}</span>
                    <span style={{ fontSize: '14px', color: plan.textColor, opacity: 0.5 }}>/mo</span>
                  </div>
                  {billing === 'yearly' && (
                    <div style={{ fontSize: '12px', color: '#10b981', fontWeight: '700', marginTop: '4px' }}>
                      ✓ Save ₹{(plan.monthlyPrice - plan.yearlyPrice) * 12}/year
                    </div>
                  )}
                </div>

                {/* Features */}
                <div style={{ marginBottom: '28px' }}>
                  {plan.features.map(f => (
                    <div key={f.text} style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '9px 0',
                      borderBottom: `1px solid ${plan.textColor === '#fff' ? 'rgba(255,255,255,0.07)' : '#f0f0f0'}`,
                      opacity: f.included ? 1 : 0.35,
                    }}>
                      <span style={{ fontSize: '14px', flexShrink: 0 }}>{f.included ? '✅' : '❌'}</span>
                      <span style={{ fontSize: '14px', color: plan.textColor, fontWeight: f.included ? '500' : '400' }}>{f.text}</span>
                    </div>
                  ))}
                </div>

                <button onClick={() => showToast(`${plan.name} plan subscribe kar liya! 🎉`, 'success')} style={{
                  width: '100%',
                  background: plan.popular ? '#f59e0b' : plan.accentColor,
                  color: plan.popular ? '#1a1a2e' : (plan.accentColor === '#fff' ? '#0d6efd' : '#fff'),
                  border: plan.accentColor === '#fff' ? '2px solid rgba(255,255,255,0.3)' : 'none',
                  borderRadius: '14px', padding: '15px',
                  fontWeight: '800', fontSize: '15px', cursor: 'pointer',
                  transition: 'opacity 0.2s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  Get {plan.name} →
                </button>
              </div>
            );
          })}
        </div>

        {/* Trust line */}
        <p style={{ textAlign: 'center', color: '#aaa', fontSize: '13px', marginTop: '32px', fontWeight: '500' }}>
          🔒 Cancel anytime &nbsp;·&nbsp; 🚚 Free delivery &nbsp;·&nbsp; 💯 Satisfaction guaranteed
        </p>
      </div>

      {/* ── FAQ ── */}
      <div ref={faqRef.ref} style={{ background: '#fff', padding: '60px 24px 80px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#1a1a2e', textAlign: 'center', marginBottom: '40px' }}>
            Common Questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {faqs.map((faq, i) => (
              <FaqItem key={faq.q} faq={faq} delay={i * 0.1} inView={faqRef.inView} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── FAQ Accordion Item ────────────────────────────────────────
const FaqItem = ({ faq, delay, inView }: { faq: { q: string; a: string }; delay: number; inView: boolean }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      border: '1.5px solid #f0f0f0', borderRadius: '16px', overflow: 'hidden',
      transition: 'border-color 0.2s',
      animation: inView ? `fadeUp 0.5s ease ${delay}s both` : 'none',
      borderColor: open ? '#0d6efd' : '#f0f0f0',
    }}>
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', padding: '20px 24px', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center',
        background: open ? '#f0f4ff' : '#fff',
        border: 'none', cursor: 'pointer', textAlign: 'left',
        transition: 'background 0.2s',
      }}>
        <span style={{ fontWeight: '700', fontSize: '15px', color: '#1a1a2e' }}>{faq.q}</span>
        <span style={{ fontSize: '20px', color: '#0d6efd', transition: 'transform 0.25s', transform: open ? 'rotate(45deg)' : 'none', flexShrink: 0 }}>+</span>
      </button>
      <div style={{ maxHeight: open ? '200px' : '0', overflow: 'hidden', transition: 'max-height 0.35s ease' }}>
        <p style={{ margin: 0, padding: '0 24px 20px', fontSize: '14px', color: '#666', lineHeight: 1.7 }}>{faq.a}</p>
      </div>
    </div>
  );
};

export default SubscriptionsPage;
