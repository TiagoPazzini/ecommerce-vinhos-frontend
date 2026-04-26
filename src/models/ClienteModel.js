// src/models/ClienteModel.js

const CHAVE = 'vinho_clientes'

const clientesIniciais = [
  { id: 1, nome: 'Ana Souza', email: 'ana@email.com', cpf: '111.111.111-11', dataNascimento: '1990-05-10', genero: 'feminino', telefone: '(11) 91111-1111', status: 'ativo' },
  { id: 2, nome: 'Bruno Lima', email: 'bruno@email.com', cpf: '222.222.222-22', dataNascimento: '1985-08-22', genero: 'masculino', telefone: '(11) 92222-2222', status: 'ativo' },
]

export class ClienteModel {
  // --- Manipulação de Dados ---
  static listar() {
    const dados = localStorage.getItem(CHAVE)
    if (!dados) {
      localStorage.setItem(CHAVE, JSON.stringify(clientesIniciais))
      return clientesIniciais
    }
    return JSON.parse(dados)
  }

  static buscarPorId(id) {
    return this.listar().find(c => c.id === Number(id)) || null
  }

  static cadastrar(cliente) {
    const clientes = this.listar()
    const novoCliente = { ...cliente, id: Date.now(), status: 'ativo' }
    localStorage.setItem(CHAVE, JSON.stringify([...clientes, novoCliente]))
  }

  static atualizar(id, dadosAtualizados) {
    const clientes = this.listar()
    const atualizados = clientes.map(c =>
      c.id === Number(id) ? { ...c, ...dadosAtualizados } : c
    )
    localStorage.setItem(CHAVE, JSON.stringify(atualizados))
  }

  static inativar(id) {
    this.atualizar(id, { status: 'inativo' })
  }

  static reativar(id) {
    this.atualizar(id, { status: 'ativo' })
  }

  // --- Regras de Negócio (Validações) ---
  static calcularIdade(dataNascimento) {
    const hoje = new Date()
    const nasc = new Date(dataNascimento)
    let idade = hoje.getFullYear() - nasc.getFullYear()
    if (hoje.getMonth() < nasc.getMonth() || (hoje.getMonth() === nasc.getMonth() && hoje.getDate() < nasc.getDate())) {
      idade--
    }
    return idade
  }

  static validarCadastro(form, enderecos) {
    // RN0071 - Maioridade
    if (this.calcularIdade(form.dataNascimento) < 18) {
      throw new Error('É necessário ter 18 anos ou mais para se cadastrar. (RN0071)')
    }
    // Confirmação de senha
    if (form.senha !== form.confirmarSenha) {
      throw new Error('As senhas não coincidem.')
    }
    // RNF0031 - Senha Forte
    const senhaForte = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/.test(form.senha)
    if (!senhaForte) {
      throw new Error('Senha deve ter 8+ caracteres, maiúscula, minúscula e caractere especial. (RNF0031)')
    }
    // RN0021 e RN0022 - Endereços Obrigatórios
    const temCobranca = enderecos.some(e => e.tipoEndereco === 'cobranca' || e.tipoEndereco === 'ambos')
    const temEntrega = enderecos.some(e => e.tipoEndereco === 'entrega' || e.tipoEndereco === 'ambos')
    
    if (!temCobranca) throw new Error('É obrigatório cadastrar ao menos um endereço de cobrança. (RN0021)')
    if (!temEntrega) throw new Error('É obrigatório cadastrar ao menos um endereço de entrega. (RN0022)')
  }

  static validarEdicao(form) {
    if (!form.nome || !form.email || !form.telefone) {
        throw new Error('Nome, e-mail e telefone são obrigatórios.')
    }
    
    // Validação de cartões movida do Controller para o Model
    const cartoesInvalidos = form.cartoes.some(c => !c.numero || !c.nomeTitular)
    if (cartoesInvalidos) {
        throw new Error('Preencha os dados obrigatórios de todos os cartões adicionados.')
    }
  }
}