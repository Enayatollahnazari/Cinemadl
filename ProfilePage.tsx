import React, { useContext } from 'react';
import Header from '../components/Header';
import { AppContext } from '../App';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const ProfilePage: React.FC = () => {
    const context = useContext(AppContext);
    const navigate = useNavigate();

    if (!context || !context.currentUser) {
        // This should be handled by the protected route, but as a fallback
        navigate('/login');
        return null;
    }

    const { currentUser } = context;

    return (
        <div className="bg-primary min-h-screen flex flex-col">
            <Header />
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-12">
                 <div className="bg-secondary p-8 rounded-lg shadow-lg max-w-md mx-auto">
                    <h1 className="text-3xl font-bold text-center text-accent mb-6">پروفایل کاربری</h1>
                    <div className="space-y-4 text-lg">
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-text-dark">نام کاربری:</span>
                            <span className="text-text-light">{currentUser.username}</span>
                        </div>
                        <div className="flex justify-between items-center">
                             <span className="font-semibold text-text-dark">وضعیت اشتراک:</span>
                             {currentUser.subscriptionActive ? (
                                <span className="bg-green-500/20 text-green-400 font-bold px-3 py-1 rounded-full text-sm">فعال</span>
                             ) : (
                                <span className="bg-red-500/20 text-red-400 font-bold px-3 py-1 rounded-full text-sm">غیرفعال</span>
                             )}
                        </div>
                        {currentUser.subscriptionActive && currentUser.subscriptionEndDate && (
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-text-dark">تاریخ انقضا:</span>
                                <span className="text-text-light font-mono text-base">
                                    {new Date(currentUser.subscriptionEndDate).toLocaleDateString('fa-IR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                        )}
                    </div>
                    {!currentUser.subscriptionActive && (
                        <div className="border-t border-slate-600 mt-8 pt-6 text-center">
                            <p className="text-text-light mb-4">برای دسترسی به محتوای ویژه، اشتراک خود را فعال کنید.</p>
                            <Link to="/subscription" className="bg-accent hover:bg-accent-hover text-primary font-bold py-2 px-6 rounded-md transition">
                                خرید اشتراک
                            </Link>
                        </div>
                    )}
                 </div>
            </main>
            <Footer />
        </div>
    );
};

export default ProfilePage;