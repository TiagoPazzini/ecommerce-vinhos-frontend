import { useEffect, useRef } from 'react' // <-- Importações nativas para controlar o scroll
import { useChatbotController } from '../controllers/useChatbotController'

export default function Chatbot() {
  const {
    isOpen, setIsOpen, inputMessage, setInputMessage,
    messages, loading, handleSendMessage, adicionarAoCarrinhoDireto
  } = useChatbotController()

  const messagesEndRef = useRef(null)

  // Dispara a rolagem automática sempre que uma nova mensagem entrar, o estado de loading mudar ou o chat abrir
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, loading, isOpen])

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, fontFamily: 'DM Sans, sans-serif' }}>
      
      {/* Botão Flutuante */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          style={{
            width: '60px', height: '60px', borderRadius: '50%',
            background: 'var(--wine)', color: '#fff', border: 'none',
            fontSize: '28px', cursor: 'pointer', boxShadow: '0 4px 16px rgba(74,16,32,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
          }}>
          🤖
        </button>
      )}

      {/* Janela do Chatbot */}
      {isOpen && (
        <div style={{
          width: '380px', height: '520px', background: '#fff',
          borderRadius: '16px', border: '1px solid var(--border)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)', display: 'flex',
          flexDirection: 'column', overflow: 'hidden'
        }}>
          
          {/* Cabeçalho */}
          <div style={{ background: 'var(--wine-dark)', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>🍷</span>
              <div>
                <h3 style={{ margin: 0, color: 'var(--cream)', fontSize: '15px', fontWeight: 600 }}>Sommelier Virtual</h3>
                <p style={{ margin: 0, color: 'var(--gold)', fontSize: '11px' }}>Curadoria Vinho & Co.</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'transparent', border: 'none', color: 'rgba(248,244,239,0.6)', cursor: 'pointer', fontSize: '16px' }}>
              ✕
            </button>
          </div>

          {/* Área de Mensagens */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', background: 'var(--cream)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                
                {/* Balão de Texto Padrão */}
                <div style={{
                  padding: '12px 16px', borderRadius: '14px',
                  fontSize: '13.5px', lineHeight: '1.45',
                  background: msg.sender === 'user' ? 'var(--wine)' : '#fff',
                  color: msg.sender === 'user' ? '#fff' : 'var(--text)',
                  border: msg.sender === 'user' ? 'none' : '1px solid var(--border)',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                }}>
                  {msg.text}
                </div>

                {/* MINI CARD COM COMPRA DIRETA VIA BOTÃO NATIVO */}
                {msg.vinhoCard && (
                  <div style={{
                    background: '#fff', border: '1px solid var(--border)',
                    borderRadius: '12px', padding: '12px', marginTop: '8px',
                    display: 'flex', gap: '12px', alignItems: 'center',
                    justifyContent: 'space-between', boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
                  }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{
                        width: '45px', height: '45px', borderRadius: '8px',
                        background: 'var(--wine-dark)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', fontSize: '20px'
                      }}>🍾</div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: 600, color: 'var(--text)' }}>{msg.vinhoCard.nome}</h4>
                        <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--muted)' }}>
                          {msg.vinhoCard.uva} • {msg.vinhoCard.regiao}, {msg.vinhoCard.pais}
                        </p>
                        <span style={{ display: 'block', marginTop: '4px', fontSize: '13px', fontWeight: 600, color: 'var(--wine)' }}>
                          R$ {msg.vinhoCard.preco.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => adicionarAoCarrinhoDireto(msg.vinhoCard)}
                      style={{
                        background: 'var(--wine)', color: '#fff', border: 'none',
                        borderRadius: '6px', padding: '8px 12px', fontSize: '12px',
                        fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
                        whiteSpace: 'nowrap', alignSelf: 'center'
                      }}
                      onMouseOver={e => e.currentTarget.style.background = 'var(--wine-light)'}
                      onMouseOut={e => e.currentTarget.style.background = 'var(--wine)'}
                    >
                      + Carrinho
                    </button>
                  </div>
                )}

              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start', background: '#fff', padding: '10px 14px', borderRadius: '12px', fontSize: '12px', color: 'var(--muted)', border: '1px solid var(--border)' }}>
                Selecionando safras...
              </div>
            )}
            
            {/* ÂNCORA INVISÍVEL PARA SCROLL AUTOMÁTICO */}
            <div ref={messagesEndRef} />
          </div>

          {/* Formulário de Input */}
          <form 
            onSubmit={handleSendMessage}
            style={{ padding: '12px', borderTop: '1px solid var(--border)', display: 'flex', gap: '8px', background: '#fff' }}>
            <input 
              type="text"
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              placeholder="Pergunte ao sommelier..."
              style={{
                flex: 1, border: '1px solid var(--border)', borderRadius: '8px',
                padding: '10px 12px', fontSize: '13px', outline: 'none'
              }}
            />
            <button 
              type="submit"
              style={{
                background: 'var(--wine)', color: '#fff', border: 'none',
                borderRadius: '8px', padding: '0 16px', fontSize: '13px',
                fontWeight: 500, cursor: 'pointer'
              }}>
              Enviar
            </button>
          </form>

        </div>
      )}

    </div>
  )
}