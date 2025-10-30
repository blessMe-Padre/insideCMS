
import { Head } from '@inertiajs/react';
import { type Review } from '@/types';
import ReviewForm from '@/components/ReviewForm';

export default function Reviews({ reviews }: { reviews: Review[] }) {
    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <Head title="Отзывы">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-4">Отзывы</h1>
                <p className="text-gray-600 mb-6">
                    Поделитесь своим мнением о нашей работе или ознакомьтесь с отзывами других клиентов.
                </p>
                
                <div className="mb-8">
                    <ReviewForm />
                </div>
            </div>

            {reviews.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">Пока нет опубликованных отзывов.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-white p-6 rounded-sm shadow-md border hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-gray-900">{review.author_name}</h3>
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
                            <p className="text-gray-700 leading-relaxed">{review.content}</p>
                            <p className="text-sm text-gray-500 mt-4">
                                {new Date(review.created_at).toLocaleDateString('ru-RU')}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}