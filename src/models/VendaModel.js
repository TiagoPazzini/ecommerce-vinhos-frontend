export class VendaModel {
  static gerarCodigoCupomTroca() {
    return 'TROCA' + Math.floor(1000 + Math.random() * 9000)
  }

  static calcularFrete(cep) {
    const inicio = cep.replace(/\D/g, '')[0]
    if (['0', '1'].includes(inicio)) return 15
    if (['2', '3'].includes(inicio)) return 20
    return 25
  }

  static calcularIdade(dataNascimento) {
    const hoje = new Date()
    const nasc = new Date(dataNascimento)
    let idade = hoje.getFullYear() - nasc.getFullYear()
    if (hoje.getMonth() < nasc.getMonth() || (hoje.getMonth() == nasc.getMonth() && hoje.getDate() < nasc.getDate())) {
      idade--
    }
    return idade;
  }

  static validarMaioridade(dataNascimento) {
    if (this.calcularIdade(dataNascimento) < 18) {
      throw new Error("Não é possível finalizar a compra. Cliente menor de idade.")
    }
  }

  static validarPagamento(cartoes, descontoCupons) {
    const temCupom = descontoCupons > 0
    for (const cartao of cartoes) {
      const val = parseFloat(cartao.valor) || 0
      if (!temCupom && val < 10 ) {
        throw new Error("Valor mínimo de R$ 10,00 por cartão. (RN0034")
      }
    } 
  }
}