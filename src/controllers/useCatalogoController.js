import { useState } from 'react' 
import { useNavigate } from 'react-router-dom'
import { ProdutoModel } from '../models/ProdutoModel'
import { CarrinhoModel } from '../models/CarrinhoModel'
import { useCarrinhoGlobal } from '../contexts/CarrinhoContext' 

export function useCatalogoController() {
  const navigate = useNavigate()
  const [filtroTipo, setFiltroTipo] = useState('Todos')
  
  // Substitua o useState(carrinho) e o useEffect por esta linha:
  const { carrinho, atualizarCarrinho } = useCarrinhoGlobal()

  const vinhosFiltrados = ProdutoModel.listarPorTipo(filtroTipo)

  function adicionarAoCarrinho(vinho) {
    let carrinhoAtual = [...carrinho]
    const itemExistente = carrinhoAtual.find(item => item.produto.id === vinho.id)

    if (itemExistente) {
      carrinhoAtual = CarrinhoModel.aumentarQuantidade(carrinhoAtual, vinho.id)
    } else {
      carrinhoAtual.push({ produto: vinho, quantidade: 1 })
    }

    // Use a função global em vez de setCarrinho e CarrinhoModel.salvar
    atualizarCarrinho(carrinhoAtual)
    alert(`${vinho.nome} adicionado ao carrinho!`)
  }

  return {
    filtroTipo, setFiltroTipo, vinhosFiltrados,
    adicionarAoCarrinho, navigate
  }
}