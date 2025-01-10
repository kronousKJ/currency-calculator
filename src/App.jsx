import React from 'react';
import MultiCurrencyTable from './components/MultiCurrencyTable';

function App() {
  return (
    <div className="App">
      <header className="header">
        <h1 className="text-2xl font-bold">통화 변환기</h1>
      </header>
      <main className="main-content">
        <div className="converter">
          <MultiCurrencyTable />
        </div>
      </main>
      <footer className="footer">
        <p>&copy; 2025 통화 변환기. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
