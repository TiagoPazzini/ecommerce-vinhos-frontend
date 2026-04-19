import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { cadastrarCliente } from '../../services/clienteService'

const BANDEIRAS = ['Visa', 'Mastercard', 'Elo', 'American Express', 'Hipercard']
const TIPOS_RESIDENCIA = ['Casa', 'Apartamento', 'Comercial', 'Outro']
const TIPOS_LOGRADOURO = ['Rua', 'Avenida', 'Travessa', 'Alameda', 'Praça', 'Rodovia']

function calcularIdade(dataNascimento) {
  const hoje = new Date()
  const nascimento = new Date(dataNascimento)
  let idade = hoje.getFullYear() - nascimento.getFullYear()
  if (hoje.getMonth() < nascimento.getMonth() ||
    (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate())) {
    idade--
  }
  return idade
}

const enderecoVazio = () => ({
  apelido: '', tipoResidencia: '', tipoLogradouro: '',
  logradouro: '', numero: '', bairro: '', cep: '',
  cidade: '', estado: '', pais: 'Brasil', observacoes: '',
  tipoEndereco: 'entrega'
})

const cartaoVazio = () => ({
  numero: '', nomeImpresso: '', bandeira: '', codSeguranca: '', preferencial: false
})

const inputStyle = {
  width: '100%', border: '1px solid var(--border)', borderRadius: 8,
  padding: '10px 14px', fontSize: 14, fontFamily: 'DM Sans, sans-serif',
  outline: 'none', boxSizing: 'border-box', background: '#fff'
}

const labelStyle = {
  display: 'block', fontSize: 13, color: 'var(--muted)', marginBottom: 6
}

export default function ClienteCadastro() {
  const navigate = useNavigate()
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  const [form, setForm] = useState({
    nome: '', email: '', cpf: '', dataNascimento: '',
    genero: '', telefone: '', senha: '', confirmarSenha: '',
  })
  const [enderecos, setEnderecos] = useState([enderecoVazio()])
  const [cartoes, setCartoes] = useState([cartaoVazio()])
  const [erro, setErro] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleEnderecoChange(index, e) {
    const novos = [...enderecos]
    novos[index][e.target.name] = e.target.value
    setEnderecos(novos)
  }

  function handleCartaoChange(index, e) {
    const novos = [...cartoes]
    novos[index][e.target.name] = e.target.value
    setCartoes(novos)
  }

  function togglePreferencial(index) {
    setCartoes(cartoes.map((c, i) => ({ ...c, preferencial: i === index })))
  }

  function adicionarEndereco() {
    setEnderecos([...enderecos, enderecoVazio()])
  }

  function removerEndereco(index) {
    if (enderecos.length === 1) return
    setEnderecos(enderecos.filter((_, i) => i !== index))
  }

  function adicionarCartao() {
    setCartoes([...cartoes, cartaoVazio()])
  }

  function removerCartao(index) {
    if (cartoes.length === 1) return
    setCartoes(cartoes.filter((_, i) => i !== index))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setErro('')

    if (calcularIdade(form.dataNascimento) < 18) {
      setErro('É necessário ter 18 anos ou mais para se cadastrar. (RN0071)')
      return
    }
    if (form.senha !== form.confirmarSenha) {
      setErro('As senhas não coincidem.')
      return
    }
    const senhaForte = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/.test(form.senha)
    if (!senhaForte) {
      setErro('Senha deve ter 8+ caracteres, maiúscula, minúscula e caractere especial. (RNF0031)')
      return
    }
    const temCobranca = enderecos.some(e => e.tipoEndereco === 'cobranca')
    const temEntrega = enderecos.some(e => e.tipoEndereco === 'entrega')
    if (!temCobranca) {
      setErro('É obrigatório cadastrar ao menos um endereço de cobrança. (RN0021)')
      return
    }
    if (!temEntrega) {
      setErro('É obrigatório cadastrar ao menos um endereço de entrega. (RN0022)')
      return
    }

    cadastrarCliente({ ...form, enderecos, cartoes })
    alert('Cliente cadastrado com sucesso!')
    navigate(isAdmin ? '/admin/clientes' : '/')
  }

  const secaoStyle = {
    background: '#fff', border: '1px solid var(--border)',
    borderRadius: 12, padding: 24, marginBottom: 24
  }

  const secaoTituloStyle = {
    fontFamily: 'Playfair Display, serif', fontSize: 18,
    color: 'var(--wine-dark)', marginBottom: 20, paddingBottom: 12,
    borderBottom: '1px solid var(--border)'
  }

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 32px' }}>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, marginBottom: 8 }}>
        Cadastro de cliente
      </h1>
      <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 32 }}>
        Preencha todos os dados abaixo para criar o cadastro.
      </p>

      {erro && (
        <div style={{
          background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8,
          padding: '12px 16px', color: '#991B1B', fontSize: 13, marginBottom: 24
        }}>
          {erro}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        {/* DADOS PESSOAIS */}
        <div style={secaoStyle}>
          <h2 style={secaoTituloStyle}>Dados pessoais</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Nome completo</label>
              <input name="nome" value={form.nome} onChange={handleChange} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>E-mail</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>CPF</label>
              <input name="cpf" value={form.cpf} onChange={handleChange} required placeholder="000.000.000-00" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Data de nascimento</label>
              <input type="date" name="dataNascimento" value={form.dataNascimento} onChange={handleChange} required style={inputStyle} />
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
              <input name="telefone" value={form.telefone} onChange={handleChange} required placeholder="(11) 99999-9999" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Senha</label>
              <input type="password" name="senha" value={form.senha} onChange={handleChange} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Confirmar senha</label>
              <input type="password" name="confirmarSenha" value={form.confirmarSenha} onChange={handleChange} required style={inputStyle} />
            </div>
          </div>
        </div>

        {/* ENDEREÇOS */}
        <div style={secaoStyle}>
          <h2 style={secaoTituloStyle}>Endereços</h2>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 20, marginTop: -12 }}>
            Obrigatório ao menos um endereço de cobrança e um de entrega. (RN0021 / RN0022)
          </p>

          {enderecos.map((end, index) => (
            <div key={index} style={{
              border: '1px solid var(--border)', borderRadius: 10,
              padding: 20, marginBottom: 16, background: 'var(--cream)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontWeight: 500, fontSize: 14 }}>Endereço {index + 1}</span>
                {enderecos.length > 1 && (
                  <button type="button" onClick={() => removerEndereco(index)} style={{
                    background: 'none', border: 'none', color: '#991B1B',
                    fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
                  }}>
                    Remover
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Apelido do endereço</label>
                  <input name="apelido" value={end.apelido} onChange={e => handleEnderecoChange(index, e)}
                    required placeholder="Ex: Casa, Trabalho" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Tipo de endereço</label>
                  <select name="tipoEndereco" value={end.tipoEndereco} onChange={e => handleEnderecoChange(index, e)} required style={inputStyle}>
                    <option value="entrega">Entrega</option>
                    <option value="cobranca">Cobrança</option>
                    <option value="ambos">Ambos</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Tipo de residência</label>
                  <select name="tipoResidencia" value={end.tipoResidencia} onChange={e => handleEnderecoChange(index, e)} required style={inputStyle}>
                    <option value="">Selecione</option>
                    {TIPOS_RESIDENCIA.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Tipo de logradouro</label>
                  <select name="tipoLogradouro" value={end.tipoLogradouro} onChange={e => handleEnderecoChange(index, e)} required style={inputStyle}>
                    <option value="">Selecione</option>
                    {TIPOS_LOGRADOURO.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Logradouro</label>
                  <input name="logradouro" value={end.logradouro} onChange={e => handleEnderecoChange(index, e)} required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Número</label>
                  <input name="numero" value={end.numero} onChange={e => handleEnderecoChange(index, e)} required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Bairro</label>
                  <input name="bairro" value={end.bairro} onChange={e => handleEnderecoChange(index, e)} required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>CEP</label>
                  <input name="cep" value={end.cep} onChange={e => handleEnderecoChange(index, e)} required placeholder="00000-000" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Cidade</label>
                  <input name="cidade" value={end.cidade} onChange={e => handleEnderecoChange(index, e)} required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Estado</label>
                  <input name="estado" value={end.estado} onChange={e => handleEnderecoChange(index, e)} required placeholder="SP" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>País</label>
                  <input name="pais" value={end.pais} onChange={e => handleEnderecoChange(index, e)} required style={inputStyle} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Observações (opcional)</label>
                  <input name="observacoes" value={end.observacoes} onChange={e => handleEnderecoChange(index, e)} style={inputStyle} />
                </div>
              </div>
            </div>
          ))}

          <button type="button" onClick={adicionarEndereco} style={{
            background: 'transparent', border: '1px dashed var(--wine)',
            borderRadius: 8, padding: '10px 20px', color: 'var(--wine)',
            fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', width: '100%'
          }}>
            + Adicionar outro endereço
          </button>
        </div>

        {/* CARTÕES */}
        <div style={secaoStyle}>
          <h2 style={secaoTituloStyle}>Cartões de crédito</h2>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 20, marginTop: -12 }}>
            Adicione os cartões que deseja usar nas compras. (RN0024 / RN0025)
          </p>

          {cartoes.map((cartao, index) => (
            <div key={index} style={{
              border: '1px solid var(--border)', borderRadius: 10,
              padding: 20, marginBottom: 16, background: 'var(--cream)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontWeight: 500, fontSize: 14 }}>Cartão {index + 1}</span>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
                    <input type="radio" name="preferencial" checked={cartao.preferencial}
                      onChange={() => togglePreferencial(index)} />
                    Preferencial
                  </label>
                  {cartoes.length > 1 && (
                    <button type="button" onClick={() => removerCartao(index)} style={{
                      background: 'none', border: 'none', color: '#991B1B',
                      fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
                    }}>
                      Remover
                    </button>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Número do cartão</label>
                  <input name="numero" value={cartao.numero} onChange={e => handleCartaoChange(index, e)}
                    required placeholder="0000 0000 0000 0000" style={inputStyle} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Nome impresso no cartão</label>
                  <input name="nomeImpresso" value={cartao.nomeImpresso} onChange={e => handleCartaoChange(index, e)}
                    required placeholder="Como aparece no cartão" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Bandeira</label>
                  <select name="bandeira" value={cartao.bandeira} onChange={e => handleCartaoChange(index, e)} required style={inputStyle}>
                    <option value="">Selecione</option>
                    {BANDEIRAS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Código de segurança</label>
                  <input name="codSeguranca" value={cartao.codSeguranca} onChange={e => handleCartaoChange(index, e)}
                    required placeholder="CVV" style={inputStyle} />
                </div>
              </div>
            </div>
          ))}

          <button type="button" onClick={adicionarCartao} style={{
            background: 'transparent', border: '1px dashed var(--wine)',
            borderRadius: 8, padding: '10px 20px', color: 'var(--wine)',
            fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', width: '100%'
          }}>
            + Adicionar outro cartão
          </button>
        </div>

        {/* AVISO LEGAL */}
        <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 24 }}>
          Beba com moderação. Venda proibida para menores de 18 anos. (RN0082)
        </p>

        {/* BOTÕES */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" style={{
            background: 'var(--wine)', color: '#fff', border: 'none',
            borderRadius: 8, padding: '12px 28px', fontSize: 14, fontWeight: 500,
            cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
          }}>
            Cadastrar cliente
          </button>
          <button type="button" onClick={() => navigate(isAdmin ? '/admin/clientes' : '/')} style={{
            background: 'transparent', border: '1px solid var(--border)',
            borderRadius: 8, padding: '12px 28px', fontSize: 14,
            cursor: 'pointer', color: 'var(--muted)', fontFamily: 'DM Sans, sans-serif'
          }}>
            Cancelar
          </button>
        </div>

      </form>
    </div>
  )
}