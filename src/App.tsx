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
    </div>
    </Router>
  )
}

export default App;

