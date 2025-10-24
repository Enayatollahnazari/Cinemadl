import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { Movie } from '../types';
import { PlayIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from './icons';
import { Link } from 'react-router-dom';

// --- MultiSelectDropdown Component ---
interface MultiSelectDropdownProps {
    name: string;
    options: string[];
    selectedOptions: string[];
    placeholder: string;
    limit: number;
    onChange: (e: { target: { name: string; value: string; type: string; checked: boolean } }) => void;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({ name, options, selectedOptions, placeholder, limit, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleCheckboxChange = (option: string, checked: boolean) => {
        if (checked && selectedOptions.length >= limit) {
             alert(`شما می‌توانید حداکثر ${limit} مورد انتخاب کنید.`);
             return;
        }
        onChange({ target: { name, value: option, type: 'checkbox', checked } });
    };

    const displayValue = selectedOptions.length > 0 ? selectedOptions.join('، ') : placeholder;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-primary border border-secondary rounded-md px-3 py-2 text-text-light focus:outline-none focus:ring-2 focus:ring-accent text-right flex justify-between items-center"
            >
                <span className="truncate">{displayValue}</span>
                <ChevronDownIcon className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute top-full right-0 mt-1 w-full bg-primary border border-secondary rounded-md z-20 max-h-60 overflow-y-auto">
                    {options.map(option => (
                        <label key={option} className="flex items-center gap-2 p-2 hover:bg-secondary cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedOptions.includes(option)}
                                onChange={(e) => handleCheckboxChange(option, e.target.checked)}
                                disabled={!selectedOptions.includes(option) && selectedOptions.length >= limit}
                                className="h-4 w-4 rounded bg-slate-600 border-slate-500 text-accent focus:ring-accent"
                            />
                            <span>{option}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- Hero Component ---
interface HeroProps {
    featuredContent: Movie[];
    filters: {
        searchTerm: string;
        selectedGenre: string[];
        selectedType: string;
        selectedCountry: string[];
        selectedLanguage: string;
        year: string;
    };
    genres: string[];
    countries: string[];
    years: number[];
    onFilterChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { target: { name: string; value: string; type: string; checked?: boolean } }) => void;
    onSearch: () => void;
    onReset: () => void;
}


const Hero: React.FC<HeroProps> = ({ featuredContent, filters, genres, countries, years, onFilterChange, onSearch, onReset }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev >= featuredContent.length - 1 ? 0 : prev + 1));
        setIsTrailerPlaying(false);
    }, [featuredContent.length]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev === 0 ? featuredContent.length - 1 : prev - 1));
        setIsTrailerPlaying(false);
    }, [featuredContent.length]);
    
    const jumpToSlide = (index: number) => {
      setCurrentIndex(index);
      setIsTrailerPlaying(false);
    }

    useEffect(() => {
        if (featuredContent.length > 1 && !isTrailerPlaying) {
            const timerId = setInterval(nextSlide, 10000);
            return () => clearInterval(timerId);
        }
    }, [featuredContent.length, nextSlide, isTrailerPlaying]);

    const mainFeatured = featuredContent[currentIndex];

    const handlePlayTrailer = () => {
        if (mainFeatured?.trailerUrl) {
            setIsTrailerPlaying(true);
        } else {
             alert('متاسفانه تریلر این فیلم موجود نیست.');
        }
    };
    
    const slugify = (text: string) => text.replace(/ /g, '_');


    if (!mainFeatured) return null;

    const detailPath = `/${mainFeatured.type === 'Movie' ? 'movies' : 'series'}/${slugify(mainFeatured.title)}`;

    return (
        <div className="relative text-white">
            {/* Background Image and Gradients */}
            <div className="absolute inset-0">
                <img src={mainFeatured.backdropUrl || mainFeatured.posterUrl.replace('/400/600', '/1200/800')} alt={mainFeatured.title} className="w-full h-full object-cover object-center" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent"></div>
                <div className="absolute inset-0 bg-primary/40"></div> {/* Dark overlay for better text readability */}
            </div>

            {/* Content Wrapper */}
            <div className="relative z-10">
                {/* Hero Content */}
                <div className="container mx-auto px-4 flex h-[60vh] min-h-[500px] items-center">
                    <div className="w-full md:w-1/2">
                        <p className="text-accent font-semibold tracking-widest">{mainFeatured.type === 'Movie' ? 'فیلم' : 'سریال'}</p>
                        <h1 className="text-4xl md:text-6xl font-bold my-4">{mainFeatured.title}</h1>
                        <div className="flex items-center space-x-4 space-x-reverse">
                            <span className="bg-accent text-primary font-bold px-2 py-1 rounded">IMDb</span>
                            <span className="text-2xl font-bold">{mainFeatured.rating} / 10</span>
                        </div>
                        <p className="mt-4 text-text-light max-w-lg line-clamp-3">{mainFeatured.description}</p>
                        <div className="mt-8 flex items-center gap-4">
                             <button onClick={handlePlayTrailer} className="flex items-center space-x-2 space-x-reverse bg-accent text-primary font-bold py-3 px-6 rounded-full hover:bg-accent-hover transition">
                                <PlayIcon className="w-6 h-6" />
                                <span>تماشای تریلر</span>
                            </button>
                             <Link to={detailPath} className="flex items-center space-x-2 space-x-reverse bg-secondary text-text-light font-bold py-3 px-6 rounded-full hover:bg-slate-600 transition">
                                <span>جزئیات و دانلود</span>
                            </Link>
                        </div>
                    </div>
    
                    <div className="hidden md:flex absolute left-4 bottom-10 items-center space-x-4 space-x-reverse">
                        <button onClick={prevSlide} className="p-2 rounded-full bg-black/30 hover:bg-accent hover:text-primary transition"><ChevronRightIcon className="w-6 h-6" /></button>
                         {featuredContent.map((item, index) => (
                            <div key={item.id} onClick={() => jumpToSlide(index)} className={`w-32 h-48 rounded-lg overflow-hidden transition-all duration-300 transform cursor-pointer ${index === currentIndex ? 'border-2 border-accent scale-105' : 'opacity-50 hover:opacity-100'}`}>
                                <img src={item.posterUrl} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                        ))}
                        <button onClick={nextSlide} className="p-2 rounded-full bg-black/30 hover:bg-accent hover:text-primary transition"><ChevronLeftIcon className="w-6 h-6" /></button>
                    </div>
                </div>

                {/* Search Form */}
                <div className="container mx-auto px-4 pb-8">
                     <div className="bg-secondary/80 backdrop-blur-sm p-4 rounded-lg space-y-4 border border-slate-600">
                        <h3 className="text-xl font-bold text-accent mb-2">جستجوی پیشرفته</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            <input
                                type="text"
                                name="searchTerm"
                                placeholder="نام فیلم یا سریال..."
                                value={filters.searchTerm}
                                onChange={onFilterChange}
                                className="w-full bg-primary border border-secondary rounded-md px-3 py-2 text-text-light focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                            <MultiSelectDropdown
                                name="selectedGenre"
                                options={genres}
                                selectedOptions={filters.selectedGenre}
                                placeholder="همه ژانرها"
                                limit={4}
                                onChange={onFilterChange}
                            />
                            <select
                                name="selectedType"
                                value={filters.selectedType}
                                onChange={onFilterChange}
                                className="w-full bg-primary border border-secondary rounded-md px-3 py-2 text-text-light focus:outline-none focus:ring-2 focus:ring-accent"
                            >
                                <option value="">همه موارد</option>
                                <option value="Movie">فیلم</option>
                                <option value="Series">سریال</option>
                            </select>
                             <select
                                name="year"
                                value={filters.year}
                                onChange={onFilterChange}
                                className="w-full bg-primary border border-secondary rounded-md px-3 py-2 text-text-light focus:outline-none focus:ring-2 focus:ring-accent"
                            >
                                <option value="">همه سال‌ها</option>
                                {years.map(year => <option key={year} value={year}>{year}</option>)}
                            </select>
                            <MultiSelectDropdown
                                name="selectedCountry"
                                options={countries}
                                selectedOptions={filters.selectedCountry}
                                placeholder="همه کشورها"
                                limit={3}
                                onChange={onFilterChange}
                            />
                            <select
                                name="selectedLanguage"
                                value={filters.selectedLanguage}
                                onChange={onFilterChange}
                                className="w-full bg-primary border border-secondary rounded-md px-3 py-2 text-text-light focus:outline-none focus:ring-2 focus:ring-accent"
                            >
                                <option value="">همه زبان‌ها</option>
                                <option value="دوبله فارسی">دوبله فارسی</option>
                                <option value="زیرنویس فارسی">زیرنویس فارسی</option>
                                <option value="زبان اصلی">زبان اصلی</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-4 border-t border-slate-600 pt-4">
                            <button
                                onClick={onReset}
                                className="bg-slate-600 hover:bg-primary text-white font-bold py-2 px-6 rounded-md transition"
                            >
                                پاک کردن
                            </button>
                            <button
                                onClick={onSearch}
                                className="bg-accent hover:bg-accent-hover text-primary font-bold py-2 px-8 rounded-md transition"
                            >
                                جستجو
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trailer Modal */}
            {isTrailerPlaying && mainFeatured.trailerUrl && (
                <div 
                    className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4" 
                    onClick={() => setIsTrailerPlaying(false)}
                    dir="ltr"
                >
                    <div 
                        className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl" 
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button 
                            onClick={() => setIsTrailerPlaying(false)} 
                            className="absolute top-2 right-3 text-white text-4xl font-bold hover:text-accent transition z-10"
                            aria-label="بستن تریلر"
                        >
                            &times;
                        </button>
                        <iframe
                            className="w-full h-full"
                            src={mainFeatured.trailerUrl}
                            title={`تریلر ${mainFeatured.title}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Hero;