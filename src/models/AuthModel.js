// src/models/AuthModel.js
import { ClienteModel } from './ClienteModel' // <-- Importando o banco de clientes

export class AuthModel {
  static autenticar(email, senha) {
    
    // 1. Verifica se é a conta fixa do Administrador
    if (email === 'admin@vinho.com' && senha === 'Admin@123') {
      return { 
        nome: 'Administrador', 
        email, 
        perfil: 'admin' 
      }
    }

    // 2. Busca na base de clientes reais (localStorage)
    const clientes = ClienteModel.listar()
    const clienteEncontrado = clientes.find(
      c => c.email === email && c.senha === senha
    )

    if (clienteEncontrado) {
      // Regra de Negócio extra de brinde: Impedir login de cliente inativado
      if (clienteEncontrado.status === 'inativo') {
        throw new Error('Esta conta está desativada. Contate o administrador.')
      }

      return { 
        nome: clienteEncontrado.nome, 
        email: clienteEncontrado.email, 
        perfil: 'cliente' 
      }
    }

    // 3. Se não for admin e não for um cliente válido
    throw new Error('E-mail ou senha inválidos.')
  }

  // --- MÉTODOS DE SESSÃO (MANTIDOS) ---
  static salvarSessao(usuario) {
    localStorage.setItem('vinho_sessao', JSON.stringify(usuario))
  }

  static carregarSessao() {
    const sessao = localStorage.getItem('vinho_sessao')
    return sessao ? JSON.parse(sessao) : null
  }

  static limparSessao() {
    localStorage.removeItem('vinho_sessao')
  }
} 