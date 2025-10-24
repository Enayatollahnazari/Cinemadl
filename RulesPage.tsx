import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const RuleItem: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-primary/50 p-6 rounded-lg border border-slate-600">
        <h3 className="text-xl font-bold text-accent mb-3">{title}</h3>
        <div className="text-text-dark leading-relaxed space-y-2">{children}</div>
    </div>
);

const RulesPage: React.FC = () => {
    return (
        <div className="bg-primary min-h-screen flex flex-col">
            <Header />
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-12">
                <div className="bg-secondary p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-accent mb-4">قوانین و مقررات استفاده از سایت</h1>
                        <p className="text-text-light text-lg">
                            استفاده شما از خدمات سینما دانلود به منزله پذیرش کامل این قوانین است.
                        </p>
                    </div>

                    <div className="space-y-6 text-right">
                        <RuleItem title="۱. تعهدات کاربران">
                            <p>کاربران متعهد می‌شوند که از خدمات سایت برای مقاصد غیرقانونی استفاده نکنند. مسئولیت تمامی فعالیت‌هایی که از طریق حساب کاربری انجام می‌شود، بر عهده صاحب حساب است.</p>
                            <p>هر کاربر مجاز به داشتن یک حساب کاربری است و اشتراک خریداری شده تنها برای استفاده شخصی می‌باشد. به اشتراک‌گذاری حساب کاربری با دیگران ممنوع است.</p>
                        </RuleItem>

                        <RuleItem title="۲. شرایط اشتراک ویژه">
                            <p>هزینه اشتراک‌های خریداری شده غیرقابل استرداد است. لطفا قبل از خرید، از تصمیم خود اطمینان حاصل فرمایید.</p>
                            <p>فعال‌سازی اشتراک پس از ارسال فیش واریزی و تایید توسط تیم پشتیبانی انجام می‌شود. این فرآیند ممکن است چند ساعت زمان ببرد.</p>
                             <p>سینما دانلود این حق را برای خود محفوظ می‌دارد که در هر زمان قیمت‌ها و شرایط اشتراک را تغییر دهد. این تغییرات بر اشتراک‌های فعال تاثیری نخواهد داشت.</p>
                        </RuleItem>
                        
                        <RuleItem title="۳. محتوای سایت و حق کپی‌رایت">
                            <p>تمامی محتوای ارائه شده در این سایت (فیلم‌ها، سریال‌ها، دوبله‌ها و زیرنویس‌ها) متعلق به صاحبان اصلی آثار بوده و سینما دانلود صرفاً به عنوان یک آرشیو عمل می‌کند.</p>
                            <p>استفاده تجاری از محتوای سایت بدون کسب اجازه کتبی ممنوع است.</p>
                        </RuleItem>

                        <RuleItem title="۴. محدودیت مسئولیت">
                           <p>تیم سینما دانلود تمام تلاش خود را برای ارائه خدمات پایدار و بدون وقفه به کار می‌گیرد، اما هیچ تضمینی مبنی بر عدم وجود اختلالات موقت یا مشکلات فنی ارائه نمی‌دهد.</p>
                           <p>ما مسئولیتی در قبال محتوایی که کاربران در بخش نظرات منتشر می‌کنند، نداریم. با این حال، نظرات توهین‌آمیز یا ناقض قوانین حذف خواهند شد.</p>
                        </RuleItem>
                        
                        <RuleItem title="۵. تغییرات در قوانین">
                            <p>این قوانین ممکن است در طول زمان تغییر کنند. نسخه به‌روز شده همواره در همین صفحه در دسترس خواهد بود و ادامه استفاده شما از سایت به معنای پذیرش تغییرات جدید است.</p>
                        </RuleItem>
                    </div>
                     <div className="border-t border-slate-600 mt-12 pt-8 text-center">
                        <p className="text-text-dark">
                            در صورت داشتن هرگونه سوال یا ابهام در مورد این قوانین، لطفا با <Link to="/support" className="text-accent hover:underline">پشتیبانی</Link> تماس بگیرید.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default RulesPage;