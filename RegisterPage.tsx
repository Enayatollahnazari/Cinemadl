import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../App';
import { Logo } from '../components/Logo';
import { AuthApiError } from '@supabase/supabase-js';

const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const context = useContext(AppContext);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!context) return;
        
        if (password.length < 6) {
             setError('رمز عبور باید حداقل ۶ کاراکتر باشد.');
            return;
        }
        
        setIsLoading(true);
        setError('');

        try {
            await context.registerUser(username, email, password);
            setIsRegistered(true);
        } catch (err: any) {
             if (err instanceof AuthApiError) {
                if (err.message === "این نام کاربری قبلا استفاده شده است.") {
                    setError(err.message);
                } else if (err.message.includes('email rate limit exceeded')) {
                    setError('تعداد درخواست بیش از حد مجاز است. لطفا بعدا تلاش کنید.');
                } else if (err.message.includes('User already registered')) {
                    setError('این ایمیل قبلا ثبت شده است.');
                } else if (err.message.includes('For security purposes')) {
                    setError('درخواست شما بیش از حد مجاز است. لطفاً یک دقیقه صبر کرده و دوباره تلاش کنید.');
                } else if (err.message.includes('Password should be at least 6 characters')) {
                    setError('رمز عبور باید حداقل ۶ کاراکتر باشد.');
                } else {
                     setError(`خطا در ثبت‌نام: ${err.message}`);
                }
            } else {
                setError(`یک خطای ناشناخته رخ داد. لطفا دوباره تلاش کنید.`);
                console.error("Registration error:", err);
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (isRegistered) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-primary p-4">
                <div className="bg-secondary p-8 rounded-lg shadow-lg w-full max-w-sm text-center">
                    <Link to="/" className="flex justify-center mb-6">
                        <Logo className="h-12 w-auto" />
                    </Link>
                    <h1 className="text-2xl font-bold text-accent mb-4">ثبت‌نام موفقیت‌آمیز بود!</h1>
                    <p className="text-text-light mb-6">
                        {email 
                            ? <>یک ایمیل حاوی لینک تایید به آدرس <span className="font-mono text-accent">{email}</span> ارسال شد. لطفاً برای فعال‌سازی حساب کاربری خود، روی لینک کلیک کنید.</>
                            : "حساب کاربری شما با موفقیت ساخته شد."
                        }
                    </p>
                    <p className="text-sm text-text-dark">
                         {email
                            ? "پس از تایید، می‌توانید وارد حساب خود شوید."
                            : "اکنون می‌توانید وارد حساب خود شوید."
                        }
                    </p>
                    <div className="mt-8">
                        <Link to="/login" className="bg-accent hover:bg-accent-hover text-primary font-bold py-2 px-6 rounded-md transition">
                            رفتن به صفحه ورود
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-primary p-4">
            <div className="bg-secondary p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm">
                <Link to="/" className="flex justify-center mb-6">
                    <Logo className="h-12 w-auto" />
                </Link>
                <h1 className="text-2xl font-bold text-center text-text-light mb-6">ایجاد حساب کاربری جدید</h1>
                {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-md mb-4 text-sm">{error}</p>}
                <form onSubmit={handleRegister} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-text-light mb-1">نام کاربری</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-primary border border-slate-600 rounded-md px-3 py-2 text-text-light focus:outline-none focus:ring-2 focus:ring-accent"
                            required
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-text-light mb-1">ایمیل (اختیاری)</label>
                        <p className="text-xs text-text-dark mb-2">برای امکان بازیابی رمز عبور، ایمیل خود را وارد کنید.</p>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-primary border border-slate-600 rounded-md px-3 py-2 text-text-light focus:outline-none focus:ring-2 focus:ring-accent"
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
                        {isLoading ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
                    </button>
                </form>
                 <p className="text-center text-sm text-text-dark mt-6">
                    قبلا ثبت‌نام کرده‌اید؟ <Link to="/login" className="text-accent hover:underline font-semibold">وارد شوید</Link>
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

export default RegisterPage;