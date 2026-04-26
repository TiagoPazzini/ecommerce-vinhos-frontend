// src/controllers/useCheckoutController.js
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { VendaModel } from '../models/VendaModel'
import { CarrinhoModel } from '../models/CarrinhoModel'
import { ClienteModel } from '../models/ClienteModel'

export function useCheckoutController() {
    const navigate = useNavigate()
    const { usuario } = useAuth()

    const [etapa, setEtapa] = useState(1)
    const [carrinho, setCarrinho] = useState([])
    const [cliente, setCliente] = useState(null)
    const [erro, setErro] = useState('')
    
    // Etapa 1 — Entrega
    const [enderecoSelecionado, setEnderecoSelecionado] = useState(null)
    const [frete, setFrete] = useState(0)

    // Etapa 2 — Pagamento
    const [codigoCupom, setCodigoCupom] = useState('')
    const [cuponsAplicados, setCuponsAplicados] = useState([])
    const [cartoesSelecionados, setCartoesSelecionados] = useState([])
    const [erroPagamento, setErroPagamento] = useState('')

    const [adicionandoEndereco, setAdicionandoEndereco] = useState(false)
    const [novoEndereco, setNovoEndereco] = useState({ 
        apelido: 'Minha Casa', tipoLogradouro: 'Rua', logradouro: '', 
        numero: '', bairro: '', cep: '', cidade: '', estado: '', tipoEndereco: 'ambos' 
    })

    useEffect(() => {
        setCarrinho(CarrinhoModel.carregar())

        const clientes = ClienteModel.listar()
        const clienteLogado = clientes.find(c => c.email === usuario?.email)
        if (clienteLogado) setCliente(clienteLogado)
    }, [usuario])

    // Cálculos
    const subtotal = carrinho.reduce((t, item) => t + item.produto.preco * item.quantidade, 0)
    const descontoCupons = cuponsAplicados.reduce((t, c) => t + c.valor, 0)
    const totalComFrete = subtotal + frete - descontoCupons

    function calcularFrete(cep) {
        const inicio = cep.replace(/\D/g, '')[0]
        if (['0', '1'].includes(inicio)) return 15
        if (['2', '3'].includes(inicio)) return 20
        return 25
    }

    function handleSelecionarEndereco(end) {
        setEnderecoSelecionado(end)
        setFrete(VendaModel.calcularFrete(end.cep))
    }

    function handleProximaEtapa() {
        setErro('')
        if (etapa === 1) {
            if (!enderecoSelecionado) return setErro('Selecione um endereço de entrega.')
            setEtapa(2)
        } else if (etapa === 2) {
            const totalPagoCartoes = cartoesSelecionados.reduce((t, c) => t + (parseFloat(c.valor) || 0), 0)
            const totalPago = totalPagoCartoes + descontoCupons
            if (totalPago < totalComFrete) {
                return setErroPagamento(`Falta R$ ${(totalComFrete - totalPago).toFixed(2)} para cobrir o total.`)
            }
            setErroPagamento('')
            setEtapa(3)
        }
    }

    function handleAplicarCupom() {
        setErro('')
        const cupom = VendaModel.buscarCupom(codigoCupom)
        if (!cupom) return setErro('Cupom inválido.')

        const jaAplicado = cuponsAplicados.find(c => c.codigo === cupom.codigo)
        if (jaAplicado) return setErro('Este cupom já foi aplicado.')

        const temPromocional = cuponsAplicados.find(c => c.tipo === 'promocional')
        if (cupom.tipo === 'promocional' && temPromocional) {
            return setErro('Apenas um cupom promocional por compra. (RN0033)')
        }

        setCuponsAplicados([...cuponsAplicados, cupom])
        setCodigoCupom('')
    }

    function handleRemoverCupom(codigo) {
        setCuponsAplicados(cuponsAplicados.filter(c => c.codigo !== codigo))
    }

    function handleToggleCartao(cartao) {
        const existe = cartoesSelecionados.find(c => c.numero === cartao.numero)
        if (existe) {
            setCartoesSelecionados(cartoesSelecionados.filter(c => c.numero !== cartao.numero))
        } else {
            setCartoesSelecionados([...cartoesSelecionados, { ...cartao, valor: '' }])
        }
    }

    function handleValorCartao(numero, valor) {
        setCartoesSelecionados(cartoesSelecionados.map(c =>
            c.numero === numero ? { ...c, valor } : c
        ))
    }

    function validarValorCartao(cartao) {
        const val = parseFloat(cartao.valor) || 0
        const temCupom = descontoCupons > 0
        if (temCupom) return true 
        return val >= 10
    }

    // Apenas a versão correta, que delega as regras para o VendaModel
    function handleConfirmar() {
        try {
            setErro('')
            
            if (cliente?.dataNascimento) {
                VendaModel.validarMaioridade(cliente.dataNascimento)
            }

            VendaModel.validarPagamento(cartoesSelecionados, descontoCupons)

            const pedido = {
                id: Date.now(), clienteId: cliente?.id, clienteEmail: usuario?.email,
                itens: carrinho, enderecoEntrega: enderecoSelecionado,
                formasPagamento: { cupons: cuponsAplicados, cartoes: cartoesSelecionados },
                frete, subtotal, descontoCupons, total: totalComFrete,
                status: 'EM PROCESSAMENTO', dataPedido: new Date().toISOString()
            }

            VendaModel.salvarPedido(pedido)
            navigate('/pedidos?sucesso=true')

        } catch (error) {
            setErro(error.message)
        }
    }

    function handleNovoEnderecoChange(e) {
        setNovoEndereco({ ...novoEndereco, [e.target.name]: e.target.value })
    }

    function handleSalvarEndereco(e) {
        e.preventDefault()
        setErro('')
        
        // Pega os endereços que o cliente já tem e adiciona o novo
        const enderecosAtualizados = cliente.enderecos ? [...cliente.enderecos, novoEndereco] : [novoEndereco]
        
        // Manda o ClienteModel salvar no "banco"
        ClienteModel.atualizar(cliente.id, { enderecos: enderecosAtualizados })
        
        // Atualiza a tela imediatamente
        setCliente({ ...cliente, enderecos: enderecosAtualizados })
        setAdicionandoEndereco(false) // Esconde o formulário
        setNovoEndereco({ ...novoEndereco, logradouro: '', numero: '', cep: '', bairro: '', cidade: '', estado: '' }) // Limpa o form
    }

    return {
        etapa, setEtapa, carrinho, cliente, erro, enderecoSelecionado,
        frete, codigoCupom, setCodigoCupom, cuponsAplicados, cartoesSelecionados,
        erroPagamento, subtotal, descontoCupons, totalComFrete,
        handleSelecionarEndereco, handleProximaEtapa, handleAplicarCupom,
        handleRemoverCupom, handleToggleCartao, handleValorCartao,
        validarValorCartao,
        calcularFrete: VendaModel.calcularFrete, 
        handleConfirmar, adicionandoEndereco, setAdicionandoEndereco, novoEndereco,
        handleNovoEnderecoChange, handleSalvarEndereco
    }
}