Cypress.Commands.add('token', (email, senha) => {
    cy.api({
        method: "POST",
        url: "login",
        body: {
            email: email,
            password: senha,
        },
    }).then((response) => {
        expect(response.status).to.equal(200);
        return response.body.authorization
    });
})

Cypress.Commands.add('cadastrarProduto', (produto, valor, descricao, qtd, token) => {
    cy.api({
        method: "POST",
        url: "produtos",
        body: {
            nome: produto,
            preco: valor,
            descricao: descricao,
            quantidade: qtd,
        },
        headers: { authorization: token },
        failOnStatusCode: false
    })
})