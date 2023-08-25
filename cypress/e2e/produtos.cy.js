/// <reference types="cypress"/>

import contrato from '../contract/produtos.contract'
describe("Produtos - Testes de API ServeRest", () => {

    let token;
    let id;
    let produto = `Produdo Ebac ${Math.floor(Math.random() * 10000000)}`;
    let valor = Math.floor(Math.random() * 1000);
    let qtd = Math.floor(Math.random() * 100);


    before(() => {
        cy.token("fulano@qa.com", "teste").then((tkn) => {
            token = tkn
        });
    });

    it('Deve validar contrato de produtos', () => {
        cy.request('produtos').then((response) => {
            contrato.validateAsync(response.body)
        })
    });

    it("Deve validar a lista de produtos cadastrados com sucesso", () => {
        cy.api('produtos').then((response) => {
            expect(response.body.produtos[0].nome).to.include("Ebac");
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property("produtos");
            expect(response.duration).to.be.lessThan(15);
        });
    });

    it("Deve validar mensagem de cadastro de produto", () => {
        cy.cadastrarProduto(produto, valor, "Novo Produto", qtd, token).then((response) => {
            expect(response.status).to.equal(201);
            expect(response.body.message).to.equal("Cadastro realizado com sucesso");
            return response.body._id
        }).then((idNew) => {
            id = idNew
        });
    });

    it("Deve validar mensagem de erro para cadastro de produto repetido", () => {
        cy.cadastrarProduto("Logitech MX Keys", 250, "Novo Produto", 10, token).then((response) => {
            expect(response.status).to.equal(400);
            expect(response.body.message).to.equal("Já existe produto com esse nome");
        });
    });

    it("Deve validar a edição de um produto já cadastrado", () => {
        cy.api({
            method: 'PUT',
            url: `produtos/${id}`,
            headers: { authorization: token },
            body: {
                nome: produto,
                preco: valor,
                descricao: 'Produto Editado',
                quantidade: qtd,
            }
        }).then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body.message).to.equal('Registro alterado com sucesso');
        })
    });

    it("Deve validar mensagem de erro ao tentar editar um produto enviar o campo preço", () => {
        cy.api({
            method: 'PUT',
            url: `produtos/${id}`,
            headers: { authorization: token },
            body: {
                nome: produto,
                descricao: 'Produto Editado',
                quantidade: qtd,
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(400);
            expect(response.body.preco).to.equal('preco é obrigatório');
        })
    });

    it("Deve validar mensagem de erro ao tentar editar um produto enviar o campo nome", () => {
        cy.api({
            method: 'PUT',
            url: `produtos/${id}`,
            headers: { authorization: token },
            body: {
                preco: valor,
                descricao: 'Produto Editado',
                quantidade: qtd,
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(400);
            expect(response.body.nome).to.equal('nome é obrigatório');
        })
    });

    it("Deve validar mensagem de erro ao tentar editar um produto enviar o campo descrição", () => {
        cy.api({
            method: 'PUT',
            url: `produtos/${id}`,
            headers: { authorization: token },
            body: {
                nome: produto,
                preco: valor,
                quantidade: qtd,
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(400);
            expect(response.body.descricao).to.equal('descricao é obrigatório');
        })
    });


    it("Deve validar mensagem de erro ao tentar editar um produto enviar o campo quantidade", () => {
        cy.api({
            method: 'PUT',
            url: `produtos/${id}`,
            headers: { authorization: token },
            body: {
                nome: produto,
                preco: valor,
                descricao: 'Produto Editado',
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(400);
            expect(response.body.quantidade).to.equal('quantidade é obrigatório');
        })
    });


    it("Deve validar a exclusão de um produto cadastrado", () => {
        cy.api({
            method: 'DELETE',
            url: `produtos/${id}`,
            headers: { authorization: token }
        }).then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body.message).to.equal('Registro excluído com sucesso');
        })
    });
});
