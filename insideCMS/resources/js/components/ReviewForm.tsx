import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { type ReviewFormData } from '@/types';

interface ReviewFormProps {
    onSuccess?: () => void;
}

export default function ReviewForm({ onSuccess }: ReviewFormProps) {
    const [showForm, setShowForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<ReviewFormData>({
        author_name: '',
        content: '',
        rating: 5,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/reviews', {
            onSuccess: () => {
                reset();
                setShowForm(false);
                onSuccess?.();
            },
        });
    };

    const handleCancel = () => {
        reset();
        setShowForm(false);
    };

    if (!showForm) {
        return (
            <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
                Добавить отзыв
            </button>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border">
            <h2 className="text-xl font-semibold mb-4">Добавить отзыв</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="author_name" className="block text-sm font-medium text-gray-700 mb-1">
                        Ваше имя *
                    </label>
                    <input
                        id="author_name"
                        type="text"
                        value={data.author_name}
                        onChange={(e) => setData('author_name', e.target.value)}
                        className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    />
                    {errors.author_name && (
                        <p className="text-red-500 text-sm mt-1">{errors.author_name}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                        Оценка *
                    </label>
                    <select
                        id="rating"
                        value={data.rating}
                        onChange={(e) => setData('rating', parseInt(e.target.value))}
                        className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    >
                        <option value={5}>5 - Отлично</option>
                        <option value={4}>4 - Хорошо</option>
                        <option value={3}>3 - Удовлетворительно</option>
                        <option value={2}>2 - Плохо</option>
                        <option value={1}>1 - Очень плохо</option>
                    </select>
                    {errors.rating && (
                        <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                        Текст отзыва *
                    </label>
                    <textarea
                        id="content"
                        value={data.content}
                        onChange={(e) => setData('content', e.target.value)}
                        rows={4}
                        className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Поделитесь своим мнением..."
                        required
                    />
                    {errors.content && (
                        <p className="text-red-500 text-sm mt-1">{errors.content}</p>
                    )}
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {processing ? 'Отправка...' : 'Отправить отзыв'}
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                    >
                        Отмена
                    </button>
                </div>
            </form>
        </div>
    );
}
