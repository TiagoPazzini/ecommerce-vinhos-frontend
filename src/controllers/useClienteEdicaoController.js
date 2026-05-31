import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ClienteModel } from '../models/ClienteModel'
import { ClienteDAO } from '../dao/ClienteDAO'

export function useClienteEdicaoController() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [erro, setErro] = useState('')
  const dao = new ClienteDAO()

  useEffect(() => {
    async function fetchCliente() {
      const cliente = await dao.read(id)
      if (cliente) setForm({ ...cliente, cartoes: cliente.cartoes || [] })
    }
    fetchCliente()
  }, [id])

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }) }

  function handleAddCartao() {
    setForm({ ...form, cartoes: [...form.cartoes, { numero: '', nomeTitular: '', validade: '', cvv: '' }] })
  }

  function handleCartaoChange(index, e) {
    const novosCartoes = [...form.cartoes]
    novosCartoes[index] = { ...novosCartoes[index], [e.target.name]: e.target.value }
    setForm({ ...form, cartoes: novosCartoes })
  }

  function handleRemoveCartao(index) {
    setForm({ ...form, cartoes: form.cartoes.filter((_, i) => i !== index) })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      setErro('')
      ClienteModel.validarEdicao(form)
      await dao.update(id, form)
      alert('Cliente atualizado com sucesso!')
      navigate('/admin/clientes')
    } catch (error) {
      setErro(error.message)
    } 
  }

  async function handleInativar() {
    if (!window.confirm(`Deseja inativar o cliente ${form.nome}?`)) return
    await dao.delete(id)
    alert('Cliente inativado com sucesso!')
    navigate('/admin/clientes')
  }

  async function handleReativar() {
    if (!window.confirm(`Deseja reativar o cliente ${form.nome}?`)) return
    await dao.update(id, { status: 'ativo' })
    alert('Cliente reativado com sucesso!')
    navigate('/admin/clientes')
  }

  return {
    form, erro, handleChange, handleAddCartao, handleCartaoChange,
    handleRemoveCartao, handleSubmit, handleInativar, handleReativar, navigate
  }
}