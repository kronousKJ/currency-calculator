import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MultiCurrencyTable = () => {
  const [balance, setBalance] = useState(1000000); // 초기 잔액 (KRW)
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('KRW');
  const [description, setDescription] = useState('');
  const [exchangeRates, setExchangeRates] = useState({});

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  const fetchExchangeRates = async () => {
    try {
      const response = await axios.get('https://api.exchangerate-api.com/v4/latest/KRW');
      setExchangeRates(response.data.rates);
    } catch (error) {
      console.error('환율 정보를 가져오는데 실패했습니다:', error);
    }
  };

  const handleAddExpense = () => {
    if (amount && currency && description) {
      const newExpense = {
        amount: parseFloat(amount),
        currency,
        description,
        date: new Date().toISOString(),
      };
      setExpenses([...expenses, newExpense]);
      setAmount('');
      setDescription('');
      updateBalance(newExpense);
    }
  };

  const updateBalance = (expense) => {
    const rate = exchangeRates[expense.currency];
    const amountInKRW = expense.currency === 'KRW' ? expense.amount : expense.amount / rate;
    setBalance(prevBalance => prevBalance - amountInKRW);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-4">다국어 경비 트래커</h1>
      <p className="text-xl mb-4">잔액: {balance.toFixed(2)} KRW</p>
      <div className="mb-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="금액"
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="KRW">KRW</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </select>
      </div>
      <div className="mb-4">
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="설명"
          className="w-full p-2 border rounded"
        />
      </div>
      <button
        onClick={handleAddExpense}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        지출 추가
      </button>
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">지출 내역:</h2>
        {expenses.map((expense, index) => (
          <div key={index} className="mb-2">
            {expense.amount} {expense.currency} - {expense.description}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiCurrencyTable;
