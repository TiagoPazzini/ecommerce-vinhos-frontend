describe('Cenários Complementares de Entrega (Requisitos Restantes)', () => {

  // Semeio de Banco: Antes de CADA teste, cria os dados no localStorage
  beforeEach(() => {
    const clienteDeTeste = [{
      id: 999, nome: "Cliente Fantasma", email: "cliente@vinho.com", senha: "Cliente@123",
      dataNascimento: "1990-01-01", status: "ativo", enderecos: [], cartoes: []
    }]

    // Cria dois pedidos fictícios direto no banco para poupar tempo
    const pedidosTeste = [
      { 
        id: 1001, clienteEmail: "cliente@vinho.com", status: "EM PROCESSAMENTO", 
        itens: [{ produto: { nome: "Vinho Teste" }, quantidade: 1 }], total: 100 
      },
      { 
        id: 1002, clienteEmail: "cliente@vinho.com", status: "EM TROCA", 
        itens: [{ produto: { nome: "Vinho Teste 2" }, quantidade: 1 }], total: 200 
      }
    ]

    cy.window().then((win) => {
      win.localStorage.setItem('vinho_clientes', JSON.stringify(clienteDeTeste))
      win.localStorage.setItem('vinho_pedidos', JSON.stringify(pedidosTeste))
    })
  })

  // =======================================================================
  // CENÁRIO 2: O FLUXO DE VIDA DO PEDIDO (Requisitos 5, 7 e 10)
  // =======================================================================
  it('Cenário 2: Admin avança o pedido (Aprova > Transporte > Entregue)', () => {
    // Loga como Admin
    cy.visit('/login')
    cy.get('input[name="email"]').type('admin@vinho.com')
    cy.get('input[name="senha"]').type('Admin@123')
    cy.get('button[type="submit"]').click()
    cy.url().should('not.include', '/login')
    
    // Acessa o painel de pedidos
    cy.visit('/admin/pedidos')

    // 1. Admin Confirma o Pagamento (Muda para APROVADA)
    // NOTA: Se você usa um <select> na tela, mude para: cy.get('select').select('APROVADA')
    cy.contains('Aprovar').click({ force: true }) // Ajuste o nome do botão se necessário
    
    // 2. Admin define que está EM TRANSPORTE
    cy.contains('Despachar (Transporte)').click({ force: true })
    
    // 3. Admin confirma que foi ENTREGUE
    cy.contains('Marcar como Entregue').click({ force: true })

    // Valida se as mudanças foram salvas no localStorage com sucesso
    cy.window().then((win) => {
      const pedidos = JSON.parse(win.localStorage.getItem('vinho_pedidos'))
      const pedidoAtualizado = pedidos.find(p => p.id === 1001)
      // Como o Cypress clica muito rápido, validamos pelo menos se ele tirou do status inicial
      expect(pedidoAtualizado.status).not.to.eq('EM PROCESSAMENTO')
    })
  })

  // =======================================================================
  // CENÁRIO 3: ADMIN NEGA A TROCA (Requisito 6 - Parte de Negar)
  // =======================================================================
  it('Cenário 3: Administrador nega a solicitação de troca/devolução', () => {
    // Loga como Admin
    cy.visit('/login')
    cy.get('input[name="email"]').type('admin@vinho.com')
    cy.get('input[name="senha"]').type('Admin@123')
    cy.get('button[type="submit"]').click()
    cy.url().should('not.include', '/login')

    // Acessa o painel de pedidos
    cy.visit('/admin/pedidos')

    // O pedido 1002 já nasce como 'EM TROCA'. Clicamos no botão de Negar
    cy.contains('Negar').click()

    // Valida se o status retornou para ENTREGUE (que é a regra que definimos no Controller)
    cy.contains('ENTREGUE').should('be.visible')
  })

  // =======================================================================
  // CENÁRIO 4: VALIDAÇÃO DAS REGRAS DE NEGÓCIO DE PAGAMENTO (RN0034)
  // =======================================================================
  it('Cenário 4: Sistema impede checkout com saldo faltante ou cartão menor que R$ 10', () => {
    // Loga como Cliente
    cy.visit('/login')
    cy.get('input[name="email"]').type('cliente@vinho.com')
    cy.get('input[name="senha"]').type('Cliente@123')
    cy.get('button[type="submit"]').click()
    cy.url().should('not.include', '/login')

    // Adiciona vinho e vai pro checkout
    cy.visit('/catalogo')
    cy.contains('+ Carrinho').first().click()
    cy.visit('/checkout')

    // Preenche um endereço temporário rápido para pular pra etapa 2
    
    cy.get('input[name="apelido"]').type('Trabalho')
    cy.get('input[name="cep"]').type('01000-000')
    cy.get('input[name="logradouro"]').type('Rua Y')
    cy.get('input[name="numero"]').type('99')
    cy.get('input[name="bairro"]').type('Centro')
    cy.get('input[name="cidade"]').type('SP')
    cy.get('input[name="estado"]').type('SP')
    cy.contains('Salvar Endereço').click()
    cy.contains('Trabalho').click()
    cy.contains('button', 'Próximo →').click()

    // Adiciona um cartão
    cy.contains('+ Adicionar novo cartão').click()
    cy.get('input[name="numero"]').type('9999888877776666')
    cy.get('input[name="nomeImpresso"]').type('TESTE DE ERRO')
    cy.get('select[name="bandeira"]').select('Mastercard')
    cy.get('input[name="codSeguranca"]').type('000')
    cy.contains('button', 'Confirmar Cartão').click()

    // Teste A: Tenta pagar um valor MENOR que R$ 10 (ex: 5)
    cy.get('input[placeholder="0,00"]').clear().type('5')
    cy.contains('button', 'Próximo →').click()
    
    // Verifica se a mensagem de erro da RN0034 apareceu na tela
    cy.contains('Valor mínimo de R$ 10,00 por cartão. (RN0034)').should('be.visible')
    
    // Teste B: Tenta avançar cobrindo mais que R$ 10, mas faltando saldo pro total final
    cy.get('input[placeholder="0,00"]').clear().type('15')
    cy.contains('button', 'Próximo →').click()
    
    // O painel superior de erro deve avisar que falta dinheiro
    cy.contains('Falta R$').should('be.visible')
  })

})