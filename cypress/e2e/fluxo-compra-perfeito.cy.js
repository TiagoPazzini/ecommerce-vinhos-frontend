describe('Fluxo de Compra e Redirecionamento', () => {

  // O beforeEach roda silenciosamente ANTES do teste começar
  beforeEach(() => {
    const clienteDeTeste = [{
      id: 999,
      nome: "Cliente Fantasma",
      email: "cliente@vinho.com",
      senha: "Cliente@123",
      dataNascimento: "1990-01-01",
      status: "ativo",
      enderecos: [{
        apelido: "Casa", tipoEndereco: "ambos", tipoLogradouro: "Rua",
        logradouro: "Av Paulista", numero: "1000", bairro: "Bela Vista",
        cep: "01310-100", cidade: "São Paulo", estado: "SP", pais: "Brasil"
      }],
      cartoes: []
    }]

    // Injeta o cliente no banco de dados do navegador
    cy.window().then((win) => {
      win.localStorage.setItem('vinho_clientes', JSON.stringify(clienteDeTeste))
    })
  })

  it('Deve adicionar um vinho ao carrinho, exigir login e voltar ao checkout', () => {
    // 1. Entra na página inicial
    cy.visit('/')

    // 2. Clica no botão de ir pro catálogo
    cy.contains('Explorar vinhos').click()

    // 3. Clica no primeiro botão "+ Carrinho" que encontrar
    cy.contains('+ Carrinho').first().click()

    // 4. Vai para a página do carrinho
    cy.contains('Carrinho').click()

    // 5. Tenta finalizar a compra (estando deslogado)
    cy.contains('Finalizar compra').click()

    // 6. Verifica se o sistema barrou e mandou pro login
    cy.url().should('include', '/login')
    cy.contains('Acesse sua conta ou cadastre-se').should('be.visible')

    // 7. Preenche os dados de login com o cliente que injetamos no beforeEach
    cy.get('input[name="email"]').type('cliente@vinho.com')
    cy.get('input[name="senha"]').type('Cliente@123')
    cy.get('button[type="submit"]').contains('Entrar').click()

    // 8. O GRANDE TESTE: Deve pular a Home e ir direto para o Checkout!
    cy.url().should('include', '/checkout')
    
    // 9. Verifica se a Etapa 1 do Checkout carregou certinho
    cy.contains('Selecione o endereço de entrega').should('be.visible')

    // ... código anterior (passo 9)

    // 10. Clica para abrir o formulário de novo endereço
    cy.contains('+ Adicionar outro endereço').click()

    // 11. Preenche os dados do endereço novo
    cy.get('input[name="apelido"]').type('Trabalho')
    cy.get('input[name="cep"]').type('04538-133')
    cy.get('input[name="logradouro"]').type('Av Brigadeiro Faria Lima')
    cy.get('input[name="numero"]').type('3000')
    cy.get('input[name="bairro"]').type('Itaim Bibi')
    cy.get('input[name="cidade"]').type('São Paulo')
    cy.get('input[name="estado"]').type('SP')

    // 12. Clica para salvar
    cy.contains('Salvar Endereço').click()

    // 13. O formulário deve sumir e o endereço "Trabalho" deve aparecer na tela. Vamos clicar nele!
    cy.contains('Trabalho').click()

    // 14. Quando selecionamos o endereço, o frete é calculado. Vamos garantir que ele apareceu:
    cy.contains('Frete: R$').should('be.visible')

    // 15. Avança para a Etapa 2 (Pagamento)
    cy.contains('Próximo →').click()

    // 16. Verifica se a tela de pagamento carregou e mostrou o Resumo
    cy.contains('Resumo').should('be.visible')
    cy.contains('Cartões de crédito').should('be.visible')

    // ... continuação após o passo 16 ...

    // 17. Aplica o cupom de desconto promocional
    cy.get('input[placeholder="Digite o código do cupom"]').type('PROMO10')
    cy.contains('button', 'Aplicar').click()
    cy.contains('PROMO10 — R$ 10.00').should('be.visible')

    // 18. Adiciona o PRIMEIRO cartão de crédito
    cy.contains('+ Adicionar novo cartão').click()
    cy.get('input[name="numero"]').type('1111222233334444')
    cy.get('input[name="nomeImpresso"]').type('CLIENTE TESTE UM')
    cy.get('select[name="bandeira"]').select('Visa')
    cy.get('input[name="codSeguranca"]').type('123')
    cy.contains('button', 'Confirmar Cartão').click()

    // 19. Adiciona o SEGUNDO cartão de crédito
    cy.contains('+ Adicionar novo cartão').click()
    cy.get('input[name="numero"]').type('5555666677778888')
    cy.get('input[name="nomeImpresso"]').type('CLIENTE TESTE DOIS')
    cy.get('select[name="bandeira"]').select('Mastercard')
    cy.get('input[name="codSeguranca"]').type('456')
    cy.contains('button', 'Confirmar Cartão').click()

    // 20. Como configuramos para os cartões já virem marcados ao criar, 
    // vamos apenas dividir o pagamento (Total R$ 895,00)
    cy.get('input[placeholder="0,00"]').eq(0).clear().type('500')
    cy.get('input[placeholder="0,00"]').eq(1).clear().type('395')

    // 21. Avança para a Etapa 3 (Confirmação)
    cy.contains('button', 'Próximo →').click()
    cy.contains('Resumo do pedido').should('be.visible')

    // 22. O Grand Finale: Confirma a compra e valida a tela de sucesso!
    cy.contains('button', 'Confirmar pedido ✓').click()
    
    // 23. Valida se chegou em Meus Pedidos com o status correto
    cy.url().should('include', '/pedidos')
    cy.contains('Pedido realizado com sucesso').should('be.visible')
    cy.contains('Pedido #').should('be.visible')
    cy.contains('EM PROCESSAMENTO').should('be.visible')


    // =======================================================
    // === PARTE 2: A JORNADA DA TROCA E CUPOM DINÂMICO ======
    // =======================================================

    // 24. Forçamos o status para ENTREGUE direto no Banco (localStorage)
    // Isso evita que o robô trave tentando adivinhar o nome dos seus botões de despachar
    cy.window().then((win) => {
      const pedidos = JSON.parse(win.localStorage.getItem('vinho_pedidos'))
      pedidos[0].status = 'ENTREGUE'
      win.localStorage.setItem('vinho_pedidos', JSON.stringify(pedidos))
    })
    
    // Recarrega a página para o cliente ver o novo status
    cy.reload()
    cy.contains('ENTREGUE').should('be.visible')

    // 25. Cliente: Abre os detalhes e Solicita Troca
    cy.contains('Ver detalhes').click()
    cy.contains('Solicitar Troca / Devolução').click()
    cy.contains('EM TROCA').should('be.visible')

    // 26. Cliente sai da conta
    cy.contains('button', 'Sair').click()

    // 27. Admin: Faz Login
    cy.url().should('include', '/login')
    cy.get('input[name="email"]').clear().type('admin@vinho.com')
    cy.get('input[name="senha"]').clear().type('Admin@123')
    cy.get('button[type="submit"]').contains('Entrar').click()

    // 🛑 TRAVA DE SEGURANÇA: Faz o robô esperar o React sair da tela de login.
    // Isso garante que deu tempo de salvar a sessão no banco antes de recarregar a página!
    cy.url().should('not.include', '/login')

    // 28. Admin: Vai para a tela de pedidos 
    cy.visit('/admin/pedidos')
    
    // 29. Admin: Autoriza a troca
    cy.contains('Autorizar Troca').click()
    cy.contains('TROCA AUTORIZADA').should('be.visible')

    // 30. O GRANDE TRUQUE: Vamos "escutar" o pop-up do navegador para roubar o código do cupom!
    let cupomGerado = ''
    cy.on('window:alert', (texto) => {
      // Procura por "TROCA" seguido de números no texto do alert
      const match = texto.match(/(TROCA\d+)/)
      if (match) cupomGerado = match[1] 
    })

    // 31. Admin: Confirma o Recebimento (Isso dispara o alert que o Cypress vai capturar acima)
    cy.contains('Confirmar Recebimento').click()
    cy.contains('Troca Finalizada').should('be.visible')

    // 32. Admin sai e Cliente volta
    cy.contains('button', 'Sair').click()
    // O Admin também estava numa rota protegida, então já caiu no /login de novo!
    cy.url().should('include', '/login')
    cy.get('input[name="email"]').clear().type('cliente@vinho.com')
    cy.get('input[name="senha"]').clear().type('Cliente@123')
    cy.get('button[type="submit"]').contains('Entrar').click()

    // 33. Cliente: Compra outro vinho
    cy.visit('/catalogo')
    cy.contains('+ Carrinho').first().click()
    
    // 34. Vai para o Checkout e reaproveita o endereço
    cy.contains('Carrinho').click()
    cy.contains('Finalizar compra').click()
    cy.contains('Trabalho').click()
    cy.contains('button', 'Próximo →').click()

    // 35. O GRAN FINALE: Aplica o super cupom recém-gerado e finaliza a compra!
    // Usamos o cy.then() para o Cypress acessar a variável cupomGerado
    cy.then(() => { 
      // Aplica o cupom
      cy.get('input[placeholder="Digite o código do cupom"]').type(cupomGerado)
      cy.contains('button', 'Aplicar').click()
      cy.contains(cupomGerado).should('be.visible')
      
      // 36. Adiciona um cartão para pagar a diferença de R$ 10,00
      cy.contains('+ Adicionar novo cartão').click()
      cy.get('input[name="numero"]').type('9999888877776666')
      cy.get('input[name="nomeImpresso"]').type('CLIENTE FIEL')
      cy.get('select[name="bandeira"]').select('Visa')
      cy.get('input[name="codSeguranca"]').type('789')
      cy.contains('button', 'Confirmar Cartão').click()

      // 37. Digita o valor restante no cartão (Exatos R$ 10)
      cy.get('input[placeholder="0,00"]').clear().type('10')

      // 38. Avança para a Etapa de Confirmação
      cy.contains('button', 'Próximo →').click()
      cy.contains('Resumo do pedido').should('be.visible')

      // 39. Finaliza a segunda compra com o cupom de troca
      cy.contains('button', 'Confirmar pedido ✓').click()
      
      // 40. Comemora a vitória na tela de Pedidos!
      cy.url().should('include', '/pedidos')
      cy.contains('Pedido realizado com sucesso').should('be.visible')
      
      cy.log('🔥 TESTE ÉPICO CONCLUÍDO COM SUCESSO! A TROCA FUNCIONOU ATÉ O FIM! 🔥')
      
    })

  })

})