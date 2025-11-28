import AppLayout from '@/layouts/app-layout';
import { addSection, dashboard } from '@/routes';
import { type BreadcrumbItem, type Section } from '@/types';
import { Head, router, useForm} from '@inertiajs/react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {  Lock, Plus,Info } from 'lucide-react';
import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { toast } from 'sonner';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import TaxonomyItem from '@/components/TaxonomyItem/TaxonomyItem';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Консоль',
        href: dashboard().url,
    },
    {
        title: 'Разделы',
        href: '/sections-admin',
    },
];

export default function SectionsAdmin({ sections}: { sections: Section[] }) {
    const deleteForm = useForm();
    const [processingNewsId, setProcessingNewsId] = useState<number | null>(null);

    const handleEdit = (id: number) => {
        router.visit(`/admin/sections/${id}/edit`);
    };

    const handleDelete = (id: number) => {
        setProcessingNewsId(id);

        deleteForm.delete(`/admin/sections/${id}`, {
            onSuccess: () => {
                setProcessingNewsId(null);
                toast.success('Раздел удален');
            },
            onError: () => {
                toast.error('Ошибка при удалении раздела');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="px-4 py-8">
                <Head title="Разделы">
                    <link rel="preconnect" href="https://fonts.bunny.net" />
                    <link
                        href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                        rel="stylesheet"
                    />
                </Head>

                <div className="flex items-center gap-2 mb-4">
                    <h1 className="text-3xl font-bold text-foreground">Разделы</h1>
                    <Popover>
                        <PopoverTrigger>
                            <Info />
                        </PopoverTrigger>
                        <PopoverContent className="background-lab w-full max-w-[450px]">
                            <p>Получение данных доступно только по API.</p>
                            <p>Если нужно прокинуть данные в шаблон, используйте контролер SectionController.</p>
                        </PopoverContent>
                    </Popover>
                </div>


                <Alert variant="default" className="mb-4">
                    <Lock />
                    <AlertDescription>
                      API:  /api/v1/sections/
                    </AlertDescription>
                </Alert>
                
                <div className="mb-5 flex justify-between items-center">
                    <p className="text-gray-500 text-lg">Всего разделов: {sections.length}</p>
                    <Link
                        href={addSection()}
                        className="shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear flex items-center gap-2 cursor-pointer"                    >
                        <Plus className="w-5 h-5" />
                        Создать раздел 
                    </Link>
                </div>

                {sections.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">Создайте свою первую секцию.</p>
                    </div>
                ) : (
                    <div className="block">
                        {sections.map((item) => (
                            <TaxonomyItem key={item.id} item={item} handleEdit={handleEdit} handleDelete={handleDelete} processingNewsId={processingNewsId} />
                        ))}
                    </div>
                )}
            </div>
       </AppLayout>
    );
}
