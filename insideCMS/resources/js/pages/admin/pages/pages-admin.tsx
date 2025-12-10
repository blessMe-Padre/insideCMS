import AppLayout from '@/layouts/app-layout';
import { addPages, dashboard } from '@/routes';
import { type BreadcrumbItem, type Page } from '@/types';
import { Head, router, useForm} from '@inertiajs/react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {  Lock, Plus, Info } from 'lucide-react';
import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import TaxonomyItem from '@/components/TaxonomyItem/TaxonomyItem';

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
        router.visit(`pages/${id}/edit`);
    };

    const handleDelete = (id: number) => {
        setProcessingNewsId(id);

        deleteForm.delete(`pages/${id}`, {
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
                <div className="flex items-center gap-2 mb-4">
                    <h1 className="text-3xl font-bold text-foreground">Страницы</h1>
                    <Popover>
                        <PopoverTrigger>
                            <Info className="cursor-pointer" />
                        </PopoverTrigger>
                        <PopoverContent className="background-lab w-full max-w-[450px]">
                            <p>Получение данных доступно только по API.</p>
                            <p>Если нужно прокинуть данные в шаблон, используйте контролер PageController.</p>
                        </PopoverContent>
                    </Popover>
                </div>
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
                        className="shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear flex items-center gap-2 cursor-pointer"                    >
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
                            <TaxonomyItem key={item.id} item={item} handleEdit={handleEdit} handleDelete={handleDelete} processingNewsId={processingNewsId} />

                        ))}
                    </div>
                )}
            </div>
       </AppLayout>
    );
}
