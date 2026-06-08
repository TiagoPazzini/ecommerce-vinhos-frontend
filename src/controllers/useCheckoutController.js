import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { VendaModel } from '../models/VendaModel'
import { ClienteDAO } from '../dao/ClienteDAO'
import { PedidoDAO } from '../dao/PedidoDAO'
import { CupomDAO } from '../dao/CupomDAO'
import { useCarrinhoGlobal } from '../contexts/CarrinhoContext'

export function useCheckoutController() {
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const { carrinho, atualizarCarrinho } = useCarrinhoGlobal()

  const clienteDao = new ClienteDAO()
  const pedidoDao = new PedidoDAO()
  const cupomDao = new CupomDAO()

  const [adicionandoCartao, setAdicionandoCartao] = useState(false);
  const [novoCartao, setNovoCartao] = useState({ numero: '', nomeImpresso: '', bandeira: '', codSeguranca: '', preferencial: false });

  const [etapa, setEtapa] = useState(1)
  const [cliente, setCliente] = useState(null)
  const [erro, setErro] = useState('')

  const [enderecoSelecionado, setEnderecoSelecionado] = useState(null)
  const [frete, setFrete] = useState(0)

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
    async function carregarCliente() {
      if (!usuario?.email) return;
      const clientes = await clienteDao.readAll();
      const clienteLogado = clientes.find(c => c.email === usuario.email);
      if (clienteLogado) setCliente(clienteLogado);
    }
    carregarCliente();
  }, [usuario])

  const subtotal = carrinho.reduce((t, item) => t + item.produto.preco * item.quantidade, 0)
  const descontoCupons = cuponsAplicados.reduce((t, c) => t + c.valor, 0)
  const totalComFrete = Math.max(0, subtotal + frete - descontoCupons)

  function handleSelecionarEndereco(end) {
      setEnderecoSelecionado(end)
      setFrete(VendaModel.calcularFrete(end.cep))
  }

  function handleProximaEtapa() {
      // 🛡️ O sistema limpa mensagens de erro e não as apresenta antes do input/submit
      setErro('')
      setErroPagamento('')

      if (etapa === 1) {
          if (!enderecoSelecionado) return setErro('Selecione um endereço de entrega.')
          setEtapa(2)
      } else if (etapa === 2) {
          
          // 1. PRIMEIRO: Valida a regra de R$ 10,00 de valor mínimo por cartão para todos independente da ordem
          try {
              VendaModel.validarPagamento(cartoesSelecionados, descontoCupons)
          } catch (error) {
              setErro(error.message)
              setErroPagamento(error.message)
              return
          }

          // 2. DEPOIS: Verifica se o valor total somado inserido nos cartões é igual ao valor líquido do pedido
          const totalPagoCartoes = cartoesSelecionados.reduce((t, c) => t + (parseFloat(c.valor) || 0), 0)
          
          if (totalPagoCartoes < totalComFrete) {
              const msgFalta = `Falta R$ ${(totalComFrete - totalPagoCartoes).toFixed(2)} no(s) cartão(ões).`
              setErro(msgFalta)
              setErroPagamento(msgFalta)
              return
          }

          if (totalPagoCartoes > totalComFrete) {
              const msgExcesso = `O valor informado nos cartões (R$ ${totalPagoCartoes.toFixed(2)}) é maior do que o total do pedido (R$ ${totalComFrete.toFixed(2)}). Ajuste os valores.`
              setErro(msgExcesso)
              setErroPagamento(msgExcesso)
              return
          }

          setErro('')
          setErroPagamento('')
          setEtapa(3)
      }
  }

  async function handleAplicarCupom() {
      setErro('')
      const cupom = await cupomDao.read(codigoCupom)
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
      if (existe) setCartoesSelecionados(cartoesSelecionados.filter(c => c.numero !== cartao.numero))
      else setCartoesSelecionados([...cartoesSelecionados, { ...cartao, valor: '' }])
  }

  function handleValorCartao(numero, valor) {
      setCartoesSelecionados(cartoesSelecionados.map(c => c.numero === numero ? { ...c, valor } : c ))
  }

  function validarValorCartao(cartao) {
      const val = parseFloat(cartao.valor) || 0
      const temCupom = descontoCupons > 0
      if (temCupom) return true
      return val >= 10
  }

  async function handleConfirmar() {
      try {
          setErro('')
          if (cliente?.dataNascimento) VendaModel.validarMaioridade(cliente.dataNascimento)
          
          VendaModel.validarPagamento(cartoesSelecionados, descontoCupons)

          const pedido = {
              id: Date.now(), clienteId: cliente?.id, clienteEmail: usuario?.email,
              itens: carrinho, enderecoEntrega: enderecoSelecionado,
              formasPagamento: { cupons: cuponsAplicados, cartoes: cartoesSelecionados },
              frete, subtotal, descontoCupons, total: totalComFrete,
              status: 'EM PROCESSAMENTO', dataPedido: new Date().toISOString()
          }

          await pedidoDao.create(pedido)
          await atualizarCarrinho([])
          navigate('/pedidos?sucesso=true')

      } catch (error) {
          setErro(error.message)
      }
  }

  function handleNovoEnderecoChange(e) {
      setNovoEndereco({ ...novoEndereco, [e.target.name]: e.target.value })
  }

  async function handleSalvarEndereco(e) {
      e.preventDefault();
      setErro('');
      if (!cliente) return setErro('Erro crítico: Perfil do cliente não encontrado.');

      const enderecosAtualizados = cliente.enderecos ? [...cliente.enderecos, novoEndereco] : [novoEndereco];
      await clienteDao.update(cliente.id, { enderecos: enderecosAtualizados });
      setCliente({ ...cliente, enderecos: enderecosAtualizados });
      setEnderecoSelecionado(novoEndereco);
      setFrete(VendaModel.calcularFrete(novoEndereco.cep));
      setAdicionandoEndereco(false);
      setNovoEndereco({ apelido: '', tipoLogradouro: 'Rua', logradouro: '', numero: '', cep: '', bairro: '', cidade: '', estado: '', tipoEndereco: 'ambos' });
  }

  function handleNovoCartaoChange(e) {
      const { name, value, type, checked } = e.target;
      setNovoCartao({ ...novoCartao, [name]: type === 'checkbox' ? checked : value });
  }

  async function handleSalvarCartao(e) {
      e.preventDefault();
      if (!cliente) return;

      const cartoesAtualizados = cliente.cartoes ? [...cliente.cartoes, novoCartao] : [novoCartao];
      await clienteDao.update(cliente.id, { cartoes: cartoesAtualizados });
      setCliente({ ...cliente, cartoes: cartoesAtualizados });
      setCartoesSelecionados([...cartoesSelecionados, { ...novoCartao, valor: '' }]);
      setAdicionandoCartao(false);
      setNovoCartao({ numero: '', nomeImpresso: '', bandeira: '', codSeguranca: '', preferencial: false });
  }

  return {
      etapa, setEtapa, carrinho, cliente, erro, enderecoSelecionado,
      frete, codigoCupom, setCodigoCupom, cuponsAplicados, cartoesSelecionados,
      erroPagamento, subtotal, descontoCupons, totalComFrete, handleSelecionarEndereco, 
      handleProximaEtapa, handleAplicarCupom, handleRemoverCupom, handleToggleCartao, 
      handleValorCartao, validarValorCartao, calcularFrete: VendaModel.calcularFrete,
      handleConfirmar, adicionandoEndereco, setAdicionandoEndereco, novoEndereco,
      handleNovoEnderecoChange, handleSalvarEndereco, adicionandoCartao, setAdicionandoCartao, 
      novoCartao, handleNovoCartaoChange, handleSalvarCartao
  }
}