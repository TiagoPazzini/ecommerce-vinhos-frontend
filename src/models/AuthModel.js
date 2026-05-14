// src/models/AuthModel.js

const usuariosMock = [
  { email: 'admin@vinho.com', senha: 'Admin@123', nome: 'Administrador', perfil: 'admin' },
  { email: 'cliente@vinho.com', senha: 'Cliente@123', nome: 'Rodrigo Rocha', perfil: 'cliente' },
]

export class AuthModel {
  static autenticar(email, senha) {
    const encontrado = usuariosMock.find(
      u => u.email === email && u.senha === senha
    )

    if (!encontrado) {
      throw new Error('E-mail ou senha inválidos.')
    }

    // Retorna apenas os dados seguros, sem devolver a senha
    return { 
      nome: encontrado.nome, 
      email: encontrado.email, 
      perfil: encontrado.perfil 
    }
  }

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