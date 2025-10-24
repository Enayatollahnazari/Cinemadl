import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import type { Movie } from '../types';
import MovieForm from './MovieForm';
import UserManagement from './UserManagement';
import DashboardAnalytics from './DashboardAnalytics';
import SupportMessages from './SupportMessages';

type AdminTab = 'dashboard' | 'content' | 'users' | 'messages';

const AdminPanel: React.FC = () => {
    const context = useContext(AppContext);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
    const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

    if (!context) return <div>در حال بارگذاری کانتکست...</div>;

    const { movies, series, deleteMovie, supportMessages, users } = context;
    const allContent = [...movies, ...series];

    const handleAddNew = () => {
        setEditingMovie(null);
        setIsFormOpen(true);
    };

    const handleEdit = (movie: Movie) => {
        setEditingMovie(movie);
        setIsFormOpen(true);
    };

    const handleDelete = (id: string, type: 'Movie' | 'Series') => {
        if (window.confirm('آیا از حذف این مورد اطمینان دارید؟')) {
            deleteMovie(id, type);
        }
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingMovie(null);
    };

    const unreadMessagesCount = supportMessages.filter(m => !m.isResolved).length;

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                 <div className="w-full overflow-x-auto border-b border-secondary">
                    <div className="flex whitespace-nowrap">
                        <button 
                            onClick={() => setActiveTab('dashboard')}
                            className={`py-2 px-4 text-lg font-semibold transition ${activeTab === 'dashboard' ? 'border-b-2 border-accent text-accent' : 'text-text-dark hover:text-text-light'}`}
                        >
                            داشبورد
                        </button>
                        <button 
                            onClick={() => setActiveTab('content')}
                            className={`py-2 px-4 text-lg font-semibold transition ${activeTab === 'content' ? 'border-b-2 border-accent text-accent' : 'text-text-dark hover:text-text-light'}`}
                        >
                            مدیریت محتوا
                        </button>
                        <button 
                            onClick={() => setActiveTab('users')}
                            className={`py-2 px-4 text-lg font-semibold transition ${activeTab === 'users' ? 'border-b-2 border-accent text-accent' : 'text-text-dark hover:text-text-light'}`}
                        >
                            مدیریت کاربران
                        </button>
                         <button 
                            onClick={() => setActiveTab('messages')}
                            className={`py-2 px-4 text-lg font-semibold transition relative ${activeTab === 'messages' ? 'border-b-2 border-accent text-accent' : 'text-text-dark hover:text-text-light'}`}
                        >
                            پیام‌ها
                            {unreadMessagesCount > 0 && (
                                <span className="absolute top-1 right-0 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {unreadMessagesCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {activeTab === 'content' && (
                     <button
                        onClick={handleAddNew}
                        className="bg-accent hover:bg-accent-hover text-primary font-bold py-2 px-4 rounded-md transition flex-shrink-0"
                    >
                        افزودن محتوای جدید
                    </button>
                )}
            </div>

            {isFormOpen && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-secondary rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                       <MovieForm existingMovie={editingMovie} onFormClose={closeForm} />
                    </div>
                </div>
            )}
            
            {activeTab === 'dashboard' && <DashboardAnalytics allContent={allContent} users={users} />}

            {activeTab === 'content' && (
                <div className="bg-secondary rounded-lg shadow-lg overflow-x-auto">
                    <table className="w-full min-w-[600px] text-right">
                        <thead className="bg-primary/50">
                            <tr>
                                <th className="p-4">پوستر</th>
                                <th className="p-4">عنوان</th>
                                <th className="p-4">سال</th>
                                <th className="p-4">نوع</th>
                                <th className="p-4">عملیات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allContent.map(movie => (
                                <tr key={movie.id} className="border-b border-secondary hover:bg-primary/30">
                                    <td className="p-2"><img src={movie.posterUrl} alt={movie.title} className="w-12 h-16 object-cover rounded"/></td>
                                    <td className="p-4 font-semibold">{movie.title}</td>
                                    <td className="p-4">{movie.year}</td>
                                    <td className="p-4"><span className={`px-2 py-1 text-xs rounded-full ${movie.type === 'Movie' ? 'bg-blue-600' : 'bg-purple-600'}`}>{movie.type === 'Movie' ? 'فیلم' : 'سریال'}</span></td>
                                    <td className="p-4 space-x-2 whitespace-nowrap">
                                        <button onClick={() => handleEdit(movie)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">ویرایش</button>
                                        <button onClick={() => handleDelete(movie.id, movie.type)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm">حذف</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {activeTab === 'users' && <UserManagement />}
            {activeTab === 'messages' && <SupportMessages />}
        </div>
    );
};

export default AdminPanel;