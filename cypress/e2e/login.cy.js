/// <reference types="cypress"/>

const token = ""
describe("Login - Testes de API ServRest", () => {
    it("Deve fazer login com sucesso", () => {

        cy.api({
            method: "POST",
            url: "login",
            body: {
                email: "fulano@qa.com",
                password: "teste",
            },
        }).then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body.message).to.equal('Login realizado com sucesso');
            cy.log(response.body.authorization)
        });
    });
});
