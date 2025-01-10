import React, { useState } from 'react';

const MultiCurrencyTable = () => {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState(null);

  const currencies = ['USD', 'EUR', 'JPY', 'GBP', 'AUD', 'CAD', 'CHF', 'CNY', 'KRW'];

  const handleConvert = () => {
    // 여기에 실제 변환 로직을 구현합니다. 지금은 더미 데이터를 사용합니다.
    setResult(parseFloat(amount) * 0.85); // 예시: USD to EUR
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">통화 변환</h2>
      <div className="mb-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="금액 입력"
        />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2">From</label>
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2">To</label>
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
        </div>
      </div>
      <button
        onClick={handleConvert}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
      >
        변환
      </button>
      {result !== null && (
        <div className="mt-4 text-lg">
          결과: {amount} {fromCurrency} = {result.toFixed(2)} {toCurrency}
        </div>
      )}
    </div>
  );
};

export default MultiCurrencyTable;
