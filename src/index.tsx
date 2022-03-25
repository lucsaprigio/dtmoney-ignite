import React from 'react';
import ReactDOM from 'react-dom';
import { createServer, Model } from 'miragejs';
import { App } from './App';

// Servidor com Mirage

createServer({
    //Banco de Dados
    models: {
      transaction: Model,
    },

    seeds(server) {
      server.db.loadData({
        transactions: [
          {
            id: 1,
            title: 'Freelance de website',
            type: 'deposit',
            category: 'Dev',
            amount: 6000,
            createdAt: new Date('2022-02-12 09:00:00'),
          },
          {
            id: 2,
            title: 'Aluguel',
            type: 'withdraw',
            category: 'Casa',
            amount: 1000,
            createdAt: new Date('2022-02-15 12:00:00'),
          },
        ],
      })
    },

  routes() {
    //Nome da Api
    this.namespace = 'api';    

    // nome da Rota com retornando os dados.
    this.get('/transactions', () => {
      return this.schema.all('transaction')

    })

    // Requisição de inserção de dados na API 
    this.post('/transactions', (schema, request) => {
      const data = JSON.parse(request.requestBody)

      // Retorna um schema (Banco) do nome transaction que está acima
      return schema.create('transaction', data)
    })
  }
})

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
