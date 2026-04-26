// src/controllers/useClienteCadastroController.js
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ClienteModel } from '../models/ClienteModel'

const enderecoVazio = () => ({
  apelido: '', tipoResidencia: '', tipoLogradouro: '',
  logradouro: '', numero: '', bairro: '', cep: '',
  cidade: '', estado: '', pais: 'Brasil', observacoes: '',
  tipoEndereco: 'entrega'
})

const cartaoVazio = () => ({
  numero: '', nomeImpresso: '', bandeira: '', codSeguranca: '', preferencial: false
})

export function useClienteCadastroController() {
  const navigate = useNavigate()
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  const [form, setForm] = useState({
    nome: '', email: '', cpf: '', dataNascimento: '',
    genero: '', telefone: '', senha: '', confirmarSenha: '',
  })
  const [enderecos, setEnderecos] = useState([enderecoVazio()])
  const [cartoes, setCartoes] = useState([cartaoVazio()])
  const [erro, setErro] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleEnderecoChange(index, e) {
    const novos = [...enderecos]
    novos[index][e.target.name] = e.target.value
    setEnderecos(novos)
  }

  function handleCartaoChange(index, e) {
    const novos = [...cartoes]
    novos[index][e.target.name] = e.target.value
    setCartoes(novos)
  }

  function togglePreferencial(index) {
    setCartoes(cartoes.map((c, i) => ({ ...c, preferencial: i === index })))
  }

  function adicionarEndereco() { setEnderecos([...enderecos, enderecoVazio()]) }
  function removerEndereco(index) { if (enderecos.length > 1) setEnderecos(enderecos.filter((_, i) => i !== index)) }
  
  function adicionarCartao() { setCartoes([...cartoes, cartaoVazio()]) }
  function removerCartao(index) { if (cartoes.length > 1) setCartoes(cartoes.filter((_, i) => i !== index)) }

  function handleSubmit(e) {
    e.preventDefault()
    try {
      setErro('')
      
      // Chama a validação pura do Model
      ClienteModel.validarCadastro(form, enderecos)
      
      // Se passou nas validações, salva!
      ClienteModel.cadastrar({ ...form, enderecos, cartoes })
      
      alert('Cliente cadastrado com sucesso!')
      navigate(isAdmin ? '/admin/clientes' : '/')
    } catch (error) {
      setErro(error.message)
    }
  }

  return {
    form, enderecos, cartoes, erro, isAdmin,
    handleChange, handleEnderecoChange, handleCartaoChange, togglePreferencial,
    adicionarEndereco, removerEndereco, adicionarCartao, removerCartao, handleSubmit, navigate
  }
}   