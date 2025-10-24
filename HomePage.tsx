import React, { useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Hero from '../components/Hero';
import MovieListItem from '../components/MovieListItem';
import Sidebar from '../components/Sidebar';
import { AppContext } from '../App';
import MovieCard from '../components/MovieCard';
import { famousCountries } from '../data';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

interface Filters {
    searchTerm: string;
    selectedGenre: string[];
    selectedType: string;
    selectedCountry: string[];
    selectedLanguage: string;
    year: string;
    director: string;
    star: string;
}

const HomePage: React.FC = () => {
    const context = useContext(AppContext);
    const location = useLocation();
    const navigate = useNavigate();

    const getInitialFilters = useCallback((): Filters => {
        const params = new URLSearchParams(location.search);
        return {
            searchTerm: params.get('q') || '',
            selectedGenre: params.get('genre')?.split(',').filter(Boolean) || [],
            selectedType: params.get('type') || '',
            selectedCountry: params.get('country')?.split(',').filter(Boolean) || [],
            selectedLanguage: params.get('lang') || '',
            year: params.get('year') || '',
            director: params.get('director') || '',
            star: params.get('star') || '',
        };
    }, [location.search]);
    
    const [filters, setFilters] = useState<Filters>(getInitialFilters);
    const [appliedFilters, setAppliedFilters] = useState<Filters>(getInitialFilters);

    useEffect(() => {
        const newFilters = getInitialFilters();
        setFilters(newFilters);
        setAppliedFilters(newFilters);
    }, [location.search, getInitialFilters]);

    if (!context || context.loading) {
        return <div className="bg-primary min-h-screen flex items-center justify-center text-xl text-accent">در حال بارگذاری...</div>;
    }
    
    const { movies, series } = context;
    
    const popularMovies = useMemo(() => {
        return [...movies]
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 6);
    }, [movies]);

    const allContent = useMemo(() => [...movies, ...series].sort((a,b) => new Date(b.year,1,1).getTime() - new Date(a.year,1,1).getTime()), [movies, series]);
    
    const featuredContent = useMemo(() => allContent.filter(c => c.featured).slice(0, 5), [allContent]);

    const allGenres = useMemo(() => {
        const genres = new Set<string>();
        allContent.forEach(item => {
            item.genres.forEach(g => genres.add(g));
        });
        return Array.from(genres).sort();
    }, [allContent]);
    
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1999 }, (_, i) => currentYear - i);

    const filteredContent = useMemo(() => {
        const { searchTerm, selectedGenre, selectedType, selectedCountry, selectedLanguage, year, director, star } = appliedFilters;
        
        return allContent.filter(item => {
            const searchTermMatch = !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());
            const genreMatch = selectedGenre.length === 0 || selectedGenre.some(g => item.genres.includes(g));
            const typeMatch = !selectedType || item.type === selectedType;
            const countryMatch = selectedCountry.length === 0 || selectedCountry.includes(item.country);
            const languageMatch = !selectedLanguage || item.languageDetails.includes(selectedLanguage);
            const yearMatch = !year || item.year.toString() === year;
            const directorMatch = !director || (item.director && item.director.toLowerCase().includes(director.toLowerCase()));
            const starMatch = !star || (item.stars && item.stars.some(s => s.toLowerCase().includes(star.toLowerCase())));

            return searchTermMatch && genreMatch && typeMatch && countryMatch && languageMatch && yearMatch && directorMatch && starMatch;
        });
    }, [allContent, appliedFilters]);
    
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { target: { name: string; value: string; type: string; checked?: boolean }}) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox' && 'checked' in e.target) {
            const { checked } = e.target;
            if (name === 'selectedGenre' || name === 'selectedCountry') {
                 setFilters(prev => {
                    const currentValues = prev[name] as string[];
                    let newValues;

                    if (checked) {
                         newValues = [...currentValues, value];
                    } else {
                        newValues = currentValues.filter(item => item !== value);
                    }
                    
                    if (name === 'selectedGenre' && newValues.length > 4) return prev;
                    if (name === 'selectedCountry' && newValues.length > 3) return prev;
                    
                    return { ...prev, [name]: newValues };
                });
            }
        } else {
             setFilters(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSearch = () => {
        setAppliedFilters(filters);
        const params = new URLSearchParams();
        if (filters.searchTerm) params.set('q', filters.searchTerm);
        if (filters.selectedGenre.length > 0) params.set('genre', filters.selectedGenre.join(','));
        if (filters.selectedType) params.set('type', filters.selectedType);
        if (filters.selectedCountry.length > 0) params.set('country', filters.selectedCountry.join(','));
        if (filters.selectedLanguage) params.set('lang', filters.selectedLanguage);
        if (filters.year) params.set('year', filters.year);
        if (filters.director) params.set('director', filters.director);
        if (filters.star) params.set('star', filters.star);

        navigate({ search: params.toString() });
    };

    const handleReset = () => {
        const resetState: Filters = { 
            searchTerm: '',
            selectedGenre: [],
            selectedType: '',
            selectedCountry: [],
            selectedLanguage: '',
            year: '',
            director: '',
            star: '',
        };
        setFilters(resetState);
        setAppliedFilters(resetState);
        navigate({ search: '' });
    };

    const isFiltered = useMemo(() => {
        return Object.values(appliedFilters).some(value => Array.isArray(value) ? value.length > 0 : value !== '');
    }, [appliedFilters]);


    return (
        <div className="bg-primary min-h-screen flex flex-col">
            <Header />
            <Navbar />
            <main className="flex-grow">
                <Hero
                    featuredContent={featuredContent.length > 0 ? featuredContent : allContent.slice(0, 5)}
                    filters={filters}
                    genres={allGenres}
                    countries={famousCountries}
                    years={years}
                    onFilterChange={handleFilterChange}
                    onSearch={handleSearch}
                    onReset={handleReset}
                />
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold border-r-4 border-accent pr-3 mb-4">محبوب‌ترین فیلم‌ها</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {popularMovies.map(movie => (
                                <MovieCard key={movie.id} movie={movie} />
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Main Content */}
                        <div className="w-full lg:w-3/4">
                             <div className="mb-4">
                                <h2 className="text-2xl font-bold border-r-4 border-accent pr-3">
                                    {isFiltered ? 'نتایج جستجو' : 'آخرین فیلم و سریال‌ها'}
                                </h2>
                            </div>
                            <div className="space-y-4">
                                {filteredContent.length > 0 ? (
                                    filteredContent.map(contentItem => (
                                        <MovieListItem key={contentItem.id} movie={contentItem} />
                                    ))
                                ) : (
                                    <div className="bg-secondary p-8 rounded-lg text-center text-text-dark">
                                        <h3 className="text-xl font-semibold text-text-light">هیچ فیلم با انتخاب های شما در دسترس نیست</h3>
                                        <p className="mt-2">لطفا فیلترهای جستجو را تغییر دهید و دوباره امتحان کنید.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <Sidebar />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default HomePage;