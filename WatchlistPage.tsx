import React, { useContext } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';
import { AppContext } from '../App';
import { Link } from 'react-router-dom';
import { BookmarkIcon } from '../components/icons';

const WatchlistPage: React.FC = () => {
    const context = useContext(AppContext);

    if (!context || !context.currentUser) {
        return null; // Should be handled by router
    }

    const { currentUser, movies, series } = context;
    const allContent = [...movies, ...series];
    
    const watchlistItems = allContent.filter(item => 
        currentUser.watchlist?.includes(item.id)
    );

    return (
        <div className="bg-primary min-h-screen flex flex-col">
            <Header />
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold border-r-4 border-accent pr-3 mb-8">
                    لیست تماشای من
                </h1>
                {watchlistItems.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {watchlistItems.map(movie => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-secondary p-8 rounded-lg text-center text-text-dark">
                        <h3 className="text-xl font-semibold text-text-light">لیست تماشای شما خالی است.</h3>
                        <p className="mt-2 mb-6">
                            فیلم‌ها و سریال‌های مورد علاقه خود را با کلیک بر روی آیکون <BookmarkIcon className="w-5 h-5 inline-block align-middle mx-1 text-accent" fill="currentColor" /> به لیست خود اضافه کنید.
                        </p>
                        <Link to="/" className="bg-accent hover:bg-accent-hover text-primary font-bold py-2 px-6 rounded-md transition">
                            شروع به جستجو
                        </Link>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default WatchlistPage;