import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import type { SupportMessage } from '../types';

const SubscriptionActivator: React.FC<{ userId: string }> = ({ userId }) => {
    const context = useContext(AppContext);
    const [duration, setDuration] = useState<number>(1);
    const [unit, setUnit] = useState<'days' | 'months' | 'years'>('months');

    const handleActivate = () => {
        if (!duration || duration <= 0) {
            alert('لطفا یک مدت زمان معتبر وارد کنید.');
            return;
        }
        context?.activateSubscription(userId, duration, unit);
        alert('اشتراک کاربر با موفقیت فعال شد.');
    };

    return (
        <div className="flex items-center gap-2 mt-2">
            <input 
                type="number"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value, 10))}
                className="w-16 bg-primary p-1 rounded border border-secondary text-sm"
            />
            <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as 'days' | 'months' | 'years')}
                className="bg-primary p-1 rounded border border-secondary text-sm"
            >
                <option value="days">روز</option>
                <option value="months">ماه</option>
                <option value="years">سال</option>
            </select>
            <button onClick={handleActivate} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm">
                فعال‌سازی
            </button>
        </div>
    );
};


const SupportMessages: React.FC = () => {
    const context = useContext(AppContext);
    const [showResolved, setShowResolved] = useState(false);

    if (!context) {
        return <div>در حال بارگذاری...</div>;
    }

    const { supportMessages, resolveSupportMessage } = context;

    const filteredMessages = supportMessages.filter(m => showResolved ? m.isResolved : !m.isResolved);

    return (
        <div>
             <div className="flex items-center gap-4 mb-4">
                <h3 className="font-semibold">فیلتر نمایش:</h3>
                <button 
                    onClick={() => setShowResolved(false)}
                    className={`px-4 py-1.5 rounded-full text-sm ${!showResolved ? 'bg-accent text-primary' : 'bg-primary hover:bg-slate-600'}`}
                >
                    بررسی نشده ({supportMessages.filter(m => !m.isResolved).length})
                </button>
                <button 
                    onClick={() => setShowResolved(true)}
                    className={`px-4 py-1.5 rounded-full text-sm ${showResolved ? 'bg-accent text-primary' : 'bg-primary hover:bg-slate-600'}`}
                >
                    بررسی شده ({supportMessages.filter(m => m.isResolved).length})
                </button>
            </div>
             <div className="space-y-4">
                {filteredMessages.length === 0 && <p className="text-text-dark text-center p-8 bg-secondary rounded-lg">هیچ پیامی برای نمایش وجود ندارد.</p>}
                {filteredMessages.map(msg => (
                    <div key={msg.id} className={`p-4 rounded-lg shadow-md ${msg.isResolved ? 'bg-primary/50' : 'bg-secondary'}`}>
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                           <div className="flex-grow">
                                <div className="flex items-center gap-4 mb-2">
                                    <span className="font-bold text-accent">{msg.username}</span>
                                    <span className="text-xs text-text-dark">{new Date(msg.timestamp).toLocaleString('fa-IR')}</span>
                                </div>
                                <p className="text-text-light mb-4 whitespace-pre-wrap">{msg.text}</p>
                                <SubscriptionActivator userId={msg.userId} />
                           </div>
                           <div className="flex-shrink-0 flex flex-col items-end gap-2 w-full sm:w-auto">
                                {msg.imageUrl && (
                                    <a href={msg.imageUrl} target="_blank" rel="noopener noreferrer" className="self-end sm:self-auto">
                                        <img src={msg.imageUrl} alt="فیش پیوست" className="w-24 h-32 object-cover rounded-md border-2 border-slate-600 hover:border-accent transition" />
                                    </a>
                                )}
                                <button
                                    onClick={() => resolveSupportMessage(msg.id, msg.isResolved)}
                                    className={`w-full sm:w-auto px-3 py-1 rounded text-sm text-white ${msg.isResolved ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                                >
                                    {msg.isResolved ? 'بازگردانی به بررسی نشده' : 'علامت‌گذاری به عنوان بررسی شده'}
                                </button>
                           </div>
                        </div>
                    </div>
                ))}
             </div>
        </div>
    );
};

export default SupportMessages;