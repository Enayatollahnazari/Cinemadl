import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../App';
import type { Movie, DownloadLink, Season, Episode } from '../types';
import { famousCountries } from '../data';

interface MovieFormProps {
    existingMovie: Movie | null;
    onFormClose: () => void;
}

const defaultMovieState: Omit<Movie, 'id'> = {
    title: '',
    description: '',
    posterUrl: 'https://picsum.photos/seed/new/400/600',
    backdropUrl: 'https://picsum.photos/seed/newbg/1200/675',
    rating: 7.0,
    year: new Date().getFullYear(),
    genres: [],
    quality: [],
    type: 'Movie',
    country: '',
    languageDetails: [],
    director: '',
    stars: [],
    trailerUrl: '',
    downloadLinks: [{ quality: '1080p', url: '#', size: '1.5 GB', subscriptionRequired: false }],
    seasons: [],
    featured: false,
    duration: 0,
    streamUrl: '',
    views: 0,
    downloads: [],
    comments: [],
};

const MovieForm: React.FC<MovieFormProps> = ({ existingMovie, onFormClose }) => {
    const context = useContext(AppContext);
    const [formData, setFormData] = useState<Movie | Omit<Movie, 'id'>>(
        existingMovie ? { ...existingMovie } : defaultMovieState
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
        }
    };
    
    const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'genres' | 'quality' | 'languageDetails' | 'stars') => {
        const { value } = e.target;
        setFormData(prev => ({ ...prev, [field]: value.split(',').map(item => item.trim()) }));
    };

    // --- Download Link Handlers ---
    const handleLinkChange = (index: number, field: keyof DownloadLink, value: any, seasonIdx?: number, episodeIdx?: number) => {
        setFormData(prev => {
            const newData = { ...prev };
            let links: DownloadLink[];
            if (typeof seasonIdx === 'number' && typeof episodeIdx === 'number') {
                links = (newData as Movie).seasons![seasonIdx].episodes[episodeIdx].downloadLinks;
            } else {
                links = (newData as Movie).downloadLinks!;
            }
            links[index] = { ...links[index], [field]: value };
            return newData;
        });
    };
    const addLink = (seasonIdx?: number, episodeIdx?: number) => {
        const newLink: DownloadLink = { quality: '', url: '', size: '', subscriptionRequired: false };
        setFormData(prev => {
            const newData = { ...prev } as Movie; // Treat as Movie for manipulation
            if (typeof seasonIdx === 'number' && typeof episodeIdx === 'number') {
                newData.seasons![seasonIdx].episodes[episodeIdx].downloadLinks.push(newLink);
            } else {
                newData.downloadLinks = [...(newData.downloadLinks || []), newLink];
            }
            return newData;
        });
    };
    const removeLink = (index: number, seasonIdx?: number, episodeIdx?: number) => {
        setFormData(prev => {
            const newData = { ...prev } as Movie;
            if (typeof seasonIdx === 'number' && typeof episodeIdx === 'number') {
                 newData.seasons![seasonIdx].episodes[episodeIdx].downloadLinks.splice(index, 1);
            } else {
                newData.downloadLinks?.splice(index, 1);
            }
            return newData;
        });
    };
    
    // --- Season & Episode Handlers ---
    const addSeason = () => {
        const newSeason: Season = { seasonNumber: (formData as Movie).seasons?.length || 0 + 1, episodes: [] };
        setFormData(prev => ({ ...prev, seasons: [...((prev as Movie).seasons || []), newSeason] }));
    };
    const removeSeason = (seasonIdx: number) => {
        setFormData(prev => ({ ...prev, seasons: (prev as Movie).seasons?.filter((_, i) => i !== seasonIdx) }));
    };
    const addEpisode = (seasonIdx: number) => {
        const newEpisode: Episode = { episodeNumber: (formData as Movie).seasons?.[seasonIdx].episodes.length || 0 + 1, title: '', downloadLinks: [] };
        setFormData(prev => {
            const newSeasons = [...(prev as Movie).seasons!];
            newSeasons[seasonIdx].episodes.push(newEpisode);
            return { ...prev, seasons: newSeasons };
        });
    };
    const removeEpisode = (seasonIdx: number, episodeIdx: number) => {
        setFormData(prev => {
            const newSeasons = [...(prev as Movie).seasons!];
            newSeasons[seasonIdx].episodes = newSeasons[seasonIdx].episodes.filter((_, i) => i !== episodeIdx);
            return { ...prev, seasons: newSeasons };
        });
    };
     const handleEpisodeChange = (seasonIdx: number, episodeIdx: number, field: keyof Episode, value: any) => {
        setFormData(prev => {
            const newSeasons = [...(prev as Movie).seasons!];
            (newSeasons[seasonIdx].episodes[episodeIdx] as any)[field] = value;
            return {...prev, seasons: newSeasons };
        });
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (existingMovie) {
            context?.updateMovie(formData as Movie);
        } else {
            context?.addMovie(formData as Omit<Movie, 'id'>);
        }
        onFormClose();
    };
    
    const renderLinkEditor = (links: DownloadLink[], seasonIdx?: number, episodeIdx?: number) => (
        <div className="space-y-3">
            {links.map((link, index) => (
                <div key={index} className="grid grid-cols-2 md:grid-cols-12 gap-2 items-center bg-primary/50 p-2 rounded-md">
                    <input type="text" placeholder="کیفیت" value={link.quality} onChange={e => handleLinkChange(index, 'quality', e.target.value, seasonIdx, episodeIdx)} className="col-span-2 md:col-span-3 bg-primary p-2 rounded border border-secondary"/>
                    <input type="text" placeholder="URL" value={link.url} onChange={e => handleLinkChange(index, 'url', e.target.value, seasonIdx, episodeIdx)} className="col-span-2 md:col-span-4 bg-primary p-2 rounded border border-secondary"/>
                    <input type="text" placeholder="حجم" value={link.size} onChange={e => handleLinkChange(index, 'size', e.target.value, seasonIdx, episodeIdx)} className="col-span-1 md:col-span-2 bg-primary p-2 rounded border border-secondary"/>
                    <label className="col-span-1 md:col-span-2 flex items-center justify-center gap-1 text-xs cursor-pointer"><input type="checkbox" checked={link.subscriptionRequired} onChange={e => handleLinkChange(index, 'subscriptionRequired', e.target.checked, seasonIdx, episodeIdx)} className="h-4 w-4 bg-primary"/>اشتراکی</label>
                    <button type="button" onClick={() => removeLink(index, seasonIdx, episodeIdx)} className="col-span-2 md:col-span-1 bg-red-600 text-white rounded p-2 text-xs">حذف</button>
                </div>
            ))}
            <button type="button" onClick={() => addLink(seasonIdx, episodeIdx)} className="bg-blue-600 text-white px-3 py-1 rounded text-sm mt-2">افزودن لینک</button>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-text-light">
             <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-accent">{existingMovie ? 'ویرایش محتوا' : 'افزودن محتوای جدید'}</h2>
                <button type="button" onClick={onFormClose} className="text-2xl text-text-dark hover:text-white">&times;</button>
            </div>
            {/* General Info */}
            <div className="p-4 bg-primary/50 rounded-lg space-y-4">
                <h3 className="font-bold text-lg">اطلاعات عمومی</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="title" placeholder="عنوان" value={formData.title} onChange={handleChange} className="w-full bg-primary p-2 rounded border border-secondary" required/>
                    <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-primary p-2 rounded border border-secondary">
                        <option value="Movie">فیلم</option>
                        <option value="Series">سریال</option>
                    </select>
                </div>
                <textarea name="description" placeholder="توضیحات" value={formData.description} onChange={handleChange} rows={3} className="w-full bg-primary p-2 rounded border border-secondary"></textarea>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" name="posterUrl" placeholder="آدرس پوستر" value={formData.posterUrl} onChange={handleChange} className="w-full bg-primary p-2 rounded border border-secondary"/>
                    <input type="text" name="backdropUrl" placeholder="آدرس تصویر پس‌زمینه" value={formData.backdropUrl} onChange={handleChange} className="w-full bg-primary p-2 rounded border border-secondary"/>
                    <input type="text" name="trailerUrl" placeholder="آدرس تریلر (Embed)" value={formData.trailerUrl} onChange={handleChange} className="w-full bg-primary p-2 rounded border border-secondary"/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="number" step="0.1" name="rating" placeholder="امتیاز" value={formData.rating} onChange={handleChange} className="w-full bg-primary p-2 rounded border border-secondary"/>
                    <input type="number" name="year" placeholder="سال انتشار" value={formData.year} onChange={handleChange} className="w-full bg-primary p-2 rounded border border-secondary"/>
                    <select name="country" value={formData.country} onChange={handleChange} className="w-full bg-primary p-2 rounded border border-secondary">
                        <option value="">انتخاب کشور</option>
                        {famousCountries.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="director" placeholder="کارگردان" value={formData.director} onChange={handleChange} className="w-full bg-primary p-2 rounded border border-secondary"/>
                    <input type="text" placeholder="ستارگان (جدا شده با کاما)" value={formData.stars?.join(', ')} onChange={(e) => handleArrayChange(e, 'stars')} className="w-full bg-primary p-2 rounded border border-secondary"/>
                </div>
                <div>
                    <input type="text" placeholder="ژانرها (جدا شده با کاما)" value={formData.genres.join(', ')} onChange={(e) => handleArrayChange(e, 'genres')} className="w-full bg-primary p-2 rounded border border-secondary"/>
                </div>
                <div>
                    <input type="text" placeholder="جزئیات زبان (دوبله فارسی, زیرنویس فارسی)" value={formData.languageDetails.join(', ')} onChange={(e) => handleArrayChange(e, 'languageDetails')} className="w-full bg-primary p-2 rounded border border-secondary"/>
                </div>
                 <div>
                    <input type="text" placeholder="کیفیت‌های موجود (جدا شده با کاما)" value={formData.quality.join(', ')} onChange={(e) => handleArrayChange(e, 'quality')} className="w-full bg-primary p-2 rounded border border-secondary"/>
                </div>
                 <div className="flex items-center gap-2">
                    <input type="checkbox" name="featured" id="featured" checked={formData.featured} onChange={handleChange} className="h-4 w-4"/>
                    <label htmlFor="featured">نمایش در بخش ویژه‌ها</label>
                </div>
            </div>

            {/* Links / Seasons */}
            {formData.type === 'Movie' ? (
                <div className="p-4 bg-primary/50 rounded-lg space-y-2">
                     <h3 className="font-bold text-lg">لینک‌های دانلود فیلم</h3>
                    {renderLinkEditor((formData as Movie).downloadLinks || [])}
                </div>
            ) : (
                 <div className="p-4 bg-primary/50 rounded-lg space-y-4">
                    <h3 className="font-bold text-lg">فصل‌ها و قسمت‌ها</h3>
                    {(formData as Movie).seasons?.map((season, sIdx) => (
                        <div key={sIdx} className="p-3 bg-primary rounded space-y-3">
                            <div className="flex justify-between items-center">
                                <h4 className="font-semibold">فصل {season.seasonNumber}</h4>
                                <button type="button" onClick={() => removeSeason(sIdx)} className="bg-red-600 text-white rounded px-2 py-1 text-xs">حذف فصل</button>
                            </div>
                            {season.episodes.map((episode, eIdx) => (
                                <div key={eIdx} className="p-3 bg-slate-600/70 rounded space-y-2">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <span>قسمت {episode.episodeNumber}:</span>
                                            <input type="text" placeholder="عنوان قسمت" value={episode.title} onChange={e => handleEpisodeChange(sIdx, eIdx, 'title', e.target.value)} className="bg-primary p-1 rounded border border-slate-700" />
                                        </div>
                                        <button type="button" onClick={() => removeEpisode(sIdx, eIdx)} className="bg-red-700 text-white rounded px-2 py-1 text-xs">حذف قسمت</button>
                                    </div>
                                    {renderLinkEditor(episode.downloadLinks, sIdx, eIdx)}
                                </div>
                            ))}
                            <button type="button" onClick={() => addEpisode(sIdx)} className="bg-green-600 text-white px-3 py-1 rounded text-sm">افزودن قسمت</button>
                        </div>
                    ))}
                    <button type="button" onClick={addSeason} className="bg-accent text-primary font-bold py-2 px-4 rounded-md">افزودن فصل جدید</button>
                </div>
            )}

            <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={onFormClose} className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-md">لغو</button>
                <button type="submit" className="bg-accent hover:bg-accent-hover text-primary font-bold py-2 px-4 rounded-md">{existingMovie ? 'به‌روزرسانی' : 'ذخیره'}</button>
            </div>
        </form>
    );
};

export default MovieForm;