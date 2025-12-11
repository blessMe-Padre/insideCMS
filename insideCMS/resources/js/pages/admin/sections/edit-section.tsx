import { Alert, AlertDescription } from '@/components/ui/alert';
import AppLayout from '@/layouts/app-layout';
import { dashboard, sectionsAdmin } from '@/routes';
import {
    type BreadcrumbItem,
    type Section,
    type Section_component,
    type ComponentAdmin,
} from '@/types';
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
        title: 'Разделы',
        href: sectionsAdmin().url,
    },
    {
        title: 'Редактировать раздел',
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

const mapSectionComponentsToBuilderElements = (
    sectionComponents: Section_component[],
    components: ComponentAdmin[],
): BuilderElement[] => {
    return sectionComponents.map((sc) => {
        const template = components.find(
            (c) => String(c.id) === String(sc.component_id),
        );

        const typeName = template?.name ?? sc.component_type;
        const description = template?.description ?? sc.component_type;

        let content = '';

        if (typeName === 'text-block') {
            if (Array.isArray(sc.data)) {
                content = sc.data[0] ?? '';
            } else if (typeof sc.data === 'string') {
                content = sc.data;
            }
        } else if (typeName === 'text-editor-block') {
            if (Array.isArray(sc.data)) {
                content = JSON.stringify(sc.data);
            } else if (typeof sc.data === 'string') {
                content = sc.data;
            }
        } else if (typeName === 'image-block') {
            if (Array.isArray(sc.data)) {
                content = JSON.stringify(sc.data);
            } else if (typeof sc.data === 'string') {
                content = JSON.stringify([sc.data]);
            }
        } else if (typeName === 'accordion-block' || typeName === 'list-block') {
            if (typeof sc.data === 'string') {
                content = sc.data;
            } else {
                content = JSON.stringify(sc.data);
            }
        } else {
            if (typeof sc.data === 'string') {
                content = sc.data;
            } else {
                content = JSON.stringify(sc.data);
            }
        }

        return {
            id: String(sc.id),
            type: typeName,
            description,
            content,
            component_id: sc.component_id ? String(sc.component_id) : undefined,
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

export default function EditSection({
    section,
    components,
    sectionComponents,
}: {
    section: Section;
    components: ComponentAdmin[];
    sectionComponents: Section_component[];
}) {
    const initialElements = mapSectionComponentsToBuilderElements(
        sectionComponents,
        components,
    );

    const { data, setData, post, processing, errors } = useForm({
        name: section.name,
        slug: section.slug,
        description: section.description,
        components: mapBuilderElementsToRequestComponents(initialElements),
    });

    const [elements, setElements] = useState<BuilderElement[]>(initialElements);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/sections/${section.id}`, {
            onSuccess: () => {
                toast.success('Раздел успешно обновлен');
                window.location.href = '/admin/sections-admin';
            },
            onError: () => {
                toast.error('Ошибка при обновлении раздела');
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
                      API:  /api/v1/sections/{section.slug}
                    </AlertDescription>
                </Alert>

                <h1 className="text-3xl font-bold text-foreground mb-4">Редактировать раздел "{section.name}"</h1>

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
                            className="w-full p-2 border rounded"                            required
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
                            className="w-full p-2 border rounded"                            required
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
                            className="w-full p-2 border rounded"                            required
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
                            onClick={() => (window.location.href = sectionsAdmin().url)}
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
