import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ClienteModel } from '../models/ClienteModel'

export function useClienteEdicaoController() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [erro, setErro] = useState('')

  useEffect(() => {
    const cliente = ClienteModel.buscarPorId(id)
    if (cliente) {
      setForm({ ...cliente, cartoes: cliente.cartoes || [] })
    }
  }, [id])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleAddCartao() {
    const novosCartoes = [...form.cartoes, { numero: '', nomeTitular: '', validade: '', cvv: '' }]
    setForm({ ...form, cartoes: novosCartoes })
  }

  function handleCartaoChange(index, e) {
    const { name, value } = e.target
    const novosCartoes = [...form.cartoes]
    novosCartoes[index] = { ...novosCartoes[index], [name]: value }
    setForm({ ...form, cartoes: novosCartoes })
  }

  function handleRemoveCartao(index) {
    const novosCartoes = form.cartoes.filter((_, i) => i !== index)
    setForm({ ...form, cartoes: novosCartoes })
  }

  function handleSubmit(e) {
    e.preventDefault()
    try {
      setErro('')
      
      // O Controller pede ao Model para validar os dados
      ClienteModel.validarEdicao(form)

      // Se não houver erro, prossegue com a atualização
      ClienteModel.atualizar(id, form)
      alert('Cliente atualizado com sucesso!')
      navigate('/admin/clientes')
    } catch (error) {
      // Captura a mensagem disparada pelo Model
      setErro(error.message)
    } 
  }

  function handleInativar() {
    if (!window.confirm(`Deseja inativar o cliente ${form.nome}?`)) return
    ClienteModel.inativar(id)
    alert('Cliente inativado com sucesso!')
    navigate('/admin/clientes')
  }

  function handleReativar() {
    if (!window.confirm(`Deseja reativar o cliente ${form.nome}?`)) return
    ClienteModel.reativar(id)
    alert('Cliente reativado com sucesso!')
    navigate('/admin/clientes')
  }

  return {
    form, erro, handleChange, handleAddCartao, handleCartaoChange,
    handleRemoveCartao, handleSubmit, handleInativar, handleReativar, navigate
  }
}