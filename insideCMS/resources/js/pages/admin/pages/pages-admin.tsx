import AppLayout from '@/layouts/app-layout';
import { addPages, dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm} from '@inertiajs/react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {  Lock, Plus, Trash, Edit } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { toast } from 'sonner';


interface Page {
    id: number;
    name: string;
    slug: string;
    description: string;
    created_at: string;
    title: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Консоль',
        href: dashboard().url,
    },
    {
        title: 'Страницы',
        href: '/pages-admin',
    },
];

export default function PagesAdmin({ pages}: { pages: Page[] }) {
    const deleteForm = useForm();
    const [processingNewsId, setProcessingNewsId] = useState<number | null>(null);

    const handleEdit = (id: number) => {
        router.visit(`/pages/${id}/edit`);
    };

    const handleDelete = (id: number) => {
        setProcessingNewsId(id);

        deleteForm.delete(`/pages/${id}`, {
            onSuccess: () => {
                setProcessingNewsId(null);
                toast.success('Страница удалена');
            },
            onError: () => {
                toast.error('Ошибка при удалении страницы');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="px-4 py-8">
                <Head title="Страницы">
                    <link rel="preconnect" href="https://fonts.bunny.net" />
                    <link
                        href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                        rel="stylesheet"
                    />
                </Head>
                <h1 className="text-3xl font-bold text-foreground mb-4">Страницы</h1>
                <Alert variant="default" className="mb-4">
                    <Lock />
                    <AlertDescription>
                      API:  /api/v1/pages/
                    </AlertDescription>
                </Alert>
                
                <div className="mb-5 flex justify-between items-center">
                    <p className="text-gray-500 text-lg">Всего страниц: {pages.length}</p>
                    <Link
                        href={addPages()}
                        className="bg-blue-600 flex items-center gap-2 cursor-pointer text-white px-4 py-2 rounded-sm hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Создать страницу 
                    </Link>
                </div>

                {pages.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">Создайте свою первую страницу.</p>
                    </div>
                ) : (
                    <div className="block">
                        {pages.map((item) => (
                            <div key={item.id} className="flex justify-between items-center gap-4 bg-gray-700 py-2 px-4 rounded-sm shadow-md border hover:shadow-lg transition-shadow mb-4">
                                <div className="flex items-center justify-between gap-4">
                                    {/* <img src={item.images ? `${item.images[0]}` : placeholder} alt={item.title} className="w-10 h-10 rounded-full" /> */}
                                    <div className="">
                                        <div className="">
                                            <h3 className="text-white text-lg font-bold">{item.name}</h3>
                                            <p className="text-sm text-gray-500">slug: <span className="text-white">{item.slug}</span></p>
                                        </div>
                                        <div className="mb-2">
                                            <p className="text-xs text-gray-500">
                                                {new Date(item.created_at).toLocaleDateString('ru-RU')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                     onClick={() => handleEdit(item.id)}
                                     title="редактировать" 
                                     className="bg-blue-600 text-white px-2 py-2 rounded-sm hover:bg-blue-700 transition-colors cursor-pointer">
                                        <Edit className="w-5 h-5" />
                                    </button>

                                    <button
                                     title="удалить"
                                     className="bg-red-600 text-white px-2 py-2 rounded-sm hover:bg-red-700 transition-colors cursor-pointer"
                                     onClick={() => handleDelete(item.id)}
                                     >
                                        {processingNewsId === item.id ? (<Spinner />) : (<Trash className="w-5 h-5" />)}
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
