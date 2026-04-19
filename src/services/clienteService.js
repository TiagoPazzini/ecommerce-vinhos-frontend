const CHAVE = 'vinho_clientes'

const clientesIniciais = [
  { id: 1, nome: 'Ana Souza', email: 'ana@email.com', cpf: '111.111.111-11', dataNascimento: '1990-05-10', genero: 'feminino', telefone: '(11) 91111-1111', status: 'ativo' },
  { id: 2, nome: 'Bruno Lima', email: 'bruno@email.com', cpf: '222.222.222-22', dataNascimento: '1985-08-22', genero: 'masculino', telefone: '(11) 92222-2222', status: 'ativo' },
  { id: 3, nome: 'Carla Mendes', email: 'carla@email.com', cpf: '333.333.333-33', dataNascimento: '1992-11-30', genero: 'feminino', telefone: '(11) 93333-3333', status: 'inativo' },
]

export function listarClientes() {
  const dados = localStorage.getItem(CHAVE)
  if (!dados) {
    localStorage.setItem(CHAVE, JSON.stringify(clientesIniciais))
    return clientesIniciais
  }
  return JSON.parse(dados)
}

export function buscarClientePorId(id) {
  return listarClientes().find(c => c.id === Number(id)) || null
}

export function cadastrarCliente(cliente) {
  const clientes = listarClientes()
  const novoCliente = { ...cliente, id: Date.now(), status: 'ativo' }
  localStorage.setItem(CHAVE, JSON.stringify([...clientes, novoCliente]))
}

export function atualizarCliente(id, dadosAtualizados) {
  const clientes = listarClientes()
  const atualizados = clientes.map(c =>
    c.id === Number(id) ? { ...c, ...dadosAtualizados } : c
  )
  localStorage.setItem(CHAVE, JSON.stringify(atualizados))
}

export function inativarCliente(id) {
  atualizarCliente(id, { status: 'inativo' })
}