import { Link, useLocation } from 'react-router-dom';
import { BookOpen, History, Upload } from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();
  const getNavClass = (path: string) => `flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-3 py-2 rounded-lg transition-colors ${location.pathname === path ? 'text-primary-600 dark:text-primary-400 sm:bg-primary-50 sm:dark:bg-primary-900/30 font-semibold' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 sm:hover:bg-gray-100 sm:dark:hover:bg-gray-800'}`;

  return (
    <nav className="w-full bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
          QuizApp
        </Link>
        <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-base font-medium">
          <Link to="/" className={getNavClass('/')}>
            <BookOpen className="w-5 h-5 sm:w-5 sm:h-5" />
            <span>Bài thi</span>
          </Link>
          <Link to="/import" className={getNavClass('/import')}>
            <Upload className="w-5 h-5 sm:w-5 sm:h-5" />
            <span>Thêm mới</span>
          </Link>
          <Link to="/history" className={getNavClass('/history')}>
            <History className="w-5 h-5 sm:w-5 sm:h-5" />
            <span>Lịch sử</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};
