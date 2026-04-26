// src/controllers/useCatalogoController.js
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProdutoModel } from '../models/ProdutoModel'
import { CarrinhoModel } from '../models/CarrinhoModel'

export function useCatalogoController() {
  const navigate = useNavigate()
  const [filtroTipo, setFiltroTipo] = useState('Todos')
  const [carrinho, setCarrinho] = useState([])

  // Carrega o carrinho inicial
  useEffect(() => {
    setCarrinho(CarrinhoModel.carregar())
  }, [])

  // Pede ao Model os vinhos filtrados
  const vinhosFiltrados = ProdutoModel.listarPorTipo(filtroTipo)
  
  // Calcula a quantidade da badge
  const quantidadeTotal = carrinho.reduce((total, item) => total + item.quantidade, 0)

  // Lógica de adicionar reaproveitando o CarrinhoModel
  function adicionarAoCarrinho(vinho) {
    let carrinhoAtual = [...carrinho]
    const itemExistente = carrinhoAtual.find(item => item.produto.id === vinho.id)

    if (itemExistente) {
      carrinhoAtual = CarrinhoModel.aumentarQuantidade(carrinhoAtual, vinho.id)
    } else {
      carrinhoAtual.push({ produto: vinho, quantidade: 1 })
    }

    CarrinhoModel.salvar(carrinhoAtual)
    setCarrinho(carrinhoAtual)
    alert(`${vinho.nome} adicionado ao carrinho!`)
  }

  return {
    filtroTipo, setFiltroTipo,
    vinhosFiltrados, quantidadeTotal,
    adicionarAoCarrinho, navigate
  }
}