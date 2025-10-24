import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { AppContext } from '../App';
import { supabase } from '../supabase';
import Navbar from '../components/Navbar';


const SupportPage: React.FC = () => {
    const [message, setMessage] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const context = useContext(AppContext);
    const navigate = useNavigate();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setError('حجم تصویر نباید بیشتر از 5 مگابایت باشد.');
                return;
            }
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImage(null);
            setImagePreview(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !image) {
            setError('لطفا هم پیام و هم تصویر فیش را ضمیمه کنید.');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess('');
        
        try {
            // 1. Upload image to Supabase Storage
            const filePath = `support-images/${Date.now()}-${image.name}`;
            const { error: uploadError } = await supabase.storage
                .from('support-images') // Assuming a bucket named 'support-images'
                .upload(filePath, image);
            
            if (uploadError) throw uploadError;

            // 2. Get the public URL of the uploaded image
            const { data: urlData } = supabase.storage
                .from('support-images')
                .getPublicUrl(filePath);

            const downloadURL = urlData.publicUrl;

            // 3. Add message with URL to context (which saves to Supabase table)
            await context?.addSupportMessage(message, downloadURL);

            setSuccess('پیام شما با موفقیت ارسال شد. پس از بررسی، اشتراک شما فعال خواهد شد.');
            setMessage('');
            setImage(null);
            setImagePreview(null);
            
            setTimeout(() => {
                navigate('/profile');
            }, 3000);

        } catch (err: any) {
            console.error("Error submitting message: ", err);
            setError(`خطایی در ارسال پیام رخ داد: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-primary min-h-screen flex flex-col">
            <Header />
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-12">
                <div className="bg-secondary p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
                    <h1 className="text-2xl font-bold text-center text-accent mb-6">ارسال پیام به پشتیبانی</h1>
                    <p className="text-center text-text-dark mb-6">در این بخش می‌توانید فیش واریزی خود را برای فعال‌سازی اشتراک ارسال کنید.</p>
                    
                    {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-md mb-4 text-sm">{error}</p>}
                    {success && <p className="bg-green-500/20 text-green-400 p-3 rounded-md mb-4 text-sm">{success}</p>}

                    {!success && (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-text-light mb-1">پیام شما</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="مثال: لطفا اشتراک من را با نام کاربری testuser@example.com فعال کنید."
                                    rows={4}
                                    className="w-full bg-primary border border-slate-600 rounded-md px-3 py-2 text-text-light focus:outline-none focus:ring-2 focus:ring-accent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-light mb-1">ضمیمه کردن فیش پرداخت</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full text-sm text-text-dark file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-text-light hover:file:bg-accent hover:file:text-primary"
                                    required
                                />
                            </div>
                            {imagePreview && (
                                <div className="mt-4">
                                    <p className="text-sm text-text-dark mb-2">پیش‌نمایش تصویر:</p>
                                    <img src={imagePreview} alt="پیش‌نمایش فیش" className="max-w-xs max-h-64 rounded-lg border border-slate-600" />
                                </div>
                            )}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-accent hover:bg-accent-hover text-primary font-bold py-2 px-4 rounded-md transition disabled:bg-slate-500 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'در حال ارسال...' : 'ارسال پیام'}
                            </button>
                        </form>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default SupportPage;