import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserIcon, SearchIcon } from './icons';
import { AppContext } from '../App';
import { Logo } from './Logo';

const Header: React.FC = () => {
    const context = useContext(AppContext);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const handleLogout = () => {
        if (context) {
            context.logoutUser();
            navigate('/');
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/?q=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm('');
        }
    };

    return (
        <header className="bg-primary/80 backdrop-blur-md sticky top-0 z-50 border-b border-secondary">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20 gap-4">
                    {/* Right side: Logo */}
                    <div className="flex items-center gap-6 flex-shrink-0">
                        <Link to="/" className="flex-shrink-0">
                            <Logo className="h-10 w-auto" />
                        </Link>
                    </div>

                    {/* Middle: Search bar */}
                    <div className="flex-grow flex justify-center px-4">
                        <form onSubmit={handleSearch} className="w-full max-w-md relative">
                            <input
                                type="text"
                                placeholder="جستجو..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-secondary border border-slate-600 rounded-full px-5 py-2 text-text-light focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                            <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dark hover:text-accent transition">
                                <SearchIcon className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                    
                    {/* Left side: User actions */}
                    <div className="flex items-center flex-shrink-0">
                        {context?.currentUser ? (
                            <div className="flex items-center space-x-2 space-x-reverse">
                                {context.currentUser.username === 'Enayatollah' && (
                                     <Link to="/admin" className="bg-secondary hover:bg-slate-600 text-text-light font-bold py-2 px-4 rounded-full text-sm transition whitespace-nowrap hidden sm:block">
                                        پنل مدیریت
                                    </Link>
                                )}
                                <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-full text-sm transition whitespace-nowrap">
                                    خروج
                                </button>
                                <Link to={context.currentUser.username === 'Enayatollah' ? '/admin' : '/profile'} className="flex items-center bg-secondary p-2 rounded-full hover:bg-slate-600">
                                    <UserIcon className="w-6 h-6" />
                                </Link>
                            </div>
                        ) : (
                             <Link to="/login" className="bg-accent hover:bg-accent-hover text-primary font-bold py-2 px-4 sm:px-6 rounded-full text-sm transition whitespace-nowrap">
                                ورود / ثبت‌نام
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;