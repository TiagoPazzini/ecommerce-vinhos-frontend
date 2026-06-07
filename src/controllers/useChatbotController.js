import { useState, useEffect } from 'react'
import { ProdutoDAO } from '../dao/ProdutoDAO'
import { PedidoDAO } from '../dao/PedidoDAO'
import { useAuth } from '../contexts/AuthContext'
import { useCarrinhoGlobal } from '../contexts/CarrinhoContext'
import { gerarRecomendacaoIA } from '../services/aiService'

export function useChatbotController() {
  const { usuario } = useAuth()
  const { carrinho, atualizarCarrinho } = useCarrinhoGlobal()
  
  const [isOpen, setIsOpen] = useState(false)
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Olá! Sou o Sommelier IA da Vinho & Co. Como posso te ajudar hoje? Posso sugerir harmonizações de vinhos finos para o seu menu.' }
  ])

  const [contextoProdutos, setContextoProdutos] = useState([])
  const [contextoHistorico, setContextoHistorico] = useState([])

  useEffect(() => {
    async function carregarContexto() {
      try {
        const produtoDao = new ProdutoDAO()
        setContextoProdutos(await produtoDao.readAll())

        if (usuario?.email) {
          const pedidoDao = new PedidoDAO()
          const todosPedidos = await pedidoDao.readAll()
          
          // 🔥 FILTRAGEM BLINDADA: Garante que os 50 pedidos entram no contexto do chat sem quebras
          const meusPedidos = todosPedidos.filter(p => {
            const emailPedido = p.clienteEmail || p.cliente_email;
            if (!emailPedido) return false;
            return emailPedido.toLowerCase().trim() === usuario.email.toLowerCase().trim();
          })
          
          console.log("🤖 Histórico real enviado para a IA do Chatbot:", meusPedidos);
          setContextoHistorico(meusPedidos)
        }
      } catch (error) {
        console.error("Erro ao carregar contexto no chatbot:", error)
      }
    }
    carregarContexto()
  }, [usuario])

  async function adicionarAoCarrinhoDireto(vinho) {
    try {
      let carrinhoAtual = [...carrinho]
      const itemExistente = carrinhoAtual.find(item => item.produto.id === vinho.id)

      if (itemExistente) {
        itemExistente.quantidade += 1
      } else {
        carrinhoAtual.push({ produto: vinho, Clinicalquantidade: 1 })
      }

      await atualizarCarrinho(carrinhoAtual)
      alert(`${vinho.nome} foi adicionado ao seu carrinho!`)
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho pelo chat:", error)
    }
  }

  async function handleSendMessage(e) {
    e.preventDefault()
    if (!inputMessage.trim()) return

    const userMessage = { id: Date.now(), sender: 'user', text: inputMessage }
    const historicoEnvio = [...messages, userMessage]
    setMessages(historicoEnvio)
    
    const textoDigitado = inputMessage
    setInputMessage('')
    setLoading(true)

    try {
      const respostaRaw = await gerarRecomendacaoIA(
        textoDigitado, 
        contextoProdutos, 
        contextoHistorico, 
        usuario?.nome,
        historicoEnvio
      )

      let textoFinalParaExibicao = respostaRaw
      let produtoOfertado = null

      const matchOferta = respostaRaw.match(/\[OFERTA:(\d+)\]/)
      if (matchOferta) {
        const idVinhoOfertado = Number(matchOferta[1])
        produtoOfertado = contextoProdutos.find(p => p.id === idVinhoOfertado) || null
      }

      textoFinalParaExibicao = textoFinalParaExibicao
        .replace(/\[OFERTA:\d+\]/g, '')
        .replace(/\[COMPRAR:\d+\]/g, '')
        .trim()

      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        sender: 'bot', 
        text: textoFinalParaExibicao,
        vinhoCard: produtoOfertado
      }])

    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: error.message }])
    } finally {
      setLoading(false)
    }
  }

  return {
    isOpen, setIsOpen, inputMessage, setInputMessage,
    messages, loading, handleSendMessage, adicionarAoCarrinhoDireto
  }
}