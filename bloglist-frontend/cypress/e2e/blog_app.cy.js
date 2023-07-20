/// <reference types="Cypress" />

const user = {
  name: 'Matti Luukkainen',
  username: 'mluukkai',
  password: 'salainen'
}

const user2 = {
  name: 'zushi',
  username: 'zms',
  password: 'password'
}

Cypress.Commands.add('Login', (user) => {
  cy.get('input').first().type(user.username)
  cy.get('input').eq(1).type(user.password)
  cy.get('button:contains("login")').click()
})

Cypress.Commands.add('postArticle', (title, author, url) => {
  cy.get('body').then(body => {

    // cy.get('#blogSubmitFormButton').then(($el) => {
    //   if ($el.length) {
    //     // Element exists, do something
    //     $el[0].click()
    //   }
    // })
    // // cy.wait(3000)
    // if (body.find('button:contains("Show Blog Submit")').length > 0) {
    //   cy.get('button').contains('logout').click()
    // }
    // if (body.find('#blogSubmitFormButton').length > 0) {
    //   cy.get('#blogSubmitFormButton').click()
    // }

    cy.get('#blogSubmitFormButton').click()
    cy.get('input').eq(0).type(title)
    cy.get('input').eq(1).type(author)
    cy.get('input').eq(2).type(url)
    cy.contains('button', 'save').click()
    cy.contains(title)
    cy.get('input').eq(0).clear()
    cy.get('input').eq(1).clear()
    cy.get('input').eq(2).clear()
    cy.get('#blogSubmitFormButton').click()
  })
})

describe('Note app', function () {
  beforeEach('Reset users', () => {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.request('POST', 'http://localhost:3003/api/users/', user2)
    cy.visit('http://localhost:3000')
  })

  it('front page can be opened', function () {
    cy.contains('blogs')
  })

  describe('login', function () {
    it('succeeds with the correct credientials', function () {
      //cy.ge
      cy.get('input').first().type('mluukkai')
      cy.get('input').eq(1).type('salainen')
      cy.get('button').click()
      cy.contains('is logged in')
      cy.get('button').eq(0).should('not.contain', 'login')
    })

    it('fails with the wrong credientials', function () {
      cy.get('input').first().type('wrong')
      cy.get('input').eq(1).type('wrong')
      cy.get('button').click()
      cy.get('button').eq(0).should('contain', 'login')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.get('input').first().type('mluukkai')
      cy.get('input').eq(1).type('salainen')
      cy.get('button').click()
      cy.contains('is logged in')
    })

    it('can log out', function () {
      cy.get('body').should('contain', 'is logged in')
      cy.contains('button', 'Logout').click()
      cy.get('body').should('not.contain', 'is logged in')
    })

    it('can submit new blog entires', function () {
      cy.get('#blogSubmitFormButton').click()
      cy.get('input').eq(0).type('title text')
      cy.get('input').eq(1).type('author text')
      cy.get('input').eq(2).type('url text')
      cy.contains('button', 'save').click()
      cy.contains('title text')
    })

    describe('When a new blog exists', function () {
      beforeEach(function () {
        cy.intercept({
          method: 'POST',
          url: '*'
        }).as('posts')

        cy.get('#blogSubmitFormButton').click()
        cy.get('input').eq(0).type('title text')
        cy.get('input').eq(1).type('author text')
        cy.get('input').eq(2).type('url text')
        cy.contains('button', 'save').click()

        cy.wait('@posts').then(xhr => {
          cy.log(xhr.responseBody)
          cy.log(xhr.requestBody)
          //expect(xhr.method).to.eq('POST')
        })

        cy.contains('title text')
      })

      it('can submit new likes', function () {
        cy.contains('button', 'Like').click()
        cy.contains('likes: 1')
      })

      it('can delete the blog', function () {
        cy.contains('title text')
        cy.contains('button', 'Delete').click()
        cy.get('body').should('not.contain', 'title text')
      })
    })
  })

  describe('When you have three blog entries by two authors', function () {
    beforeEach(function () {
      cy.Login(user)
      cy.postArticle('title1', 'author1', 'url1')
      cy.postArticle('title2', 'author2', 'url2')
      // cy.get('input').first().type('mluukkai')
      // cy.get('input').eq(1).type('salainen')
      cy.get('button:contains("Like")').eq(1).click()
      // cy.get('button', 'Like')[1].click()
      cy.postArticle('title3', 'author3', 'url3')
      cy.contains('button', 'Logout').click()
      cy.Login(user2)
      cy.postArticle('title4', 'author4', 'url4')
    })

    it('only one delete button for new user', function () {
      cy.get('button:contains("Delete")').should('have.length', 1)
    })

    it.only('Highest like items appear first', function () {
      cy.get('div:contains("likes:")').eq(0).contains('1')
      cy.get('div:contains("likes:")').eq(1).contains('0')
    })
  })
})