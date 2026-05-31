// src/pages/AdminPedidos.jsx
import { useAdminPedidosController } from '../controllers/useAdminPedidosController'

// Dicionário visual de cores
const statusCor = {
  'EM PROCESSAMENTO': { bg: '#FEF9C3', color: '#854D0E' },
  'APROVADA': { bg: '#F0FDF4', color: '#166534' },
  'REPROVADA': { bg: '#FEF2F2', color: '#991B1B' },
  'EM TRANSPORTE': { bg: '#EFF6FF', color: '#1E40AF' },
  'ENTREGUE': { bg: '#F0FDF4', color: '#14532D' },
  // Novos status:
  'EM TROCA': { bg: '#FEF3C7', color: '#A16207' },
  'TROCA AUTORIZADA': { bg: '#DBEAFE', color: '#1D4ED8' },
  'TROCADO': { bg: '#E5E7EB', color: '#374151' },
}

export default function AdminPedidos() {
  const { 
    pedidos, handleMudarStatus, formatarData, 
    handleAutorizarTroca, handleNegarTroca, handleConfirmarRecebimento 
  } = useAdminPedidosController()

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 32px' }}>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, marginBottom: 32 }}>
        Gestão de Pedidos
      </h1>

      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: 'var(--cream)' }}>
              {['Pedido', 'Data', 'Cliente', 'Total', 'Status', 'Ações'].map(col => (
                <th key={col} style={{
                  padding: '12px 16px', textAlign: 'left', fontWeight: 500, 
                  color: 'var(--muted)', fontSize: 12, textTransform: 'uppercase'
                }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pedidos.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: 'var(--muted)' }}>
                  Nenhum pedido encontrado no sistema.
                </td>
              </tr>
            )}
            {pedidos.map(pedido => (
              <tr key={pedido.id} style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: '14px 16px', fontWeight: 600 }}>#{String(pedido.id).slice(-6)}</td>
                <td style={{ padding: '14px 16px', color: 'var(--muted)' }}>{formatarData(pedido.dataPedido)}</td>
                <td style={{ padding: '14px 16px', color: 'var(--muted)' }}>{pedido.clienteEmail}</td>
                <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--wine)' }}>
                  R$ {pedido.total?.toFixed(2)}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                    background: statusCor[pedido.status]?.bg || '#F9FAFB',
                    color: statusCor[pedido.status]?.color || '#6B7280'
                  }}>
                    {pedido.status}
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  
                  {/* Máquina de Status: Exibe botões com base no momento do pedido */}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {pedido.status === 'EM PROCESSAMENTO' && (
                      <>
                        <button onClick={() => handleMudarStatus(pedido.id, 'APROVADA')}
                          style={{ background: '#166534', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 10px', fontSize: 12, cursor: 'pointer' }}>Aprovar</button>
                        <button onClick={() => handleMudarStatus(pedido.id, 'REPROVADA')}
                          style={{ background: '#991B1B', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 10px', fontSize: 12, cursor: 'pointer' }}>Reprovar</button>
                      </>
                    )}

                    {pedido.status === 'APROVADA' && (
                      <button onClick={() => handleMudarStatus(pedido.id, 'EM TRANSPORTE')}
                        style={{ background: '#1E40AF', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 10px', fontSize: 12, cursor: 'pointer' }}>Despachar (Transporte)</button>
                    )}

                    {pedido.status === 'EM TRANSPORTE' && (
                      <button onClick={() => handleMudarStatus(pedido.id, 'ENTREGUE')}
                        style={{ background: '#14532D', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 10px', fontSize: 12, cursor: 'pointer' }}>Marcar como Entregue</button>
                    )}

                    {pedido.status === 'EM TROCA' && (
                      <>
                        <button onClick={() => handleAutorizarTroca(pedido.id)}
                          style={{ background: '#1D4ED8', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 10px', fontSize: 12, cursor: 'pointer' }}>Autorizar Troca</button>
                        <button onClick={() => handleNegarTroca(pedido.id)}
                          style={{ background: '#991B1B', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 10px', fontSize: 12, cursor: 'pointer' }}>Negar</button>
                      </>
                    )}

                    {pedido.status === 'TROCA AUTORIZADA' && (
                      <button onClick={() => handleConfirmarRecebimento(pedido.id)}
                        style={{ background: '#047857', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 10px', fontSize: 12, cursor: 'pointer' }}>Confirmar Recebimento (Gerar Cupom)</button>
                    )}

                    {pedido.status === 'TROCADO' && (
                       <span style={{ fontSize: 12, color: 'var(--muted)' }}>Troca Finalizada</span>
                    )}

                    {pedido.status === 'ENTREGUE' && (
                       <span style={{ fontSize: 12, color: 'var(--muted)' }}>Finalizado</span>
                    )}
                  </div>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}