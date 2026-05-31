
const CUPONS_MOCK = [
    { codigo: 'PROMO10', tipo: 'promocional', valor: 10 },
    { codigo: 'TROCA20', tipo: 'troca', valor: 20 },
]

export class VendaModel {

    static listarCupons() {
        const cupons = localStorage.getItem('vinho_cupons')
        if (!cupons) {
            // Se o banco de cupons estiver vazio, cria os de teste iniciais
            const iniciais = [
                { codigo: 'PROMO10', tipo: 'promocional', valor: 10 },
                { codigo: 'TROCA20', tipo: 'troca', valor: 20 },
            ]
            localStorage.setItem('vinho_cupons', JSON.stringify(iniciais))
            return iniciais
        }
        return JSON.parse(cupons)
    }

    static buscarCupom(codigo) {
        return this.listarCupons().find(c => c.codigo === codigo.toUpperCase()) || null
    }

    // RN0044 - Gerar cupom de troca após recebimento
    static gerarCupomTroca(valor) {
        // Gera um código aleatório, ex: TROCA8492
        const codigo = 'TROCA' + Math.floor(1000 + Math.random() * 9000)
        const novoCupom = { codigo, tipo: 'troca', valor }
        
        const cupons = this.listarCupons()
        cupons.push(novoCupom)
        localStorage.setItem('vinho_cupons', JSON.stringify(cupons))
        
        return codigo // Retorna o código gerado para mostrarmos ao Admin
    }

    static calcularFrete(cep) {
        const inicio = cep.replace(/\D/g, '')[0]
        if (['0', '1'].includes(inicio)) return 15
        if (['2', '3'].includes(inicio)) return 20
        return 25
    }

    //Calcula a idade baseada no ano de nascimento
    static calcularIdade(dataNascimento) {
        const hoje = new Date()
        const nasc = new Date(dataNascimento)
        let idade = hoje.getFullYear() - nasc.getFullYear()
        if (hoje.getMonth() < nasc.getMonth() || (hoje.getMonth() == nasc.getMonth() && hoje.getDate() < nasc.getDate())) {
            idade--
        }
        return idade;
     };

    //Vericica se o usuário é maior de idade e mostra um erro se for menor
    static validarMaioridade(dataNascimento) {
        if (this.calcularIdade(dataNascimento) < 18){
            throw new Error ("Não é possível finalizar a compra. Cliente menor de idade.")
        }
     }

    //valida se o valor passado em cada cartão é pelo menos 10,00
    static validarPagamento(cartoes, descontoCupons) { 
        const temCupom = descontoCupons > 0
        for (const cartao of cartoes) {
            const val = parseFloat(cartao.valor) || 0
            if (!temCupom && val < 10) {
                throw new Error ("Valor mínimo por cartão é de 10 reais ")
            }
        }
    }

    //função para salvar o pedido e limpar o carrinho
    static salvarPedido(pedido) {
        
        const pedidos = JSON.parse(localStorage.getItem('vinho_pedidos') || '[]' )
        localStorage.setItem ('vinho_pedidos', JSON.stringify([...pedidos, pedido]))
        localStorage.setItem ('vinho_carrinho', JSON.stringify([]))
     };

}