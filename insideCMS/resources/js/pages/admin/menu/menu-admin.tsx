import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { addMenuAdmin, dashboard, editMenuAdmin } from '@/routes';
import { type BreadcrumbItem} from '@/types';
import { router, useForm} from '@inertiajs/react';
import { Edit, Lock, Plus, Trash } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MenuItem {
    id: number;
    title: string;
    slug: string;
    description: string;
    data: unknown[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Консоль',
        href: dashboard().url,
    },
    {
        title: 'Меню',
        href: '#',
    },
];

export default function MenuAdmin({ menus }: { menus: MenuItem[] }) {
    const deleteForm = useForm();
    const [processingNewsId, setProcessingNewsId] = useState<number | null>(null);
    const handleEdit = (id: number) => {
        router.visit(editMenuAdmin(id).url);
    }

    const handleDelete = (id: number) => {
        setProcessingNewsId(id);

        deleteForm.delete(`/admin/menus/${id}`, {
            onSuccess: () => {
                setProcessingNewsId(null);
                toast.success('Меню удалено');
            },
            onError: () => {
                toast.error('Ошибка при удалении меню');
            }
        });
    };


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Alert variant="default" className="mb-4">
                <Lock />
                <AlertDescription>
                    API:  /api/v1/menus
                </AlertDescription>
            </Alert>

            <Link
                href={addMenuAdmin()}
                className="shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear flex items-center gap-2 cursor-pointer"            >
                <Plus className="w-5 h-5" />
                Создать новое меню
            </Link>

            {menus.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">Пока нет опубликованных меню.</p>
                </div>
            ) : (
                menus.map((menu) => (
                    <div className="flex mb-4 justify-between items-center gap-4 py-2 px-4 rounded-sm border border-gray-200" 
                    key={menu.id}
                    >
                        <div>
                            <div className="text-sm">Название: {menu.title}</div>
                            <div className="text-sm text-gray-500">Slug: {menu.slug}</div>
                            <div className="text-sm text-gray-500">Описание: {menu.description}</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleEdit(menu.id)}
                                title="редактировать" 
                                className="bg-blue-600 text-white px-2 py-2 rounded-sm hover:bg-blue-700 transition-colors cursor-pointer">
                                <Edit className="w-5 h-5" />
                            </button>

                            <button
                                title="удалить"
                                className="bg-red-600 text-white px-2 py-2 rounded-sm hover:bg-red-700 transition-colors cursor-pointer"
                                    onClick={() => handleDelete(menu.id)}
                                >
                                {processingNewsId === menu.id ? (<Spinner />) : (<Trash className="w-5 h-5" />)}
                            </button>
                        </div>
                    </div>
                ))
            )}
        </AppLayout>
    );
}
