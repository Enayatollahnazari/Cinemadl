import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { InstagramIcon, TelegramIcon } from '../components/icons';
import Navbar from '../components/Navbar';

const FeatureCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-primary/50 p-6 rounded-lg border border-slate-600">
        <h3 className="text-xl font-bold text-accent mb-3">{title}</h3>
        <p className="text-text-dark leading-relaxed">{children}</p>
    </div>
);

const AboutPage: React.FC = () => {
    return (
        <div className="bg-primary min-h-screen flex flex-col">
            <Header />
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-12">
                <div className="bg-secondary p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-accent mb-4">درباره سینما دانلود</h1>
                        <p className="text-text-light text-lg mb-6">
                            به سینما دانلود خوش آمدید! مرجع شما برای دنیایی از فیلم و سریال.
                        </p>
                        <p className="text-text-dark leading-relaxed mb-12">
                            ما یک تیم علاقه‌مند به سینما هستیم که با هدف ایجاد یک پلتفرم جامع و کاربرپسند برای دسترسی به جدیدترین فیلم‌ها و سریال‌های روز دنیا گرد هم آمده‌ایم. ما معتقدیم که هنر هفتم باید برای همه قابل دسترس باشد و تلاش می‌کنیم تا با ارائه آرشیوی غنی و به‌روز، تجربه‌ای لذت‌بخش از دنیای سینما و تلویزیون را برای شما به ارمغان بیاوریم.
                        </p>
                    </div>

                    <div className="space-y-8 mb-12 text-right">
                         <div className="border-t border-slate-600 pt-8">
                             <h2 className="text-3xl font-bold text-white mb-6 text-center">ماموریت و چشم‌انداز ما</h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="bg-primary/50 p-6 rounded-lg">
                                    <h3 className="text-2xl font-semibold text-accent mb-3">هدف ما</h3>
                                    <p className="text-text-dark leading-relaxed">
                                        هدف اصلی ما در سینما دانلود، ارائه دسترسی آسان، سریع و باکیفیت به مجموعه‌ای کامل از فیلم‌ها و سریال‌های ایرانی و خارجی، همراه با دوبله فارسی و زیرنویس دقیق است. ما می‌خواهیم هر کاربر، با هر سلیقه‌ای، بتواند محتوای مورد علاقه خود را به راحتی پیدا کرده و از تماشای آن لذت ببرد.
                                    </p>
                                </div>
                                <div className="bg-primary/50 p-6 rounded-lg">
                                     <h3 className="text-2xl font-semibold text-accent mb-3">چشم‌انداز ما</h3>
                                    <p className="text-text-dark leading-relaxed">
                                        ما در تلاشیم تا به معتبرترین و محبوب‌ترین مرجع فیلم و سریال برای فارسی‌زبانان در سراسر جهان، به ویژه در افغانستان، تبدیل شویم. با بهبود مستمر پلتفرم و افزودن قابلیت‌های جدید، قصد داریم تجربه‌ی کاربری بی‌نظیری را برای مخاطبان خود رقم بزنیم.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-600 pt-8">
                             <h2 className="text-3xl font-bold text-white mb-6 text-center">چرا سینما دانلود؟</h2>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FeatureCard title="آرشیو کامل و به‌روز">
                                    تیم ما بی‌وقفه تلاش می‌کند تا جدیدترین عناوین را در کوتاه‌ترین زمان ممکن به آرشیو سایت اضافه کند.
                                </FeatureCard>
                                 <FeatureCard title="کیفیت‌های متنوع">
                                    ما محتوا را در کیفیت‌های مختلف، از موبایل تا 4K، ارائه می‌دهیم تا شما بهترین تجربه را متناسب با سرعت اینترنت خود داشته باشید.
                                </FeatureCard>
                                 <FeatureCard title="دوبله و زیرنویس فارسی">
                                    اهمیت زیادی به ارائه دوبله‌های باکیفیت و زیرنویس‌های هماهنگ و دقیق برای رضایت هرچه بیشتر شما می‌دهیم.
                                </FeatureCard>
                                 <FeatureCard title="پشتیبانی پاسخگو">
                                    تیم پشتیبانی ما همیشه آماده است تا به سوالات شما پاسخ دهد و مشکلات احتمالی را در سریع‌ترین زمان ممکن برطرف کند.
                                </FeatureCard>
                            </div>
                        </div>
                    </div>
                    
                    <div className="border-t border-slate-600 pt-8 text-center">
                        <h2 className="text-2xl font-semibold text-white mb-4">به ما بپیوندید</h2>
                        <p className="text-text-dark mb-6">برای اطلاع از آخرین اخبار و به‌روزرسانی‌ها، ما را در شبکه‌های اجتماعی دنبال کنید.</p>
                        <div className="flex items-center justify-center gap-6">
                            <a
                                href="https://t.me/Cinemadl_af"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-500 hover:bg-blue-600 transition-all text-white p-3 rounded-lg flex items-center justify-center gap-2 text-lg"
                            >
                                <TelegramIcon className="w-8 h-8" />
                                <span className="font-semibold">تلگرام</span>
                            </a>
                            <a
                                href="https://instagram.com/Cinemadl_af"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:opacity-90 transition-all text-white p-3 rounded-lg flex items-center justify-center gap-2 text-lg"
                            >
                                <InstagramIcon className="w-8 h-8" />
                                <span className="font-semibold">اینستاگرام</span>
                            </a>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AboutPage;