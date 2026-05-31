export class AuthModel {
  static autenticar(email, senha, listaClientes) {
    if (email === 'admin@vinho.com' && senha === 'Admin@123') {
      return { nome: 'Administrador', email, perfil: 'admin' }
    }

    const clienteEncontrado = listaClientes.find(c => c.email === email && c.senha === senha)

    if (clienteEncontrado) {
      if (clienteEncontrado.status === 'inativo') {
        throw new Error('Esta conta está desativada. Contate o administrador.')
      }
      return { nome: clienteEncontrado.nome, email: clienteEncontrado.email, perfil: 'cliente' }
    }

    throw new Error('E-mail ou senha inválidos.')
  }

  static salvarSessao(usuario) { localStorage.setItem('vinho_sessao', JSON.stringify(usuario)) }
  static carregarSessao() { const s = localStorage.getItem('vinho_sessao'); return s ? JSON.parse(s) : null }
  static limparSessao() { localStorage.removeItem('vinho_sessao') }
}