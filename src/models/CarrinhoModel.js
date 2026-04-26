export class CarrinhoModel {
    static carregar(){
        const carrinhoSalvo = localStorage.getItem('vinho_carrinho')
        return carrinhoSalvo ? JSON.parse(carrinhoSalvo) : []
    }

    static salvar(carrinho) {
        localStorage.setItem('vinho_carrinho', JSON.stringify(carrinho))
    }

    static aumentarQuantidade(carrinho, produtoId){
        return carrinho.map(item =>
            item.produtoId === produtoId 
                ? {...item, quantidade: item.quantidade + 1} 
                : item
        )
    }

    static diminuirQuantidade(carrinho, produtoId) {
        return carrinho.map(item =>
            item.produto.id === produtoId && item.quantidade > 1
            ? {...item, quantidade: item.quantidade - 1}
            : item
        )
    }

    static removerItem(carrinho, produtoId){
        return carrinho.filter(item => item.produto.id !== produtoId)
    }

    static calcularSubtotal(item){
        return item.produto.preco * item.quantidade
    }

    static calcularTotal(carrinho){
        return carrinho.reduce((total, item) => total + this.calcularSubtotal(item), 0)
    }
}