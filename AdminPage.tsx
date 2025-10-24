import React from 'react';
import AdminPanel from '../components/AdminPanel';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../App';

const AdminPage: React.FC = () => {
    const context = React.useContext(AppContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        context?.logoutUser();
        navigate('/');
    };

    return (
        <div className="bg-primary min-h-screen p-4 sm:p-6 lg:p-8">
             <header className="flex justify-between items-center mb-6 pb-4 border-b border-secondary">
                <h1 className="text-3xl font-bold text-accent">داشبورد مدیریت</h1>
                <div>
                    <Link to="/" className="text-text-light hover:text-accent ml-4">مشاهده سایت</Link>
                    <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md text-sm transition">
                        خروج
                    </button>
                </div>
            </header>
            <AdminPanel />
        </div>
    );
};

export default AdminPage;