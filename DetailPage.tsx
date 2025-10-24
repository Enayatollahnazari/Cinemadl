import React, { useContext, useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import Header from '../components/Header';
import MovieCard from '../components/MovieCard';
import { LockClosedIcon, PlayCircleIcon, BookmarkIcon } from '../components/icons';
import type { Movie, Season, DownloadLink } from '../types';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const InfoRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 py-2 border-b border-secondary/50">
        <span className="font-semibold text-text-dark w-24 flex-shrink-0">{label}:</span>
        <div className="flex flex-wrap gap-2">{children}</div>
    </div>
);

const FilterLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
    <Link to={to} className="text-text-light hover:text-accent transition duration-200 hover:underline">
        {children}
    </Link>
);


const DetailPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const context = useContext(AppContext);
    const navigate = useNavigate();
    
    const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [isWatchingOnline, setIsWatchingOnline] = useState(false);
    const [onlineWatchUrl, setOnlineWatchUrl] = useState<string | null>(null);

    const slugify = (text: string) => text.replace(/ /g, '_');

    const contentItem = useMemo(() => {
        if (!context || !slug) return null;
        const allContent = [...context.movies, ...context.series];
        const decodedSlug = decodeURIComponent(slug);
        return allContent.find(item => slugify(item.title) === decodedSlug) || null;
    }, [context?.movies, context?.series, slug]);

    // Set initial selected season and record view
    useEffect(() => {
        if (contentItem) {
            if (contentItem.type === 'Series' && contentItem.seasons && contentItem.seasons.length > 0) {
                setSelectedSeason(contentItem.seasons[0]);
            } else {
                setSelectedSeason(null);
            }
            context?.incrementViewCount(contentItem.id, contentItem.type);
        }
        // Scroll to top on navigation
        window.scrollTo(0, 0);
    }, [contentItem?.id]); // Depend on id to re-trigger on navigation

    const similarContent = useMemo(() => {
        if (!context || !contentItem) return [];
        const allContent = [...context.movies, ...context.series];
        return allContent
            .filter(item => 
                item.id !== contentItem.id &&
                (item.country === contentItem.country || item.genres.some(g => contentItem.genres.includes(g)))
            )
            .slice(0, 6);
    }, [context?.movies, context?.series, contentItem]);

    if (context?.loading) return <div className="bg-primary min-h-screen text-center p-10">در حال بارگذاری...</div>;
    if (!contentItem) return <div className="bg-primary min-h-screen text-center p-10">محتوا یافت نشد.</div>;

    const getLanguageBadge = (languageDetails: string[], isLarge: boolean = false) => {
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

        const sizeClass = isLarge 
            ? 'top-4 right-4 text-sm px-3 py-1'
            : 'top-1 right-1 text-[10px] px-1.5 py-0.5';

        return <span className={`absolute ${sizeClass} ${badgeClass} text-white font-bold rounded-full z-10`}>{badgeText}</span>;
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim() && contentItem.id) {
            context.addComment(contentItem.id, contentItem.type, newComment);
            setNewComment('');
        }
    };
    
    const handleDownloadClick = (link: DownloadLink) => {
        if (link.subscriptionRequired) {
            if (!context?.currentUser) {
                alert('برای دانلود این محتوا، لطفا ابتدا وارد حساب کاربری خود شوید.');
                navigate('/login');
                return false;
            }
            if (!context.currentUser.subscriptionActive) {
                alert('این محتوا ویژه کاربران دارای اشتراک است. لطفا اشتراک تهیه کنید.');
                navigate('/subscription');
                return false;
            }
        }
        context.recordDownload(contentItem.id, contentItem.type);
        return true;
    };
    
    const handleWatchOnlineClick = (url: string) => {
        if (!context?.currentUser) {
            alert('برای تماشای این محتوا، لطفا ابتدا وارد حساب کاربری خود شوید.');
            navigate('/login');
            return;
        }
        if (!context.currentUser.subscriptionActive) {
            alert('این محتوا ویژه کاربران دارای اشتراک است. لطفا اشتراک تهیه کنید.');
            navigate('/subscription');
            return;
        }
        
        context.recordDownload(contentItem.id, contentItem.type);
        setOnlineWatchUrl(url);
        setIsWatchingOnline(true);
    };

    const renderDownloadLinks = (links: DownloadLink[], itemTitle: string) => (
        <ul className="space-y-2">
            {links.map(link => (
                <li key={`${link.quality}-${link.size}`}>
                    <a
                        href={link.url}
                        onClick={(e) => {
                           if (!handleDownloadClick(link)) {
                               e.preventDefault();
                           } else {
                               alert(`درحال آماده‌سازی لینک دانلود برای: ${itemTitle} با کیفیت ${link.quality}`);
                               e.preventDefault();
                           }
                        }}
                        className="flex justify-between items-center bg-primary p-3 rounded-md hover:bg-accent hover:text-primary transition-all duration-200 group"
                    >
                        <div className="flex items-center gap-2">
                             {/* FIX: Moved title attribute to a wrapping span to resolve TypeScript error. */}
                             {link.subscriptionRequired && <span title="نیازمند اشتراک"><LockClosedIcon className="w-4 h-4 text-yellow-500 flex-shrink-0"/></span>}
                            <span className="font-semibold">{link.quality}</span>
                        </div>
                        <span className="text-sm text-text-dark group-hover:text-primary">{link.size}</span>
                    </a>
                </li>
            ))}
        </ul>
    );

    const isInWatchlist = context?.currentUser?.watchlist?.includes(contentItem.id);


    return (
        <div className="bg-primary min-h-screen flex flex-col">
            <Header />
            <Navbar />
            <main className="flex-grow">
                {/* Backdrop and Hero Info */}
                <div className="relative text-white min-h-[60vh] flex items-end">
                    <div className="absolute inset-0">
                        <img 
                            src={contentItem.backdropUrl || contentItem.posterUrl.replace('/400/600', '/1200/675')} 
                            alt={contentItem.title} 
                            className="w-full h-full object-cover object-center" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent"></div>
                    </div>
                    <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 items-end">
                        <div className="relative w-48 h-72 md:w-56 md:h-80 flex-shrink-0 -mb-20">
                            {getLanguageBadge(contentItem.languageDetails, true)}
                            <img src={contentItem.posterUrl} alt={contentItem.title} className="w-full h-full object-cover rounded-lg shadow-2xl"/>
                        </div>
                        <div className="flex-grow">
                            <h1 className="text-4xl md:text-5xl font-bold">{contentItem.title}</h1>
                            <div className="flex items-center gap-4 mt-2">
                                <span className="text-lg">{contentItem.year}</span>
                                <span className="w-1 h-1 bg-text-dark rounded-full"></span>
                                <span className="bg-accent text-primary font-bold px-2 py-0.5 rounded text-sm">IMDb {contentItem.rating}</span>
                                {contentItem.duration && <><span className="w-1 h-1 bg-text-dark rounded-full"></span><span>{contentItem.duration} دقیقه</span></>}
                            </div>
                            <div className="mt-6 flex flex-wrap items-center gap-4">
                                <button
                                    onClick={() => {
                                        if (!context?.currentUser) {
                                            navigate('/login');
                                        } else {
                                            context.toggleWatchlist(contentItem.id);
                                        }
                                    }}
                                    className={`flex items-center space-x-2 space-x-reverse border-2 font-bold py-2 px-5 rounded-full transition ${isInWatchlist ? 'bg-accent text-primary border-accent' : 'border-secondary text-text-light hover:bg-slate-700'}`}
                                >
                                    <BookmarkIcon className="w-5 h-5" />
                                    <span>{isInWatchlist ? 'در لیست شما' : 'افزودن به لیست'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8 mt-20">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Main Content */}
                        <div className="w-full lg:w-3/4 space-y-8">
                            {/* Description & Info */}
                            <div className="bg-secondary p-6 rounded-lg">
                                <h2 className="text-xl font-bold border-r-4 border-accent pr-3 mb-4">خلاصه داستان</h2>
                                <p className="text-text-light leading-relaxed mb-6">{contentItem.description}</p>
                                
                                <div className="border-t border-slate-600 pt-4 space-y-2">
                                    <InfoRow label="ژانر">
                                        {contentItem.genres.map((g, index) => (
                                            <React.Fragment key={g}>
                                                <FilterLink to={`/genres/${encodeURIComponent(g)}`}>{g}</FilterLink>
                                                {index < contentItem.genres.length - 1 && <span>،</span>}
                                            </React.Fragment>
                                        ))}
                                    </InfoRow>
                                    <InfoRow label="سال انتشار">
                                        <FilterLink to={`/?year=${contentItem.year}`}>{contentItem.year}</FilterLink>
                                    </InfoRow>
                                     <InfoRow label="کشور سازنده">
                                        <FilterLink to={`/?country=${encodeURIComponent(contentItem.country)}`}>{contentItem.country}</FilterLink>
                                    </InfoRow>
                                    {contentItem.director && (
                                         <InfoRow label="کارگردان">
                                            <FilterLink to={`/?director=${encodeURIComponent(contentItem.director)}`}>{contentItem.director}</FilterLink>
                                        </InfoRow>
                                    )}
                                    {contentItem.stars && contentItem.stars.length > 0 && (
                                         <InfoRow label="ستارگان">
                                             {contentItem.stars.map((star, index) => (
                                                <React.Fragment key={star}>
                                                    <FilterLink to={`/?star=${encodeURIComponent(star)}`}>{star}</FilterLink>
                                                    {index < contentItem.stars!.length - 1 && <span>،</span>}
                                                </React.Fragment>
                                            ))}
                                        </InfoRow>
                                    )}
                                </div>
                            </div>
                            
                            {/* Download/Episodes Section */}
                            <div className="bg-secondary p-6 rounded-lg">
                                <h2 className="text-xl font-bold border-r-4 border-accent pr-3 mb-4">
                                    {contentItem.type === 'Movie' ? 'دانلود و تماشا' : 'فصل‌ها و قسمت‌ها'}
                                </h2>
                                
                                {contentItem.type === 'Movie' && (
                                    <div className="space-y-6">
                                        {contentItem.streamUrl && (
                                            <div>
                                                <h3 className="text-lg font-semibold text-text-light mb-3">تماشای آنلاین</h3>
                                                <button 
                                                    onClick={() => handleWatchOnlineClick(contentItem.streamUrl!)}
                                                    className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-bold py-3 px-6 rounded-md hover:bg-red-700 transition"
                                                >
                                                    <LockClosedIcon className="w-5 h-5" />
                                                    <PlayCircleIcon className="w-6 h-6" />
                                                    <span>پخش آنلاین (ویژه)</span>
                                                </button>
                                            </div>
                                        )}
                                        {contentItem.downloadLinks && (
                                             <div>
                                                <h3 className="text-lg font-semibold text-text-light mb-3">لینک‌های دانلود</h3>
                                                {renderDownloadLinks(contentItem.downloadLinks, contentItem.title)}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {contentItem.type === 'Series' && contentItem.seasons && (
                                    <div>
                                        <div className="flex flex-wrap gap-2 mb-4 border-b border-slate-600 pb-4">
                                            {contentItem.seasons.map(season => (
                                                <button 
                                                    key={season.seasonNumber}
                                                    onClick={() => setSelectedSeason(season)}
                                                    className={`px-4 py-2 rounded-md font-semibold transition ${selectedSeason?.seasonNumber === season.seasonNumber ? 'bg-accent text-primary' : 'bg-primary hover:bg-slate-600'}`}
                                                >
                                                    فصل {season.seasonNumber}
                                                </button>
                                            ))}
                                        </div>
                                        {selectedSeason && (
                                            <div className="space-y-3">
                                                {selectedSeason.episodes.map(episode => (
                                                    <div key={episode.episodeNumber} className="bg-primary/50 p-3 rounded-lg">
                                                        <details>
                                                            <summary className="font-semibold cursor-pointer">قسمت {episode.episodeNumber}: {episode.title}</summary>
                                                            <div className="pt-3 mt-3 border-t border-slate-700 space-y-4">
                                                                {episode.streamUrl && (
                                                                    <button 
                                                                        onClick={() => handleWatchOnlineClick(episode.streamUrl!)}
                                                                        className="w-full flex items-center justify-center gap-2 bg-red-600/90 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-700 transition"
                                                                    >
                                                                        <LockClosedIcon className="w-4 h-4" />
                                                                        <PlayCircleIcon className="w-5 h-5" />
                                                                        <span>پخش آنلاین (ویژه)</span>
                                                                    </button>
                                                                )}
                                                                {renderDownloadLinks(episode.downloadLinks, `${contentItem.title} S${selectedSeason.seasonNumber}E${episode.episodeNumber}`)}
                                                            </div>
                                                        </details>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                             {/* Comments Section */}
                            <div className="bg-secondary p-6 rounded-lg">
                                <button 
                                    onClick={() => setShowComments(!showComments)}
                                    className="text-xl font-bold border-r-4 border-accent pr-3 mb-4 w-full text-right"
                                >
                                    نظرات کاربران ({contentItem.comments?.length || 0})
                                </button>
                                {showComments && (
                                    <div className="space-y-6 mt-4">
                                        {contentItem.comments && contentItem.comments.length > 0 ? (
                                            [...contentItem.comments].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(comment => (
                                                <div key={comment.id} className="bg-primary p-4 rounded-md">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <p className="font-bold text-accent">{comment.username}</p>
                                                        <p className="text-xs text-text-dark">{new Date(comment.timestamp).toLocaleDateString('fa-IR')}</p>
                                                    </div>
                                                    <p>{comment.text}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-text-dark">هنوز نظری ثبت نشده است. اولین نفر باشید!</p>
                                        )}

                                        <div className="border-t border-slate-600 pt-6">
                                            {context.currentUser ? (
                                                <form onSubmit={handleCommentSubmit}>
                                                    <h3 className="text-lg font-semibold mb-2">نظر خود را بنویسید</h3>
                                                    <textarea
                                                        value={newComment}
                                                        onChange={(e) => setNewComment(e.target.value)}
                                                        className="w-full bg-primary p-2 rounded border border-slate-600 focus:outline-none focus:ring-2 focus:ring-accent"
                                                        rows={3}
                                                        placeholder="نظر شما..."
                                                        required
                                                    ></textarea>
                                                    <button type="submit" className="mt-2 bg-accent text-primary font-bold py-2 px-6 rounded-md hover:bg-accent-hover transition">ارسال نظر</button>
                                                </form>
                                            ) : (
                                                <p className="text-text-dark">برای ثبت نظر، لطفا <Link to="/login" className="text-accent hover:underline">وارد شوید</Link>.</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar with similar content */}
                        <aside className="w-full lg:w-1/4 space-y-8">
                            <div>
                                <h3 className="text-xl font-bold mb-4 border-r-4 border-accent pr-3">فیلم و سریال‌های مشابه</h3>
                                <div className="space-y-4">
                                    {similarContent.map((item: Movie) => {
                                        const detailPath = `/${item.type === 'Movie' ? 'movies' : 'series'}/${slugify(item.title)}`;
                                        return (
                                            <Link to={detailPath} key={item.id} className="flex items-center gap-4 group cursor-pointer">
                                                <div className="relative w-16 h-24 flex-shrink-0">
                                                    {getLanguageBadge(item.languageDetails)}
                                                    <img src={item.posterUrl.replace('/400/600', '/100/150')} alt={item.title} className="w-full h-full object-cover rounded-md" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-sm text-text-light group-hover:text-accent transition">{item.title}</h4>
                                                    <p className="text-xs text-text-dark">{item.year} &bull; {item.rating.toFixed(1)}/10</p>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
            <Footer />

            {/* Online Watch Modal */}
            {isWatchingOnline && onlineWatchUrl && (
                <div 
                    className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4" 
                    onClick={() => setIsWatchingOnline(false)}
                    dir="ltr"
                >
                    <div 
                        className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl" 
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button 
                            onClick={() => setIsWatchingOnline(false)} 
                            className="absolute top-2 right-3 text-white text-4xl font-bold hover:text-accent transition z-10"
                            aria-label="بستن"
                        >
                            &times;
                        </button>
                        <iframe
                            className="w-full h-full"
                            src={onlineWatchUrl}
                            title={`پخش آنلاین ${contentItem.title}`}
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

export default DetailPage;