import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { PedidoModel } from '../models/PedidoModel'
import { PedidoDAO } from '../dao/PedidoDAO'

export function usePedidosController() {
  const navigate = useNavigate()
  const { usuario } = useAuth()
  
  const [searchParams] = useSearchParams()
  const sucesso = searchParams.get('sucesso')

  const [pedidos, setPedidos] = useState([])
  const [expandido, setExpandido] = useState(null)
  
  const dao = new PedidoDAO()

  async function carregarPedidos() {
    if (usuario?.email) {
      try {
        const todos = await dao.readAll()
        
        // 🔥 FILTRAGEM BLINDADA: Aceita os dois padrões e evita quebras se houver dados nulos
        const meus = todos.filter(p => {
          // Tenta pegar o e-mail tanto em camelCase quanto em snake_case do banco
          const emailPedido = p.clienteEmail || p.cliente_email;
          
          // Se o pedido não tiver e-mail por algum motivo, ignora de forma segura sem quebrar a tela
          if (!emailPedido) return false; 
          
          return emailPedido.toLowerCase().trim() === usuario.email.toLowerCase().trim();
        })
        
        setPedidos(meus.reverse())
      } catch (error) {
        console.error("❌ Erro ao ler a tabela do Supabase:", error.message);
      }
    }
  }

  useEffect(() => {
    carregarPedidos()
  }, [usuario])

  function toggleExpandido(id) {
    setExpandido(expandido === id ? null : id)
  }

 // Dentro de src/controllers/usePedidosController.js
  async function handleSolicitarTroca(pedidoId, itensSelecao = null) {
    const msgConfirmacao = itensSelecao 
      ? 'Deseja solicitar a devolução parcial dos itens selecionados?' 
      : 'Deseja solicitar a troca/devolução total deste pedido?';

    if (window.confirm(msgConfirmacao)) {
      try {
        // Se foi passada uma seleção em lote de itens
        if (itensSelecao && Object.keys(itensSelecao).length > 0) {
          const pedidoOriginal = await dao.read(pedidoId);
          if (!pedidoOriginal) return;

          const itensAtualizados = pedidoOriginal.itens.map(item => {
            const qtdParaDevolver = itensSelecao[item.produto.id];
            
            // Se este item foi selecionado para devolução com uma quantidade válida
            if (qtdParaDevolver && qtdParaDevolver > 0) {
              return { ...item, emTroca: true, qtdTroca: Number(qtdParaDevolver) };
            }
            return item;
          });

          await dao.update(pedidoId, { status: 'EM TROCA', itens: itensAtualizados });
        } else {
          // Fallback total: Mantém compatibilidade com o robô do Cypress
          await dao.update(pedidoId, { status: 'EM TROCA' });
        }
        
        await carregarPedidos();
      } catch (error) {
        console.error("Erro ao processar solicitação de troca:", error.message);
      }
    }
  }

  return {
    pedidos, expandido, sucesso, toggleExpandido, handleSolicitarTroca,
    formatarData: PedidoModel.formatarData, navigate
  }
}