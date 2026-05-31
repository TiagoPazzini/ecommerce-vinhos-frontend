import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProdutoModel } from '../models/ProdutoModel'
import { ProdutoDAO } from '../dao/ProdutoDAO'
import { useCarrinhoGlobal } from '../contexts/CarrinhoContext'

export function useCatalogoController() {
  const navigate = useNavigate()
  const [filtroTipo, setFiltroTipo] = useState('Todos')
  const [produtos, setProdutos] = useState([])
  const { carrinho, atualizarCarrinho } = useCarrinhoGlobal()

  useEffect(() => {
    async function carregarProdutos() {
      const dao = new ProdutoDAO()
      setProdutos(await dao.readAll())
    }
    carregarProdutos()
  }, [])

  const vinhosFiltrados = ProdutoModel.filtrarPorTipo(produtos, filtroTipo)

  async function adicionarAoCarrinho(vinho) {
    let carrinhoAtual = [...carrinho]
    const itemExistente = carrinhoAtual.find(item => item.produto.id === vinho.id)

    if (itemExistente) {
      itemExistente.quantidade += 1
    } else {
      carrinhoAtual.push({ produto: vinho, quantidade: 1 })
    }

    await atualizarCarrinho(carrinhoAtual)
    alert(`${vinho.nome} adicionado ao carrinho!`)
  }

  return { filtroTipo, setFiltroTipo, vinhosFiltrados, adicionarAoCarrinho, navigate }
}