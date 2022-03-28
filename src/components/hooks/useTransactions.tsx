import { createContext, ReactNode, useEffect, useState, useContext } from 'react';
import { api } from '../../services/api';

// Tipagem da transação
interface Transaction {
    id: number;
    title: string;
    amount: number;
    type: string;
    category: string;
    createdAt: string;
}

// Pegue toda a tipagem acima menos o id e o createdAt
type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>

interface TrasactionProviderProps {
    children: ReactNode;
}

// interface para passarmos as duas informações para o value do Provider.
interface TransactionContextData {
    transactions: Transaction[];
    createTransaction: (transaction: TransactionInput) => Promise<void>;
}

 // Passamos a tipagem como um objeto vazio e colocamos que ele é um TransactionContextData
 const TransactionsContext = createContext<TransactionContextData>(
    {} as TransactionContextData
);

// Criação do componente do contexto junto com o useEffect da API
export function TransactionsProvider({ children }: TrasactionProviderProps) {
    // Estado que vai monitorar a mudança da transação
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    
    // Consumo da API do mirageJS
    useEffect(() =>{
        api.get('transactions')
        .then(response => setTransactions(response.data.transactions))
    },[]);

    async function createTransaction(transactionInput: TransactionInput) {
    // chamada a API - inserindo dados na rota
       const response =  await api.post('/transactions', {
           ...transactionInput,
           createdAt: new Date()
       })   
       // Aqui vei todos os dados da API
       const { transaction } = response.data;
       
       // Imultabilidade -> passamos todas as informações primeiro, e depois colocamos a nossa que criamos dentro
       setTransactions([
           ...transactions,
           transaction
       ]);
}
    return (
        <TransactionsContext.Provider value={{ transactions, createTransaction }}>
            {children}
        </TransactionsContext.Provider>
    )
}

export function useTransactions() {
    const context = useContext(TransactionsContext);

    return context;
}