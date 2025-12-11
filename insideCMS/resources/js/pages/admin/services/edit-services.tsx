import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { dashboard, servicesAdmin } from '@/routes';
import {
    type BreadcrumbItem,
    type Service,
    type ComponentAdmin,
    type Persona,
} from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, LockIcon, SaveIcon, TrashIcon } from 'lucide-react';
import { useState, useMemo } from 'react';
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
        title: 'Услуги',
        href: servicesAdmin().url,
    },
    {
        title: 'Редактировать услугу',
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

type ServiceComponent = {
    id: number;
    service_id?: number;
    component_id?: number;
    data: string | string[];
    component_type: string;
};

const mapServiceComponentsToBuilderElements = (
    serviceComponents: ServiceComponent[],
    components: ComponentAdmin[],
): BuilderElement[] => {
    return serviceComponents.map((sc) => {
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

export default function EditService({
    service,
    components,
    serviceComponents,
    services,
    personas,
    personaIds,
}: {
    service: Service;
    components: ComponentAdmin[];
    serviceComponents: ServiceComponent[];
    services: Service[];
    personas: Persona[];
    personaIds?: number[];
}) {
    const initialElements = mapServiceComponentsToBuilderElements(
        serviceComponents,
        components,
    );

    const { data, setData, post, processing, errors } = useForm({
        title: service.title,
        slug: service.slug,
        description: service.description,
        parentId: service.parentId,
        personaIds: personaIds || [],
        images: service.images || [],
        content: service.content || [],
        components: mapBuilderElementsToRequestComponents(initialElements),
    });

    const [elements, setElements] = useState<BuilderElement[]>(initialElements);

    const [activeMainPopup, setActiveMainPopup] = useState<boolean>(false);
    const [selectedMainImage, setSelectedMainImage] = useState<FileManagerFile[]>(
        service.images
            ? service.images.map((path: string) => ({ path } as FileManagerFile))
            : [],
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/services/${service.id}`, {
            onSuccess: () => {
                toast.success('Услуга успешно обновлена');
                window.location.href = '/admin/services-admin';
            },
            onError: () => {
                toast.error('Ошибка при обновлении услуги');
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
        const next = current.filter((_: string, index: number) => index !== fileIndex);
        setData('images', next);
        if (selectedMainImage.length > 0) {
            const updated = selectedMainImage.filter((_: FileManagerFile, index: number) => index !== fileIndex);
            setSelectedMainImage(updated);
        }
    };

    // Собираем множество ID всех потомков текущей услуги, чтобы запретить их как родителя
    const descendantIds = useMemo(() => {
        const result = new Set<number>();
        const queue: number[] = [service.id];
        while (queue.length > 0) {
            const current = queue.shift()!;
            for (const s of services) {
                const p = (s.parentId ?? 0);
                if (p === current && !result.has(s.id)) {
                    result.add(s.id);
                    queue.push(s.id);
                }
            }
        }
        return result;
    }, [service.id, services]);

    const handleChangeElements = (nextElements: BuilderElement[]) => {
        setElements(nextElements);
        const payload = mapBuilderElementsToRequestComponents(nextElements);
        setData('components', payload);
    };

    const addPersona = (value: string) => {
        const id = parseInt(value);
        const current: number[] = Array.isArray(data.personaIds) ? data.personaIds : [];
        if (!current.includes(id)) {
            setData('personaIds', [...current, id]);
        }
    }

    const removePersona = (id: number) => {
        const current: number[] = Array.isArray(data.personaIds) ? data.personaIds : [];
        setData('personaIds', current.filter((x) => x !== id));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="px-4 py-8">
                <Head title="Редактировать услугу">
                    <link rel="preconnect" href="https://fonts.bunny.net" />
                    <link
                        href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                        rel="stylesheet"
                    />
                </Head>

                <Alert variant="default" className="mb-4">
                    <LockIcon className="w-4 h-4" />
                    <AlertDescription>
                      API:  /api/v1/services/{service.slug}
                    </AlertDescription>
                </Alert>

                <h1 className="text-3xl font-bold text-foreground mb-4">
                    Редактировать "{service.title}"
                </h1>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="content" className="block text-foreground text-sm font-medium mb-1">
                           Изображения
                        </label>

                        {(() => {
                            const images = selectedMainImage.length > 0
                                ? selectedMainImage.map((f) => f.path)
                                : (Array.isArray(data.images) ? data.images : []);
                            return images.length > 0 ? (
                                <div className="flex flex-wrap gap-2 mt-2 mb-2">
                                    {images.map((url: string, index: number) => (
                                        <div key={`main-image-${index}`} className="relative">
                                            <button
                                                className="absolute top-1 right-1 cursor-pointer text-red-500 hover:text-red-700"
                                                onClick={(e) => handleRemoveMainFile(e, index)}
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                            <img src={url} alt={`Main ${index + 1}`} className="w-20 h-20 object-cover rounded-md border" />
                                        </div>
                                    ))}
                                </div>
                            ) : null;
                        })()}

                        <Button 
                            variant="outline" 
                            onClick={(e) => {
                                e.preventDefault();
                                setActiveMainPopup(true);
                            }}>Выбрать файл</Button>

                        <Popup activePopup={activeMainPopup} setActivePopup={setActiveMainPopup}>
                            <FileManagerComponent 
                                initialFiles={[]}
                                setActivePopup={setActiveMainPopup}
                                setSelectedFiles={handleMainFileSelection}
                            />
                        </Popup>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-foreground text-sm font-medium mb-1">
                            Название *
                        </label>
                        <Input
                            id="title"
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                        {errors.title && (
                            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
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
                        <label htmlFor="description" className="block text-foreground text-sm font-medium mb-1">
                            Описание
                        </label>
                        <Input
                            id="description"
                            type="text"
                            value={data.description || ''}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="parentId" className="block text-foreground text-sm font-medium mb-1">
                            Родительская услуга
                        </label>
                        <Select 
                            value={data.parentId && data.parentId > 0 ? data.parentId.toString() : '0'} 
                            onValueChange={(value) => {
                                const newId = value === '0' ? 0 : parseInt(value);
                                if (newId !== 0 && descendantIds.has(newId)) {
                                    toast.error('Нельзя выбирать потомка как родителя');
                                    return;
                                }
                                setData('parentId', newId);
                            }}
                        >
                            <SelectTrigger className="w-[320px]">
                                <SelectValue placeholder="Выберите родителя" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">Нет родителя</SelectItem>
                                {services.map((s) => (
                                    <SelectItem key={s.id} value={s.id.toString()} disabled={descendantIds.has(s.id)}>
                                        {s.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.parentId && (
                            <p className="text-red-500 text-sm mt-1">{errors.parentId}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="personaIds" className="block text-foreground text-sm font-medium mb-1">
                            Персоны
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {(data.personaIds ?? []).map((id: number) => {
                                const p = personas.find(pp => pp.id === id);
                                return (
                                    <div key={id} className="flex items-center gap-2 border rounded px-2 py-1">
                                        <span>{p?.name ?? id}</span>
                                        <button onClick={(e) => { e.preventDefault(); removePersona(id); }}>
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                        <Select 
                            onValueChange={(value) => addPersona(value)}
                        >
                            <SelectTrigger className="w-[320px]">
                                <SelectValue placeholder="Добавить персону" />
                            </SelectTrigger>
                            <SelectContent>
                                {personas.map((p) => (
                                    <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
                            onClick={() => window.location.href = '/admin/persons-admin'}
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
