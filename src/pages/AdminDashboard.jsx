import React from 'react'
import { useAdminDashboardController } from '../controllers/useAdminDashboardController'

const coresCategoria = { 
  Tinto: '#7B1F30', 
  Branco: '#C9A96E', 
  Rosé: '#D4758A', 
  Espumante: '#4A1020' 
}

export default function AdminDashboard() {
  const {
    dadosGrafico, 
    rankingVinhos, // 📊 Recebe o ranking do controlador
    filtroDataInicio, setFiltroDataInicio,
    filtroDataFim, setFiltroDataFim, 
    categoriasAtivas, toggleCategoria,
    filtroDocura, setFiltroDocura, 
    filtroUva, setFiltroUva, 
    filtroSafra, setFiltroSafra
  } = useAdminDashboardController()

  const width = 750
  const height = 340 
  const padding = 50

  const maxVendas = Math.max(
    ...dadosGrafico.map(d => (d.Tinto || 0) + (d.Branco || 0) + (d.Rosé || 0) + (d.Espumante || 0)), 5
  )
  const tetoY = Math.ceil(maxVendas / 5) * 5

  const larguraDisponivel = width - padding * 2
  const larguraBarra = dadosGrafico.length > 1
    ? (larguraDisponivel / (dadosGrafico.length - 1)) * 0.40 
    : 30

  const obterCoordenadasPath = (categoria) => {
    if (!dadosGrafico || dadosGrafico.length < 2) return ''
    return dadosGrafico.map((d, index) => {
      const x = padding + (index / (dadosGrafico.length - 1)) * (width - padding * 2)
      const y = height - padding - ((d[categoria] || 0) / tetoY) * (height - padding * 2)
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
    }).join(' ')
  }

  return (
    <div style={{ maxWidth: 950, margin: '0 auto', padding: '48px 32px', fontFamily: 'DM Sans, sans-serif' }}>
      <h1 style={{ fontSize: 30, fontWeight: 700, marginBottom: 8, color: '#1E293B' }}>Dashboard Gerencial</h1>
      <p style={{ color: '#64748B', fontSize: 14, marginBottom: 32 }}>Análise combinatória de características técnicas e volume físico de vendas (RF0055).</p>

      {/* PAINEL DE FILTROS */}
      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: 24, marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
        
        {/* Linha Superior: Período e Categorias */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: 24 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 8, color: '#64748B' }}>Período</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="date" value={filtroDataInicio} onChange={e => setFiltroDataInicio(e.target.value)} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13, width: '100%' }} />
              <input type="date" value={filtroDataFim} onChange={e => setFiltroDataFim(e.target.value)} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13, width: '100%' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 8, color: '#64748B' }}>Exibir no Gráfico</label>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              {Object.keys(categoriasAtivas).map(cat => (
                <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer', padding: '6px 12px', borderRadius: 6, border: `1px solid ${categoriasAtivas[cat] ? coresCategoria[cat] : '#E2E8F0'}`, background: categoriasAtivas[cat] ? '#F8FAFC' : '#fff' }}>
                  <input type="checkbox" checked={categoriasAtivas[cat]} onChange={() => toggleCategoria(cat)} />
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: coresCategoria[cat] }}></span>
                  {cat}
                </label>
              ))}
              <span style={{ fontSize: 12, color: '#64748B', marginLeft: 'auto', background: '#F1F5F9', padding: '6px 12px', borderRadius: 6, fontWeight: 500 }}>
                📊 Total Geral (Barras)
              </span>
            </div>
          </div>
        </div>

        {/* Filtros de Características Técnicas */}
        <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: '#64748B' }}>Classificação / Doçura</label>
            <select value={filtroDocura} onChange={e => setFiltroDocura(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13, background: '#fff' }}>
              <option value="">Todas as Doçuras</option>
              <option value="Seco">Seco</option>
              <option value="Meio Seco">Meio Seco</option>
              <option value="Brut">Brut</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: '#64748B' }}>Tipo de Uva (Casta)</label>
            <select value={filtroUva} onChange={e => setFiltroUva(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13, background: '#fff' }}>
              <option value="">Todas as Uvas</option>
              <option value="Malbec">Malbec</option>
              <option value="Riesling">Riesling</option>
              <option value="Syrah">Syrah</option>
              <option value="Chardonnay">Chardonnay</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: '#64748B' }}>Safra (Ano)</label>
            <select value={filtroSafra} onChange={e => setFiltroSafra(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13, background: '#fff' }}>
              <option value="">Todas as Safras</option>
              <option value="2020">2020</option>
              <option value="2021">2021</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
            </select>
          </div>
        </div>
      </div>

      {/* ÁREA DO GRÁFICO PRINCIPAL */}
      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '24px 16px', display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
        {dadosGrafico.length === 0 ? (
          <p style={{ padding: 40, color: '#64748B' }}>Nenhum dado encontrado para o período.</p>
        ) : (
          <svg width={width} height={height} style={{ overflow: 'visible' }}>
            {/* Linhas Horizontais Eixo Y */}
            {[0, 1, 2, 3, 4, 5].map(v => {
              const valorY = (tetoY / 5) * v
              const y = height - padding - (valorY / tetoY) * (height - padding * 2)
              return (
                <g key={v}>
                  <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#F1F5F9" strokeWidth="1" />
                  <text x={padding - 12} y={y + 4} textAnchor="end" style={{ fontSize: 11, fill: '#94A3B8', fontWeight: 500 }}>{Math.round(valorY)}</text>
                </g>
              )
            })}

            {/* Meses Eixo X */}
            {dadosGrafico.map((d, index) => {
              const x = padding + (index / (dadosGrafico.length - 1)) * (width - padding * 2)
              return (
                <text key={index} x={x} y={height - padding + 20} textAnchor="middle" style={{ fontSize: 10, fill: '#94A3B8', fontWeight: 600 }}>
                  {dadosGrafico.length > 10 && index % 2 !== 0 ? '' : d.label}
                </text>
              )
            })}

            {/* Barras do Total Geral */}
            {dadosGrafico.map((d, index) => {
              const totalMes = (d.Tinto || 0) + (d.Branco || 0) + (d.Rosé || 0) + (d.Espumante || 0)
              const x = padding + (index / (dadosGrafico.length - 1)) * (width - padding * 2)
              const alturaBarra = (totalMes / tetoY) * (height - padding * 2)
              const y = height - padding - alturaBarra

              return (
                <g key={`bar-${index}`}>
                  <rect x={x - larguraBarra / 2} y={y} width={larguraBarra} height={alturaBarra} fill="rgba(123, 31, 48, 0.11)" stroke="rgba(123, 31, 48, 0.25)" strokeWidth="1" rx="4" style={{ transition: 'all 0.3s ease' }} />
                  {totalMes > 0 && (
                    <text x={x} y={y - 6} textAnchor="middle" style={{ fontSize: 10, fontWeight: 700, fill: '#7B1F30' }}>{totalMes}</text>
                  )}
                </g>
              )
            })}

            {/* Linhas das Categorias */}
            {Object.keys(categoriasAtivas).map(cat => {
              if (!categoriasAtivas[cat]) return null
              return (
                <path key={cat} d={obterCoordenadasPath(cat)} fill="none" stroke={coresCategoria[cat]} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'all 0.3s ease' }} />
              )
            })}

            {/* TÍTULO DO EIXO Y (VERTICAL) */}
            <text transform="rotate(-90)" x={-((height - padding * 2) / 2 + padding)} y={14} textAnchor="middle" style={{ fontSize: 11, fontWeight: 700, fill: '#64748B', letterSpacing: '0.08em' }}>Nº DE GARRAFAS VENDIDAS</text>

            {/* TÍTULO DO EIXO X (HORIZONTAL) */}
            <text x={width / 2} y={height - 5} textAnchor="middle" style={{ fontSize: 11, fontWeight: 700, fill: '#64748B', letterSpacing: '0.08em' }}>PERÍODO (MESES DE ANÁLISE)</text>
          </svg>
        )}
      </div>

      {/* 🏆 NOVA SEÇÃO: RANKING FÍSICO E FINANCEIRO POR RÓTULO ESPECÍFICO */}
      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '28px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, color: '#1E293B', fontFamily: 'Playfair Display, serif' }}>
          Performance de Vendas por Rótulo (SKU)
        </h2>
        <p style={{ color: '#64748B', fontSize: 13, marginBottom: 24 }}>Distribuição volumétrica e faturamento bruto dos vinhos mais vendidos no período.</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {rankingVinhos.length === 0 ? (
            <p style={{ color: '#94A3B8', fontSize: 14, textAlign: 'center', padding: '12px 0' }}>Nenhum vinho corresponde aos filtros cruzados atuais.</p>
          ) : (
            rankingVinhos.map((vinho, index) => {
              // Baseia a barra de progresso em relação ao campeão de vendas (index 0)
              const maxQtdRanking = rankingVinhos[0]?.qtd || 1
              const percentualLargura = (vinho.qtd / maxQtdRanking) * 100
              
              return (
                <div key={vinho.nome} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: 13.5 }}>
                    <span style={{ fontWeight: 600, color: '#1E293B' }}>
                      <span style={{ color: '#94A3B8', marginRight: 6 }}>{index + 1}º</span> 
                      {vinho.nome} 
                      <span style={{ fontWeight: 400, color: '#64748B', fontSize: 11, marginLeft: 8, background: '#F1F5F9', padding: '2px 8px', borderRadius: 4 }}>
                        {vinho.tipo}
                      </span>
                    </span>
                    <span style={{ fontWeight: 600, color: '#4A1020' }}>
                      <strong>{vinho.qtd}</strong> {vinho.qtd === 1 ? 'unidade' : 'unidades'} 
                      <span style={{ fontWeight: 400, color: '#64748B', fontSize: 12, marginLeft: 12 }}>
                        · Faturamento: <strong>R$ {vinho.faturamento.toFixed(2)}</strong>
                      </span>
                    </span>
                  </div>
                  {/* Barra de Distribuição Gráfica Dinâmica */}
                  <div style={{ width: '100%', height: 10, background: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: 9999, overflow: 'hidden' }}>
                    <div style={{
                      width: `${percentualLargura}%`,
                      height: '100%',
                      background: coresCategoria[vinho.tipo] || '#64748B',
                      borderRadius: 9999,
                      transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                    }} />
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

    </div>
  )
}