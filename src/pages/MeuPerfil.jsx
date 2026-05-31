// src/pages/MeuPerfil.jsx
import { useMeuPerfilController } from '../controllers/useMeuPerfilController'

const inputStyle = { width: '100%', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', fontSize: 14 }

export default function MeuPerfil() {
  const { cliente, mensagem, handleChange, handleSalvar, handleRemoverEndereco, handleRemoverCartao } = useMeuPerfilController()

  if (!cliente) return <div style={{ padding: 40, textAlign: 'center' }}>Carregando...</div>

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 32px' }}>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, marginBottom: 24 }}>Meu Perfil</h1>

      {mensagem && (
        <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: 16, borderRadius: 8, color: '#166534', marginBottom: 24 }}>
          {mensagem}
        </div>
      )}

      <form onSubmit={handleSalvar} style={{ background: '#fff', padding: 24, borderRadius: 12, border: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: 18, marginBottom: 16 }}>Dados Pessoais</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <div><label>Nome</label><input name="nome" value={cliente.nome} onChange={handleChange} style={inputStyle} /></div>
          <div><label>Telefone</label><input name="telefone" value={cliente.telefone} onChange={handleChange} style={inputStyle} /></div>
          <div><label>E-mail (Fixo)</label><input value={cliente.email} disabled style={{ ...inputStyle, background: '#f5f5f5' }} /></div>
          <div><label>CPF (Fixo)</label><input value={cliente.cpf} disabled style={{ ...inputStyle, background: '#f5f5f5' }} /></div>
        </div>

        <h2 style={{ fontSize: 18, marginBottom: 16, borderTop: '1px solid var(--border)', paddingTop: 24 }}>Meus Endereços</h2>
        {cliente.enderecos?.map((end, i) => (
          <div key={i} style={{ padding: 16, border: '1px solid var(--border)', borderRadius: 8, marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{end.apelido} ({end.tipoEndereco})</strong>
              <button type="button" onClick={() => handleRemoverEndereco(i)} style={{ color: '#991B1B', background: 'none', border: 'none', cursor: 'pointer' }}>Remover</button>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--muted)' }}>{end.logradouro}, {end.numero} - {end.cidade}/{end.estado}</p>
          </div>
        ))}

        <h2 style={{ fontSize: 18, marginBottom: 16, borderTop: '1px solid var(--border)', paddingTop: 24 }}>Meus Cartões</h2>
        {cliente.cartoes?.map((cartao, i) => (
          <div key={i} style={{ padding: 16, border: '1px solid var(--border)', borderRadius: 8, marginBottom: 12, display: 'flex', justifyContent: 'space-between' }}>
            <span>{cartao.bandeira} •••• {cartao.numero.slice(-4)}</span>
            <button type="button" onClick={() => handleRemoverCartao(i)} style={{ color: '#991B1B', background: 'none', border: 'none', cursor: 'pointer' }}>Remover</button>
          </div>
        ))}

        <button type="submit" style={{ background: 'var(--wine)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 8, marginTop: 24, cursor: 'pointer' }}>
          Salvar Alterações
        </button>
      </form>
    </div>
  )
}