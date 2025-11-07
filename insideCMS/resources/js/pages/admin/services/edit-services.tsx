import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { dashboard, personaAdmin } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, LockIcon, SaveIcon, TrashIcon } from 'lucide-react';
import { useState, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import TextEditor from '@/components/editor/TextEditor';
import FileManagerComponent from '@/components/editor/fileManager/FileManagerComponent';
import Popup from '@/components/popup/Popup';
import { FileManagerFile } from '@cubone/react-file-manager';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Консоль',
        href: dashboard().url,
    },
    {
        title: 'Услуги',
        href: personaAdmin().url,
    },
    {
        title: 'Редактировать услугу',
        href: '#',
    },
];

interface Component {
    id: number;
    component_id: number;
    data: string | string[];
    component_type: string;
}

interface Service {
    id: number;
    title: string;
    slug: string;
    description: string;
    parentId: number;
    images?: string[];
    content?: string[];
}

interface Persona {
    id: number;
    name: string;
}

export default function EditPage({ service, components, services, personas, personaIds }: { service: Service, components: Component[], services: Service[], personas: Persona[], personaIds?: number[] }) {
    const { data, setData, post, processing, errors } = useForm({
        title: service.title,
        slug: service.slug,
        description: service.description,
        parentId: service.parentId,
        personaIds: personaIds || [],
        images: service.images || [],
        content: service.content || [],
        components: components,
    });

    const [elements, setElements] = useState<Component[]>(components);
    
    const [activePopup, setActivePopup] = useState<boolean>(false);
    const [selectedFiles, setSelectedFiles] = useState<FileManagerFile[]>([]);

    const [activeMainPopup, setActiveMainPopup] = useState<boolean>(false);
    const [selectedMainImage, setSelectedMainImage] = useState<FileManagerFile[]>(
        service.images ? service.images.map((path: string) => ({ path } as FileManagerFile)) : []
    );
    const [currentImageElementId, setCurrentImageElementId] = useState<number | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/services/${service.id}`, {
            onSuccess: () => {
                toast.success('Услуга успешно обновлена');
                window.location.href = '/services-admin';
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

    const handleUpdateContent = useCallback((id: number, content: string) => {
        const updatedElements = elements.map((element) => {
            if (element.id === id) {
                if (element.component_type === 'text') {
                    return { ...element, data: [content] };
                }
                if (element.component_type === 'text-editor') {
                    return { ...element, data: content };
                }
                return { ...element, data: content };
            }
            return element;
        });

        setElements(updatedElements);
        setData('components', updatedElements);
    }, [elements, setData]);

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

    // Обработчик выбора файлов из FileManager
    const handleFileSelection = (files: FileManagerFile[]) => {
        setSelectedFiles(files);
        if (currentImageElementId !== null) {
            const imageUrls = files.map((file) => file.path);
            const updatedElements = elements.map((element) => 
                element.id === currentImageElementId ? { ...element, data: imageUrls } : element
            );
            setElements(updatedElements);
            setData('components', updatedElements);
        }
    };

    const handleRemoveFile = (e: React.FormEvent, elementId: number, fileIndex: number) => {
        e.preventDefault();

        if (currentImageElementId === elementId && selectedFiles.length > 0) {
            const updatedSelectedFiles = selectedFiles.filter((_: FileManagerFile, index: number) => index !== fileIndex);
            setSelectedFiles(updatedSelectedFiles);

            const imageUrls = updatedSelectedFiles.map((file) => file.path);
            const updatedElements = elements.map((element) =>
                element.id === elementId ? { ...element, data: imageUrls } : element
            );
            setElements(updatedElements);
            setData('components', updatedElements);
            return;
        }

        // Иначе удаляем из уже сохранённых файлов элемента
        const updatedElements = elements.map((element) => {
            if (element.id !== elementId) return element;
            const images = Array.isArray(element.data) ? element.data : [];
            const nextImages = images.filter((_: string, index: number) => index !== fileIndex);
            return { ...element, data: nextImages };
        });
        setElements(updatedElements);
        setData('components', updatedElements);
    };

    const componentName = (component_type: string) => {
        switch (component_type) {
            case 'text':
                return 'Текст';
            case "text-editor":
                return 'Текстовый редактор';
            case 'file':
                return 'Файлы / Изображения';
            default:
                return component_type;
        }
    }

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

                <h1 className="text-3xl font-bold text-foreground mb-4">Редактировать "{service.title}"</h1>

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
                        <input
                            id="title"
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="w-full text-foreground px-3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        <input
                            id="slug"
                            type="text"
                            value={data.slug}
                            onChange={(e) => setData('slug', e.target.value)}
                            className="w-full text-foreground px-3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        <input
                            id="description"
                            type="text"
                            value={data.description || ''}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full text-foreground px-3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

                    
                    {elements.map((element, index) => (
                    <div key={index} className="mb-4 p-4 border rounded">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="font-medium">{componentName(element.component_type)}</h2>
                        </div>
                    
                    {element.component_type === 'text' && (
                        <input 
                            id={`text-input-${element.id}`}
                            value={Array.isArray(element.data) ? (element.data[0] || '') : (typeof element.data === 'string' ? element.data : '')}
                            onChange={(e) => handleUpdateContent(element.id, e.target.value)}
                            placeholder="Введите текст..."
                            className="w-full p-2 border rounded"
                         />
                    )}
                    
                    {element.component_type === "text-editor" && (
                        <div id={`text-editor-${element.id}`}>
                            <TextEditor 
                                value={
                                    Array.isArray(element.data)
                                        ? JSON.stringify(element.data)
                                        : (typeof element.data === 'string' ? element.data : JSON.stringify(element.data ?? ''))
                                }
                                onChange={(value) => handleUpdateContent(element.id, value)} 
                            />
                        </div>
                    )}

                    {element.component_type === 'file' && (
                        <>
                           {(() => {
                                if (currentImageElementId === element.id && selectedFiles.length > 0) {
                                    return (
                                        <div className="flex flex-wrap gap-2 mt-2 mb-2">
                                            {selectedFiles.map((file, index) => (
                                                <div key={`selected-${index}`} className="relative">
                                                    <button
                                                        className="absolute top-1 right-1 cursor-pointer text-red-500 hover:text-red-700"
                                                        onClick={(e) => handleRemoveFile(e, element.id, index)}>
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                    <img  
                                                    src={file.path} 
                                                    alt={`Selected ${index + 1}`} 
                                                    className="w-20 h-20 object-cover rounded-md border border-blue-500" 
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    );
                                }
                                
                                // Иначе показываем существующие файлы из element.data
                                if (element.data) {
                                    const images = Array.isArray(element.data) ? element.data : [];
                                    if (images.length > 0) {
                                        return (
                                            <div className="flex flex-wrap gap-2 mt-2 mb-2">
                                                {images.map((image: string, index: number) => (
                                                    <div key={`image-${index}`} className="relative">
                                                        <button className="absolute top-1 right-1 cursor-pointer text-red-500 hover:text-red-700"
                                                        onClick={(e) => handleRemoveFile(e, element.id, index)}>
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>   
                                                    <img 
                                                        src={image} 
                                                        alt={`Preview ${index + 1}`} 
                                                        className="w-20 h-20 object-cover rounded-md border" 
                                                    />
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    }
                                }
                                
                                return null;
                            })()}

                          <Button 
                              variant="outline" 
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentImageElementId(element.id);
                                setActivePopup(true);
                            }}>Выбрать файл</Button>
                            
                            <Popup activePopup={activePopup} setActivePopup={setActivePopup}>
                                <FileManagerComponent 
                                    initialFiles={[]}
                                    setActivePopup={setActivePopup}
                                    setSelectedFiles={handleFileSelection}
                                />
                            </Popup>
                        </>
                    )}

                    </div>
                     ))}

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
                            onClick={() => window.location.href = '/persons-admin'}
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
