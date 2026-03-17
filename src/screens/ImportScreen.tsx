import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeckStore } from '../store';
import { parseDeck, parseTextToDeck } from '../utils/parser';
import { importJson } from '../utils/io';
import { MotionWrapper } from '../components/MotionWrapper';
import { UploadCloud, CheckCircle2, AlertCircle, FileText, Code } from 'lucide-react';

export const ImportScreen = () => {
  const navigate = useNavigate();
  const { addDeck } = useDeckStore();
  
  const [activeTab, setActiveTab] = useState<'text' | 'json'>('text');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [rawText, setRawText] = useState('');
  const [deckName, setDeckName] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleJsonUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const jsonData = await importJson(file);
      const deck = parseDeck(jsonData);
      addDeck(deck);
      setSuccess(`Nhập thành công JSON: "${deck.name}" (${deck.questions.length} câu)`);
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
      // reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleTextImport = () => {
    if (!rawText.trim()) {
       setError('Vui lòng dán văn bản vô khung mẫu.');
       return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
       const deck = parseTextToDeck(rawText, deckName.trim());
       addDeck(deck);
       setSuccess(`Tạo thành công: "${deck.name}" (${deck.questions.length} câu)`);
       setTimeout(() => navigate('/'), 1500);
    } catch (err) {
       setError((err as Error).message);
    } finally {
       setLoading(false);
    }
  };

  return (
    <MotionWrapper>
      <h1 className="text-2xl font-bold dark:text-white mb-6">Thêm bài thi mới</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-8">
        {/* Tabs */}
        <div className="flex border-b border-gray-100 dark:border-gray-700 font-medium">
          <button 
            onClick={() => { setActiveTab('text'); setError(null); }}
            className={`flex-1 py-4 flex items-center justify-center gap-2 ${activeTab === 'text' ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50/50 dark:bg-primary-900/20' : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'}`}
          >
            <FileText className="w-5 h-5" /> Copy & Paste chữ
          </button>
          <button 
             onClick={() => { setActiveTab('json'); setError(null); }}
             className={`flex-1 py-4 flex items-center justify-center gap-2 ${activeTab === 'json' ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50/50 dark:bg-primary-900/20' : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'}`}
          >
            <Code className="w-5 h-5" /> Tải lên JSON
          </button>
        </div>

        <div className="p-6 sm:p-8">
          
          {activeTab === 'text' && (
             <div className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tên bài thi (Không bắt buộc)</label>
                  <input
                    type="text"
                    value={deckName}
                    onChange={(e) => setDeckName(e.target.value)}
                    placeholder="VD: Kiểm tra Hoá Học lần 1"
                    className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                   Nội dung trắc nghiệm (Mỗi câu 1 dòng)
                 </label>
                 <textarea
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    placeholder="Cấu trúc hóa học của thuốc tê gồm những thành phần nào? A. Nhân thơm, nhóm amin và nhóm trung gian (Correct). B. Nhân thơm và nhóm acid. C. Nhóm amin và chuỗi peptide. D. Nhóm este và nhóm amid."
                    className="w-full h-48 p-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                 />
                 <p className="text-xs text-gray-500 mt-2">Định dạng chuẩn: Nội dung câu hỏi... A. Đáp án 1 B. Đáp án 2 (Correct) C. Đáp án 3 D. Đáp án 4</p>
               </div>
               <button
                  onClick={handleTextImport}
                  disabled={loading || !rawText.trim()}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white py-3 rounded-xl font-medium transition-colors"
                >
                  {loading ? 'Đang phân tích...' : 'Tạo Bài Thi'}
                </button>
             </div>
          )}

          {activeTab === 'json' && (
             <div className="text-center py-8">
                <UploadCloud className="w-16 h-16 text-primary-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2 dark:text-white">Tải lên định dạng JSON rành mạch</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                  Sử dụng file JSON nếu bạn có cấu trúc bài thi cực lớn được xuất ra từ hệ thống từ trước.
                </p>
                <input 
                  type="file" 
                  accept=".json" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleJsonUpload}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                  className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-medium"
                >
                  {loading ? 'Đang xử lý...' : 'Chọn file JSON'}
                </button>
             </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center gap-2 rounded-xl text-sm font-medium">
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <span className="text-left leading-tight">{error}</span>
            </div>
          )}

          {success && (
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 flex items-center justify-center gap-2 rounded-xl text-sm font-medium">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span className="text-left">{success}</span>
            </div>
          )}
        </div>
      </div>
      
    </MotionWrapper>
  );
};
