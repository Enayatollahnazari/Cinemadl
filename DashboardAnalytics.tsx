import React from 'react';
import type { Movie, User } from '../types';

interface DashboardAnalyticsProps {
    allContent: Movie[];
    users: User[];
}

const StatCard: React.FC<{ title: string; value: string | number, description: string }> = ({ title, value, description }) => (
    <div className="bg-secondary p-6 rounded-lg shadow-lg">
        <h3 className="text-sm font-medium text-text-dark uppercase">{title}</h3>
        <p className="text-3xl font-bold text-accent mt-2">{value}</p>
        <p className="text-xs text-text-dark mt-1">{description}</p>
    </div>
);

const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({ allContent, users }) => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    
    const currentDayOfWeek = now.getDay(); // Sunday is 0, Saturday is 6
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - currentDayOfWeek); // Assuming week starts on Sunday
    weekStart.setHours(0, 0, 0, 0);
    const weekStartTs = weekStart.getTime();

    const monthStartTs = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    let downloadsToday = 0;
    let downloadsThisWeek = 0;
    let downloadsThisMonth = 0;
    const totalViews = allContent.reduce((sum, item) => sum + item.views, 0);
    const totalDownloads = allContent.reduce((sum, item) => sum + item.downloads.length, 0);
    const totalUsers = users.length;
    const activeSubscribers = users.filter(u => u.subscriptionActive).length;

    allContent.forEach(item => {
        item.downloads.forEach(download => {
            const downloadTs = new Date(download.timestamp).getTime();
            if (downloadTs >= todayStart) {
                downloadsToday++;
            }
            if (downloadTs >= weekStartTs) {
                downloadsThisWeek++;
            }
            if (downloadTs >= monthStartTs) {
                downloadsThisMonth++;
            }
        });
    });

    return (
        <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="کل کاربران" value={totalUsers.toLocaleString('fa-IR')} description="تعداد کل کاربران ثبت‌نام کرده" />
                <StatCard title="مشترکین فعال" value={activeSubscribers.toLocaleString('fa-IR')} description="تعداد کاربران با اشتراک فعال" />
                <StatCard title="دانلودهای امروز" value={downloadsToday.toLocaleString('fa-IR')} description="تعداد کل دانلودهای ثبت شده امروز" />
                <StatCard title="دانلودهای این ماه" value={downloadsThisMonth.toLocaleString('fa-IR')} description="از ابتدای ماه جاری میلادی" />
            </div>

            {/* Content Stats Table */}
             <div className="bg-secondary rounded-lg shadow-lg overflow-hidden">
                <h3 className="text-xl font-bold p-4 border-b border-slate-600">آمار بازدید و دانلود محتوا</h3>
                <div className="overflow-x-auto max-h-[500px]">
                    <table className="w-full min-w-[400px] text-right">
                        <thead className="bg-primary/50 sticky top-0">
                            <tr>
                                <th className="p-4">عنوان</th>
                                <th className="p-4">بازدید کل</th>
                                <th className="p-4">دانلود کل</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allContent.sort((a,b) => b.views - a.views).map(item => (
                                <tr key={item.id} className="border-b border-slate-600 hover:bg-primary/30">
                                    <td className="p-4 font-semibold">{item.title}</td>
                                    <td className="p-4">{item.views.toLocaleString('fa-IR')}</td>
                                    <td className="p-4">{item.downloads.length.toLocaleString('fa-IR')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardAnalytics;