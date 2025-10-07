
import { Head } from '@inertiajs/react';
import { BreadcrumbItem, type Review } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { dashboard, reviewsAdmin } from '@/routes';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Консоль',
        href: dashboard().url,
    },
    {
        title: 'Отзывы администратора',
        href: reviewsAdmin().url,
    },
];

export default function Reviews({ reviews }: { reviews: Review[] }) {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="px-4 py-8">
                <Head title="Отзывы">
                    <link rel="preconnect" href="https://fonts.bunny.net" />
                    <link
                        href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                        rel="stylesheet"
                    />
                </Head>
                
                {reviews.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">Пока нет опубликованных отзывов.</p>
                    </div>
                ) : (
                    <div className="block">
                        {reviews.map((review) => (
                            <div key={review.id} className="bg-gray-700 p-6 rounded-lg shadow-md border hover:shadow-lg transition-shadow mb-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-semibold text-white">{review.author_name}</h3>
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <span
                                                key={i}
                                                className={`text-lg ${
                                                    i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                                }`}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-2 flex items-center justify-between gap-2">
                                    <p className="text-white leading-relaxed">{review.content}</p>
                                    <p className="text-sm text-gray-500 mt-2">
                                        {new Date(review.created_at).toLocaleDateString('ru-RU')}
                                    </p>
                                </div>

                                <div className="inline-flex items-center justify-between gap-2">
                                    <Switch id="airplane-mode"/>
                                    <Label htmlFor="airplane-mode" className="text-sm text-gray-500">Опубликовать</Label>
                                </div>
                            </div>  
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}