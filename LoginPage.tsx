import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../App';
import { Logo } from '../components/Logo';
import { AuthApiError } from '@supabase/supabase-js';


const LoginPage: React.FC = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const context = useContext(AppContext);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!context) return;

        setIsLoading(true);
        setError('');

        let loginEmail = identifier;
        if (identifier === 'Enayatollah') {
            loginEmail = 'Enayatollaharashi@gmail.com';
        } else if (!identifier.includes('@')) {
            loginEmail = `${identifier.toLowerCase().replace(/\s/g, '_')}@cinemadownload.app`;
        }


        try {
            const loggedInUser = await context.loginUser(loginEmail, password);
            if (loggedInUser.username === 'Enayatollah') {
                navigate('/admin');
            } else {
                navigate('/profile');
            }
        } catch (loginErr: any) {
             if (loginErr instanceof AuthApiError) {
                if (loginErr.message === 'Invalid login credentials') {
                    setError('ایمیل/نام کاربری یا رمز عبور نامعتبر است.');
                } else if (loginErr.message === 'Email not confirmed') {
                    setError('حساب کاربری شما هنوز تایید نشده است. لطفا ایمیل خود را برای لینک تایید بررسی کنید.');
                } else if (loginErr.message.includes('For security purposes')) {
                    setError('تلاش‌های ورود بیش از حد مجاز است. لطفاً یک دقیقه صبر کرده و دوباره تلاش کنید.');
                } else {
                    setError(`خطا: ${loginErr.message}`);
                }
             } else {
                setError('یک خطای ناشناخته رخ داد. لطفا دوباره تلاش کنید.');
                console.error("Login error:", loginErr);
             }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-primary p-4">
            <div className="bg-secondary p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm">
                 <Link to="/" className="flex justify-center mb-6">
                    <Logo className="h-12 w-auto" />
                </Link>
                <h1 className="text-2xl font-bold text-center text-text-light mb-6">ورود به حساب کاربری</h1>
                {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-md mb-4 text-sm">{error}</p>}
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-text-light mb-1">نام کاربری یا ایمیل</label>
                        <input
                            type="text"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            className="w-full bg-primary border border-slate-600 rounded-md px-3 py-2 text-text-light focus:outline-none focus:ring-2 focus:ring-accent"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-light mb-1">رمز عبور</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-primary border border-slate-600 rounded-md px-3 py-2 text-text-light focus:outline-none focus:ring-2 focus:ring-accent"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-accent hover:bg-accent-hover text-primary font-bold py-2 px-4 rounded-md transition disabled:bg-slate-500 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'در حال ورود...' : 'ورود'}
                    </button>
                </form>
                <p className="text-center text-sm text-text-dark mt-6">
                    حساب کاربری ندارید؟ <Link to="/register" className="text-accent hover:underline font-semibold">ثبت‌نام کنید</Link>
                </p>
                <div className="border-t border-slate-600 mt-6 pt-4 text-center">
                    <Link to="/" className="text-sm text-text-dark hover:text-accent transition">
                        &larr; بازگشت به سایت
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;