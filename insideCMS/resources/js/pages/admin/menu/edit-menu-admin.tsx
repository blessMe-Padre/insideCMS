import AppLayout from '@/layouts/app-layout';
import { dashboard, menuAdmin} from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { LoaderCircle, SaveIcon } from 'lucide-react';
import { toast } from "sonner";
import MenuBuilder from '@/components/menuEditor/MenuBuilder';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Консоль',
        href: dashboard().url,
    },
    {
        title: 'Меню',
        href: menuAdmin().url,
    },
    {
        title: 'Редактировать меню',
        href: '#',
    },
];

interface MenuNode {
    id: string;
    name: string;
    href: string;
    children: MenuNode[];
}

interface MenuEntity {
    id: number;
    title: string;
    slug: string;
    description: string;
    data: MenuNode[];
}

export default function EditMenuAdmin({ menu }: { menu: MenuEntity }) {
    const { data, setData, post, processing, errors, reset, transform } = useForm({
        title: menu.title,
        slug: menu.slug,
        description: menu.description,
    });

    const [menus, setMenus] = useState<MenuNode[]>(menu.data as MenuNode[] ?? []);
    const [formData, setFormData] = useState<MenuNode>({ id: '', name: '', href: '', children: [] });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        transform((values) => ({ ...(values as Record<string, unknown>), data: menus } as unknown as typeof values));
        post(`/menus/${menu.id}`, {
            onSuccess: () => {
                reset();
                toast.success('Меню успешно обновлено');
                router.visit(menuAdmin().url);
            },
            onError: () => {
                console.log(errors);
                toast.error('Ошибка при обновлении меню');
            },
        });
    };


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="px-4 py-8">
                <Head title="Редактировать меню">
                    <link rel="preconnect" href="https://fonts.bunny.net" />
                    <link
                        href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                        rel="stylesheet"
                    />
                </Head>

                <h1 className="text-3xl font-bold text-foreground mb-4">Редактировать меню</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-foreground text-sm font-medium mb-1">
                            Название меню *
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="w-full text-white px-3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                        {errors.title && (
                            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="slug" className="block text-foreground text-sm font-medium mb-1">
                            Slug меню *
                        </label>
                        <input
                            id="slug"
                            type="text"
                            value={data.slug}
                            onChange={(e) => setData('slug', e.target.value)}
                            className="w-full text-white px-3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                        {errors.slug && (
                            <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-foreground text-sm font-medium mb-1">
                            Описание меню
                        </label>
                        <input
                            id="description"
                            type="text"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full text-white px-3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                        )}
                    </div>
                    <div>
                        <MenuBuilder 
                            menus={menus} 
                            setMenus={setMenus} 
                            formData={formData} 
                            setFormData={setFormData} 
                        />
                    </div>


                    <div className="flex gap-2 mt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 text-white cursor-pointer px-4 p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {processing ? 
                                (<div className="flex items-center gap-2"><LoaderCircle className="w-4 h-4 animate-spin" /> Сохранение...</div>)
                                : 
                                (<div className="flex items-center gap-2"><SaveIcon className="w-4 h-4" /> Сохранить</div>)
                            }
                        </button>
                        <button
                            type="button"
                            onClick={() => (window.location.href = menuAdmin().url)}
                            disabled={processing}
                            className="bg-gray-500 text-white cursor-pointer px-4 p-2 rounded-lg hover:bg-gray-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Отмена
                        </button>
                    </div>
                </form>

               


            </div>

       </AppLayout>
    );
}
