import { useState, useEffect } from 'react'
import { PedidoDAO } from '../dao/PedidoDAO'

export function useAdminDashboardController() {
  const pedidoDao = new PedidoDAO()
  const [todosPedidos, setTodosPedidos] = useState([])
  const [dadosGrafico, setDadosGrafico] = useState([])
  const [rankingVinhos, setRankingVinhos] = useState([]) // 📊 Novo estado para o ranking por rótulo
  
  const dataHoje = new Date()
  const dataInicioPadrao = new Date(dataHoje.getFullYear() - 1, dataHoje.getMonth(), 1).toISOString().split('T')[0]
  const dataFimPadrao = dataHoje.toISOString().split('T')[0]

  const [filtroDataInicio, setFiltroDataInicio] = useState(dataInicioPadrao)
  const [filtroDataFim, setFiltroDataFim] = useState(dataFimPadrao)
  const [categoriasAtivas, setCategoriasAtivas] = useState({ Tinto: true, Branco: true, Rosé: true, Espumante: true })
  
  const [filtroDocura, setFiltroDocura] = useState('')
  const [filtroUva, setFiltroUva] = useState('')
  const [filtroSafra, setFiltroSafra] = useState('')

  useEffect(() => {
    async function carregarDados() {
      const dados = await pedidoDao.readAll()
      setTodosPedidos(dados.filter(p => p.status === 'ENTREGUE' || p.status === 'TROCADO'))
    }
    carregarDados()
  }, [])

  useEffect(() => {
    if (todosPedidos.length === 0) return

    // 1. GERAÇÃO DA CRONOLOGIA DO GRÁFICO MACRO
    const mesesTimeline = []
    let dataCursor = new Date(filtroDataInicio + 'T00:00:00')
    const dataLimite = new Date(filtroDataFim + 'T23:59:59')

    while (dataCursor <= dataLimite) {
      mesesTimeline.push({
        ano: dataCursor.getFullYear(),
        mes: dataCursor.getMonth(),
        label: dataCursor.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }).replace('.', '')
      })
      dataCursor.setMonth(dataCursor.getMonth() + 1)
    }

    // Objeto temporário para acumular vendas por nome do vinho para o ranking
    const acumularRanking = {}

    const resultadoAgrupado = mesesTimeline.map(ponto => {
      const volumes = { Tinto: 0, Branco: 0, Rosé: 0, Espumante: 0 }

      todosPedidos.forEach(pedido => {
        const dataP = new Date(pedido.dataPedido)
        
        // Verifica se o pedido está dentro do mês corrente do gráfico
        const mesmoMes = dataP.getFullYear() === ponto.ano && dataP.getMonth() === ponto.mes
        
        // Verifica se o pedido está dentro do período global de filtros selecionado
        const dentroDoPeriodoGeral = dataP >= new Date(filtroDataInicio + 'T00:00:00') && dataP <= new Date(filtroDataFim + 'T23:59:59')

        pedido.itens?.forEach(item => {
          const prod = item.produto || {}
          const cat = prod.tipo

          const bateDocura = !filtroDocura || prod.docura === filtroDocura
          const bateUva = !filtroUva || prod.uva === filtroUva
          const bateSafra = !filtroSafra || prod.safra === filtroSafra

          if (bateDocura && bateUva && bateSafra) {
            // Acumula no gráfico macro por categoria (mês a mês)
            if (mesmoMes && volumes[cat] !== undefined) {
              volumes[cat] += Number(item.quantidade || 1)
            }

            // Acumula no ranking geral por nome do rótulo (respeitando o período e filtros)
            if (dentroDoPeriodoGeral) {
              const nomeVinho = prod.nome || 'Rótulo Desconhecido'
              if (!acumularRanking[nomeVinho]) {
                acumularRanking[nomeVinho] = { qtd: 0, tipo: cat, faturamento: 0 }
              }
              acumularRanking[nomeVinho].qtd += Number(item.quantidade || 1)
              acumularRanking[nomeVinho].faturamento += Number(item.quantidade || 1) * Number(prod.preco || 0)
            }
          }
        })
      })

      return { label: ponto.label, ...volumes }
    })

    // Ordena o ranking do mais vendido para o menos vendido
    const rankingOrdenado = Object.entries(acumularRanking)
      .map(([nome, dados]) => ({ nome, ...dados }))
      .sort((a, b) => b.qtd - a.qtd)

    setDadosGrafico(resultadoAgrupado)
    setRankingVinhos(rankingOrdenado)
  }, [todosPedidos, filtroDataInicio, filtroDataFim, filtroDocura, filtroUva, filtroSafra])

  const toggleCategoria = (cat) => {
    setCategoriasAtivas(prev => ({ ...prev, [cat]: !prev[cat] }))
  }

  return {
    dadosGrafico, rankingVinhos, filtroDataInicio, setFiltroDataInicio,
    filtroDataFim, setFiltroDataFim, categoriasAtivas, toggleCategoria,
    filtroDocura, setFiltroDocura, filtroUva, setFiltroUva, filtroSafra, setFiltroSafra
  }
}