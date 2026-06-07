import { useCheckoutController } from "../controllers/useCheckoutController"
import { Link } from 'react-router-dom'



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
  const {
    etapa, setEtapa, carrinho, cliente, erro, enderecoSelecionado,
    frete, codigoCupom, setCodigoCupom, cuponsAplicados, cartoesSelecionados,
    erroPagamento, subtotal, descontoCupons, totalComFrete,
    handleSelecionarEndereco, handleProximaEtapa, handleAplicarCupom,
    handleRemoverCupom, handleToggleCartao, handleValorCartao,
    validarValorCartao, calcularFrete, handleConfirmar, adicionandoEndereco, setAdicionandoEndereco, novoEndereco,
    handleNovoEnderecoChange, handleSalvarEndereco, adicionandoCartao, setAdicionandoCartao, novoCartao,
    handleNovoCartaoChange, handleSalvarCartao
  } = useCheckoutController()


  // Se carrinho vazio
  if (carrinho.length === 0 && etapa !== 3) {
    return (
      <div style={{ maxWidth: 600, margin: '80px auto', textAlign: 'center', padding: 32 }}>
        <p style={{ fontSize: 18, color: 'var(--muted)', marginBottom: 24 }}>Seu carrinho está vazio.</p>
        <Link to="/catalogo" style={{
          background: 'var(--wine)', color: '#fff', border: 'none', textDecoration: 'none',
          display: 'inline-block',
          borderRadius: 8, padding: '12px 24px', fontSize: 14, cursor: 'pointer'
        }}>
          Ir para o Catálogo
        </Link>
      </div>
    )
  }

  // 🛡️ ADICIONE ESTE GUARD AQUI: Impede que a tela renderize formulários errados enquanto o Supabase responde
  if (!cliente && etapa !== 3) {
    return (
      <div style={{ padding: 80, textAlign: 'center', fontFamily: 'DM Sans, sans-serif', color: 'var(--muted)' }}>
        Carregando dados do perfil...
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

              {!cliente?.enderecos?.length || adicionandoEndereco ? (
                <form onSubmit={handleSalvarEndereco} style={{ background: '#F9FAFB', border: '1px solid var(--border)', borderRadius: 10, padding: 20, marginBottom: 16 }}>
                  <h3 style={{ fontSize: 16, marginBottom: 16, marginTop: 0 }}>Cadastrar Endereço</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <input name="apelido" placeholder="Apelido (ex: Casa)" value={novoEndereco.apelido} onChange={handleNovoEnderecoChange} style={inputStyle} required />
                    <input name="cep" placeholder="CEP (somente números)" value={novoEndereco.cep} onChange={handleNovoEnderecoChange} style={inputStyle} required maxLength="8" />
                    <input name="logradouro" placeholder="Endereço (Rua, Avenida...)" value={novoEndereco.logradouro} onChange={handleNovoEnderecoChange} style={{ ...inputStyle, gridColumn: 'span 2' }} required />
                    <input name="numero" placeholder="Número" value={novoEndereco.numero} onChange={handleNovoEnderecoChange} style={inputStyle} required />
                    <input name="bairro" placeholder="Bairro" value={novoEndereco.bairro} onChange={handleNovoEnderecoChange} style={inputStyle} required />
                    <input name="cidade" placeholder="Cidade" value={novoEndereco.cidade} onChange={handleNovoEnderecoChange} style={inputStyle} required />
                    <input name="estado" placeholder="Estado (ex: SP)" value={novoEndereco.estado} onChange={handleNovoEnderecoChange} style={inputStyle} required maxLength="2" />
                  </div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                    <button type="submit" style={{ background: 'var(--wine)', color: '#fff', padding: '10px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13 }}>
                      Salvar Endereço
                    </button>
                    {cliente?.enderecos?.length > 0 && (
                      <button type="button" onClick={() => setAdicionandoEndereco(false)} style={{ background: 'transparent', border: '1px solid var(--border)', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
              ) : (
                <>
                  {cliente.enderecos
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
                    ))}

                  <button type="button" onClick={() => setAdicionandoEndereco(true)} style={{
                    width: '100%', background: 'transparent', border: '1px dashed var(--wine)', color: 'var(--wine)',
                    padding: 16, borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 500
                  }}>
                    + Adicionar outro endereço
                  </button>
                </>
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
              <h2 style={secaoTituloStyle}>Resumo do Pedido</h2>
              <div style={{ marginBottom: 20, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
                {carrinho.map(item => (
                  <div key={item.produto.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>
                    <span>{item.produto.nome} (x{item.quantidade})</span>
                    <span>R$ {(item.produto.preco * item.quantidade).toFixed(2)}</span>
                  </div>
                ))}
              </div>
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
                Valor a ser pago no cartão: <strong style={{ color: 'var(--wine)' }}>R$ {totalComFrete.toFixed(2)}</strong>
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

              {/* Substitua o final da seção de Cartões pelo código abaixo */}
              {!adicionandoCartao ? (
                <button type="button" onClick={() => setAdicionandoCartao(true)} style={{
                  width: '100%', background: 'transparent', border: '1px dashed var(--wine)', color: 'var(--wine)',
                  padding: 16, borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 500, marginTop: 12
                }}>
                  + Adicionar novo cartão
                </button>
              ) : (
                <form onSubmit={handleSalvarCartao} style={{ background: '#F9FAFB', border: '1px solid var(--border)', borderRadius: 10, padding: 20, marginTop: 16 }}>
                  <h3 style={{ fontSize: 15, marginBottom: 16, marginTop: 0 }}>Novo Cartão</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <input name="numero" placeholder="Número do Cartão" value={novoCartao.numero} onChange={handleNovoCartaoChange} style={{ ...inputStyle, gridColumn: 'span 2' }} required />
                    <input name="nomeImpresso" placeholder="Nome Impresso" value={novoCartao.nomeImpresso} onChange={handleNovoCartaoChange} style={{ ...inputStyle, gridColumn: 'span 2' }} required />
                    <select name="bandeira" value={novoCartao.bandeira} onChange={handleNovoCartaoChange} style={inputStyle} required>
                      <option value="">Bandeira</option>
                      <option value="Visa">Visa</option>
                      <option value="Mastercard">Mastercard</option>
                      <option value="Elo">Elo</option>
                    </select>
                    <input name="codSeguranca" placeholder="CVV" value={novoCartao.codSeguranca} onChange={handleNovoCartaoChange} style={inputStyle} required maxLength="4" />
                  </div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                    <button type="submit" style={{ background: 'var(--wine)', color: '#fff', padding: '10px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13 }}>
                      Confirmar Cartão
                    </button>
                    <button type="button" onClick={() => setAdicionandoCartao(false)} style={{ background: 'transparent', border: '1px solid var(--border)', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
                      Cancelar
                    </button>
                  </div>
                </form>
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