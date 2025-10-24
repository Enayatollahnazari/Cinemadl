import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Movie } from '../types';
import { LockClosedIcon, BookmarkIcon } from './icons';
import { AppContext } from '../App';

interface MovieListItemProps {
    movie: Movie;
}

const MovieListItem: React.FC<MovieListItemProps> = ({ movie }) => {
    const context = useContext(AppContext);
    const navigate = useNavigate();

    // Check if any download link requires a subscription
    const requiresSubscription = movie.type === 'Movie' 
        ? movie.downloadLinks?.some(l => l.subscriptionRequired) 
        : movie.seasons?.some(s => s.episodes.some(e => e.downloadLinks.some(l => l.subscriptionRequired)));

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

        return <div className={`absolute top-3 right-3 ${badgeClass} text-white text-xs font-bold px-2 py-1 rounded-full z-10`}>{badgeText}</div>;
    };

    const slugify = (text: string) => text.replace(/ /g, '_');
    const detailPath = `/${movie.type === 'Movie' ? 'movies' : 'series'}/${slugify(movie.title)}`;

    const isInWatchlist = context?.currentUser?.watchlist?.includes(movie.id);

    return (
        <Link 
            to={detailPath}
            className="bg-secondary p-4 rounded-lg flex flex-col md:flex-row gap-4 relative hover:bg-slate-600 transition-all duration-200"
        >
            {requiresSubscription && (
                <div className="absolute top-3 left-3 bg-yellow-500 text-primary p-1.5 rounded-full z-10" title="شامل محتوای ویژه">
                    <LockClosedIcon className="w-4 h-4" />
                </div>
            )}
            <div className="flex-shrink-0 w-full md:w-32 relative">
                {getLanguageBadge(movie.languageDetails)}
                <img src={movie.posterUrl} alt={movie.title} className="w-full h-auto rounded-md aspect-[2/3] object-cover" />
            </div>
            <div className="flex-grow">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-text-light">{movie.title}</h3>
                    <span className="text-sm font-bold text-accent border border-accent px-2 py-0.5 rounded-md">{movie.year}</span>
                </div>
                <p className="text-sm text-text-dark mt-2 line-clamp-2">{movie.description}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs items-center">
                    {movie.genres.map(genre => <span key={genre} className="bg-primary px-2 py-1 rounded-full">{genre}</span>)}
                    {movie.type === 'Series' && movie.seasons && movie.seasons.length > 0 && (
                        <span className="bg-purple-600 text-white px-3 py-1 rounded-full font-semibold">
                            {`فصل ${movie.seasons[movie.seasons.length - 1].seasonNumber}`}
                        </span>
                    )}
                </div>
                <div className="border-t border-slate-600 my-4"></div>
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                        {movie.quality.map(q => <span key={q} className="border border-slate-600 px-3 py-1 rounded-md text-sm">{q}</span>)}
                    </div>
                     <div className="flex items-center gap-2">
                         <button 
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!context?.currentUser) {
                                    navigate('/login');
                                } else {
                                    context.toggleWatchlist(movie.id);
                                }
                            }}
                            className={`p-2 rounded-full hover:bg-slate-700 transition ${isInWatchlist ? 'text-accent' : 'text-text-dark'}`}
                            title={isInWatchlist ? 'حذف از لیست تماشا' : 'افزودن به لیست تماشا'}
                        >
                            <BookmarkIcon className="w-6 h-6" fill={isInWatchlist ? 'currentColor' : 'none'} />
                        </button>
                        <div className="bg-accent text-primary font-bold py-2 px-6 rounded-md text-sm">
                            مشاهده جزئیات
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default MovieListItem;