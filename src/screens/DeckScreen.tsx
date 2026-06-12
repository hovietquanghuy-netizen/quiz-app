import { useNavigate } from 'react-router-dom';
import { useDeckStore } from '../store';
import { MotionWrapper } from '../components/MotionWrapper';
import { downloadJson } from '../utils/io';
import type { Deck } from '../types';
import { Trash2, PlusCircle, PlayCircle, Download } from 'lucide-react';

export const DeckScreen = () => {
  const navigate = useNavigate();
  const { decks, removeDeck } = useDeckStore();

  // Xuất theo đúng schema import được, để backup/chia sẻ rồi nhập lại qua tab JSON
  const handleExportDeck = (deck: Deck) => {
    const exportData = {
      name: deck.name,
      questions: deck.questions.map(q => ({
        text: q.text,
        options: q.options.map(o => o.text),
        correctIndex: q.correctIndex
      }))
    };
    const safeName = deck.name.replace(/[^\p{L}\p{N}]+/gu, '_').slice(0, 50) || 'bai_thi';
    downloadJson(exportData, `${safeName}.json`);
  };

  return (
    <MotionWrapper>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold dark:text-white">Kho bài thi</h1>
        <button
          onClick={() => navigate('/import')}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <PlusCircle className="w-5 h-5" />
          <span className="hidden sm:inline">Thêm mới</span>
        </button>
      </div>

      {decks.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="text-gray-400 mb-4">
            <PlusCircle className="w-16 h-16 mx-auto opacity-50" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Chưa có bài thi nào</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
            Hãy bắt đầu bằng cách tải lên file JSON chứa danh sách câu hỏi của bạn.
          </p>
          <button
            onClick={() => navigate('/import')}
            className="text-primary-600 font-medium hover:underline"
          >
            Tải lên ngay →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {decks.map((deck) => (
            <div key={deck.id} className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col hover:shadow-md transition-shadow">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">{deck.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{deck.questions.length} câu hỏi • Ngày tạo: {new Date(deck.createdAt).toLocaleDateString('vi-VN')}</p>
              </div>
              <div className="flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-gray-700 mt-2">
                <button
                  onClick={() => navigate(`/config/${deck.id}`)}
                  className="flex-1 bg-primary-50 hover:bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:hover:bg-primary-900/50 dark:text-primary-300 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <PlayCircle className="w-5 h-5" />
                  Làm bài
                </button>
                <button
                  onClick={() => handleExportDeck(deck)}
                  title="Xuất file JSON để backup/chia sẻ"
                  className="p-3 text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-colors"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Bạn có chắc chắn muốn xoá bộ đề này?')) {
                      removeDeck(deck.id);
                    }
                  }}
                  className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </MotionWrapper>
  );
};
