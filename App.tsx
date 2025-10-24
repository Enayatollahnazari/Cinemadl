import React, { useState, createContext, useMemo, useCallback, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabase';
import type { Movie, User, SupportMessage, Comment } from './types';
import { mockMovies, mockSeries, mockUsers } from './data';
import { AuthApiError } from '@supabase/supabase-js';

import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SubscriptionPage from './pages/SubscriptionPage';
import ProfilePage from './pages/ProfilePage';
import DetailPage from './pages/DetailPage';
import AboutPage from './pages/AboutPage';
import SupportPage from './pages/SupportPage';
import HelpPage from './pages/HelpPage';
import RulesPage from './pages/RulesPage';
import ListingPage from './pages/ListingPage';
import GenresListPage from './pages/GenresListPage';
import WatchlistPage from './pages/WatchlistPage';

interface AppContextType {
    movies: Movie[];
    series: Movie[];
    users: User[];
    supportMessages: SupportMessage[];
    currentUser: User | null;
    loading: boolean;
    addMovie: (movie: Omit<Movie, 'id' | 'views' | 'downloads' | 'comments'>) => Promise<void>;
    updateMovie: (updatedMovie: Movie) => Promise<void>;
    deleteMovie: (id: string, type: 'Movie' | 'Series') => Promise<void>;
    loginUser: (email: string, password?: string) => Promise<User>;
    logoutUser: () => Promise<void>;
    registerUser: (username: string, email?: string, password?: string) => Promise<void>;
    deactivateSubscription: (userId: string) => Promise<void>;
    addComment: (contentId: string, type: 'Movie' | 'Series', commentText: string) => Promise<void>;
    incrementViewCount: (contentId: string, type: 'Movie' | 'Series') => Promise<void>;
    recordDownload: (contentId: string, type: 'Movie' | 'Series') => Promise<void>;
    addSupportMessage: (text: string, imageUrl?: string) => Promise<void>;
    activateSubscription: (userId: string, duration: number, unit: 'days' | 'months' | 'years') => Promise<void>;
    resolveSupportMessage: (messageId: string, isResolved: boolean) => Promise<void>;
    toggleWatchlist: (contentId: string) => Promise<void>;
}

export const AppContext = createContext<AppContextType | null>(null);

const App: React.FC = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [series, setSeries] = useState<Movie[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const initializeApp = async () => {
            try {
                const { count } = await supabase.from('content').select('*', { count: 'exact', head: true });

                if (count === 0) {
                    console.log('Content table is empty, seeding with mock data...');
                    const allMockContent = [...mockMovies, ...mockSeries];
                    
                    const potentialMissingColumns: (keyof Movie)[] = [
                        'title', 'description', 'posterUrl', 'backdropUrl', 'rating', 'year', 
                        'genres', 'quality', 'type', 'country', 'languageDetails', 'director', 
                        'stars', 'seasons', 'downloadLinks', 'featured', 'duration', 'trailerUrl', 
                        'streamUrl', 'comments', 'views', 'downloads'
                    ];
                    
                    let seedData: any[] = allMockContent.map(({ id, ...data }) => data);
                    let { error } = await supabase.from('content').insert(seedData);
                    let removedColumns: string[] = [];

                    while (error && error.message.includes("Could not find the") && error.message.includes("column of 'content'")) {
                        const missingColumn = potentialMissingColumns.find(col => error!.message.includes(`'${col}'`));
                        
                        if (missingColumn && !removedColumns.includes(missingColumn)) {
                            console.warn(`Seeding failed due to missing '${missingColumn}' column. Retrying without it.`);
                            console.warn(`For best results, please add a '${missingColumn}' column to your 'content' table in Supabase.`);
                            
                            removedColumns.push(missingColumn);

                            seedData = allMockContent.map(item => {
                                const { id, ...rest } = item;
                                const newItem: any = { ...rest };
                                removedColumns.forEach(col => delete newItem[col]);
                                return newItem;
                            });

                            const result = await supabase.from('content').insert(seedData);
                            error = result.error;
                        } else {
                            console.error("Seeding failed with a column that wasn't expected to be missing, or a persistent error occurred. Please check your table schema.", error);
                            break; 
                        }
                    }

                    if (error) {
                        throw error;
                    }
                    
                    console.log('Database seeded successfully.');
                }
            } catch (error: any) {
                if (error && error.code === '42501') {
                     console.warn(
                        "Seeding skipped due to Supabase Row Level Security (RLS) policies. " +
                        "This is expected if RLS is enabled for the 'content' table. " +
                        "The app will now fall back to local mock data. " +
                        "To use Supabase data, please disable RLS for the 'content' table or create a policy that allows anonymous inserts."
                    );
                } else {
                    console.error('Error during database seeding:', error);
                }
            } finally {
                setIsInitialized(true);
            }
        };
        initializeApp();
    }, []);

    const fetchData = useCallback(async (user: User | null) => {
        try {
            const { data: contentData, error: contentError } = await supabase
                .from('content')
                .select('*')
                .order('year', { ascending: false });
            
            if (contentError) throw contentError;

            if (contentData && contentData.length > 0) {
                setMovies(contentData.filter(c => c.type === 'Movie'));
                setSeries(contentData.filter(c => c.type === 'Series'));
            } else if (isInitialized) {
                console.warn("Supabase 'content' table is empty. Falling back to local mock data.");
                setMovies(mockMovies);
                setSeries(mockSeries);
            }

            setUsers([]);
            setSupportMessages([]);

            if (user?.username === 'Enayatollah') {
                const { data: usersData, error: usersError } = await supabase.from('users').select('*');
                if (usersError) throw usersError;

                if (usersData && usersData.length > 0) {
                    setUsers(usersData);
                } else if (isInitialized) {
                    console.warn("Supabase 'users' table is empty. Falling back to local mock data for admin view.");
                    setUsers(mockUsers);
                }
            
                const { data: messagesData, error: messagesError } = await supabase
                    .from('supportMessages')
                    .select('*')
                    .order('timestamp', { ascending: false });
                if (messagesError) throw messagesError;
                setSupportMessages(messagesData || []);
            }
        } catch (error) {
            console.error("Error fetching data from Supabase: ", error);
            console.warn("Falling back to local mock data due to fetch error.");
            setMovies(mockMovies);
            setSeries(mockSeries);
            setUsers(user?.username === 'Enayatollah' ? mockUsers : []);
            setSupportMessages([]);
        }
    }, [isInitialized]);

    useEffect(() => {
        if (!isInitialized) return;

        const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setLoading(true);
            let appUser: User | null = null;
            if (session?.user) {
                const { data: profile } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();
                appUser = profile;
            }
            setCurrentUser(appUser);
            await fetchData(appUser);
            setLoading(false);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [isInitialized, fetchData]);

    const registerUser = useCallback(async (username: string, email?: string, password?: string): Promise<void> => {
        const registrationEmail = email || `${username.toLowerCase().replace(/\s/g, '_')}@cinemadownload.app`;
        const { error } = await supabase.auth.signUp({
            email: registrationEmail,
            password: password!,
            options: {
                data: {
                    username: username,
                }
            }
        });

        if (error) {
            if (error.message.includes("User already registered") && !email) {
                throw new AuthApiError("این نام کاربری قبلا استفاده شده است.", error.status || 400);
            }
            throw error;
        }
    }, []);

    const loginUser = useCallback(async (email: string, password?: string): Promise<User> => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password!,
        });

        if (error) throw error;
        if (!data.user) throw new Error("Login failed, no user returned.");
        
        const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single();
        
        // 'PGRST116' is the code for "No rows found" which is expected if profile doesn't exist yet
        if (profileError && profileError.code !== 'PGRST116') {
            throw profileError;
        }

        if (profile) {
            return profile;
        }

        // Profile doesn't exist, create it.
        const newProfileData: User = {
            id: data.user.id,
            username: data.user.user_metadata.username,
            subscriptionActive: false,
            watchlist: [],
        };

        const { data: newProfile, error: insertError } = await supabase
            .from('users')
            .insert(newProfileData)
            .select()
            .single();
        
        if (insertError) {
            await supabase.auth.signOut();
            console.error('Failed to create user profile on first login:', insertError);
            throw new Error('Could not create your user profile. Please contact support.');
        }

        return newProfile;
    }, []);

    const logoutUser = useCallback(async () => {
        await supabase.auth.signOut();
    }, []);

    const toggleWatchlist = useCallback(async (contentId: string) => {
        if (!currentUser) return;

        const currentWatchlist = currentUser.watchlist || [];
        const isInWatchlist = currentWatchlist.includes(contentId);
        const newWatchlist = isInWatchlist
            ? currentWatchlist.filter(id => id !== contentId)
            : [...currentWatchlist, contentId];
        
        setCurrentUser(prev => prev ? { ...prev, watchlist: newWatchlist } : null);

        const { error } = await supabase
            .from('users')
            .update({ watchlist: newWatchlist })
            .eq('id', currentUser.id);

        if (error) {
            console.error("Failed to update watchlist:", error);
            setCurrentUser(prev => prev ? { ...prev, watchlist: currentWatchlist } : null);
            alert('خطا در به‌روزرسانی لیست تماشا. لطفا دوباره تلاش کنید.');
        }
    }, [currentUser]);

    const activateSubscription = useCallback(async (userId: string, duration: number, unit: 'days' | 'months' | 'years') => {
        const now = new Date();
        const endDate = new Date(now);

        if (unit === 'days') endDate.setDate(now.getDate() + duration);
        else if (unit === 'months') endDate.setMonth(now.getMonth() + duration);
        else if (unit === 'years') endDate.setFullYear(now.getFullYear() + duration);
        
        const updatedFields = { subscriptionActive: true, subscriptionEndDate: endDate.toISOString() };
        
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedFields } : u));

        const { error } = await supabase.from('users').update(updatedFields).eq('id', userId);
        if (error) {
            console.error("Failed to activate subscription:", error);
            // Simple rollback for this example, a more robust solution might be needed
            fetchData(currentUser); 
            alert('خطا در فعال‌سازی اشتراک. لطفا دوباره تلاش کنید.');
        }
    }, [currentUser, fetchData]);

    const deactivateSubscription = useCallback(async (userId: string) => {
        const updatedFields = { subscriptionActive: false, subscriptionEndDate: null };
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedFields } : u));
        
        const { error } = await supabase.from('users').update(updatedFields).eq('id', userId);
        if (error) {
            console.error("Failed to deactivate subscription:", error);
            fetchData(currentUser);
            alert('خطا در غیرفعال کردن اشتراک. لطفا دوباره تلاش کنید.');
        }
    }, [currentUser, fetchData]);

    const addMovie = useCallback(async (movie: Omit<Movie, 'id' | 'views' | 'downloads' | 'comments'>) => {
        const movieData = {
            ...movie,
            views: 0,
            downloads: [],
            comments: [],
            createdAt: new Date().toISOString(),
        };
        const { data, error } = await supabase.from('content').insert(movieData).select().single();
        if (error) throw error;
        
        const newMovie = data as Movie;
        if (newMovie.type === 'Movie') {
            setMovies(prev => [newMovie, ...prev]);
        } else {
            setSeries(prev => [newMovie, ...prev]);
        }
    }, []);

    const updateMovie = useCallback(async (updatedMovie: Movie) => {
        const { id, ...movieData } = updatedMovie;
        const { error } = await supabase.from('content').update(movieData).eq('id', id);
        if (error) throw error;

        const updater = (prev: Movie[]) => prev.map(m => m.id === id ? updatedMovie : m);
        if (updatedMovie.type === 'Movie') setMovies(updater);
        else setSeries(updater);
    }, []);

    const deleteMovie = useCallback(async (id: string, type: 'Movie' | 'Series') => {
        const { error } = await supabase.from('content').delete().eq('id', id);
        if (error) throw error;

        const remover = (prev: Movie[]) => prev.filter(m => m.id !== id);
        if (type === 'Movie') setMovies(remover);
        else setSeries(remover);
    }, []);

    const addComment = useCallback(async (contentId: string, type: 'Movie' | 'Series', commentText: string) => {
        if (!currentUser) return;
        const newComment: Comment = {
            id: `comment-${Date.now()}`,
            userId: currentUser.id,
            username: currentUser.username,
            text: commentText,
            timestamp: new Date().toISOString(),
        };
        
        const { data: currentContent, error: fetchError } = await supabase.from('content').select('comments').eq('id', contentId).single();
        if (fetchError) throw fetchError;

        const updatedComments = [...(currentContent?.comments || []), newComment];
        const { error: updateError } = await supabase.from('content').update({ comments: updatedComments }).eq('id', contentId);
        if (updateError) throw updateError;
        
        const updater = (prev: Movie[]) => prev.map(m => m.id === contentId ? { ...m, comments: updatedComments } : m);
        if (type === 'Movie') setMovies(updater);
        else setSeries(updater);
    }, [currentUser]);
    
    const incrementViewCount = useCallback(async (contentId: string, type: 'Movie' | 'Series') => {
        const { data, error } = await supabase.from('content').select('views').eq('id', contentId).single();
        if (error) { console.error(error); return; }
        
        const newViews = (data?.views || 0) + 1;
        await supabase.from('content').update({ views: newViews }).eq('id', contentId);
    }, []);

    const recordDownload = useCallback(async (contentId: string, type: 'Movie' | 'Series') => {
         const { data, error } = await supabase.from('content').select('downloads').eq('id', contentId).single();
        if (error) { console.error(error); return; }

        const updatedDownloads = [...(data?.downloads || []), { timestamp: new Date().toISOString() }];
        await supabase.from('content').update({ downloads: updatedDownloads }).eq('id', contentId);
    }, []);

    const addSupportMessage = useCallback(async (text: string, imageUrl?: string) => {
        if (!currentUser) return;
        const newMessage: Omit<SupportMessage, 'id'> = {
            userId: currentUser.id,
            username: currentUser.username,
            text,
            imageUrl,
            timestamp: new Date().toISOString(),
            isResolved: false
        };
        const { data, error } = await supabase.from('supportMessages').insert(newMessage).select().single();
        if (error) throw error;

        setSupportMessages(prev => [data, ...prev]);
    }, [currentUser]);

    const resolveSupportMessage = useCallback(async (messageId: string, isResolved: boolean) => {
        const { error } = await supabase.from('supportMessages').update({ isResolved: !isResolved }).eq('id', messageId);
        if (error) throw error;

        setSupportMessages(prev => prev.map(msg => msg.id === messageId ? { ...msg, isResolved: !isResolved } : msg));
    }, []);

    const contextValue = useMemo(() => ({
        movies, series, users, supportMessages, currentUser, loading, addMovie, updateMovie, deleteMovie, loginUser, logoutUser, registerUser, deactivateSubscription, addComment, incrementViewCount, recordDownload, addSupportMessage, activateSubscription, resolveSupportMessage, toggleWatchlist,
    }), [movies, series, users, supportMessages, currentUser, loading, addMovie, updateMovie, deleteMovie, loginUser, logoutUser, registerUser, deactivateSubscription, addComment, incrementViewCount, recordDownload, addSupportMessage, activateSubscription, resolveSupportMessage, toggleWatchlist]);

    if (loading || !isInitialized) {
        return (
            <div className="bg-primary min-h-screen flex items-center justify-center">
                <div className="text-accent text-xl font-bold">در حال بارگذاری...</div>
            </div>
        );
    }

    return (
        <AppContext.Provider value={contextValue}>
            <HashRouter>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/movies" element={<ListingPage />} />
                    <Route path="/movies/:slug" element={<DetailPage />} />
                    <Route path="/series" element={<ListingPage />} />
                    <Route path="/series/:slug" element={<DetailPage />} />
                    <Route path="/genres" element={<GenresListPage />} />
                    <Route path="/genres/:genreName" element={<ListingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/subscription" element={<SubscriptionPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/help" element={<HelpPage />} />
                    <Route path="/rules" element={<RulesPage />} />
                    <Route path="/profile" element={currentUser ? <ProfilePage /> : <Navigate to="/login" />} />
                    <Route path="/support" element={currentUser ? <SupportPage /> : <Navigate to="/login" />} />
                    <Route path="/watchlist" element={currentUser ? <WatchlistPage /> : <Navigate to="/login" />} />
                    <Route path="/admin" element={currentUser?.username === 'Enayatollah' ? <AdminPage /> : <Navigate to="/" />} />
                </Routes>
            </HashRouter>
        </AppContext.Provider>
    );
};

export default App;