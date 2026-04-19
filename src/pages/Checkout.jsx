import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// Cupons disponíveis para teste
const CUPONS_MOCK = [
  { codigo: 'PROMO10', tipo: 'promocional', valor: 10 },
  { codigo: 'TROCA20', tipo: 'troca', valor: 20 },
]

// Calcula frete pelo primeiro dígito do CEP
function calcularFrete(cep) {
  const inicio = cep.replace(/\D/g, '')[0]
  if (['0', '1'].includes(inicio)) return 15
  if (['2', '3'].includes(inicio)) return 20
  return 25
}

function calcularIdade(dataNascimento) {
  const hoje = new Date()
  const nasc = new Date(dataNascimento)
  let idade = hoje.getFullYear() - nasc.getFullYear()
  if (hoje.getMonth() < nasc.getMonth() ||
    (hoje.getMonth() === nasc.getMonth() && hoje.getDate() < nasc.getDate())) {
    idade--
  }
  return idade
}

const inputStyle = {
  width: '100%', border: '1px solid var(--border)', borderRadius: 8,
  padding: '10px 14px', fontSize: 14, fontFamily: 'DM Sans, sans-serif',
  outline: 'none', boxSizing: 'border-box', background: '#fff'
}

const secaoStyle = {
  background: '#fff', border: '1px solid var(--border)',
  borderRadius: 12, padding: 24, marginBottom: 24
}

const secaoTituloStyle = {
  fontFamily: 'Playfair Display, serif', fontSize: 20,
  color: 'var(--wine-dark)', marginBottom: 20,
  paddingBottom: 12, borderBottom: '1px solid var(--border)'
}

export default function Checkout() {
  const navigate = useNavigate()
  const { usuario } = useAuth()

  const [etapa, setEtapa] = useState(1)
  const [carrinho, setCarrinho] = useState([])
  const [cliente, setCliente] = useState(null)
  const [erro, setErro] = useState('')

  // Etapa 1 — Entrega
  const [enderecoSelecionado, setEnderecoSelecionado] = useState(null)
  const [frete, setFrete] = useState(0)

  // Etapa 2 — Pagamento
  const [codigoCupom, setCodigoCupom] = useState('')
  const [cuponsAplicados, setCuponsAplicados] = useState([])
  const [cartoesSelecionados, setCartoesSelecionados] = useState([])
  const [erroPagamento, setErroPagamento] = useState('')

  // Carrega dados ao montar
  useEffect(() => {
    const carrinhoSalvo = localStorage.getItem('vinho_carrinho')
    if (carrinhoSalvo) setCarrinho(JSON.parse(carrinhoSalvo))

    const clientes = JSON.parse(localStorage.getItem('vinho_clientes') || '[]')
    const clienteLogado = clientes.find(c => c.email === usuario?.email)
    if (clienteLogado) setCliente(clienteLogado)
  }, [])

  // Cálculos
  const subtotal = carrinho.reduce((t, item) => t + item.produto.preco * item.quantidade, 0)
  const descontoCupons = cuponsAplicados.reduce((t, c) => t + c.valor, 0)
  const totalComFrete = subtotal + frete - descontoCupons
  const totalRestante = totalComFrete - cartoesSelecionados.reduce((t, c) => t + (parseFloat(c.valor) || 0), 0)

  // Seleciona endereço e calcula frete
  function handleSelecionarEndereco(end) {
    setEnderecoSelecionado(end)
    setFrete(calcularFrete(end.cep))
  }

  // Avança etapa
  function handleProximaEtapa() {
    setErro('')
    if (etapa === 1) {
      if (!enderecoSelecionado) {
        setErro('Selecione um endereço de entrega.')
        return
      }
      setEtapa(2)
    } else if (etapa === 2) {
      // Valida que o pagamento cobre o total
      const totalPagoCartoes = cartoesSelecionados.reduce((t, c) => t + (parseFloat(c.valor) || 0), 0)
      const totalPago = totalPagoCartoes + descontoCupons
      if (totalPago < totalComFrete) {
        setErroPagamento(`Falta R$ ${(totalComFrete - totalPago).toFixed(2)} para cobrir o total.`)
        return
      }
      setErroPagamento('')
      setEtapa(3)
    }
  }

  // Aplica cupom
  function handleAplicarCupom() {
    setErro('')
    const cupom = CUPONS_MOCK.find(c => c.codigo === codigoCupom.toUpperCase())
    if (!cupom) { setErro('Cupom inválido.'); return }

    const jaAplicado = cuponsAplicados.find(c => c.codigo === cupom.codigo)
    if (jaAplicado) { setErro('Este cupom já foi aplicado.'); return }

    const temPromocional = cuponsAplicados.find(c => c.tipo === 'promocional')
    if (cupom.tipo === 'promocional' && temPromocional) {
      setErro('Apenas um cupom promocional por compra. (RN0033)')
      return
    }

    setCuponsAplicados([...cuponsAplicados, cupom])
    setCodigoCupom('')
  }

  // Remove cupom
  function handleRemoverCupom(codigo) {
    setCuponsAplicados(cuponsAplicados.filter(c => c.codigo !== codigo))
  }

  // Adiciona cartão ao pagamento
  function handleToggleCartao(cartao) {
    const existe = cartoesSelecionados.find(c => c.numero === cartao.numero)
    if (existe) {
      setCartoesSelecionados(cartoesSelecionados.filter(c => c.numero !== cartao.numero))
    } else {
      setCartoesSelecionados([...cartoesSelecionados, { ...cartao, valor: '' }])
    }
  }

  // Atualiza valor do cartão
  function handleValorCartao(numero, valor) {
    setCartoesSelecionados(cartoesSelecionados.map(c =>
      c.numero === numero ? { ...c, valor } : c
    ))
  }

  // Valida valor mínimo por cartão (RN0034 / RN0035)
  function validarValorCartao(cartao) {
    const val = parseFloat(cartao.valor) || 0
    const temCupom = descontoCupons > 0
    if (temCupom) return true // RN0035 — com cupom, valor pode ser menor que R$10
    return val >= 10
  }

  // Confirma pedido
  function handleConfirmar() {
    setErro('')

    // RN0071 — verifica maioridade
    if (cliente?.dataNascimento && calcularIdade(cliente.dataNascimento) < 18) {
      setErro('Não é possível finalizar a compra. Cliente menor de idade. (RN0071)')
      return
    }

    // Valida valores mínimos por cartão
    const cartaoInvalido = cartoesSelecionados.find(c => !validarValorCartao(c))
    if (cartaoInvalido && descontoCupons === 0) {
      setErro('Valor mínimo por cartão é R$ 10,00. (RN0034)')
      return
    }

    // Monta o pedido
    const pedido = {
      id: Date.now(),
      clienteId: cliente?.id,
      clienteEmail: usuario?.email,
      itens: carrinho,
      enderecoEntrega: enderecoSelecionado,
      formasPagamento: {
        cupons: cuponsAplicados,
        cartoes: cartoesSelecionados
      },
      frete,
      subtotal,
      descontoCupons,
      total: totalComFrete,
      status: 'EM PROCESSAMENTO',
      dataPedido: new Date().toISOString()
    }

    // Salva pedido
    const pedidos = JSON.parse(localStorage.getItem('vinho_pedidos') || '[]')
    localStorage.setItem('vinho_pedidos', JSON.stringify([...pedidos, pedido]))

    // Limpa carrinho
    localStorage.setItem('vinho_carrinho', JSON.stringify([]))

    navigate('/pedidos?sucesso=true')
  }

  // Se carrinho vazio
  if (carrinho.length === 0 && etapa !== 3) {
    return (
      <div style={{ maxWidth: 600, margin: '80px auto', textAlign: 'center', padding: 32 }}>
        <p style={{ fontSize: 18, color: 'var(--muted)', marginBottom: 24 }}>Seu carrinho está vazio.</p>
        <button onClick={() => navigate('/catalogo')} style={{
          background: 'var(--wine)', color: '#fff', border: 'none',
          borderRadius: 8, padding: '12px 24px', fontSize: 14, cursor: 'pointer'
        }}>Ir para o catálogo</button>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh', paddingBottom: 60 }}>

      {/* Header */}
      <div style={{ background: 'var(--wine-dark)', padding: '32px 40px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--cream)', fontSize: 32, margin: 0 }}>
            Finalizar compra
          </h1>
        </div>
      </div>

      {/* Indicador de etapas */}
      <div style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '16px 40px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          {['Entrega', 'Pagamento', 'Confirmação'].map((label, i) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600,
                background: etapa > i + 1 ? 'var(--gold)' : etapa === i + 1 ? 'var(--wine)' : 'var(--border)',
                color: etapa >= i + 1 ? '#fff' : 'var(--muted)'
              }}>
                {etapa > i + 1 ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: 13, fontWeight: etapa === i + 1 ? 600 : 400, color: etapa === i + 1 ? 'var(--wine)' : 'var(--muted)' }}>
                {label}
              </span>
              {i < 2 && <span style={{ color: 'var(--border)', margin: '0 4px' }}>›</span>}
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 32px' }}>

        {erro && (
          <div style={{
            background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8,
            padding: '12px 16px', color: '#991B1B', fontSize: 13, marginBottom: 24
          }}>
            {erro}
          </div>
        )}

        {/* ===== ETAPA 1 — ENTREGA ===== */}
        {etapa === 1 && (
          <div>
            <div style={secaoStyle}>
              <h2 style={secaoTituloStyle}>Selecione o endereço de entrega</h2>

              {!cliente?.enderecos?.length ? (
                <p style={{ color: 'var(--muted)', fontSize: 14 }}>
                  Você não tem endereços cadastrados.
                  <button onClick={() => navigate('/cadastro')} style={{
                    background: 'none', border: 'none', color: 'var(--wine)',
                    cursor: 'pointer', textDecoration: 'underline', fontSize: 14, marginLeft: 4
                  }}>
                    Cadastre um endereço.
                  </button>
                </p>
              ) : (
                cliente.enderecos
                  .filter(e => e.tipoEndereco === 'entrega' || e.tipoEndereco === 'ambos')
                  .map((end, i) => (
                    <div key={i} onClick={() => handleSelecionarEndereco(end)} style={{
                      border: `2px solid ${enderecoSelecionado?.apelido === end.apelido ? 'var(--wine)' : 'var(--border)'}`,
                      borderRadius: 10, padding: 16, marginBottom: 12, cursor: 'pointer',
                      background: enderecoSelecionado?.apelido === end.apelido ? '#FFF5F5' : '#fff'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 600, fontSize: 14 }}>{end.apelido}</span>
                        {enderecoSelecionado?.apelido === end.apelido && (
                          <span style={{ color: 'var(--wine)', fontSize: 13 }}>✓ Selecionado</span>
                        )}
                      </div>
                      <p style={{ color: 'var(--muted)', fontSize: 13, margin: '6px 0 0' }}>
                        {end.tipoLogradouro} {end.logradouro}, {end.numero} — {end.bairro}, {end.cidade}/{end.estado} — CEP {end.cep}
                      </p>
                      {enderecoSelecionado?.apelido === end.apelido && (
                        <p style={{ color: 'var(--wine)', fontSize: 13, marginTop: 8, fontWeight: 500 }}>
                          Frete: R$ {calcularFrete(end.cep).toFixed(2)}
                        </p>
                      )}
                    </div>
                  ))
              )}
            </div>

            <button onClick={handleProximaEtapa} style={{
              background: 'var(--wine)', color: '#fff', border: 'none',
              borderRadius: 8, padding: '12px 32px', fontSize: 14, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
            }}>
              Próximo →
            </button>
          </div>
        )}

        {/* ===== ETAPA 2 — PAGAMENTO ===== */}
        {etapa === 2 && (
          <div>
            {/* Resumo de valores */}
            <div style={secaoStyle}>
              <h2 style={secaoTituloStyle}>Resumo</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--muted)' }}>Subtotal</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--muted)' }}>Frete</span>
                  <span>R$ {frete.toFixed(2)}</span>
                </div>
                {descontoCupons > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#166534' }}>
                    <span>Desconto cupons</span>
                    <span>- R$ {descontoCupons.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 16, borderTop: '1px solid var(--border)', paddingTop: 8, marginTop: 4 }}>
                  <span>Total</span>
                  <span style={{ color: 'var(--wine)' }}>R$ {totalComFrete.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Cupons */}
            <div style={secaoStyle}>
              <h2 style={secaoTituloStyle}>Cupons</h2>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <input value={codigoCupom} onChange={e => setCodigoCupom(e.target.value)}
                  placeholder="Digite o código do cupom"
                  style={{ ...inputStyle, flex: 1 }} />
                <button onClick={handleAplicarCupom} style={{
                  background: 'var(--wine)', color: '#fff', border: 'none',
                  borderRadius: 8, padding: '10px 20px', fontSize: 13,
                  cursor: 'pointer', whiteSpace: 'nowrap'
                }}>
                  Aplicar
                </button>
              </div>
              <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>
                Cupons de teste: PROMO10 (R$ 10 off) · TROCA20 (R$ 20 off)
              </p>
              {cuponsAplicados.map(c => (
                <div key={c.codigo} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: '#F0FDF4', border: '1px solid #BBF7D0',
                  borderRadius: 8, padding: '10px 14px', marginBottom: 8
                }}>
                  <span style={{ fontSize: 13, color: '#166534', fontWeight: 500 }}>
                    {c.codigo} — R$ {c.valor.toFixed(2)} ({c.tipo})
                  </span>
                  <button onClick={() => handleRemoverCupom(c.codigo)} style={{
                    background: 'none', border: 'none', color: '#991B1B',
                    cursor: 'pointer', fontSize: 13
                  }}>
                    Remover
                  </button>
                </div>
              ))}
            </div>

            {/* Cartões */}
            <div style={secaoStyle}>
              <h2 style={secaoTituloStyle}>Cartões de crédito</h2>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
                Valor restante a pagar: <strong style={{ color: 'var(--wine)' }}>R$ {Math.max(0, totalComFrete - descontoCupons).toFixed(2)}</strong>
              </p>

              {!cliente?.cartoes?.length ? (
                <p style={{ color: 'var(--muted)', fontSize: 14 }}>
                  Você não tem cartões cadastrados.
                </p>
              ) : (
                cliente.cartoes.map((cartao, i) => {
                  const selecionado = cartoesSelecionados.find(c => c.numero === cartao.numero)
                  return (
                    <div key={i} style={{
                      border: `2px solid ${selecionado ? 'var(--wine)' : 'var(--border)'}`,
                      borderRadius: 10, padding: 16, marginBottom: 12,
                      background: selecionado ? '#FFF5F5' : '#fff'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: selecionado ? 12 : 0 }}>
                        <input type="checkbox" checked={!!selecionado}
                          onChange={() => handleToggleCartao(cartao)}
                          style={{ width: 16, height: 16, cursor: 'pointer' }} />
                        <div>
                          <span style={{ fontWeight: 500, fontSize: 14 }}>
                            {cartao.bandeira} •••• {cartao.numero.slice(-4)}
                          </span>
                          <span style={{ color: 'var(--muted)', fontSize: 13, marginLeft: 8 }}>
                            {cartao.nomeImpresso}
                          </span>
                          {cartao.preferencial && (
                            <span style={{
                              marginLeft: 8, fontSize: 11, background: 'var(--gold)',
                              color: 'var(--wine-dark)', padding: '2px 8px', borderRadius: 20
                            }}>
                              Preferencial
                            </span>
                          )}
                        </div>
                      </div>

                      {selecionado && (
                        <div>
                          <label style={{ display: 'block', fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>
                            Valor a pagar neste cartão (mínimo R$ 10,00)
                          </label>
                          <input type="number" min="0" step="0.01"
                            value={selecionado.valor}
                            onChange={e => handleValorCartao(cartao.numero, e.target.value)}
                            placeholder="0,00"
                            style={{ ...inputStyle, width: 160 }} />
                          {!validarValorCartao(selecionado) && (
                            <p style={{ color: '#991B1B', fontSize: 12, marginTop: 4 }}>
                              Valor mínimo de R$ 10,00 por cartão. (RN0034)
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })
              )}

              {erroPagamento && (
                <p style={{ color: '#991B1B', fontSize: 13, marginTop: 8 }}>{erroPagamento}</p>
              )}
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setEtapa(1)} style={{
                background: 'transparent', border: '1px solid var(--border)',
                borderRadius: 8, padding: '12px 24px', fontSize: 14,
                cursor: 'pointer', color: 'var(--muted)', fontFamily: 'DM Sans, sans-serif'
              }}>
                ← Voltar
              </button>
              <button onClick={handleProximaEtapa} style={{
                background: 'var(--wine)', color: '#fff', border: 'none',
                borderRadius: 8, padding: '12px 32px', fontSize: 14, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
              }}>
                Próximo →
              </button>
            </div>
          </div>
        )}

        {/* ===== ETAPA 3 — CONFIRMAÇÃO ===== */}
        {etapa === 3 && (
          <div>
            <div style={secaoStyle}>
              <h2 style={secaoTituloStyle}>Resumo do pedido</h2>

              {/* Itens */}
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Itens</h3>
              {carrinho.map(item => (
                <div key={item.produto.id} style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: 14, color: 'var(--muted)', marginBottom: 8
                }}>
                  <span>{item.produto.nome} × {item.quantidade}</span>
                  <span>R$ {(item.produto.preco * item.quantidade).toFixed(2)}</span>
                </div>
              ))}

              <div style={{ borderTop: '1px solid var(--border)', marginTop: 16, paddingTop: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Entrega</h3>
                <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>
                  {enderecoSelecionado?.tipoLogradouro} {enderecoSelecionado?.logradouro}, {enderecoSelecionado?.numero} — {enderecoSelecionado?.bairro}, {enderecoSelecionado?.cidade}/{enderecoSelecionado?.estado}
                </p>
                <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
                  Frete: R$ {frete.toFixed(2)}
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', marginTop: 16, paddingTop: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Pagamento</h3>
                {cuponsAplicados.map(c => (
                  <p key={c.codigo} style={{ fontSize: 13, color: '#166534', margin: '0 0 4px' }}>
                    Cupom {c.codigo}: - R$ {c.valor.toFixed(2)}
                  </p>
                ))}
                {cartoesSelecionados.map(c => (
                  <p key={c.numero} style={{ fontSize: 13, color: 'var(--muted)', margin: '0 0 4px' }}>
                    {c.bandeira} •••• {c.numero.slice(-4)}: R$ {parseFloat(c.valor).toFixed(2)}
                  </p>
                ))}
              </div>

              <div style={{ borderTop: '2px solid var(--border)', marginTop: 16, paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 600 }}>Total</span>
                <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: 'var(--wine)' }}>
                  R$ {totalComFrete.toFixed(2)}
                </span>
              </div>
            </div>

            <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 24 }}>
              Beba com moderação. Venda proibida para menores de 18 anos. (RN0082)
            </p>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setEtapa(2)} style={{
                background: 'transparent', border: '1px solid var(--border)',
                borderRadius: 8, padding: '12px 24px', fontSize: 14,
                cursor: 'pointer', color: 'var(--muted)', fontFamily: 'DM Sans, sans-serif'
              }}>
                ← Voltar
              </button>
              <button onClick={handleConfirmar} style={{
                background: 'var(--wine)', color: '#fff', border: 'none',
                borderRadius: 8, padding: '12px 32px', fontSize: 14, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
              }}>
                Confirmar pedido ✓
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}