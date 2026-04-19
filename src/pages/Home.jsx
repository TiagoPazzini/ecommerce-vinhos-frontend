import { useNavigate } from 'react-router-dom'

const harmonizacoes = [
  { icone: '🥩', label: 'Carnes vermelhas' },
  { icone: '🐟', label: 'Peixes e frutos do mar' },
  { icone: '🧀', label: 'Queijos finos' },
  { icone: '🍝', label: 'Massas' },
  { icone: '🍫', label: 'Sobremesas' },
  { icone: '🥗', label: 'Saladas' },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh' }}>

      {/* HERO */}
      <section style={{
        background: `linear-gradient(135deg, var(--wine-dark) 0%, var(--wine) 60%, #9B3A4A 100%)`,
        padding: '80px 40px', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: -60, right: -60,
          width: 400, height: 400, borderRadius: '50%',
          background: 'rgba(201,169,110,0.08)',
        }} />
        <div style={{
          position: 'absolute', bottom: -80, left: '40%',
          width: 300, height: 300, borderRadius: '50%',
          background: 'rgba(201,169,110,0.05)',
        }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40 }}>
          <div style={{ flex: 1 }}>
            <p style={{ color: 'var(--gold)', fontSize: 13, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>
              Curadoria exclusiva
            </p>
            <h1 style={{
              fontFamily: 'Playfair Display, serif',
              color: 'var(--cream)', fontSize: 52, fontWeight: 700,
              lineHeight: 1.15, marginBottom: 24
            }}>
              A arte de escolher<br />o vinho perfeito
            </h1>
            <p style={{ color: 'rgba(248,244,239,0.7)', fontSize: 16, lineHeight: 1.7, marginBottom: 36, maxWidth: 460 }}>
              Explore nossa seleção de vinhos de todo o mundo, com recomendações personalizadas por harmonização, ocasião e paladar.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => navigate('/catalogo')}
                style={{
                  background: 'var(--gold)', color: 'var(--wine-dark)',
                  border: 'none', borderRadius: 8, padding: '14px 28px',
                  fontSize: 14, fontWeight: 600, cursor: 'pointer'
                }}>
                Ver catálogo
              </button>
              <button
                onClick={() => navigate('/cadastro')}
                style={{
                  background: 'transparent', color: 'var(--cream)',
                  border: '1px solid rgba(248,244,239,0.3)', borderRadius: 8,
                  padding: '14px 28px', fontSize: 14, fontWeight: 500, cursor: 'pointer'
                }}>
                Criar conta
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16, flexShrink: 0 }}>
            {[
              { numero: '500+', label: 'Rótulos' },
              { numero: '30+', label: 'Países' },
              { numero: '4.9★', label: 'Avaliação' },
            ].map(({ numero, label }) => (
              <div key={label} style={{
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(201,169,110,0.2)',
                borderRadius: 12, padding: '24px 20px', textAlign: 'center', minWidth: 90
              }}>
                <div style={{ fontFamily: 'Playfair Display, serif', color: 'var(--gold)', fontSize: 28, fontWeight: 700 }}>{numero}</div>
                <div style={{ color: 'rgba(248,244,239,0.6)', fontSize: 12, marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HARMONIZAÇÕES */}
      <section style={{ padding: '48px 40px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ color: 'var(--muted)', fontSize: 12, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>
            Explore por harmonização
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {harmonizacoes.map(({ icone, label }) => (
              <button key={label} onClick={() => navigate('/catalogo')} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: '#fff', border: '1px solid var(--border)',
                borderRadius: 40, padding: '10px 18px',
                fontSize: 13, color: 'var(--text)', cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif', fontWeight: 400,
              }}
                onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--wine)'; e.currentTarget.style.color = 'var(--wine)' }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text)' }}>
                <span style={{ fontSize: 16 }}>{icone}</span>
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* BANNER CHATBOT */}
      <section style={{ background: 'var(--wine-dark)', padding: '64px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <span style={{ fontSize: 40 }}>🤖</span>
          <h2 style={{
            fontFamily: 'Playfair Display, serif', color: 'var(--cream)',
            fontSize: 32, fontWeight: 600, margin: '16px 0 12px'
          }}>
            Não sabe qual vinho escolher?
          </h2>
          <p style={{ color: 'rgba(248,244,239,0.65)', fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
            Nossa IA analisa sua ocasião, prato e preferências para recomendar o rótulo perfeito.
          </p>
          <button style={{
            background: 'var(--gold)', color: 'var(--wine-dark)',
            border: 'none', borderRadius: 8, padding: '14px 32px',
            fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
          }}>
            Falar com o sommelier IA
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        background: '#0F0508', padding: '32px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <span style={{ fontFamily: 'Playfair Display, serif', color: 'var(--gold)', fontSize: 16 }}>
          Vinho & Co.
        </span>
        <p style={{ color: 'rgba(248,244,239,0.3)', fontSize: 12, margin: 0 }}>
          Beba com moderação. Venda proibida para menores de 18 anos. (RN0082)
        </p>
      </footer>

    </div>
  )
}