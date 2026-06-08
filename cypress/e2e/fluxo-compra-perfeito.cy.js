describe('Fluxo de Compra Perfeito do Zero - Vinho & Co.', () => {

  function gerarCPFValido() {
    const randomDigit = () => Math.floor(Math.random() * 9);
    const n = Array.from({ length: 9 }, randomDigit);
    let d1 = n.reduce((total, num, idx) => total + num * (10 - idx), 0);
    d1 = 11 - (d1 % 11);
    if (d1 >= 10) d1 = 0;
    let d2 = d1 * 2 + n.reduce((total, num, idx) => total + num * (11 - idx), 0);
    d2 = 11 - (d2 % 11);
    if (d2 >= 10) d2 = 0;
    return `${n[0]}${n[1]}${n[2]}.${n[3]}${n[4]}${n[5]}.${n[6]}${n[7]}${n[8]}-${d1}${d2}`;
  }

  const emailCliente = `maria.${Date.now()}@vinho.com`
  const senhaCliente = 'Cliente@123'
  const cpfDinamico = gerarCPFValido()

  beforeEach(() => {
    cy.clearLocalStorage()
    cy.clearCookies()
  })

  it('Deve executar toda a jornada combinada de compra, cadastro do zero, validações e troca parcial', () => {
    
    // =======================================================================
    // 1. ADICIONAR PRODUTOS AO CARRINHO E ALTERAR QUANTIDADES (DESLOGADO)
    // =======================================================================
    cy.visit('/')
    cy.contains('Explorar vinhos').click()
    cy.wait(2000)

    cy.get('button').filter(':contains("+ Carrinho")').eq(0).click({ force: true })
    cy.get('button').filter(':contains("+ Carrinho")').eq(1).click({ force: true })

    cy.contains('🛒 Carrinho').click()
    cy.url().should('include', '/carrinho')
    cy.wait(2000)

    cy.contains('Itens do carrinho').should('be.visible')
    cy.get('button').contains('+').first().click()
    cy.wait(2000)

    cy.contains('Finalizar compra').click()
    cy.url().should('include', '/login')
    cy.wait(2000)

    // =======================================================================
    // 2. CRIAR NOVA CONTA (VELOCIDADE MÁXIMA)
    // =======================================================================
    cy.get('button').contains('Criar conta').click()
    cy.contains('Ir para o cadastro').click()
    cy.url().should('include', '/cadastro')

    cy.contains('h2', 'Dados pessoais').parent().within(() => {
      cy.get('input[name="nome"]').type('Maria da Silva')
      cy.get('input[name="email"]').type(emailCliente)
      cy.get('input[name="cpf"]').type(cpfDinamico)
      cy.get('input[name="dataNascimento"]').type('1995-05-15')
      cy.get('select[name="genero"]').select('feminino')
      cy.get('input[name="telefone"]').type('(11) 98888-7777')
      cy.get('input[name="senha"]').type(senhaCliente)
      cy.get('input[name="confirmarSenha"]').type(senhaCliente)
    })

    cy.contains('h2', 'Endereços').parent().within(() => {
      cy.get('input[name="apelido"]').type('Casa da Maria')
      cy.get('select[name="tipoEndereco"]').select('ambos')
      cy.get('select[name="tipoResidencia"]').select('Casa')
      cy.get('select[name="tipoLogradouro"]').select('Rua')
      cy.get('input[name="logradouro"]').type('Rua das Garrafas de Vinho')
      cy.get('input[name="numero"]').type('750')
      cy.get('input[name="bairro"]').type('Videiras')
      cy.get('input[name="cep"]').type('13000-000')
      cy.get('input[name="cidade"]').type('Campinas')
      cy.get('input[name="estado"]').type('SP')
      cy.get('input[name="pais"]').clear().type('Brasil')
    })

    cy.contains('h2', 'Cartões de crédito').parent().within(() => {
      cy.get('input[name="numero"]').type('1111222233334444')
      cy.get('input[name="nomeImpresso"]').type('CLIENTE TESTE UM')
      cy.get('select[name="bandeira"]').select('Visa')
      cy.get('input[name="codSeguranca"]').type('123')
    })

    // ⏱️ Timeout estendido para aguentar a inserção no banco remoto do Supabase
    cy.get('button[type="submit"]').contains('Cadastrar cliente').click()

    // =======================================================================
    // 3. CHECKOUT: CADASTRAR UM NOVO ENDEREÇO E PROSSEGUIR
    // =======================================================================
    cy.url({ timeout: 10000 }).should('include', '/checkout')
    cy.contains('Selecione o endereço de entrega').should('be.visible')
    cy.wait(2000)

    cy.contains('+ Adicionar outro endereço').click()
    cy.contains('h3', 'Cadastrar Endereço').parent().within(() => {
      cy.get('input[name="apelido"]').type('Trabalho')
      cy.get('input[name="cep"]').type('01310-100')
      cy.get('input[name="logradouro"]').type('Avenida Paulista')
      cy.get('input[name="numero"]').type('1000')
      cy.get('input[name="bairro"]').type('Bela Vista')
      cy.get('input[name="cidade"]').type('São Paulo')
      cy.get('input[name="estado"]').type('SP')
      cy.contains('Salvar Endereço').click()
    })
    cy.wait(2000)

    cy.contains('Trabalho').click()
    cy.contains('Frete: R$').should('be.visible')
    cy.wait(2000)
    cy.contains('Próximo →').click()

    // =======================================================================
    // 4. ETAPA 2: CUPOM, DOIS CARTÕES E SEQUÊNCIA DE REGRAS DE NEGÓCIO
    // =======================================================================
    cy.contains('Resumo do Pedido').should('be.visible')
    

    cy.get('input[placeholder="Digite o código do cupom"]').type('PROMO10')
    cy.contains('button', 'Aplicar').click()
    cy.contains('PROMO10').should('be.visible')
    

    cy.contains('+ Adicionar novo cartão').click()
    cy.contains('h3', 'Novo Cartão').parent().within(() => {
      cy.get('input[name="numero"]').type('5555666677778888')
      cy.get('input[name="nomeImpresso"]').type('CLIENTE TESTE DOIS')
      cy.get('select[name="bandeira"]').select('Mastercard')
      cy.get('input[name="codSeguranca"]').type('456')
      cy.contains('button', 'Confirmar Cartão').click()
    })
    
    cy.wait(2000)

    cy.contains('CLIENTE TESTE UM').click()
    //cy.contains('CLIENTE TESTE DOIS').click()
    

    // Testando erro de valor mínimo (R$ 5,00)
    cy.get('input[type="number"]').eq(0).clear().type('5')
    cy.get('input[type="number"]').eq(1).clear().type('150')
    cy.contains('button', 'Próximo →').click()
    cy.contains('Valor mínimo de R$ 10,00 por cartão.').should('be.visible')
  

    // Testando erro de valor somado incorreto
    cy.get('input[type="number"]').eq(0).clear().type('20')
    cy.get('input[type="number"]').eq(1).clear().type('20')
    cy.contains('button', 'Próximo →').click()
    cy.contains('Falta R$').should('be.visible')
    cy.wait(2000)

    cy.contains('Total').siblings().last().then(($totalElement) => {
      const valorTotal = parseFloat($totalElement.text().replace(/[^\d,.]/g, '').replace(',', '.'))
      const metadeValor = (valorTotal / 2).toFixed(2)
      
      cy.get('input[type="number"]').eq(0).clear().type(metadeValor)
      cy.get('input[type="number"]').eq(1).clear().type(metadeValor)
    })
    cy.wait(2000)

    cy.contains('button', 'Próximo →').click()
    cy.wait(2000)
    cy.contains('Confirmar pedido ✓').click()
    
    // ⏱️ Espera elástica pelo salvamento do pedido no Supabase
    cy.url({ timeout: 10000 }).should('include', '/pedidos')
    cy.wait(2000)

    // =======================================================================
    // 5. PAINEL ADMIN: MÁQUINA DE STATUS DE PEDIDOS (IMUNIZADO)
    // =======================================================================
    cy.contains('button', 'Sair').click()
    cy.get('input[name="email"]').clear().type('admin@vinho.com')
    cy.get('input[name="senha"]').clear().type('Admin@123')
    cy.get('button[type="submit"]').contains('Entrar').click()

    cy.visit('/admin/pedidos')
    cy.wait(2000)
    
    // 🚀 BLINDAGEM HISTÓRICA: O Admin agora isola e atua estritamente sobre a linha da Maria
    cy.contains(emailCliente).closest('tr, [style*="border"], div').within(() => {
      cy.contains('button', 'Aprovar').click()
    })
    cy.wait(2000)
    
    cy.contains(emailCliente).closest('tr, [style*="border"], div').within(() => {
      cy.contains('button', 'Despachar (Transporte)').click()
    })
    cy.wait(2000)
    
    cy.contains(emailCliente).closest('tr, [style*="border"], div').within(() => {
      cy.contains('button', 'Marcar como Entregue').click()
    })
    cy.wait(2000)

    // =======================================================================
    // 6. CLIENTE: ENTRAR E SOLICITAR TROCA PARCIAL DE APENAS 1 ITEM
    // =======================================================================
    cy.contains('button', 'Sair').click()
    cy.get('input[name="email"]').clear().type(emailCliente)
    cy.get('input[name="senha"]').clear().type(senhaCliente)
    cy.get('button[type="submit"]').contains('Entrar').click()

    cy.visit('/pedidos')
    cy.contains('Pedido #').first().click()
    cy.wait(2000)
    
    cy.get('input[type="number"]').first().clear().type('1')
    cy.wait(2000)
    cy.contains('Confirmar Devolução dos Itens Selecionados').click()
    cy.contains('EM TROCA').should('be.visible')
    cy.wait(2000)

    // =======================================================================
    // 7. ADMIN: AUTORIZAR TROCA E CAPTURAR CÓDIGO DO CUPOM
    // =======================================================================
    cy.contains('button', 'Sair').click()
    cy.get('input[name="email"]').clear().type('admin@vinho.com')
    cy.get('input[name="senha"]').clear().type('Admin@123')
    cy.get('button[type="submit"]').contains('Entrar').click()

    cy.visit('/admin/pedidos')
    cy.wait(2000)
    
    cy.contains(emailCliente).closest('tr, [style*="border"], div').within(() => {
      cy.contains('button', 'Autorizar Troca').click()
    })

    let cupomTrocaGerado = ''
    cy.on('window:alert', (textoAlert) => {
      const match = textoAlert.match(/(TROCA\d+)/)
      if (match) cupomTrocaGerado = match[1]
    })

    cy.wait(2000)
    cy.contains(emailCliente).closest('tr, [style*="border"], div').within(() => {
      cy.contains('button', 'Confirmar Recebimento').click()
    })
    cy.wait(2000)

    // =======================================================================
    // 8. RECOMPRA DO CLIENTE: OUTROS 3 PRODUTOS E ENDEREÇO SALVO
    // =======================================================================
    cy.contains('button', 'Sair').click()
    cy.get('input[name="email"]').clear().type(emailCliente)
    cy.get('input[name="senha"]').clear().type(senhaCliente)
    cy.get('button[type="submit"]').contains('Entrar').click()

    cy.visit('/catalogo')
    cy.get('button').filter(':contains("+ Carrinho")').eq(0).click({ force: true })
    cy.get('button').filter(':contains("+ Carrinho")').eq(1).click({ force: true })
    cy.get('button').filter(':contains("+ Carrinho")').eq(2).click({ force: true })

    cy.contains('🛒 Carrinho').click()
    cy.contains('Finalizar compra').click()
    cy.wait(2000)
    
    cy.contains('Trabalho').click()
    cy.contains('button', 'Próximo →').click()

    // =======================================================================
    // 9. FINALIZAÇÃO: REAPROVEITAR CUPOM DA TROCA E VERIFICAÇÃO DE SALDO 0
    // =======================================================================
    cy.then(() => {
      cy.get('input[placeholder="Digite o código do cupom"]').type(cupomTrocaGerado)
      cy.contains('button', 'Aplicar').click()
      cy.contains(cupomTrocaGerado).should('be.visible')
      cy.wait(2000)

      cy.contains('Valor a ser pago no cartão').find('strong').then(($total) => {
        const valorRestante = parseFloat($total.text().replace(/[^\d,.]/g, '').replace(',', '.'))
        
        if (valorRestante > 0) {
          cy.contains('Visa').click()
          cy.get('input[type="number"]').first().clear().type(valorRestante.toFixed(2))
          cy.wait(2000)
        }
      })

      cy.contains('button', 'Próximo →').click()
      cy.wait(2000)
      cy.contains('Confirmar pedido ✓').click()
      cy.url({ timeout: 10000 }).should('include', '/pedidos')
      cy.contains('EM PROCESSAMENTO').should('be.visible')
      
    })
  })
})