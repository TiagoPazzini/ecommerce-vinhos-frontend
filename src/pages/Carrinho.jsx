import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Carrinho() {
  const navigate = useNavigate()
  const [carrinho, setCarrinho] = useState([])

  // Carregar carrinho do localStorage ao montar o componente
  useEffect(() => {
    carregarCarrinho()
  }, [])

  function carregarCarrinho() {
    const carrinhoSalvo = localStorage.getItem('vinho_carrinho')
    if (carrinhoSalvo) {
      setCarrinho(JSON.parse(carrinhoSalvo))
    }
  }

  // Salvar carrinho no localStorage
  function salvarCarrinho(novoCarrinho) {
    localStorage.setItem('vinho_carrinho', JSON.stringify(novoCarrinho))
    setCarrinho(novoCarrinho)
  }

  // Aumentar quantidade de um item
  function aumentarQuantidade(produtoId) {
    const novoCarrinho = carrinho.map(item => 
      item.produto.id === produtoId 
        ? { ...item, quantidade: item.quantidade + 1 }
        : item
    )
    salvarCarrinho(novoCarrinho)
  }

  // Diminuir quantidade de um item
  function diminuirQuantidade(produtoId) {
    const novoCarrinho = carrinho.map(item => 
      item.produto.id === produtoId && item.quantidade > 1
        ? { ...item, quantidade: item.quantidade - 1 }
        : item
    )
    salvarCarrinho(novoCarrinho)
  }

  // Remover item do carrinho
  function removerItem(produtoId) {
    if (confirm('Deseja remover este item do carrinho?')) {
      const novoCarrinho = carrinho.filter(item => item.produto.id !== produtoId)
      salvarCarrinho(novoCarrinho)
    }
  }

  // Calcular subtotal de um item
  function calcularSubtotal(item) {
    return item.produto.preco * item.quantidade
  }

  // Calcular total geral
  function calcularTotal() {
    return carrinho.reduce((total, item) => total + calcularSubtotal(item), 0)
  }

  // Finalizar compra
  function finalizarCompra() {
  if (carrinho.length === 0) {
    alert('Seu carrinho está vazio!')
    return
  }
  navigate('/checkout')
}

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh', paddingBottom: 60 }}>
      
      {/* Header */}
      <div style={{ 
        background: 'var(--wine-dark)', 
        padding: '32px 40px',
        borderBottom: '1px solid var(--wine)'
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h1 style={{ 
            fontFamily: 'Playfair Display, serif', 
            color: 'var(--cream)', 
            fontSize: 36, 
            fontWeight: 700,
            margin: 0,
            marginBottom: 8
          }}>
            Meu Carrinho
          </h1>
          <p style={{ color: 'rgba(248,244,239,0.7)', fontSize: 15, margin: 0 }}>
            {carrinho.length === 0 
              ? 'Seu carrinho está vazio' 
              : `${carrinho.length} ${carrinho.length === 1 ? 'item' : 'itens'} no carrinho`
            }
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 40px' }}>
        
        {/* Carrinho vazio */}
        {carrinho.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '80px 20px',
            background: '#fff',
            borderRadius: 16,
            border: '1px solid var(--border)'
          }}>
            <span style={{ fontSize: 64, marginBottom: 16, display: 'block' }}>🛒</span>
            <h2 style={{ 
              fontFamily: 'Playfair Display, serif',
              fontSize: 24,
              color: 'var(--text)',
              marginBottom: 12
            }}>
              Seu carrinho está vazio
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: 15, marginBottom: 32 }}>
              Adicione vinhos ao seu carrinho para continuar
            </p>
            <button
              onClick={() => navigate('/catalogo')}
              style={{
                background: 'var(--wine)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '14px 32px',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif'
              }}>
              Ir para o catálogo
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32 }}>
            
            {/* Lista de itens */}
            <div>
              <h2 style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 20,
                marginBottom: 20,
                color: 'var(--text)'
              }}>
                Itens do carrinho
              </h2>

              {carrinho.map(item => (
                <div 
                  key={item.produto.id}
                  style={{
                    background: '#fff',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    padding: 20,
                    marginBottom: 16,
                    display: 'flex',
                    gap: 20,
                    alignItems: 'center'
                  }}>
                  
                  {/* Ícone do vinho */}
                  <div style={{
                    width: 80,
                    height: 80,
                    background: 'var(--wine)',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 36,
                    flexShrink: 0
                  }}>
                    🍷
                  </div>

                  {/* Informações do produto */}
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontFamily: 'Playfair Display, serif',
                      fontSize: 18,
                      fontWeight: 600,
                      margin: '0 0 4px 0',
                      color: 'var(--text)'
                    }}>
                      {item.produto.nome}
                    </h3>
                    <p style={{ 
                      color: 'var(--muted)', 
                      fontSize: 13,
                      margin: '0 0 8px 0'
                    }}>
                      {item.produto.tipo} · {item.produto.uva} · {item.produto.regiao}
                    </p>
                    <p style={{
                      color: 'var(--wine)',
                      fontSize: 16,
                      fontWeight: 600,
                      margin: 0
                    }}>
                      R$ {item.produto.preco.toFixed(2)} / unidade
                    </p>
                  </div>

                  {/* Controles de quantidade */}
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 12
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      padding: '4px 8px'
                    }}>
                      <button
                        onClick={() => diminuirQuantidade(item.produto.id)}
                        disabled={item.quantidade === 1}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: item.quantidade === 1 ? 'var(--border)' : 'var(--wine)',
                          fontSize: 18,
                          cursor: item.quantidade === 1 ? 'not-allowed' : 'pointer',
                          padding: '0 8px',
                          fontWeight: 600
                        }}>
                        −
                      </button>
                      <span style={{ 
                        fontSize: 16, 
                        fontWeight: 600,
                        minWidth: 30,
                        textAlign: 'center'
                      }}>
                        {item.quantidade}
                      </span>
                      <button
                        onClick={() => aumentarQuantidade(item.produto.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--wine)',
                          fontSize: 18,
                          cursor: 'pointer',
                          padding: '0 8px',
                          fontWeight: 600
                        }}>
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removerItem(item.produto.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#DC2626',
                        fontSize: 12,
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        fontFamily: 'DM Sans, sans-serif'
                      }}>
                      Remover
                    </button>
                  </div>

                  {/* Subtotal do item */}
                  <div style={{ 
                    textAlign: 'right',
                    minWidth: 100
                  }}>
                    <p style={{ 
                      color: 'var(--muted)', 
                      fontSize: 11,
                      margin: '0 0 4px 0'
                    }}>
                      Subtotal
                    </p>
                    <p style={{
                      fontFamily: 'Playfair Display, serif',
                      color: 'var(--wine)',
                      fontSize: 20,
                      fontWeight: 700,
                      margin: 0
                    }}>
                      R$ {calcularSubtotal(item).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}

              {/* Botão continuar comprando */}
              <button
                onClick={() => navigate('/catalogo')}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: '12px 24px',
                  fontSize: 14,
                  color: 'var(--muted)',
                  cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                  marginTop: 8
                }}>
                ← Continuar comprando
              </button>
            </div>

            {/* Resumo do pedido */}
            <div>
              <div style={{
                background: '#fff',
                border: '1px solid var(--border)',
                borderRadius: 12,
                padding: 24,
                position: 'sticky',
                top: 20
              }}>
                <h2 style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: 20,
                  marginBottom: 20,
                  color: 'var(--text)',
                  paddingBottom: 16,
                  borderBottom: '1px solid var(--border)'
                }}>
                  Resumo do pedido
                </h2>

                {/* Detalhamento */}
                <div style={{ marginBottom: 20 }}>
                  {carrinho.map(item => (
                    <div 
                      key={item.produto.id}
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        marginBottom: 12,
                        fontSize: 14,
                        color: 'var(--muted)'
                      }}>
                      <span>{item.produto.nome} (x{item.quantidade})</span>
                      <span>R$ {calcularSubtotal(item).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div style={{
                  paddingTop: 20,
                  borderTop: '2px solid var(--border)',
                  marginBottom: 24
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      fontFamily: 'Playfair Display, serif',
                      fontSize: 18,
                      fontWeight: 600,
                      color: 'var(--text)'
                    }}>
                      Total
                    </span>
                    <span style={{
                      fontFamily: 'Playfair Display, serif',
                      fontSize: 28,
                      fontWeight: 700,
                      color: 'var(--wine)'
                    }}>
                      R$ {calcularTotal().toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Botão finalizar */}
                <button
                  onClick={finalizarCompra}
                  style={{
                    width: '100%',
                    background: 'var(--wine)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '16px',
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'DM Sans, sans-serif',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={e => e.currentTarget.style.background = 'var(--wine-light)'}
                  onMouseOut={e => e.currentTarget.style.background = 'var(--wine)'}>
                  Finalizar compra
                </button>

                <p style={{
                  fontSize: 11,
                  color: 'var(--muted)',
                  textAlign: 'center',
                  marginTop: 16,
                  margin: '16px 0 0 0'
                }}>
                  Beba com moderação. Venda proibida para menores de 18 anos.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
