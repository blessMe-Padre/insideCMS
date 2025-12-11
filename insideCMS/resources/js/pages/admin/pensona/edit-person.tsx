import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { dashboard, personaAdmin } from '@/routes';
import {
    type BreadcrumbItem,
    type Persona,
    type ComponentAdmin,
} from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { LoaderCircle, LockIcon, SaveIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import FileManagerComponent from '@/components/editor/fileManager/FileManagerComponent';
import Popup from '@/components/popup/Popup';
import { FileManagerFile } from '@cubone/react-file-manager';
import { Input } from '@/components/ui/input';
import ElementsBuilder from '@/components/ElementsBuilder/ElementsBuilder';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Консоль',
        href: dashboard().url,
    },
    {
        title: 'Персоны',
        href: personaAdmin().url,
    },
    {
        title: 'Редактировать персону',
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

type PersonaComponent = {
    id: number;
    persona_id?: number;
    component_id?: number;
    data: string | string[];
    component_type: string;
};

const mapPersonaComponentsToBuilderElements = (
    personaComponents: PersonaComponent[],
    components: ComponentAdmin[],
): BuilderElement[] => {
    return personaComponents.map((pc) => {
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

export default function EditPerson({
    persona,
    components,
    personaComponents,
}: {
    persona: Persona;
    components: ComponentAdmin[];
    personaComponents: PersonaComponent[];
}) {
    const initialElements = mapPersonaComponentsToBuilderElements(
        personaComponents,
        components,
    );

    const { data, setData, post, processing, errors } = useForm({
        name: persona.name,
        slug: persona.slug,
        images: persona.images,
        components: mapBuilderElementsToRequestComponents(initialElements),
    });

    const [elements, setElements] = useState<BuilderElement[]>(initialElements);

    // Главное изображение персоны (images)
    const [activeMainPopup, setActiveMainPopup] = useState<boolean>(false);
    const [selectedMainImage, setSelectedMainImage] = useState<FileManagerFile[]>([]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/persons/${persona.id}`, {
            onSuccess: () => {
                toast.success('Персона успешно обновлена');
                window.location.href = '/admin/persons-admin';
            },
            onError: () => {
                toast.error('Ошибка при обновлении персоны');
            },
        });
    };

    const handleMainFileSelection = (files: FileManagerFile[]) => {
        setSelectedMainImage(files);
        const imageUrls = files.map((file) => file.path);
        setData('images', imageUrls);
    };

    const handleRemoveMainFile = (e: React.MouseEvent, fileIndex: number) => {
        e.preventDefault();
        const current = Array.isArray(data.images) ? data.images : [];
        const next = current.filter((_, index) => index !== fileIndex);
        setData('images', next);
        if (selectedMainImage.length > 0) {
            const updated = selectedMainImage.filter((_, index) => index !== fileIndex);
            setSelectedMainImage(updated);
        }
    };

    const handleChangeElements = (nextElements: BuilderElement[]) => {
        setElements(nextElements);
        const payload = mapBuilderElementsToRequestComponents(nextElements);
        setData('components', payload);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="px-4 py-8">
                <Head title="Редактировать персону">
                    <link rel="preconnect" href="https://fonts.bunny.net" />
                    <link
                        href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                        rel="stylesheet"
                    />
                </Head>

                <Alert variant="default" className="mb-4">
                    <LockIcon className="w-4 h-4" />
                    <AlertDescription>
                        API: /api/v1/persons/{persona.slug}
                    </AlertDescription>
                </Alert>

                <h1 className="text-3xl font-bold text-foreground mb-4">
                    Редактировать "{persona.name}"
                </h1>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="content"
                            className="block text-foreground text-sm font-medium mb-1"
                        >
                            Фотография
                        </label>

                        {(() => {
                            const images = selectedMainImage.length > 0
                                ? selectedMainImage.map((f) => f.path)
                                : (Array.isArray(data.images) ? data.images : []);
                            if (images.length === 0) {
                                return null;
                            }
                            return (
                                <div className="flex flex-wrap gap-2 mt-2 mb-2">
                                    {images.map((url, index) => (
                                        <div key={`main-image-${index}`} className="relative">
                                            <button
                                                className="absolute top-1 right-1 cursor-pointer text-red-500 hover:text-red-700"
                                                onClick={(e) => handleRemoveMainFile(e, index)}
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                            <img
                                                src={url}
                                                alt={`Main ${index + 1}`}
                                                className="w-20 h-20 object-cover rounded-md border"
                                            />
                                        </div>
                                    ))}
                                </div>
                            );
                        })()}

                        <Button
                            variant="outline"
                            onClick={(e) => {
                                e.preventDefault();
                                setActiveMainPopup(true);
                            }}
                        >
                            Выбрать файл
                        </Button>

                        <Popup activePopup={activeMainPopup} setActivePopup={setActiveMainPopup}>
                            <FileManagerComponent
                                initialFiles={[]}
                                setActivePopup={setActiveMainPopup}
                                setSelectedFiles={handleMainFileSelection}
                            />
                        </Popup>
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="name"
                            className="block text-foreground text-sm font-medium mb-1"
                        >
                            Имя *
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
                        <label
                            htmlFor="slug"
                            className="block text-foreground text-sm font-medium mb-1"
                        >
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
                            {processing ? (
                                <div className="flex items-center gap-2">
                                    <LoaderCircle className="w-4 h-4 animate-spin" />
                                    Сохранение...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <SaveIcon className="w-4 h-4" />
                                    Сохранить изменения
                                </div>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.visit(personaAdmin().url)}
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


