// src/pages/Home.jsx
import { useCatalogoController } from '../controllers/useCatalogoController'

const harmonizacoes = [
  { icone: '🥩', label: 'Carnes vermelhas' },
  { icone: '🐟', label: 'Peixes e frutos do mar' },
  { icone: '🧀', label: 'Queijos finos' },
  { icone: '🍝', label: 'Massas' },
  { icone: '🍫', label: 'Sobremesas' },
  { icone: '🥗', label: 'Saladas' },
]

const tipoCor = {
  'Tinto': { bg: '#7B1F30', text: '#F8F4EF' },
  'Branco': { bg: '#C9A96E', text: '#1A0A0E' },
  'Rosé': { bg: '#D4758A', text: '#F8F4EF' },
  'Espumante': { bg: '#4A1020', text: '#C9A96E' },
}

export default function Home() {
  const {
    filtroTipo, setFiltroTipo,
    vinhosFiltrados,
    adicionarAoCarrinho, navigate
  } = useCatalogoController()

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh' }}>

      {/* HERO */}
      <section style={{
        background: `linear-gradient(135deg, var(--wine-dark) 0%, var(--wine) 60%, #9B3A4A 100%)`,
        padding: '80px 40px', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: -60, right: -60, width: 400, height: 400, 
          borderRadius: '50%', background: 'rgba(201,169,110,0.08)',
        }} />
        <div style={{
          position: 'absolute', bottom: -80, left: '40%', width: 300, height: 300, 
          borderRadius: '50%', background: 'rgba(201,169,110,0.05)',
        }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40 }}>
          <div style={{ flex: 1 }}>
            <p style={{ color: 'var(--gold)', fontSize: 13, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>
              Curadoria exclusiva
            </p>
            <h1 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--cream)', fontSize: 52, fontWeight: 700, lineHeight: 1.15, marginBottom: 24 }}>
              A arte de escolher<br />o vinho perfeito
            </h1>
            <p style={{ color: 'rgba(248,244,239,0.7)', fontSize: 16, lineHeight: 1.7, marginBottom: 36, maxWidth: 460 }}>
              Explore nossa seleção de vinhos de todo o mundo, com recomendações personalizadas por harmonização, ocasião e paladar.
            </p>
            <button
              onClick={() => document.getElementById('vitrine').scrollIntoView({ behavior: 'smooth' })}
              style={{
                background: 'var(--gold)', color: 'var(--wine-dark)',
                border: 'none', borderRadius: 8, padding: '14px 28px',
                fontSize: 14, fontWeight: 600, cursor: 'pointer'
              }}>
              Explorar vinhos 
            </button>
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
              <button key={label} 
                onClick={() => document.getElementById('vitrine').scrollIntoView({ behavior: 'smooth' })}
                style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: '#fff', border: '1px solid var(--border)',
                borderRadius: 40, padding: '10px 18px',
                fontSize: 13, color: 'var(--text)', cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s'
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

      {/* VITRINE / CATÁLOGO REAL INTEGRAD0 */}
      <section id="vitrine" style={{ padding: '64px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <p style={{ color: 'var(--muted)', fontSize: 12, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
                Catálogo
              </p>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, fontWeight: 600, margin: 0 }}>
                Nossa seleção
              </h2>
            </div>
            
            {/* Filtros da arquitetura MVC conectados na Home */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['Todos', 'Tinto', 'Branco', 'Rosé', 'Espumante'].map(tipo => (
                <button
                  key={tipo}
                  onClick={() => setFiltroTipo(tipo)}
                  style={{
                    background: filtroTipo === tipo ? 'var(--wine)' : 'transparent',
                    color: filtroTipo === tipo ? '#fff' : 'var(--muted)',
                    border: filtroTipo === tipo ? '1px solid var(--wine)' : '1px solid var(--border)',
                    borderRadius: 20, padding: '8px 20px', fontSize: 13, fontWeight: 500,
                    cursor: 'pointer', transition: 'all 0.2s'
                  }}>
                  {tipo}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
            {vinhosFiltrados.map(vinho => (
              <div key={vinho.id} style={{
                background: '#fff', borderRadius: 16, border: '1px solid var(--border)', 
                overflow: 'hidden', transition: 'all 0.2s', cursor: 'pointer'
              }}
                onMouseOver={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(123,31,48,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseOut={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}>

                <div style={{
                  background: tipoCor[vinho.tipo]?.bg || 'var(--wine)',
                  padding: '32px 24px', position: 'relative',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <span style={{ fontSize: 64 }}>🍷</span>
                  <span style={{
                    position: 'absolute', bottom: 12, left: 12,
                    background: 'rgba(255,255,255,0.15)', color: tipoCor[vinho.tipo]?.text || '#fff',
                    fontSize: 11, fontWeight: 500, padding: '4px 10px', borderRadius: 20
                  }}>
                    {vinho.tipo}
                  </span>
                </div>

                <div style={{ padding: '20px 24px' }}>
                  <p style={{ color: 'var(--muted)', fontSize: 11, marginBottom: 4 }}>{vinho.regiao} · Safra {vinho.safra}</p>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 600, margin: '0 0 6px', lineHeight: 1.3 }}>
                    {vinho.nome}
                  </h3>
                  <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 20 }}>{vinho.uva}</p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'Playfair Display, serif', color: 'var(--wine)', fontSize: 20, fontWeight: 600 }}>
                      R$ {vinho.preco.toFixed(2)}
                    </span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); adicionarAoCarrinho(vinho) }}
                      style={{
                      background: 'var(--wine)', color: '#fff', border: 'none', borderRadius: 8, 
                      padding: '8px 16px', fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
                    }}>
                      + Carrinho
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {vinhosFiltrados.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
              <p style={{ fontSize: 16 }}>Nenhum vinho encontrado para este filtro.</p>
            </div>
          )}
        </div>
      </section>

      {/* BANNER CHATBOT */}
      <section style={{ background: 'var(--wine-dark)', padding: '64px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <span style={{ fontSize: 40 }}>🤖</span>
          <h2 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--cream)', fontSize: 32, fontWeight: 600, margin: '16px 0 12px' }}>
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