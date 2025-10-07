
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { BreadcrumbItem, type Review } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { dashboard, reviewsAdmin } from '@/routes';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

/**
 * TODO: Добавить кнопку для удаления отзыва
 * TODO: Добавить панинацию
 * TODO: Добавить сортировку
 */

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
    const publishForm = useForm();
    const unpublishForm = useForm();
    const deleteForm = useForm();
    const [processingReviewId, setProcessingReviewId] = useState<number | null>(null);

    const handlePublish = (reviewId: number) => {
        setProcessingReviewId(reviewId);
        publishForm.patch(`/reviews/${reviewId}/publish`, {
            onSuccess: () => {
                setProcessingReviewId(null);
            },
            onError: () => {
                setProcessingReviewId(null);
            }
        });
    };

    const handleUnpublish = (reviewId: number) => {
        setProcessingReviewId(reviewId);
        unpublishForm.patch(`/reviews/${reviewId}/unpublish`, {
            onSuccess: () => {
                setProcessingReviewId(null);
            },
            onError: () => {
                setProcessingReviewId(null);
            }
        });
    };

    const handleDelete = (reviewId: number) => {
        setProcessingReviewId(reviewId);
        deleteForm.delete(`/reviews/${reviewId}`, {
            onSuccess: () => {
                setProcessingReviewId(null);
            }
        });
    };

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

                <div className="mb-8">
                    <span className="text-gray-500 text-lg">API: </span>
                    <span className="text-gray-500 text-lg">/api/v1/reviews</span>
                </div>

                <div className="mb-3">
                    <p className="text-gray-500 text-lg">Всего отзывов: {reviews.length}</p>
                </div>
                
                {reviews.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">Пока нет опубликованных отзывов.</p>
                    </div>
                ) : (
                    <div className="block">
                        {reviews.map((review) => (
                            <div key={review.id} className="bg-gray-700 p-6 rounded-lg shadow-md border hover:shadow-lg transition-shadow mb-4">
                                <div className="flex items-center justify-between">
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
                                    <p className="text-sm text-gray-500">
                                        {new Date(review.created_at).toLocaleDateString('ru-RU')}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-2">
                                        <Switch 
                                            id={`review-${review.id}`}
                                            checked={review.is_published}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    handlePublish(review.id);
                                                } else {
                                                    handleUnpublish(review.id);
                                                }
                                            }}
                                        />
                                        {processingReviewId === review.id ? (
                                            <span className="text-sm text-gray-300">изменение статуса...</span>
                                        ) : (
                                            <Label htmlFor={`review-${review.id}`} className="text-sm text-gray-300 cursor-pointer">
                                                {review.is_published ? (<span className="text-green-300">Опубликован</span>) : 'Не опубликован'}
                                            </Label>
                                        )}
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                        review.is_published 
                                            ? 'bg-green-900 text-green-300' 
                                            : 'bg-gray-600 text-gray-300'
                                    }`}>
                                        {review.is_published ? 'Активен' : 'Скрыт'}
                                    </span>
                                </div>
                            
                            <div className="flex items-center justify-end mt-4">
                                <button 
                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors cursor-pointer"
                                    onClick={() => handleDelete(review.id)}
                                >
                                    {processingReviewId === review.id ? "удаление..." : "удалить"}
                                </button>
                            </div>  
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}