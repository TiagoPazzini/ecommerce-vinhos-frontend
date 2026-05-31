import { useClienteListaController } from '../../controllers/useClienteListaController'

export default function ClienteLista() {
  const {
    busca, setBusca, clientesFiltrados,
    handleInativar, handleReativar, navigate
  } = useClienteListaController()

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, margin: 0 }}>Clientes</h1>
      </div>

      <input
        type="text"
        placeholder="Buscar por nome, e-mail ou CPF..."
        value={busca}
        onChange={e => setBusca(e.target.value)}
        style={{
          width: '100%', border: '1px solid var(--border)', borderRadius: 8,
          padding: '10px 14px', fontSize: 14, marginBottom: 24,
          fontFamily: 'DM Sans, sans-serif', boxSizing: 'border-box', outline: 'none'
        }}
      />

      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: 'var(--cream)' }}>
              {['Nome', 'E-mail', 'CPF', 'Status', 'Ações'].map(col => (
                <th key={col} style={{
                  padding: '12px 16px', textAlign: 'left',
                  fontWeight: 500, color: 'var(--muted)', fontSize: 12,
                  textTransform: 'uppercase', letterSpacing: '0.06em'
                }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--muted)' }}>
                  Nenhum cliente encontrado.
                </td>
              </tr>
            )}
            {clientesFiltrados.map(cliente => (
              <tr key={cliente.id} style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: '14px 16px', fontWeight: 500 }}>{cliente.nome}</td>
                <td style={{ padding: '14px 16px', color: 'var(--muted)' }}>{cliente.email}</td>
                <td style={{ padding: '14px 16px', color: 'var(--muted)' }}>{cliente.cpf}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500,
                    background: cliente.status === 'ativo' ? '#F0FDF4' : '#F9FAFB',
                    color: cliente.status === 'ativo' ? '#166534' : '#6B7280'
                  }}>
                    {cliente.status}
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button onClick={() => navigate(`/admin/clientes/${cliente.id}`)}
                      style={{ background: 'none', border: 'none', color: 'var(--wine)', cursor: 'pointer', fontSize: 13, padding: 0 }}>
                      Editar
                    </button>
                    {cliente.status === 'ativo' ? (
  <button onClick={() => handleInativar(cliente.id)}
    style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 13, padding: 0 }}>
    Inativar
  </button>
) : (
  <button onClick={() => handleReativar(cliente.id)}
    style={{ background: 'none', border: 'none', color: '#166534', cursor: 'pointer', fontSize: 13, padding: 0 }}>
    Reativar
  </button>
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