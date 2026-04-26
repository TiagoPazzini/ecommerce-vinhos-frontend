import { useCatalogoController } from '../controllers/useCatalogoController'

// Cores por tipo de vinho (Mantido na View pois é estritamente UI)
const tipoCor = {
  'Tinto': { bg: '#7B1F30', text: '#F8F4EF' },
  'Branco': { bg: '#C9A96E', text: '#1A0A0E' },
  'Rosé': { bg: '#D4758A', text: '#F8F4EF' },
  'Espumante': { bg: '#4A1020', text: '#C9A96E' },
}

export default function Catalogo() {
  const {
    filtroTipo, setFiltroTipo,
    vinhosFiltrados, quantidadeTotal,
    adicionarAoCarrinho, navigate
  } = useCatalogoController()

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh', paddingBottom: 60 }}>
      
      {/* Header do catálogo com filtros e botão do carrinho */}
      <div style={{ 
        background: 'var(--wine-dark)', 
        padding: '32px 40px',
        borderBottom: '1px solid var(--wine)'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <h1 style={{ 
                fontFamily: 'Playfair Display, serif', 
                color: 'var(--cream)', 
                fontSize: 36, 
                fontWeight: 700,
                margin: 0,
                marginBottom: 8
              }}>
                Catálogo de Vinhos
              </h1>
              <p style={{ color: 'rgba(248,244,239,0.7)', fontSize: 15, margin: 0 }}>
                Explore nossa seleção premium de vinhos do mundo todo
              </p>
            </div>

            {/* Botão do carrinho com badge */}
            <button 
              onClick={() => navigate('/carrinho')}
              style={{
                position: 'relative',
                background: 'var(--gold)',
                color: 'var(--wine-dark)',
                border: 'none',
                borderRadius: 8,
                padding: '12px 24px',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
              🛒 Ver Carrinho
              {quantidadeTotal > 0 && (
                <span style={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  background: '#DC2626',
                  color: '#fff',
                  borderRadius: '50%',
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 700
                }}>
                  {quantidadeTotal}
                </span>
              )}
            </button>
          </div>

          {/* Filtros por tipo */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {['Todos', 'Tinto', 'Branco', 'Rosé', 'Espumante'].map(tipo => (
              <button
                key={tipo}
                onClick={() => setFiltroTipo(tipo)}
                style={{
                  background: filtroTipo === tipo ? 'var(--gold)' : 'rgba(255,255,255,0.1)',
                  color: filtroTipo === tipo ? 'var(--wine-dark)' : 'var(--cream)',
                  border: filtroTipo === tipo ? 'none' : '1px solid rgba(248,244,239,0.3)',
                  borderRadius: 20,
                  padding: '8px 20px',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}>
                {tipo}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid de vinhos */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 40px' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: 24 
        }}>
          {vinhosFiltrados.map(vinho => (
            <div 
              key={vinho.id}
              style={{
                background: '#fff',
                borderRadius: 16,
                border: '1px solid var(--border)',
                overflow: 'hidden',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
              onMouseOver={e => {
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(123,31,48,0.12)'
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseOut={e => {
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.transform = 'none'
              }}>
              
              {/* Header colorido por tipo */}
              <div style={{
                background: tipoCor[vinho.tipo]?.bg || 'var(--wine)',
                padding: '32px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <span style={{ fontSize: 64 }}>🍷</span>
                <span style={{
                  position: 'absolute',
                  bottom: 12,
                  left: 12,
                  background: 'rgba(255,255,255,0.15)',
                  color: tipoCor[vinho.tipo]?.text || '#fff',
                  fontSize: 11,
                  fontWeight: 500,
                  padding: '4px 10px',
                  borderRadius: 20
                }}>
                  {vinho.tipo}
                </span>
              </div>

              {/* Corpo do card */}
              <div style={{ padding: '20px 24px' }}>
                <p style={{ 
                  color: 'var(--muted)', 
                  fontSize: 11, 
                  marginBottom: 4,
                  margin: 0
                }}>
                  {vinho.regiao} · Safra {vinho.safra}
                </p>
                
                <h3 style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: 18,
                  fontWeight: 600,
                  margin: '4px 0 6px',
                  lineHeight: 1.3,
                  color: 'var(--text)'
                }}>
                  {vinho.nome}
                </h3>
                
                <p style={{ 
                  color: 'var(--muted)', 
                  fontSize: 13, 
                  marginBottom: 12,
                  margin: '0 0 12px 0'
                }}>
                  {vinho.uva}
                </p>

                {/* Tags de harmonização */}
                <div style={{ 
                  display: 'flex', 
                  gap: 6, 
                  flexWrap: 'wrap',
                  marginBottom: 16
                }}>
                  {vinho.harmonizacao.map(tag => (
                    <span 
                      key={tag}
                      style={{
                        background: 'var(--cream)',
                        color: 'var(--muted)',
                        fontSize: 10,
                        padding: '3px 8px',
                        borderRadius: 12,
                        border: '1px solid var(--border)'
                      }}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Preço e botão */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  marginTop: 16
                }}>
                  <span style={{
                    fontFamily: 'Playfair Display, serif',
                    color: 'var(--wine)',
                    fontSize: 22,
                    fontWeight: 600
                  }}>
                    R$ {vinho.preco.toFixed(2)}
                  </span>
                  
                  <button 
                    onClick={() => adicionarAoCarrinho(vinho)}
                    style={{
                      background: 'var(--wine)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '10px 18px',
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: 'pointer',
                      fontFamily: 'DM Sans, sans-serif',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={e => e.currentTarget.style.background = 'var(--wine-light)'}
                    onMouseOut={e => e.currentTarget.style.background = 'var(--wine)'}>
                    + Carrinho
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mensagem quando não há vinhos filtrados */}
        {vinhosFiltrados.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            color: 'var(--muted)'
          }}>
            <p style={{ fontSize: 16 }}>Nenhum vinho encontrado para este filtro.</p>
          </div>
        )}
      </div>
    </div>
  )
}
