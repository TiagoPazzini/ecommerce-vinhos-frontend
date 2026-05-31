import { useNavigate } from 'react-router-dom'
import { CarrinhoModel } from '../models/CarrinhoModel'
import { useCarrinhoGlobal } from '../contexts/CarrinhoContext'

export function useCarrinhoController() {
  const navigate = useNavigate()
  const { carrinho, atualizarCarrinho } = useCarrinhoGlobal()

  async function aumentarQuantidade(produtoId) {
    await atualizarCarrinho(CarrinhoModel.aumentarQuantidade(carrinho, produtoId))
  }

  async function diminuirQuantidade(produtoId) {
    await atualizarCarrinho(CarrinhoModel.diminuirQuantidade(carrinho, produtoId))
  }

  async function removerItem(produtoId) {
    if (window.confirm('Deseja remover este item do carrinho?')) {
      await atualizarCarrinho(CarrinhoModel.removerItem(carrinho, produtoId))
    }
  }

  function finalizarCompra() {
    if (carrinho.length === 0) {
      alert('Seu carrinho está vazio!')
      return
    }
    navigate('/checkout')
  }

  return {
    carrinho,
    aumentarQuantidade,
    diminuirQuantidade,
    removerItem,
    finalizarCompra,
    calcularSubtotal: CarrinhoModel.calcularSubtotal,
    calcularTotal: () => CarrinhoModel.calcularTotal(carrinho),
    navigate
  }
}