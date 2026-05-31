export class ClienteModel {
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
    if (this.calcularIdade(form.dataNascimento) < 18) {
      throw new Error('É necessário ter 18 anos ou mais para se cadastrar. (RN0071)')
    }
    
    if (form.senha !== form.confirmarSenha) {
      throw new Error('As senhas não coincidem.')
    }
    
    const senhaForte = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/.test(form.senha)
    if (!senhaForte) {
      throw new Error('Senha deve ter 8+ caracteres, maiúscula, minúscula e caractere especial. (RNF0031)')
    }
    
    const temCobranca = enderecos.some(e => e.tipoEndereco === 'cobranca' || e.tipoEndereco === 'ambos')
    const temEntrega = enderecos.some(e => e.tipoEndereco === 'entrega' || e.tipoEndereco === 'ambos')
    
    if (!temCobranca) throw new Error('É obrigatório cadastrar ao menos um endereço de cobrança. (RN0021)')
    if (!temEntrega) throw new Error('É obrigatório cadastrar ao menos um endereço de entrega. (RN0022)')
  }

  static validarEdicao(form) {
    if (!form.nome || !form.email || !form.telefone) {
        throw new Error('Nome, e-mail e telefone são obrigatórios.')
    }
    
    const cartoesInvalidos = form.cartoes.some(c => !c.numero || !c.nomeTitular)
    if (cartoesInvalidos) {
        throw new Error('Preencha os dados obrigatórios de todos os cartões adicionados.')
    }
  }
}