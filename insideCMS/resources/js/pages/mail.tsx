import { dashboard, login, reviews, register as registerRoute } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';

interface PageProps {
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function Mail() {
    const { auth, modules, flash } = usePage<SharedData & PageProps>().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        subject: '',
        phone: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/mail/send', {
            onSuccess: () => {
                toast.success(flash?.success || 'Письмо успешно отправлено');
                reset();
            },
            onError: () => {
                toast.error(flash?.error || 'Ошибка отправки письма');
            },
        });
    };


    return (
        <>
            <Head title="Mail">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full py-6 max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        <Link
                            href={reviews()}
                            className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                        >
                            Отзывы
                        </Link>     
                        {auth.user ? (
                            <>
                            <Link
                                href={dashboard()}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Личный кабинет
                            </Link>
                            {modules?.info?.is_active && (
                                <Link
                                    href="/info"
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Информация о пользователе
                                </Link>
                            )}
                            </>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Войти
                                </Link>
                                <Link
                                    href={registerRoute()}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Регистрация
                                </Link>
                            </>
                        )}
                    </nav>
                </header>
                <main className="py-6">
                    <div className="container max-w-2xl mx-auto">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label>Имя</label>
                                <input 
                                    type="text" 
                                    value={data.name} 
                                    onChange={e => setData('name', e.target.value)}
                                    className="w-full px-4 py-2 border rounded"
                                />
                                {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
                            </div>

                            <div>
                                <label>Email</label>
                                <input 
                                    type="email" 
                                    value={data.email} 
                                    onChange={e => setData('email', e.target.value)}
                                    className="w-full px-4 py-2 border rounded"
                                />
                                {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
                            </div>

                            <div>
                                <label>Телефон</label>
                                <input 
                                    type="text" 
                                    value={data.phone} 
                                    onChange={e => setData('phone', e.target.value)}
                                    className="w-full px-4 py-2 border rounded"
                                />
                                {errors.phone && <div className="text-red-500 text-sm">{errors.phone}</div>}
                            </div>

                            <div>
                                <label>Тема</label>
                                <input 
                                    type="text" 
                                    value={data.subject} 
                                    onChange={e => setData('subject', e.target.value)}
                                    className="w-full px-4 py-2 border rounded"
                                />
                                {errors.subject && <div className="text-red-500 text-sm">{errors.subject}</div>}
                            </div>

                            <div>
                                <label>Сообщение</label>
                                <textarea 
                                    value={data.message} 
                                    onChange={e => setData('message', e.target.value)}
                                    className="w-full px-4 py-2 border rounded"
                                    rows={5}
                                />
                                {errors.message && <div className="text-red-500 text-sm">{errors.message}</div>}
                            </div>

                            <button 
                                type="submit" 
                                disabled={processing}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                            >
                                {processing ? 'Отправка...' : 'Отправить'}
                            </button>
                        </form>
                    </div>
                </main>
            </div>
        </>
    )
}
