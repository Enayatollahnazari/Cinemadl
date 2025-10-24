import type { Movie, User, DownloadLink, Season, Comment, SupportMessage, Episode } from './types';

export const famousCountries: string[] = [
    'آمریکا', 'ایران', 'هند', 'کره جنوبی', 'ژاپن', 'بریتانیا', 'فرانسه', 'آلمان', 'ایتالیا', 'اسپانیا',
    'کانادا', 'استرالیا', 'چین', 'روسیه', 'برزیل', 'مکزیک', 'آرژانتین', 'سوئد', 'دانمارک', 'نروژ',
    'ترکیه', 'مصر', 'نیجریه', 'هنگ کنگ', 'لهستان', 'هلند', 'بلژیک', 'ایرلند', 'نیوزلند', 'افغانستان'
];

const sampleComments: Comment[] = [
    { id: 'c1', userId: 'user-2', username: 'testuser', text: 'فیلم فوق‌العاده‌ای بود، حتما ببینید!', timestamp: '2024-05-20T10:00:00Z' },
    { id: 'c2', userId: 'user-3', username: 'subscriber', text: 'از داستانش خیلی خوشم اومد.', timestamp: '2024-05-21T14:30:00Z' },
];

const sampleMovieLinks: DownloadLink[] = [
    { quality: '1080p WEB-DL', url: '#', size: '2.5 GB', subscriptionRequired: true },
    { quality: '720p WEB-DL', url: '#', size: '1.2 GB', subscriptionRequired: false },
    { quality: '480p WEB-DL', url: '#', size: '600 MB', subscriptionRequired: false },
];

const sampleEpisodeLinks: DownloadLink[] = [
    { quality: '1080p x265', url: '#', size: '800 MB', subscriptionRequired: true },
    { quality: '720p', url: '#', size: '450 MB', subscriptionRequired: false },
];

const generateDownloads = (count: number) => {
    const downloads = [];
    for (let i = 0; i < count; i++) {
        const daysAgo = Math.floor(Math.random() * 40); // Downloads in the last 40 days
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        downloads.push({ timestamp: date.toISOString() });
    }
    return downloads;
};

export const mockMovies: Movie[] = [
    {
        id: '1',
        title: 'Ejen Ali: The Movie 2',
        description: 'Super-spy Ejen Ali is back, and this time he must unravel a mysterious plot that threatens the city of Cyberaya. With new gadgets, new allies, and a new threat, Ali must push his skills to the limit to save his city and the world.',
        posterUrl: 'https://picsum.photos/seed/ejenali/400/600',
        backdropUrl: 'https://picsum.photos/seed/ejenalibg/1200/675',
        rating: 8.0,
        year: 2025,
        genres: ['انیمیشن', 'اکشن', 'ماجراجویی'],
        quality: ['WEB-DL', '1080p', '720p', '480p'],
        type: 'Movie',
        duration: 115,
        country: 'مالزی',
        director: 'Usamah Zaid Yasin',
        stars: ['Altimet', 'Amir Bamer', 'Fadhli Shafian'],
        languageDetails: ['دوبله فارسی', 'زبان اصلی'],
        downloadLinks: sampleMovieLinks,
        comments: sampleComments,
        views: 15203,
        downloads: generateDownloads(250),
    },
    {
        id: '2',
        title: 'Caramelo',
        description: 'A heartwarming story about a stray dog who brings a fractured family together. Through his playful antics and unwavering loyalty, Caramelo teaches them the true meaning of love, forgiveness, and home.',
        posterUrl: 'https://picsum.photos/seed/caramelo/400/600',
        backdropUrl: 'https://picsum.photos/seed/caramelobg/1200/675',
        rating: 7.2,
        year: 2025,
        genres: ['خانوادگی', 'درام', 'کمدی'],
        quality: ['WEB-DL', '1080p', '720p'],
        type: 'Movie',
        duration: 101,
        country: 'آمریکا',
        director: 'Sandra Cisneros',
        stars: ['Lupe Ontiveros', 'Sandra Oh', 'E.J. Bonilla'],
        languageDetails: ['دوبله فارسی', 'زیرنویس فارسی'],
        downloadLinks: [
             { quality: '1080p WEB-DL', url: '#', size: '2.1 GB', subscriptionRequired: true },
             { quality: '720p WEB-DL', url: '#', size: '1.0 GB', subscriptionRequired: true },
        ],
        comments: [],
        views: 8941,
        downloads: generateDownloads(120),
    },
     {
        id: '3',
        title: 'Sinners',
        description: 'In a city of corruption, two detectives must race against time to catch a killer who is targeting the city\'s elite. As they delve deeper, they uncover a conspiracy that reaches the highest levels of power, forcing them to confront their own demons.',
        posterUrl: 'https://picsum.photos/seed/sinners/400/600',
        backdropUrl: 'https://picsum.photos/seed/sinnersbg/1200/675',
        rating: 7.9,
        year: 2024,
        genres: ['جنایی', 'هیجان‌انگیز', 'رازآلود'],
        quality: ['HD', '1080p'],
        type: 'Movie',
        featured: true,
        duration: 125,
        country: 'آمریکا',
        director: 'Ryan Coogler',
        stars: ['Michael B. Jordan', 'Jon Bernthal', 'Jacki Weaver'],
        languageDetails: ['زیرنویس فارسی', 'زبان اصلی'],
        trailerUrl: 'https://www.youtube.com/embed/aqz-KE-bpKQ?autoplay=1',
        streamUrl: 'https://www.youtube.com/embed/aqz-KE-bpKQ?autoplay=1',
        downloadLinks: sampleMovieLinks,
        comments: sampleComments,
        views: 25678,
        downloads: generateDownloads(980),
    },
];

export const mockSeries: Movie[] = [
    {
        id: '101',
        title: 'The Last of Us',
        description: 'In a post-apocalyptic world ravaged by a deadly fungus, a hardened survivor named Joel takes charge of a 14-year-old girl, Ellie, who may be humanity\'s last hope. Their journey across a desolate America is a brutal test of survival and humanity.',
        posterUrl: 'https://picsum.photos/seed/tlou/400/600',
        backdropUrl: 'https://picsum.photos/seed/tloubg/1200/675',
        rating: 8.7,
        year: 2023,
        genres: ['اکشن', 'درام', 'ترسناک'],
        quality: ['4K', '1080p'],
        type: 'Series',
        featured: true,
        country: 'آمریکا',
        director: 'Craig Mazin',
        stars: ['Pedro Pascal', 'Bella Ramsey', 'Anna Torv'],
        languageDetails: ['دوبله فارسی', 'زیرنویس فارسی'],
        trailerUrl: 'https://www.youtube.com/embed/uLtkt8BonwM?autoplay=1',
        streamUrl: 'https://www.youtube.com/embed/uLtkt8BonwM?autoplay=1',
        seasons: [
            {
                seasonNumber: 1,
                episodes: Array.from({ length: 9 }, (_, i) => {
                    const episode: Episode = {
                        episodeNumber: i + 1,
                        title: `Episode ${i + 1}`,
                        downloadLinks: sampleEpisodeLinks,
                    };
                    if (i === 0) {
                        episode.streamUrl = 'https://www.youtube.com/embed/uLtkt8BonwM?autoplay=1';
                    }
                    return episode;
                }),
            },
        ],
        comments: sampleComments,
        views: 150000,
        downloads: generateDownloads(8500),
    },
    {
        id: '102',
        title: 'Wednesday',
        description: 'While attending Nevermore Academy, Wednesday Addams attempts to master her emerging psychic ability, thwart a monstrous killing spree, and solve the supernatural mystery that embroiled her parents 25 years ago.',
        posterUrl: 'https://picsum.photos/seed/wednesday/400/600',
        backdropUrl: 'https://picsum.photos/seed/wednesdaybg/1200/675',
        rating: 8.1,
        year: 2022,
        genres: ['کمدی', 'جنایی', 'فانتزی'],
        quality: ['HD', '1080p'],
        type: 'Series',
        country: 'آمریکا',
        director: 'Tim Burton',
        stars: ['Jenna Ortega', 'Gwendoline Christie', 'Riki Lindhome'],
        languageDetails: ['دوبله فارسی'],
        seasons: [
            {
                seasonNumber: 1,
                episodes: Array.from({ length: 8 }, (_, i) => ({
                    episodeNumber: i + 1,
                    title: `Chapter ${i + 1}`,
                    downloadLinks: sampleEpisodeLinks,
                })),
            },
        ],
        views: 120450,
        downloads: generateDownloads(6500),
    },
    {
        id: '103',
        title: 'Dead City',
        description: 'Maggie and Negan travel into a post-apocalyptic Manhattan long ago cut off from the mainland. The crumbling city is filled with the dead and denizens who have made New York City their own world full of anarchy, danger, beauty, and terror.',
        posterUrl: 'https://picsum.photos/seed/deadcity/400/600',
        backdropUrl: 'https://picsum.photos/seed/deadcitybg/1200/675',
        rating: 7.0,
        year: 2023,
        genres: ['ماجراجویی', 'ترسناک', 'هیجان‌انگیز'],
        quality: ['HD', '1080p'],
        type: 'Series',
        country: 'آمریکا',
        director: 'Eli Jorné',
        stars: ['Jeffrey Dean Morgan', 'Lauren Cohan', 'Gaius Charles'],
        languageDetails: ['زیرنویس فارسی'],
        trailerUrl: 'https://www.youtube.com/embed/sY2V-I3a6hE?autoplay=1',
        streamUrl: 'https://www.youtube.com/embed/sY2V-I3a6hE?autoplay=1',
        seasons: [
            {
                seasonNumber: 1,
                episodes: Array.from({ length: 6 }, (_, i) => ({
                    episodeNumber: i + 1,
                    title: `Episode ${i + 1}`,
                    downloadLinks: [
                        { quality: '1080p', url: '#', size: '900 MB', subscriptionRequired: true },
                        { quality: '720p', url: '#', size: '500 MB', subscriptionRequired: true },
                    ],
                })),
            },
        ],
        comments: [sampleComments[0]],
        views: 78345,
        downloads: generateDownloads(3200),
    },
     {
        id: '104',
        title: 'Murderbot',
        description: 'A self-hacking security android is horrified by human emotion and prefers to spend its free time watching a soap operas. But when it discovers a dark conspiracy, it must protect its clients while keeping its own sentience a secret.',
        posterUrl: 'https://picsum.photos/seed/murderbot/400/600',
        backdropUrl: 'https://picsum.photos/seed/murderbotbg/1200/675',
        rating: 8.5,
        year: 2024,
        genres: ['علمی-تخیلی', 'درام'],
        quality: ['HD', '1080p'],
        type: 'Series',
        country: 'کانادا',
        director: 'Chris Weitz',
        stars: ['Alexander Skarsgård', 'David Dastmalchian', 'Noma Dumezoni'],
        languageDetails: ['زبان اصلی', 'زیرنویس فارسی'],
        seasons: [
            {
                seasonNumber: 1,
                episodes: Array.from({ length: 10 }, (_, i) => ({
                    episodeNumber: i + 1,
                    title: `Part ${i + 1}`,
                    downloadLinks: sampleEpisodeLinks,
                })),
            },
        ],
        views: 45010,
        downloads: generateDownloads(1500),
    },
    {
        id: '4',
        title: 'House of the Dragon',
        description: 'The story of the House Targaryen, set 200 years before the events of Game of Thrones. This series chronicles the beginning of the end of the Targaryen dynasty, leading to the civil war known as the "Dance of the Dragons."',
        posterUrl: 'https://picsum.photos/seed/hotd/400/600',
        backdropUrl: 'https://picsum.photos/seed/hotdbg/1200/675',
        rating: 8.5,
        year: 2022,
        genres: ['اکشن', 'ماجراجویی', 'درام'],
        quality: ['4K', '1080p'],
        type: 'Series',
        featured: true,
        country: 'آمریکا',
        director: 'Ryan Condal',
        stars: ['Paddy Considine', 'Matt Smith', 'Olivia Cooke'],
        languageDetails: ['دوبله فارسی', 'زیرنویس فارسی', 'زبان اصلی'],
        trailerUrl: 'https://www.youtube.com/embed/DotnJ7tTA34?autoplay=1',
        streamUrl: 'https://www.youtube.com/embed/DotnJ7tTA34?autoplay=1',
        seasons: [
            {
                seasonNumber: 1,
                episodes: Array.from({ length: 10 }, (_, i) => ({
                    episodeNumber: i + 1,
                    title: `The Heirs of the Dragon - E${i + 1}`,
                    downloadLinks: sampleEpisodeLinks,
                })),
            },
             {
                seasonNumber: 2,
                episodes: Array.from({ length: 8 }, (_, i) => ({
                    episodeNumber: i + 1,
                    title: `A Son for a Son - E${i + 1}`,
                    downloadLinks: sampleEpisodeLinks,
                })),
            },
        ],
        comments: sampleComments,
        views: 215340,
        downloads: generateDownloads(11000),
    }
];

export const mockUsers: User[] = [
    { id: 'admin-user', username: 'Enayatollah', subscriptionActive: true, subscriptionEndDate: '2099-12-31T23:59:59Z' },
    { id: 'test-user-1', username: 'testuser', subscriptionActive: false },
    { id: 'test-user-2', username: 'subscriber', subscriptionActive: true, subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() },
];