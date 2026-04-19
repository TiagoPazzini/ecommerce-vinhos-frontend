import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { buscarClientePorId, atualizarCliente, inativarCliente } from '../../services/clienteService'

export default function ClienteEdicao() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [erro, setErro] = useState('')

  useEffect(() => {
    const cliente = buscarClientePorId(id)
    // Garante que a propriedade cartoes exista, mesmo que o cliente venha sem ela
    if (cliente) {
      setForm({ ...cliente, cartoes: cliente.cartoes || [] })
    }
  }, [id])

  if (!form) return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '48px 32px' }}>
      <p style={{ color: 'var(--muted)' }}>Cliente não encontrado.</p>
      <button onClick={() => navigate('/admin/clientes')}
        style={{ background: 'none', border: 'none', color: 'var(--wine)', cursor: 'pointer', marginTop: 12 }}>
        ← Voltar para listagem
      </button>
    </div>
  )

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // --- FUNÇÕES PARA GERENCIAR CARTÕES ---
  function handleAddCartao() {
    const novosCartoes = [...form.cartoes, { numero: '', nomeTitular: '', validade: '', cvv: '' }]
    setForm({ ...form, cartoes: novosCartoes })
  }

  function handleCartaoChange(index, e) {
    const { name, value } = e.target
    const novosCartoes = [...form.cartoes]
    novosCartoes[index] = { ...novosCartoes[index], [name]: value }
    setForm({ ...form, cartoes: novosCartoes })
  }

  function handleRemoveCartao(index) {
    const novosCartoes = form.cartoes.filter((_, i) => i !== index)
    setForm({ ...form, cartoes: novosCartoes })
  }
  // --------------------------------------

  function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    if (!form.nome || !form.email || !form.telefone) {
      setErro('Nome, e-mail e telefone são obrigatórios.')
      return
    }
    
    // Validação básica para garantir que cartões em branco não sejam salvos
    const cartoesInvalidos = form.cartoes.some(c => !c.numero || !c.nomeTitular)
    if (cartoesInvalidos) {
      setErro('Preencha os dados obrigatórios de todos os cartões adicionados.')
      return
    }

    atualizarCliente(id, form)
    alert('Cliente atualizado com sucesso!')
    navigate('/admin/clientes')
  }

  function handleInativar() {
    if (!confirm(`Deseja inativar o cliente ${form.nome}?`)) return
    inativarCliente(id)
    alert('Cliente inativado com sucesso!')
    navigate('/admin/clientes')
  }

  function handleReativar() {
    if (!confirm(`Deseja reativar o cliente ${form.nome}?`)) return
    atualizarCliente(id, { status: 'ativo' })
    alert('Cliente reativado com sucesso!')
    navigate('/admin/clientes')
  }

  const inputStyle = {
    width: '100%', border: '1px solid var(--border)', borderRadius: 8,
    padding: '10px 14px', fontSize: 14, fontFamily: 'DM Sans, sans-serif',
    outline: 'none', boxSizing: 'border-box'
  }

  const labelStyle = {
    display: 'block', fontSize: 13, color: 'var(--muted)', marginBottom: 6
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '48px 32px' }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, margin: 0 }}>
          Editar cliente
        </h1>
        <span style={{
          padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500,
          background: form.status === 'ativo' ? '#F0FDF4' : '#F9FAFB',
          color: form.status === 'ativo' ? '#166534' : '#6B7280'
        }}>
          {form.status}
        </span>
      </div>

      {erro && (
        <div style={{
          background: '#FEF2F2', border: '1px solid #FECACA',
          borderRadius: 8, padding: '12px 16px', color: '#991B1B', fontSize: 13, marginBottom: 20
        }}>
          {erro}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* DADOS PESSOAIS */}
        <div>
          <label style={labelStyle}>Nome completo</label>
          <input name="nome" value={form.nome} onChange={handleChange} required style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>E-mail</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>CPF</label>
          <input value={form.cpf} disabled
            style={{ ...inputStyle, background: '#F9FAFB', color: 'var(--muted)', cursor: 'not-allowed' }} />
          <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>CPF não pode ser alterado.</p>
        </div>
        <div>
          <label style={labelStyle}>Data de nascimento</label>
          <input type="date" value={form.dataNascimento} disabled
            style={{ ...inputStyle, background: '#F9FAFB', color: 'var(--muted)', cursor: 'not-allowed' }} />
          <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Data de nascimento não pode ser alterada.</p>
        </div>
        <div>
          <label style={labelStyle}>Gênero</label>
          <select name="genero" value={form.genero} onChange={handleChange} required style={inputStyle}>
            <option value="">Selecione</option>
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
            <option value="outro">Outro</option>
            <option value="prefiro_nao_informar">Prefiro não informar</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Telefone</label>
          <input name="telefone" value={form.telefone} onChange={handleChange} required
            placeholder="(11) 99999-9999" style={inputStyle} />
        </div>

        {/* SEÇÃO DE CARTÕES */}
        <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, margin: 0, fontFamily: 'Playfair Display, serif' }}>Cartões Cadastrados</h2>
            <button type="button" onClick={handleAddCartao} style={{
              background: 'transparent', border: '1px solid var(--wine)', color: 'var(--wine)',
              borderRadius: 6, padding: '6px 12px', fontSize: 13, cursor: 'pointer'
            }}>
              + Adicionar Cartão
            </button>
          </div>

          {form.cartoes.length === 0 && (
            <p style={{ fontSize: 14, color: 'var(--muted)' }}>Nenhum cartão cadastrado.</p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {form.cartoes.map((cartao, index) => (
              <div key={index} style={{ padding: 16, border: '1px solid var(--border)', borderRadius: 8, background: '#F9FAFB' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>Cartão {index + 1}</span>
                  <button type="button" onClick={() => handleRemoveCartao(index)} style={{
                    background: 'none', border: 'none', color: '#991B1B', fontSize: 13, cursor: 'pointer'
                  }}>
                    Remover
                  </button>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={labelStyle}>Número do Cartão</label>
                    <input name="numero" value={cartao.numero} onChange={(e) => handleCartaoChange(index, e)} style={inputStyle} placeholder="0000 0000 0000 0000" maxLength="19" />
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={labelStyle}>Nome no Cartão</label>
                    <input name="nomeTitular" value={cartao.nomeTitular} onChange={(e) => handleCartaoChange(index, e)} style={inputStyle} placeholder="NOME IMPRESSO" />
                  </div>
                  <div>
                    <label style={labelStyle}>Validade</label>
                    <input name="validade" value={cartao.validade} onChange={(e) => handleCartaoChange(index, e)} style={inputStyle} placeholder="MM/AA" maxLength="5" />
                  </div>
                  <div>
                    <label style={labelStyle}>CVV</label>
                    <input name="cvv" value={cartao.cvv} onChange={(e) => handleCartaoChange(index, e)} style={inputStyle} placeholder="123" maxLength="4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTÕES DE AÇÃO */}
        <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
          <button type="submit" style={{
            background: 'var(--wine)', color: '#fff', border: 'none',
            borderRadius: 8, padding: '11px 24px', fontSize: 14,
            cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
          }}>
            Salvar alterações
          </button>

          <button type="button" onClick={() => navigate('/admin/clientes')} style={{
            background: 'transparent', border: '1px solid var(--border)',
            borderRadius: 8, padding: '11px 24px', fontSize: 14,
            cursor: 'pointer', color: 'var(--muted)', fontFamily: 'DM Sans, sans-serif'
          }}>
            Cancelar
          </button>

          {form.status === 'ativo' ? (
            <button type="button" onClick={handleInativar} style={{
              background: 'transparent', border: '1px solid #FECACA',
              borderRadius: 8, padding: '11px 24px', fontSize: 14,
              cursor: 'pointer', color: '#991B1B', fontFamily: 'DM Sans, sans-serif',
              marginLeft: 'auto'
            }}>
              Inativar cliente
            </button>
          ) : (
            <button type="button" onClick={handleReativar} style={{
              background: 'transparent', border: '1px solid #BBF7D0',
              borderRadius: 8, padding: '11px 24px', fontSize: 14,
              cursor: 'pointer', color: '#166534', fontFamily: 'DM Sans, sans-serif',
              marginLeft: 'auto'
            }}>
              Reativar cliente
            </button>
          )}
        </div>
      </form>
    </div>
  )
}