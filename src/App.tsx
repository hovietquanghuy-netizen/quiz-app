import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { DeckScreen } from './screens/DeckScreen';
import { ImportScreen } from './screens/ImportScreen';
import { ConfigScreen } from './screens/ConfigScreen';
import { QuizScreen } from './screens/QuizScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { HistoryScreen } from './screens/HistoryScreen';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col w-full">
      <Navbar />
      <main className="flex-1 w-full bg-gray-50 dark:bg-gray-900 transition-colors">
        <Routes>
          <Route path="/" element={<DeckScreen />} />
          <Route path="/import" element={<ImportScreen />} />
          <Route path="/config/:deckId" element={<ConfigScreen />} />
          <Route path="/quiz" element={<QuizScreen />} />
          <Route path="/results/:deckId" element={<ResultsScreen />} />
          <Route path="/history" element={<HistoryScreen />} />
        </Routes>
      </main>
      
      <footer className="w-full bg-white dark:bg-gray-900 py-4 border-t border-gray-200 dark:border-gray-800 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium tracking-wide">
          Design by <span className="text-primary-600 font-bold">HoVietQuangHuy</span>, build by <span className="text-indigo-600 font-bold">AntiGravity</span>
        </p>
      </footer>
    </div>
    </Router>
  )
}

export default App;

