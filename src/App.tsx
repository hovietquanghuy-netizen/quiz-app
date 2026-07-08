import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDeckStore, useSessionStore } from './store';
import { Navbar } from './components/Navbar';
import { DeckScreen } from './screens/DeckScreen';
import { ImportScreen } from './screens/ImportScreen';
import { ConfigScreen } from './screens/ConfigScreen';
import { QuizScreen } from './screens/QuizScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { HistoryScreen } from './screens/HistoryScreen';

// IndexedDB nạp bất đồng bộ: phải chờ hydrate xong mới render Routes,
// nếu không QuizScreen/ResultsScreen sẽ tưởng chưa có phiên thi và đá về trang chủ khi reload
const useStoresHydrated = () => {
  const [hydrated, setHydrated] = useState(
    () => useDeckStore.persist.hasHydrated() && useSessionStore.persist.hasHydrated()
  );

  useEffect(() => {
    const check = () => {
      if (useDeckStore.persist.hasHydrated() && useSessionStore.persist.hasHydrated()) {
        setHydrated(true);
      }
    };
    const unsub1 = useDeckStore.persist.onFinishHydration(check);
    const unsub2 = useSessionStore.persist.onFinishHydration(check);
    check();
    return () => { unsub1(); unsub2(); };
  }, []);

  return hydrated;
};

function App() {
  const hydrated = useStoresHydrated();

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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

