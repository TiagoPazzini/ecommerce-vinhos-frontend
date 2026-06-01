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

  static validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, ''); // Remove pontuação
    if (cpf === '' || cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false; // Impede tudo repetido ex: 111.111.111-11

    let soma = 0;
    for (let i = 1; i <= 9; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    let resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
  }

  static validarCadastro(form, enderecos) {
    if (!this.validarCPF(form.cpf)) {
      throw new Error('O CPF informado é inválido. Verifique os números digitados.');
    }

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