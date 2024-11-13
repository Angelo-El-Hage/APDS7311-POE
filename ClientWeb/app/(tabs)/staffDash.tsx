import React, { useEffect, useState } from 'react';
import TransactionCard from './transactionCard';
import { View, Text, StyleSheet } from 'react-native';

interface Transaction {
  _id: string;
  customerId: string;
  amount: number;
  currency: string;
  provider: string;
  destinationAccount: string;
  swiftCode: string;
  status: string;
  createdAt: string;
  __v: number;
}

export default function StaffDashScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // Fetch transactions from your API
    fetch('https://api.example.com/transactions')
      .then(response => response.json())
      .then(data => setTransactions(data))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  // Callback to handle status update
  const handleStatusUpdate = (id: string, newStatus: string) => {
    setTransactions(prevTransactions =>
      prevTransactions.map(transaction =>
        transaction._id === id ? { ...transaction, status: newStatus } : transaction
      )
    );

    // Optionally, send an update request to the server
    fetch(`https://api.example.com/transactions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    }).catch(error => console.error("Error updating status:", error));
  };

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Transactions</h2>
      <div className="transaction-list">
        {transactions.map(transaction => (
          <TransactionCard key={transaction._id} transaction={transaction} onUpdateStatus={handleStatusUpdate} />
        ))}
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
