import React, { useContext, useMemo } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { AppContext } from '../App';
import { Link } from 'react-router-dom';

const GenresListPage: React.FC = () => {
    const context = useContext(AppContext);

    const allGenres = useMemo(() => {
        if (!context) return [];
        const allContent = [...context.movies, ...context.series];
        const genres = new Set<string>();
        allContent.forEach(item => {
            item.genres.forEach(g => genres.add(g));
        });
        return Array.from(genres).sort();
    }, [context]);

    if (context?.loading) {
        return <div className="bg-primary min-h-screen flex items-center justify-center text-xl text-accent">در حال بارگذاری...</div>;
    }

    return (
        <div className="bg-primary min-h-screen flex flex-col">
            <Header />
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-12">
                <div className="bg-secondary p-8 rounded-lg shadow-lg">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-accent mb-4">دسته‌بندی ژانرها</h1>
                        <p className="text-text-light text-lg">
                            ژانر مورد علاقه خود را انتخاب کنید و به دنیایی از فیلم و سریال وارد شوید.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {allGenres.map(genre => (
                            <Link 
                                key={genre}
                                to={`/genres/${encodeURIComponent(genre)}`}
                                className="bg-primary/50 hover:bg-accent hover:text-primary transition-all duration-300 text-text-light font-semibold text-center p-6 rounded-lg shadow-md flex items-center justify-center"
                            >
                                {genre}
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default GenresListPage;