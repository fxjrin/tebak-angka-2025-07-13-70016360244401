import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { backend } from 'declarations/backend';
import '/index.css';

const App = () => {
  const [status, setStatus] = useState("Tekan 'Mulai Game' untuk memulai!");
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [history, setHistory] = useState([]); // simpan tebakan user

  const handleStartGame = async () => {
    setIsLoading(true);
    try {
      await backend.generateAnswer();
      setGameStarted(true);
      setHistory([]);
      setStatus("Aku sudah memilih angka antara 1 sampai 100. Tebak sekarang!");
    } catch (e) {
      console.error(e);
      setStatus("Gagal memulai game. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || !gameStarted) return;

    const guessNum = parseInt(inputValue, 10);
    if (isNaN(guessNum) || guessNum < 1 || guessNum > 100) {
      setStatus("Masukkan angka valid antara 1–100!");
      return;
    }

    setInputValue('');
    setIsLoading(true);

    try {
      const result = await backend.guess(guessNum);
      setHistory(prev => [...prev, guessNum]);
      setStatus(result);
      if (result.includes("Benar")) {
        setGameStarted(false);
      }
    } catch (e) {
      console.error(e);
      setStatus("Gagal memeriksa jawaban!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-white p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl p-6 space-y-6">
        
        {/* Header */}
        <h1 className="text-2xl font-bold text-center text-blue-600">🎮 Tebak Angka AI</h1>

        {/* Status */}
        <div className="rounded-lg bg-gray-100 p-4 text-center text-gray-800 min-h-[60px] flex items-center justify-center">
          {status}
        </div>

        {/* Input dan tombol submit */}
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="number"
            placeholder="Tebakan (1–100)"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading || !gameStarted}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading || !gameStarted}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700 disabled:bg-blue-300 transition"
          >
            Kirim
          </button>
        </form>

        {/* Tombol mulai ulang */}
        <button
          onClick={handleStartGame}
          disabled={isLoading || gameStarted}
          className="w-full rounded-lg bg-green-500 py-3 text-white font-semibold hover:bg-green-600 disabled:bg-green-300 transition"
        >
          {gameStarted ? "Game Sedang Berjalan" : "Mulai Game"}
        </button>

        {/* History tebakan */}
        {history.length > 0 && (
          <div className="pt-2">
            <h2 className="text-gray-700 font-semibold mb-1">Tebakan kamu:</h2>
            <div className="flex flex-wrap gap-2">
              {history.map((num, idx) => (
                <div key={idx} className="rounded bg-blue-100 text-blue-800 px-3 py-1 text-sm">
                  {num}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default App;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
