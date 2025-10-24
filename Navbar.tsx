import React, { useContext, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppContext } from '../App';

const Navbar: React.FC = () => {
    const location = useLocation();
    const context = useContext(AppContext);

    const navLinks = useMemo(() => {
        const links = [
            { name: 'صفحه اصلی', path: '/' },
            { name: 'فیلم‌ها', path: '/movies' },
            { name: 'سریال‌ها', path: '/series' },
            { name: 'ژانرها', path: '/genres' },
        ];
        if (context?.currentUser) {
            links.push({ name: 'لیست تماشا', path: '/watchlist' });
        }
        links.push(
            { name: 'خرید اشتراک', path: '/subscription' },
            { name: 'درباره ما', path: '/about' },
            { name: 'راهنما', path: '/help' },
            { name: 'پشتیبانی', path: '/support' }
        );
        return links;
    }, [context?.currentUser]);


    const isActive = (path: string) => {
        // For the homepage, only be active on the exact path
        if (path === '/') {
            return location.pathname === '/';
        }
        // For other top-level links, check if the path starts with the link's path
        // This makes '/genres' active when on '/genres/action'
        return location.pathname.startsWith(path);
    };


    return (
        <nav className="bg-secondary shadow-md sticky top-20 z-40">
            <div className="container mx-auto px-4">
                 {/* On small screens, this container allows horizontal scrolling */}
                <div className="w-full overflow-x-auto">
                    <ul className="flex items-center justify-start md:justify-center space-x-2 space-x-reverse whitespace-nowrap py-1">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <Link
                                    to={link.path}
                                    className={`block py-3 px-4 font-semibold transition duration-200 ${
                                        isActive(link.path)
                                            ? 'text-accent border-b-2 border-accent'
                                            : 'text-text-dark hover:text-text-light'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;