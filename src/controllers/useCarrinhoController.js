import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CarrinhoModel } from '../models/CarrinhoModel'

export function useCarrinhoController() {
  const navigate = useNavigate()
  const [carrinho, setCarrinho] = useState([])

  useEffect(() => {
    setCarrinho(CarrinhoModel.carregar())
  }, [])

  function atualizarESalvar(novoCarrinho) {
    CarrinhoModel.salvar(novoCarrinho)
    setCarrinho(novoCarrinho)
  }

  function aumentarQuantidade(produtoId) {
    atualizarESalvar(CarrinhoModel.aumentarQuantidade(carrinho, produtoId))
  }

  function diminuirQuantidade(produtoId) {
    atualizarESalvar(CarrinhoModel.diminuirQuantidade(carrinho, produtoId))
  }

  function removerItem(produtoId) {
    if (window.confirm('Deseja remover este item do carrinho?')) {
      atualizarESalvar(CarrinhoModel.removerItem(carrinho, produtoId))
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
    navigate // Exportado para os botões de voltar ao catálogo funcionarem
  }
}