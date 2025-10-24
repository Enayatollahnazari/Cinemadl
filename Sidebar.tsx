import React, { useContext } from 'react';
import { AppContext } from '../App';
import type { Movie } from '../types';
import { InstagramIcon, TelegramIcon } from './icons';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
    const context = useContext(AppContext);

    if (!context) {
        return <aside className="w-full lg:w-1/4"></aside>;
    }

    const { movies, series } = context;

    // Get unique genres from all content
    const allGenres = [...movies, ...series].reduce((acc, item) => {
        item.genres.forEach(genre => {
            if (!acc.includes(genre)) {
                acc.push(genre);
            }
        });
        return acc;
    }, [] as string[]);

    // For "Most Popular", let's just take the first few series for demonstration
    const popularSeries = series.slice(0, 4);

    const getLanguageBadge = (languageDetails: string[]) => {
        let badgeText = '';
        let badgeClass = '';

        if (languageDetails.includes('دوبله فارسی')) {
            badgeText = 'دوبله';
            badgeClass = 'bg-blue-600';
        } else if (languageDetails.includes('زیرنویس فارسی')) {
            badgeText = 'زیرنویس';
            badgeClass = 'bg-green-600';
        } else if (languageDetails.includes('زبان اصلی')) {
            badgeText = 'اصلی';
            badgeClass = 'bg-slate-600';
        } else {
            return null;
        }

        return <div className={`absolute top-1 right-1 ${badgeClass} text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full z-10`}>{badgeText}</div>;
    };
    
    const slugify = (text: string) => text.replace(/ /g, '_');

    return (
        <aside className="w-full lg:w-1/4 space-y-8">
            {/* Most Popular Series */}
            <div>
                <h3 className="text-xl font-bold mb-4 border-r-4 border-accent pr-3">محبوب‌ترین سریال‌ها</h3>
                <div className="space-y-4">
                    {popularSeries.map((s: Movie) => {
                        const detailPath = `/${s.type === 'Movie' ? 'movies' : 'series'}/${slugify(s.title)}`;
                        return (
                            <Link to={detailPath} key={s.id} className="flex items-center gap-4 group">
                                <div className="relative w-16 h-24 flex-shrink-0">
                                    {getLanguageBadge(s.languageDetails)}
                                    <img src={s.posterUrl.replace('/400/600', '/100/150')} alt={s.title} className="w-full h-full object-cover rounded-md" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm text-text-light group-hover:text-accent transition">{s.title}</h4>
                                    <p className="text-xs text-text-dark">{s.year} &bull; {s.rating.toFixed(1)}/10</p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Follow Us */}
            <div>
                <h3 className="text-xl font-bold mb-4 border-r-4 border-accent pr-3">ما را دنبال کنید</h3>
                <div className="flex items-center gap-4">
                    <a
                        href="https://t.me/Cinemadl_af"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-blue-500 hover:bg-blue-600 transition-all text-white p-3 rounded-lg flex items-center justify-center gap-2"
                    >
                        <TelegramIcon className="w-6 h-6" />
                        <span className="font-semibold">تلگرام</span>
                    </a>
                    <a
                        href="https://instagram.com/Cinemadl_af"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:opacity-90 transition-all text-white p-3 rounded-lg flex items-center justify-center gap-2"
                    >
                        <InstagramIcon className="w-6 h-6" />
                        <span className="font-semibold">اینستاگرام</span>
                    </a>
                </div>
            </div>

            {/* Genres */}
            <div>
                <h3 className="text-xl font-bold mb-4 border-r-4 border-accent pr-3">ژانرها</h3>
                <div className="flex flex-wrap gap-2">
                    {allGenres.map(genre => (
                        <Link to={`/genres/${encodeURIComponent(genre)}`} key={genre} className="bg-secondary hover:bg-accent hover:text-primary transition text-sm px-3 py-1.5 rounded-full">
                            {genre}
                        </Link>
                    ))}
                </div>
            </div>

            {/* A placeholder for an ad */}
            <div className="bg-secondary rounded-lg p-4 text-center">
                 <p className="text-text-dark">محل تبلیغات</p>
            </div>
        </aside>
    );
};

export default Sidebar;