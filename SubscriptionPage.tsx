import React from 'react';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const plans = [
    { duration: '۱ ماهه', price: '۱۵۰', pricePerMonth: '۱۵۰', bestValue: false },
    { duration: '۲ ماهه', price: '۲۸۰', pricePerMonth: '۱۴۰', bestValue: false },
    { duration: '۴ ماهه', price: '۵۴۰', pricePerMonth: '۱۳۵', bestValue: false },
    { duration: '۶ ماهه', price: '۷۸۰', pricePerMonth: '۱۳۰', bestValue: true },
    { duration: '۱ ساله', price: '۱۵۰۰', pricePerMonth: '۱۲۵', bestValue: false },
];


const SubscriptionPage: React.FC = () => {
    return (
        <div className="bg-primary min-h-screen flex flex-col">
            <Header />
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-12">
                <div className="bg-secondary p-6 sm:p-8 rounded-lg shadow-lg max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl font-bold text-accent mb-4">فعال‌سازی اشتراک ویژه</h1>
                    <p className="text-text-light mb-8 max-w-2xl mx-auto">
                        با خرید اشتراک ویژه به تمامی محتوای سایت بدون محدودیت دسترسی داشته باشید. پلن مورد نظر خود را انتخاب کنید.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
                        {plans.map((plan, index) => (
                            <div key={index} className={`relative bg-primary/50 border-2 rounded-lg p-6 flex flex-col text-center transition-all duration-300 transform hover:scale-105 ${plan.bestValue ? 'border-accent' : 'border-slate-600'}`}>
                                {plan.bestValue && <span className="absolute -top-3 right-1/2 translate-x-1/2 bg-accent text-primary text-xs font-bold px-3 py-1 rounded-full">مقرون به صرفه</span>}
                                <h2 className="text-2xl font-bold text-text-light">{plan.duration}</h2>
                                <p className="text-4xl font-bold text-accent my-4">{plan.price} <span className="text-lg text-text-dark">افغانی</span></p>
                                <p className="text-sm text-text-dark mb-6">ماهانه {plan.pricePerMonth} افغانی</p>
                                <div className="flex-grow"></div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-primary/50 border border-slate-600 rounded-lg p-6 my-8 space-y-4 text-right">
                        <h3 className="text-xl font-bold text-center mb-4 text-accent">راهنمای فعال‌سازی</h3>
                        <p>۱. مبلغ پلن مورد نظر خود را به شماره کارت زیر واریز کنید:</p>
                        <div className="bg-slate-800 p-4 rounded-md text-center font-mono tracking-wider text-lg">
                            XXXX-XXXX-XXXX-XXXX
                        </div>
                        <p className="mt-2 text-center text-sm text-text-dark">(به نام: مدیریت سینما دانلود)</p>
                        <p>۲. پس از واریز، روی دکمه زیر کلیک کرده و تصویر فیش پرداختی را به همراه نام کاربری و <span className="font-bold text-accent">پلن انتخابی</span> خود برای ما ارسال کنید.</p>
                        <p>۳. اشتراک شما در اسرع وقت فعال خواهد شد.</p>
                    </div>
                    
                    <Link 
                        to="/support"
                        className="w-full block bg-accent hover:bg-accent-hover text-primary font-bold py-3 px-6 rounded-md transition text-lg"
                    >
                        ارسال فیش و فعال‌سازی اشتراک
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default SubscriptionPage;