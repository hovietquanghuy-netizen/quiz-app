import { useNavigate } from 'react-router-dom';
import { useHistoryStore } from '../store';
import { MotionWrapper } from '../components/MotionWrapper';
import { downloadJson } from '../utils/io';
import { Trash2, Download, History as HistoryIcon } from 'lucide-react';

export const HistoryScreen = () => {
  const navigate = useNavigate();
  const { results, removeResult, clearHistory } = useHistoryStore();

  const handleExport = () => {
    downloadJson(results, `history_export_${Date.now()}.json`);
  };

  return (
    <MotionWrapper>
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
            <HistoryIcon className="w-6 h-6 text-primary-500" />
            Lịch sử thi
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Danh sách tất cả các bài thi đã hoàn thành.</p>
        </div>
        <div className="flex items-center gap-2">
          {results.length > 0 && (
             <>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                >
                  <Download className="w-4 h-4" /> Xuất JSON
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Xóa toàn bộ lịch sử?')) clearHistory();
                  }}
                  className="flex items-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                >
                  <Trash2 className="w-4 h-4" /> Xóa tất cả
                </button>
             </>
          )}
        </div>
      </div>

      {results.length === 0 ? (
         <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
           <div className="text-gray-400 mb-4">
             <HistoryIcon className="w-16 h-16 mx-auto opacity-30" />
           </div>
           <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Chưa có lịch sử làm bài</h2>
           <p className="text-gray-500 dark:text-gray-400 mb-6">Bạn chưa hoàn thành bài thi nào ở chế độ Exam. Hãy làm một bài thi để lưu lại kết quả nhé!</p>
           <button onClick={() => navigate('/')} className="text-primary-600 font-medium hover:underline">Về kho bài thi →</button>
         </div>
      ) : (
         <div className="space-y-4">
           {results.map((req) => {
             const m = Math.floor(req.timeTaken / 60);
             const s = req.timeTaken % 60;
             const timeStr = `${m}p${s}s`;
             const percent = Math.round((req.score / req.total) * 100);

             return (
               <div key={req.id} className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">{req.deckName || 'Bài thi không tên'}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                       <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">{new Date(req.date).toLocaleString('vi-VN')}</span>
                       <span>⏱ {timeStr}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 sm:gap-6 border-t sm:border-t-0 border-gray-100 dark:border-gray-700 pt-4 sm:pt-0">
                     <div className="text-center">
                       <div className="text-xs font-medium text-gray-400 mb-1">Điểm số</div>
                       <div className="font-bold text-lg text-gray-900 dark:text-white">{req.score}/{req.total}</div>
                     </div>
                     <div className="text-center">
                       <div className="text-xs font-medium text-gray-400 mb-1">Tỷ lệ</div>
                       <div className={`font-bold text-lg ${percent >= 80 ? 'text-green-500' : percent >= 50 ? 'text-orange-500' : 'text-red-500'}`}>{percent}%</div>
                     </div>
                     <button
                       onClick={() => req.id && removeResult(req.id)}
                       className="p-2 ml-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                     >
                       <Trash2 className="w-5 h-5" />
                     </button>
                  </div>
               </div>
             );
           })}
         </div>
      )}
    </MotionWrapper>
  );
};
