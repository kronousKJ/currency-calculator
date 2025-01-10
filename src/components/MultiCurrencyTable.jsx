import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MultiCurrencyTable = () => {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('KRW');
  const [toCurrency, setToCurrency] = useState('USD');
  const [exchangeRates, setExchangeRates] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get('https://quotation-api-cdn.dunamu.com/v1/forex/recent?codes=FRX.KRWUSD,FRX.KRWEUR,FRX.KRWGBP');
        if (response.data && response.data.length > 0) {
          const rates = {};
          response.data.forEach(item => {
            rates[item.currencyCode.replace('KRW', '')] = item.basePrice;
          });
          setExchangeRates(rates);
        }
      } catch (error) {
        console.error('환율 정보를 가져오는데 실패했습니다:', error);
      }
    };

    fetchExchangeRates();
  }, []);

  const handleConvert = () => {
    if (exchangeRates && amount) {
      if (fromCurrency === 'KRW') {
        setResult(parseFloat(amount) / exchangeRates[toCurrency]);
      } else if (toCurrency === 'KRW') {
        setResult(parseFloat(amount) * exchangeRates[fromCurrency]);
      } else {
        setResult((parseFloat(amount) * exchangeRates[fromCurrency]) / exchangeRates[toCurrency]);
      }
    }
  };

  const currencies = ['KRW', 'USD', 'EUR', 'GBP'];

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
            {currencies.map(currency => (
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
            {currencies.map(currency => (
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
      {Object.keys(exchangeRates).length > 0 && (
        <div className="mt-2 text-sm text-gray-600">
          현재 환율:<br />
          1 USD = {exchangeRates['USD'].toFixed(2)} KRW<br />
          1 EUR = {exchangeRates['EUR'].toFixed(2)} KRW<br />
          1 GBP = {exchangeRates['GBP'].toFixed(2)} KRW
        </div>
      )}
    </div>
  );
};

export default MultiCurrencyTable;
