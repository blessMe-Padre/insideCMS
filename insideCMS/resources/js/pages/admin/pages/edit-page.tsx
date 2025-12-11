import { Alert, AlertDescription } from '@/components/ui/alert';
import AppLayout from '@/layouts/app-layout';
import { dashboard, pagesAdmin } from '@/routes';
import { type BreadcrumbItem, type Page, type Page_component, type ComponentAdmin } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, LockIcon, SaveIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import ElementsBuilder from '@/components/ElementsBuilder/ElementsBuilder';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Консоль',
        href: dashboard().url,
    },
    {
        title: 'Страницы',
        href: pagesAdmin().url,
    },
    {
        title: 'Редактировать страницу',
        href: '#',
    },
];

type BuilderElement = {
    id: string;
    type?: string;
    description?: string;
    content?: string;
    component_id?: string;
};

const mapPageComponentsToBuilderElements = (
    pageComponents: Page_component[],
    components: ComponentAdmin[],
): BuilderElement[] => {
    return pageComponents.map((pc) => {
        const template = components.find(
            (c) => String(c.id) === String(pc.component_id),
        );

        const typeName = template?.name ?? pc.component_type;
        const description = template?.description ?? pc.component_type;

        let content = '';

        if (typeName === 'text-block') {
            if (Array.isArray(pc.data)) {
                content = pc.data[0] ?? '';
            } else if (typeof pc.data === 'string') {
                content = pc.data;
            }
        } else if (typeName === 'text-editor-block') {
            if (Array.isArray(pc.data)) {
                content = JSON.stringify(pc.data);
            } else if (typeof pc.data === 'string') {
                content = pc.data;
            }
        } else if (typeName === 'image-block') {
            if (Array.isArray(pc.data)) {
                content = JSON.stringify(pc.data);
            } else if (typeof pc.data === 'string') {
                content = JSON.stringify([pc.data]);
            }
        } else if (typeName === 'accordion-block' || typeName === 'list-block') {
            if (typeof pc.data === 'string') {
                content = pc.data;
            } else {
                content = JSON.stringify(pc.data);
            }
        } else {
            if (typeof pc.data === 'string') {
                content = pc.data;
            } else {
                content = JSON.stringify(pc.data);
            }
        }

        return {
            id: String(pc.id),
            type: typeName,
            description,
            content,
            component_id: pc.component_id ? String(pc.component_id) : undefined,
        };
    });
};

const mapBuilderElementsToRequestComponents = (
    elements: BuilderElement[],
): Array<{ component_id?: string; data: string }> => {
    return elements.map((element) => {
        const typeName = element.type;
        let data: string;

        if (typeName === 'text-block') {
            data = JSON.stringify([element.content ?? '']);
        } else if (typeName === 'text-editor-block') {
            if (!element.content) {
                data = JSON.stringify([]);
            } else {
                try {
                    const parsed = JSON.parse(element.content);
                    data = JSON.stringify(parsed);
                } catch {
                    data = JSON.stringify([element.content]);
                }
            }
        } else if (typeName === 'image-block') {
            if (!element.content) {
                data = JSON.stringify([]);
            } else {
                try {
                    const parsed = JSON.parse(element.content);
                    if (Array.isArray(parsed)) {
                        data = JSON.stringify(parsed);
                    } else {
                        data = JSON.stringify([parsed]);
                    }
                } catch {
                    data = JSON.stringify([element.content]);
                }
            }
        } else if (typeName === 'accordion-block' || typeName === 'list-block') {
            if (!element.content) {
                data = JSON.stringify([]);
            } else {
                try {
                    const parsed = JSON.parse(element.content);
                    data = JSON.stringify(parsed);
                } catch {
                    data = JSON.stringify(element.content);
                }
            }
        } else {
            data = JSON.stringify(element.content ?? '');
        }

        return {
            component_id: element.component_id,
            data,
        };
    });
};

export default function EditPage({
    page,
    components,
    pageComponents,
}: {
    page: Page;
    components: ComponentAdmin[];
    pageComponents: Page_component[];
}) {
    const initialElements = mapPageComponentsToBuilderElements(
        pageComponents,
        components,
    );

    const { data, setData, post, processing, errors } = useForm({
        name: page.name,
        slug: page.slug,
        description: page.description,
        components: mapBuilderElementsToRequestComponents(initialElements),
    });

    const [elements, setElements] = useState<BuilderElement[]>(initialElements);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/pages/${page.id}`, {
            onSuccess: () => {
                toast.success('Страница успешно обновлена');
                window.location.href = '/admin/pages-admin';
            },
            onError: () => {
                toast.error('Ошибка при обновлении страницы');
            },
        });
    };

    const handleChangeElements = (nextElements: BuilderElement[]) => {
        setElements(nextElements);
        const payload = mapBuilderElementsToRequestComponents(nextElements);
        setData('components', payload);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="px-4 py-8">
                <Head title="Редактировать страницу">
                    <link rel="preconnect" href="https://fonts.bunny.net" />
                    <link
                        href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                        rel="stylesheet"
                    />
                </Head>

                <Alert variant="default" className="mb-4">
                    <LockIcon className="w-4 h-4" />
                    <AlertDescription>
                      API:  /api/v1/pages/{page.slug}
                    </AlertDescription>
                </Alert>

                <h1 className="text-3xl font-bold text-foreground mb-4">Редактировать страницу "{page.name}"</h1>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-foreground text-sm font-medium mb-1">
                            Название *
                        </label>
                        <Input  
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-foreground text-sm font-medium mb-1">
                            Slug *
                        </label>
                        <Input
                            id="slug"
                            type="text"
                            value={data.slug}
                            onChange={(e) => setData('slug', e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                        {errors.slug && (
                            <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-foreground text-sm font-medium mb-1">
                            Описание *
                        </label>
                        <Input
                            id="description"
                            type="text"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                        )}
                    </div>

                    <ElementsBuilder
                        components={components}
                        elements={elements}
                        onChangeElements={handleChangeElements}
                    />

                    <div className="flex gap-2 mt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 text-white cursor-pointer px-4 p-2 rounded-sm hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {processing ? 
                                (<div className="flex items-center gap-2"><LoaderCircle className="w-4 h-4 animate-spin" /> Сохранение...</div>)
                                : 
                                (<div className="flex items-center gap-2"><SaveIcon className="w-4 h-4" /> Сохранить изменения</div>)
                            }
                        </button>
                        <button
                            type="button"
                            onClick={() => window.location.href = '/pages-admin'}
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
