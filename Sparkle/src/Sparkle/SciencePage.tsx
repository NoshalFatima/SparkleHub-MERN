import { useState, useEffect, useRef } from 'react';

// ── Intersection Observer Hook ────────────────────────────────
const useInView = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, inView };
};

// ── Animated Counter ──────────────────────────────────────────
const AnimatedNumber = ({ value, suffix = '+', trigger }: { value: number; suffix?: string; trigger: boolean }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const duration = 1800;
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

// ── Science Page ──────────────────────────────────────────────
const SciencePage = ({ totalOrders }: { totalOrders: number }) => {
  const statsRef = useInView();
  const ingredientsRef = useInView();
  const processRef = useInView();

  const stats = [
    { value: 12000 + totalOrders, suffix: '+', label: 'Happy Customers' },
    { value: 500, suffix: '+', label: 'Dermatologists Trust Us' },
    { value: 98, suffix: '%', label: 'Customer Satisfaction' },
    { value: 0, suffix: ' Harsh Chemicals', label: 'Always Clean' },
  ];

  const ingredients = [
    { emoji: '🍊', name: 'Vitamin C', benefit: 'Brightens & evens skin tone', color: '#fff7ed', accent: '#f59e0b' },
    { emoji: '💧', name: 'Hyaluronic Acid', benefit: '1000x weight in moisture', color: '#eff6ff', accent: '#3b82f6' },
    { emoji: '🌿', name: 'Niacinamide', benefit: 'Reduces pores & redness', color: '#f0fdf4', accent: '#10b981' },
    { emoji: '🌙', name: 'Retinol', benefit: 'Anti-aging powerhouse', color: '#faf5ff', accent: '#8b5cf6' },
    { emoji: '🌸', name: 'Ceramides', benefit: 'Repairs skin barrier', color: '#fdf2f8', accent: '#ec4899' },
    { emoji: '☀️', name: 'SPF Technology', benefit: 'Broad spectrum protection', color: '#fffbeb', accent: '#f59e0b' },
  ];

  const process = [
    { step: '01', title: 'Research', desc: 'Our scientists study thousands of ingredients and clinical studies to find what actually works.', icon: '🔬' },
    { step: '02', title: 'Formulation', desc: 'Expert chemists craft precise formulas in our ISO-certified lab with pharmaceutical-grade ingredients.', icon: '⚗️' },
    { step: '03', title: 'Clinical Testing', desc: 'Every product undergoes rigorous dermatologist-supervised testing on diverse skin types.', icon: '🧫' },
    { step: '04', title: 'Your Skin', desc: 'Only after passing all tests, the product reaches you — with results you can actually see and feel.', icon: '✨' },
  ];

  return (
    <div style={{ fontFamily: "'Sora', system-ui, sans-serif" }}>

      {/* ── Hero Banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0f0c29, #1a1a2e 50%, #0d6efd22)',
        padding: '100px 24px 80px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(13,110,253,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '700px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-block', background: 'rgba(245,158,11,0.15)',
            border: '1px solid rgba(245,158,11,0.3)', borderRadius: '20px',
            padding: '6px 18px', fontSize: '13px', color: '#f59e0b',
            fontWeight: '700', letterSpacing: '1px', marginBottom: '24px',
          }}>🔬 SCIENCE-FIRST SKINCARE</div>

          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: '900',
            color: '#fff', margin: '0 0 20px', lineHeight: 1.1,
            letterSpacing: '-1px',
          }}>
            Skin Science,<br />
            <span style={{ color: '#f59e0b' }}>Not Skin Myths.</span>
          </h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, margin: 0 }}>
            Every formula backed by clinical evidence. Every ingredient chosen for a reason. No fluff, no fillers — just results.
          </p>
        </div>
      </div>

      {/* ── Animated Stats ── */}
      <div ref={statsRef.ref} style={{
        background: '#f59e0b',
        padding: '48px 40px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '32px',
        textAlign: 'center',
      }}>
        {stats.map((s, i) => (
          <div key={s.label} style={{ animation: statsRef.inView ? `fadeUp 0.5s ease ${i * 0.1}s both` : 'none' }}>
            <div style={{ fontSize: '36px', fontWeight: '900', color: '#1a1a2e', lineHeight: 1 }}>
              <AnimatedNumber value={s.value} suffix={s.suffix} trigger={statsRef.inView} />
            </div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: 'rgba(26,26,46,0.65)', marginTop: '6px', letterSpacing: '0.5px' }}>
              {s.label.toUpperCase()}
            </div>
          </div>
        ))}
      </div>

      {/* ── Star Ingredients ── */}
      <div ref={ingredientsRef.ref} style={{ padding: '80px 40px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <p style={{ color: '#0d6efd', fontWeight: '700', fontSize: '13px', letterSpacing: '2px', marginBottom: '12px' }}>OUR FORMULAS</p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '900', color: '#1a1a2e', margin: '0 0 16px', letterSpacing: '-0.5px' }}>
            Ingredients That Actually Work
          </h2>
          <p style={{ color: '#888', fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>
            We only use clinically proven actives — every single ingredient earns its place in the formula.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {ingredients.map((ing, i) => (
            <div key={ing.name} style={{
              background: ing.color,
              borderRadius: '20px',
              padding: '28px',
              border: `1px solid ${ing.accent}22`,
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              transition: 'transform 0.25s, box-shadow 0.25s',
              animation: ingredientsRef.inView ? `fadeUp 0.5s ease ${i * 0.08}s both` : 'none',
              cursor: 'default',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 32px ${ing.accent}22`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
            >
              <div style={{
                width: '64px', height: '64px', borderRadius: '16px',
                background: '#fff', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '28px', flexShrink: 0,
                boxShadow: `0 4px 16px ${ing.accent}33`,
              }}>{ing.emoji}</div>
              <div>
                <div style={{ fontWeight: '800', fontSize: '16px', color: '#1a1a2e', marginBottom: '4px' }}>{ing.name}</div>
                <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.5' }}>{ing.benefit}</div>
                <div style={{ marginTop: '8px', display: 'inline-block', background: ing.accent, color: '#fff', fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px' }}>
                  Clinically Proven
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Our Process ── */}
      <div ref={processRef.ref} style={{ background: '#0f0c29', padding: '80px 40px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p style={{ color: '#f59e0b', fontWeight: '700', fontSize: '13px', letterSpacing: '2px', marginBottom: '12px' }}>HOW WE WORK</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '900', color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>
              From Lab to Your Skin
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
            {process.map((step, i) => (
              <div key={step.step} style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px', padding: '32px 24px',
                position: 'relative', overflow: 'hidden',
                animation: processRef.inView ? `fadeUp 0.5s ease ${i * 0.1}s both` : 'none',
                transition: 'border-color 0.25s, background 0.25s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,158,11,0.4)'; (e.currentTarget as HTMLElement).style.background = 'rgba(245,158,11,0.05)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
              >
                <div style={{
                  position: 'absolute', top: '16px', right: '20px',
                  fontSize: '48px', fontWeight: '900',
                  color: 'rgba(255,255,255,0.04)', lineHeight: 1,
                }}>{step.step}</div>
                <div style={{ fontSize: '36px', marginBottom: '16px' }}>{step.icon}</div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', margin: '0 0 10px' }}>{step.title}</h3>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Certifications Strip ── */}
      <div style={{ background: '#fff', padding: '40px 40px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '48px', flexWrap: 'wrap' }}>
          {[
            { icon: '🏆', text: 'ISO 22716 Certified' },
            { icon: '🐰', text: 'Cruelty Free' },
            { icon: '🌿', text: '100% Vegan' },
            { icon: '♻️', text: 'Eco Packaging' },
            { icon: '🧴', text: 'Dermatologist Tested' },
          ].map(cert => (
            <div key={cert.text} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#555', fontSize: '14px', fontWeight: '600' }}>
              <span style={{ fontSize: '20px' }}>{cert.icon}</span> {cert.text}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default SciencePage;
