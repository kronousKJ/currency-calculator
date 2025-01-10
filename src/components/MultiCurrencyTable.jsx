import React, { useState, useEffect } from 'react';

export const MultiCurrencyTable = () => {
  const [totalBudget, setTotalBudget] = useState('');
  const [exchangeRates, setExchangeRates] = useState({
    USD: '',
    EUR: ''
  });
  
  const [rows, setRows] = useState([
    { id: 1, amount: '', currency: 'KRW', description: '' }
  ]);

  const currencies = [
    { code: 'USD', name: '달러 (USD)' },
    { code: 'EUR', name: '유로 (EUR)' },
    { code: 'KRW', name: '원화 (KRW)' }
  ];

  // 로컬 스토리지에 데이터 저장
  useEffect(() => {
    const savedData = {
      totalBudget,
      exchangeRates,
      rows
    };
    localStorage.setItem('currencyCalculatorData', JSON.stringify(savedData));
  }, [totalBudget, exchangeRates, rows]);

  // 페이지 로드 시 저장된 데이터 불러오기
  useEffect(() => {
    const savedData = localStorage.getItem('currencyCalculatorData');
    if (savedData) {
      const { totalBudget, exchangeRates, rows } = JSON.parse(savedData);
      setTotalBudget(totalBudget);
      setExchangeRates(exchangeRates);
      setRows(rows);
    }
  }, []);

  // 원화로 환산
  const convertToKRW = (amount, currency) => {
    if (!amount) return 0;
    const numAmount = parseFloat(amount);
    
    switch(currency) {
      case 'USD':
        return numAmount * (parseFloat(exchangeRates.USD) || 0);
      case 'EUR':
        return numAmount * (parseFloat(exchangeRates.EUR) || 0);
      case 'KRW':
        return numAmount;
      default:
        return 0;
    }
  };

  // 총 사용금액 계산 (원화)
  const calculateTotalUsed = () => {
    return rows.reduce((sum, row) => {
      return sum + convertToKRW(row.amount, row.currency);
    }, 0);
  };

  // 남은 금액 계산
  const calculateRemaining = () => {
    return (parseFloat(totalBudget) || 0) - calculateTotalUsed();
  };

  // 행 추가
  const addRow = () => {
    const newRow = {
      id: Date.now(), // 고유 ID 생성
      amount: '',
      currency: 'KRW',
      description: ''
    };
    setRows([...rows, newRow]);
  };

  // 행 업데이트
  const updateRow = (rowId, field, value) => {
    setRows(rows.map(row => 
      row.id === rowId ? { ...row, [field]: value } : row
    ));
  };

  // 행 삭제
  const deleteRow = (id) => {
    setRows(rows.filter(row => row.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">다중 통화 예산 계산기</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium">총 예산 (원)</label>
            <input
              type="number"
              value={totalBudget}
              onChange={(e) => setTotalBudget(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="총 예산 입력"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">달러 환율 (USD)</label>
            <input
              type="number"
              value={exchangeRates.USD}
              onChange={(e) => setExchangeRates({...exchangeRates, USD: e.target.value})}
              className="w-full p-2 border rounded"
              placeholder="USD 환율 입력"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">유로 환율 (EUR)</label>
            <input
              type="number"
              value={exchangeRates.EUR}
              onChange={(e) => setExchangeRates({...exchangeRates, EUR: e.target.value})}
              className="w-full p-2 border rounded"
              placeholder="EUR 환율 입력"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 border">설명</th>
                <th className="p-2 border">통화</th>
                <th className="p-2 border">금액</th>
                <th className="p-2 border">원화 환산</th>
                <th className="p-2 border">남은 예산</th>
                <th className="p-2 border">작업</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => {
                const previousTotal = rows.slice(0, index).reduce(
                  (sum, r) => sum + convertToKRW(r.amount, r.currency), 0
                );
                const currentRowKRW = convertToKRW(row.amount, row.currency);
                const remaining = (parseFloat(totalBudget) || 0) - previousTotal - currentRowKRW;

                return (
                  <tr key={row.id}>
                    <td className="p-2 border">
                      <input
                        type="text"
                        value={row.description}
                        onChange={(e) => updateRow(row.id, 'description', e.target.value)}
                        className="w-full p-1 border rounded"
                        placeholder="설명 입력"
                      />
                    </td>
                    <td className="p-2 border">
                      <select
                        value={row.currency}
                        onChange={(e) => updateRow(row.id, 'currency', e.target.value)}
                        className="w-full p-1 border rounded"
                      >
                        {currencies.map(curr => (
                          <option key={curr.code} value={curr.code}>
                            {curr.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2 border">
                      <input
                        type="number"
                        value={row.amount}
                        onChange={(e) => updateRow(row.id, 'amount', e.target.value)}
                        className="w-full p-1 border rounded"
                        placeholder="금액 입력"
                      />
                    </td>
                    <td className="p-2 border text-right">
                      {currentRowKRW.toLocaleString()}원
                    </td>
                    <td className="p-2 border text-right">
                      {remaining.toLocaleString()}원
                    </td>
                    <td className="p-2 border text-center">
                      <button 
                        onClick={() => deleteRow(row.id)}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-gray-50 font-medium">
              <tr>
                <td colSpan="3" className="p-2 border text-right">총계:</td>
                <td className="p-2 border text-right">{calculateTotalUsed().toLocaleString()}원</td>
                <td className="p-2 border text-right">{calculateRemaining().toLocaleString()}원</td>
                <td className="p-2 border"></td>
              </tr>
            </tfoot>
          </table>
          
          <button 
            onClick={addRow}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            행 추가
          </button>
        </div>
      </div>
    </div>
  );
};
