import React, { useContext, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MovieListItem from '../components/MovieListItem';
import { AppContext } from '../App';
import type { Movie } from '../types';

const ListingPage: React.FC = () => {
    const context = useContext(AppContext);
    const location = useLocation();
    const { genreName } = useParams<{ genreName: string }>();

    const allContent = useMemo(() => {
        if (!context) return [];
        return [...context.movies, ...context.series].sort((a,b) => b.year - a.year);
    }, [context?.movies, context?.series]);

    const { pageTitle, filteredContent } = useMemo(() => {
        let title = '';
        let content: Movie[] = [];

        if (location.pathname === '/movies') {
            title = 'همه فیلم‌ها';
            content = allContent.filter(item => item.type === 'Movie');
        } else if (location.pathname === '/series') {
            title = 'همه سریال‌ها';
            content = allContent.filter(item => item.type === 'Series');
        } else if (genreName) {
            const decodedGenre = decodeURIComponent(genreName);
            title = `ژانر: ${decodedGenre}`;
            content = allContent.filter(item => item.genres.includes(decodedGenre));
        }

        return { pageTitle: title, filteredContent: content };
    }, [location.pathname, genreName, allContent]);

    if (context?.loading) {
        return <div className="bg-primary min-h-screen flex items-center justify-center text-xl text-accent">در حال بارگذاری...</div>;
    }

    return (
        <div className="bg-primary min-h-screen flex flex-col">
            <Header />
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content */}
                    <div className="w-full lg:w-3/4">
                        <div className="mb-4">
                            <h1 className="text-3xl font-bold border-r-4 border-accent pr-3">
                                {pageTitle}
                            </h1>
                        </div>
                        <div className="space-y-4">
                            {filteredContent.length > 0 ? (
                                filteredContent.map(contentItem => (
                                    <MovieListItem key={contentItem.id} movie={contentItem} />
                                ))
                            ) : (
                                <div className="bg-secondary p-8 rounded-lg text-center text-text-dark">
                                    <h3 className="text-xl font-semibold">موردی یافت نشد.</h3>
                                    <p className="mt-2">متاسفانه محتوایی مطابق با این دسته‌بندی وجود ندارد.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <Sidebar />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ListingPage;