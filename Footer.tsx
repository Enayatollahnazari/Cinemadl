import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { InstagramIcon, TelegramIcon } from './icons';

const Footer: React.FC = () => {
    return (
        <footer className="bg-secondary border-t border-slate-600 mt-12">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-right">
                    {/* Logo and Social */}
                    <div>
                        <Link to="/" className="inline-block mb-4">
                            <Logo className="h-12 w-auto mx-auto md:mx-0" />
                        </Link>
                        <div className="flex justify-center md:justify-start items-center gap-4">
                            <a href="https://t.me/Cinemadl_af" target="_blank" rel="noopener noreferrer" className="text-text-dark hover:text-white transition">
                                <TelegramIcon className="w-8 h-8" />
                            </a>
                            <a href="https://instagram.com/Cinemadl_af" target="_blank" rel="noopener noreferrer" className="text-text-dark hover:text-white transition">
                                <InstagramIcon className="w-8 h-8" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-lg text-text-light mb-4">لینک‌های سریع</h3>
                        <ul className="space-y-2">
                            <li><Link to="/" className="text-text-dark hover:text-accent transition">صفحه اصلی</Link></li>
                            <li><Link to="/movies" className="text-text-dark hover:text-accent transition">فیلم‌ها</Link></li>
                            <li><Link to="/series" className="text-text-dark hover:text-accent transition">سریال‌ها</Link></li>
                            <li><Link to="/subscription" className="text-text-dark hover:text-accent transition">خرید اشتراک</Link></li>
                        </ul>
                    </div>

                    {/* About Us */}
                    <div>
                        <h3 className="font-bold text-lg text-text-light mb-4">درباره ما</h3>
                        <ul className="space-y-2">
                            <li><Link to="/about" className="text-text-dark hover:text-accent transition">درباره سینما دانلود</Link></li>
                            <li><Link to="/support" className="text-text-dark hover:text-accent transition">پشتیبانی</Link></li>
                            <li><Link to="/rules" className="text-text-dark hover:text-accent transition">قوانین و مقررات</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-slate-600 mt-8 pt-6 text-center text-text-dark text-sm">
                    <p>&copy; {new Date().getFullYear()} تمامی حقوق برای سینما دانلود محفوظ است.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;