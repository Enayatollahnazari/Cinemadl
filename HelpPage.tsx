import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const AccordionItem: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <details className="bg-primary/50 p-4 rounded-lg border border-slate-600 group">
        <summary className="font-bold text-lg text-text-light cursor-pointer list-none flex justify-between items-center">
            {title}
            <span className="transform transition-transform duration-300 group-open:rotate-180">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            </span>
        </summary>
        <div className="mt-4 pt-4 border-t border-slate-600 text-text-dark leading-relaxed">
            {children}
        </div>
    </details>
);

const HelpPage: React.FC = () => {
    return (
        <div className="bg-primary min-h-screen flex flex-col">
            <Header />
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-12">
                <div className="bg-secondary p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-accent mb-4">راهنمای سایت و سوالات متداول</h1>
                        <p className="text-text-light text-lg">
                            پاسخ سوالات خود را در اینجا بیابید و با نحوه استفاده از امکانات سایت آشنا شوید.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <AccordionItem title="چگونه در سایت ثبت‌نام کنم؟">
                           <p>
                                ثبت‌نام در سینما دانلود بسیار ساده و رایگان است. کافیست به صفحه <Link to="/register" className="text-accent hover:underline">ثبت‌نام</Link> مراجعه کرده، ایمیل و رمز عبور دلخواه خود را وارد کنید. پس از آن حساب کاربری شما ساخته شده و می‌توانید وارد سایت شوید.
                           </p>
                        </AccordionItem>

                        <AccordionItem title="چگونه اشتراک ویژه تهیه کنم؟">
                           <p>
                                برای دسترسی به محتوای ویژه و لینک‌های دانلود با کیفیت بالا، نیاز به اشتراک دارید. مراحل خرید اشتراک به شرح زیر است:
                                <ol className="list-decimal list-inside pr-4 mt-2 space-y-2">
                                    <li>به صفحه <Link to="/subscription" className="text-accent hover:underline">خرید اشتراک</Link> بروید و پلن مورد نظر خود را انتخاب کنید.</li>
                                    <li>مبلغ مشخص شده را به شماره حساب اعلام شده واریز نمایید.</li>
                                    <li>به صفحه <Link to="/support" className="text-accent hover:underline">پشتیبانی</Link> بروید و تصویر فیش واریزی را به همراه نام کاربری خود برای ما ارسال کنید.</li>
                                    <li>اشتراک شما در سریع‌ترین زمان ممکن فعال خواهد شد.</li>
                                </ol>
                           </p>
                        </AccordionItem>

                        <AccordionItem title="تفاوت لینک‌های دانلود عادی و ویژه (اشتراکی) چیست؟">
                            <p>
                                برخی از محتواها، به خصوص کیفیت‌های بالا (1080p, 4K) و دوبله‌های اختصاصی، تنها برای کاربرانی که اشتراک فعال دارند در دسترس هستند. این لینک‌ها با یک آیکون قفل مشخص شده‌اند. کاربران عادی همچنان می‌توانند به لینک‌های دانلود با کیفیت پایین‌تر به صورت رایگان دسترسی داشته باشند.
                            </p>
                        </AccordionItem>
                        
                         <AccordionItem title="فعال‌سازی اشتراک چقدر زمان می‌برد؟">
                            <p>
                                ما تمام تلاش خود را می‌کنیم تا پس از ارسال فیش واریزی، اشتراک شما را در کمتر از چند ساعت فعال کنیم. در صورت وجود هرگونه تاخیر، می‌توانید از طریق صفحه پشتیبانی با ما در تماس باشید.
                            </p>
                        </AccordionItem>

                        <AccordionItem title="اگر لینک دانلودی خراب بود چه کار کنم؟">
                            <p>
                                ما به طور مداوم لینک‌ها را بررسی می‌کنیم، اما در صورت مشاهده هرگونه لینک خراب یا مشکل‌دار، لطفا از طریق صفحه <Link to="/support" className="text-accent hover:underline">پشتیبانی</Link> به ما اطلاع دهید و عنوان فیلم یا سریال و لینک خراب را ذکر کنید تا در اسرع وقت مشکل را برطرف کنیم.
                            </p>
                        </AccordionItem>
                    </div>
                     <div className="border-t border-slate-600 mt-12 pt-8 text-center">
                        <h2 className="text-2xl font-semibold text-white mb-4">هنوز سوالی دارید؟</h2>
                        <p className="text-text-dark mb-6">
                            اگر پاسخ سوال خود را پیدا نکردید، تیم پشتیبانی ما آماده کمک به شماست.
                        </p>
                        <Link to="/support" className="bg-accent hover:bg-accent-hover text-primary font-bold py-3 px-8 rounded-md transition text-lg">
                            تماس با پشتیبانی
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default HelpPage;