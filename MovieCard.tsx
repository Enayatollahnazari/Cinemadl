import React, { useContext } from 'react';
import type { Movie } from '../types';
import { BookmarkIcon } from './icons';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../App';

interface MovieCardProps {
    movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
    const context = useContext(AppContext);
    const navigate = useNavigate();

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
            badgeClass = 'bg-gray-600';
        } else {
            return null;
        }

        return <div className={`absolute top-2 right-2 ${badgeClass} text-white text-xs font-bold px-2 py-1 rounded-full z-10`}>{badgeText}</div>;
    };

    const slugify = (text: string) => text.replace(/ /g, '_');
    const detailPath = `/${movie.type === 'Movie' ? 'movies' : 'series'}/${slugify(movie.title)}`;

    const isInWatchlist = context?.currentUser?.watchlist?.includes(movie.id);

    return (
        <Link to={detailPath} className="bg-secondary rounded-lg overflow-hidden group block">
            <div className="relative">
                <img src={movie.posterUrl} alt={movie.title} className="w-full h-auto aspect-[2/3] object-cover" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-all duration-300"></div>
                {getLanguageBadge(movie.languageDetails)}
                <div className="absolute top-2 left-2 bg-accent text-primary text-xs font-bold px-2 py-1 rounded">
                    {movie.rating.toFixed(1)}
                </div>
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
                    className={`absolute bottom-2 left-2 p-2 bg-black/50 rounded-full cursor-pointer hover:bg-accent transition ${isInWatchlist ? 'text-accent' : 'text-white hover:text-primary'}`}
                    title={isInWatchlist ? 'حذف از لیست تماشا' : 'افزودن به لیست تماشا'}
                 >
                    <BookmarkIcon className="w-5 h-5" fill={isInWatchlist ? 'currentColor' : 'none'} />
                </button>
            </div>
            <div className="p-3">
                <h3 className="font-semibold text-sm truncate text-text-light">{movie.title}</h3>
                <p className="text-xs text-text-dark">{movie.year} &bull; {movie.genres[0]}</p>
            </div>
        </Link>
    );
};

export default MovieCard;