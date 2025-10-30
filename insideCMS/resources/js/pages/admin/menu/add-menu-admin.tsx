import AppLayout from '@/layouts/app-layout';
import { dashboard, menuAdmin} from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { LoaderCircle, SaveIcon } from 'lucide-react';
import { toast } from "sonner";
import MenuBuilder from '@/components/menuEditor/MenuBuilder';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

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
        title: 'Добавить меню',
        href: '#',
    },
];

interface MenuItem {
    id: string;
    name: string;
    href: string;
    children: MenuItem[];
}

const initialFormData: MenuItem = {
    id: '',
    name: 'Новая Страница',
    href: 'new-page',
    children: [],
};

const initialMenus: MenuItem[] = [
    {
        id: 'Home',
        name: 'Главная',
        href: '/home',
        children: [],
    },
];
interface Page {
    id: string;
    name: string;
    slug: string;
    description: string;
}
  
export default function AddMenuAdmin({ pages }: { pages: Page[] }) {
    const { data, setData, post, processing, errors, reset, transform } = useForm({
        title: '',
        slug: '',
        description: '',
    });

    const [menus, setMenus] = useState<MenuItem[]>(initialMenus as MenuItem[]);
    const [formData, setFormData] = useState(initialFormData);
    const [selectedPageIds, setSelectedPageIds] = useState<string[]>([]);

    const togglePageSelection = (pageId: string) => {
        setSelectedPageIds((prev) =>
            prev.includes(pageId) ? prev.filter((id) => id !== pageId) : [...prev, pageId]
        );
    };

    const addSelectedPagesToMenu = () => {
        const selectedPages = pages.filter((p) => selectedPageIds.includes(p.id));
        if (selectedPages.length === 0) return;

        const newItems: MenuItem[] = selectedPages.map((p) => ({
            id: Math.random().toString(36).substring(7),
            name: p.name,
            href: `/${p.slug}`,
            children: [],
        }));

        setMenus([...menus, ...newItems]);
        setSelectedPageIds([]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        transform((values) => ({ ...(values as Record<string, unknown>), data: menus } as unknown as typeof values));
        post('/menus', {
            onSuccess: () => {
                reset();
                toast.success('Меню успешно создано');
                router.visit(menuAdmin().url);
            },
            onError: () => {
                console.log(errors);
                toast.error('Ошибка при создании меню');
            },
        });
    };


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="px-4 py-8">
                <Head title="Добавить меню">
                    <link rel="preconnect" href="https://fonts.bunny.net" />
                    <link
                        href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                        rel="stylesheet"
                    />
                </Head>

                <h1 className="text-3xl font-bold text-foreground mb-4">Создайте новое меню</h1>

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
                        <label htmlFor="title" className="block text-foreground text-sm font-medium mb-1">
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

                    <div className="flex gap-4 ">
                        <div>
                            <h3 className="text-foreground text-sm font-medium mb-1">Выбрать из существующих страниц</h3>
                            {pages.map((page) => (
                                <div className="flex items-center" key={page.id}>
                                    <label htmlFor={page.id} className="flex items-center gap-2">
                                    <input
                                        id={page.id}
                                        type="checkbox"
                                        value={page.id}
                                        className=""
                                        checked={selectedPageIds.includes(page.id)}
                                        onChange={() => togglePageSelection(page.id)}
                                    />
                                        {page.name}
                                    </label>
                                </div>
                            ))}
                            <Button
                                type="button"
                                onClick={addSelectedPagesToMenu}
                                className="bg-gray-500 text-white mt-2 cursor-pointer px-4 p-2 rounded-sm hover:bg-gray-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                disabled={selectedPageIds.length === 0}
                            >
                                Добавить выбранные страницы
                            </Button>
                        </div>

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
                            className="bg-blue-600 text-white cursor-pointer px-4 p-2 rounded-sm hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {processing ? 
                                (<div className="flex items-center gap-2"><LoaderCircle className="w-4 h-4 animate-spin" /> Сохранение...</div>)
                                : 
                                (<div className="flex items-center gap-2"><SaveIcon className="w-4 h-4" /> Создать</div>)
                            }
                        </button>
                        <button
                            type="button"
                            onClick={() => (window.location.href = menuAdmin().url)}
                            disabled={processing}
                            className="bg-gray-500 text-white cursor-pointer px-4 p-2 rounded-sm hover:bg-gray-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Отмена
                        </button>
                    </div>
                </form>
            </div>

       </AppLayout>
    );
}
