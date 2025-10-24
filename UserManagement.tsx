import React, { useState, useContext, useMemo } from 'react';
import { AppContext } from '../App';

const UserManagement: React.FC = () => {
    const context = useContext(AppContext);
    const [showSubscribedOnly, setShowSubscribedOnly] = useState(false);
    const [actions, setActions] = useState<{ [key: string]: string }>({});

    if (!context) {
        return <div>در حال بارگذاری...</div>;
    }

    const { users, activateSubscription, deactivateSubscription } = context;

    const regularUsers = useMemo(() => 
        users.filter(user => user.username !== 'admin'),
        [users]
    );

    const displayedUsers = useMemo(() => {
        return showSubscribedOnly ? regularUsers.filter(u => u.subscriptionActive) : regularUsers;
    }, [regularUsers, showSubscribedOnly]);

    const handleActionChange = (userId: string, value: string) => {
        setActions(prev => ({ ...prev, [userId]: value }));
    };

    const handleApplyAction = (userId: string) => {
        const action = actions[userId];
        if (!action) return;
        
        if (action === 'deactivate') {
            if (window.confirm(`آیا از غیرفعال کردن اشتراک این کاربر مطمئن هستید؟`)) {
                deactivateSubscription(userId);
            }
        } else {
            const months = parseInt(action, 10);
            if (window.confirm(`آیا از فعال کردن اشتراک ${months} ماهه برای این کاربر مطمئن هستید؟`)) {
                activateSubscription(userId, months, 'months');
            }
        }
        // Reset the select after applying
        setActions(prev => {
            const newActions = { ...prev };
            delete newActions[userId];
            return newActions;
        });
    };

    return (
        <div>
             <div className="flex items-center gap-4 mb-4">
                <h3 className="font-semibold">فیلتر نمایش:</h3>
                <button 
                    onClick={() => setShowSubscribedOnly(false)}
                    className={`px-4 py-1.5 rounded-full text-sm ${!showSubscribedOnly ? 'bg-accent text-primary' : 'bg-primary hover:bg-slate-600'}`}
                >
                    همه کاربران
                </button>
                <button 
                    onClick={() => setShowSubscribedOnly(true)}
                    className={`px-4 py-1.5 rounded-full text-sm ${showSubscribedOnly ? 'bg-accent text-primary' : 'bg-primary hover:bg-slate-600'}`}
                >
                    فقط مشترکین فعال
                </button>
            </div>
            <div className="bg-secondary rounded-lg shadow-lg overflow-x-auto">
                <table className="w-full min-w-[700px] text-right">
                    <thead className="bg-primary/50">
                        <tr>
                            <th className="p-4">نام کاربری</th>
                            <th className="p-4">وضعیت اشتراک</th>
                            <th className="p-4">تاریخ انقضا</th>
                            <th className="p-4">عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedUsers.map(user => (
                            <tr key={user.id} className="border-b border-slate-600 hover:bg-primary/30">
                                <td className="p-4 font-semibold">{user.username}</td>
                                <td className="p-4">
                                    {user.subscriptionActive ? (
                                        <span className="bg-green-500/20 text-green-400 font-bold px-3 py-1 rounded-full text-xs">فعال</span>
                                    ) : (
                                        <span className="bg-red-500/20 text-red-400 font-bold px-3 py-1 rounded-full text-xs">غیرفعال</span>
                                    )}
                                </td>
                                <td className="p-4 font-mono text-sm">
                                    {user.subscriptionEndDate ? new Date(user.subscriptionEndDate).toLocaleDateString('fa-IR') : '---'}
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <select
                                            value={actions[user.id] || ''}
                                            onChange={(e) => handleActionChange(user.id, e.target.value)}
                                            className="bg-primary border border-slate-600 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                                        >
                                            <option value="" disabled>-- انتخاب عملیات --</option>
                                            <option value="deactivate">غیرفعال کردن</option>
                                            <option value="1">فعال‌سازی ۱ ماهه</option>
                                            <option value="2">فعال‌سازی ۲ ماهه</option>
                                            <option value="4">فعال‌سازی ۴ ماهه</option>
                                            <option value="6">فعال‌سازی ۶ ماهه</option>
                                            <option value="12">فعال‌سازی ۱ ساله</option>
                                        </select>
                                        <button 
                                            onClick={() => handleApplyAction(user.id)}
                                            disabled={!actions[user.id]}
                                            className="bg-accent hover:bg-accent-hover text-primary px-3 py-1 rounded text-sm disabled:bg-slate-500 disabled:cursor-not-allowed"
                                        >
                                            اعمال
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;