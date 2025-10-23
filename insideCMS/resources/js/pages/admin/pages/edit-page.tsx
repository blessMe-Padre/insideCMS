import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { dashboard, pagesAdmin } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, LockIcon, SaveIcon, TrashIcon } from 'lucide-react';
import { useState, useCallback } from 'react';
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
        title: 'Страницы',
        href: pagesAdmin().url,
    },
    {
        title: 'Редактировать страницу',
        href: '#',
    },
];

interface Page {
    id: number;
    name: string;
    slug: string;
    description: string;
}

interface Page_component {
    id: number;
    page_id?: number;
    component_id?: number;
    data: string | string[];
    component_type: string;
}

export default function EditPage({ page, components }: { page: Page, components: Page_component[] }) {
    const { data, setData, post, processing, errors } = useForm({
        name: page.name,
        slug: page.slug,
        description: page.description,
        components: components,
    });

   const [elements, setElements] = useState<Page_component[]>(components);
    
    // File manager states
    const [activePopup, setActivePopup] = useState<boolean>(false);
    const [selectedFiles, setSelectedFiles] = useState<FileManagerFile[]>([]);
    const [currentImageElementId, setCurrentImageElementId] = useState<number | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/pages/${page.id}`, {
            onSuccess: () => {
                toast.success('Страница успешно обновлена');
                window.location.href = '/pages-admin';
            },
            onError: () => {
                toast.error('Ошибка при обновлении страницы');
            },
        });
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

    // Обработка выбранных файлов выполняется непосредственно в handleFileSelection

    // Обработчик выбора файлов из FileManager
    const handleFileSelection = (files: FileManagerFile[]) => {
        // Сначала сохраняем выбранные файлы для мгновенного предпросмотра
        setSelectedFiles(files);
        // Затем синхронизируем данные элемента
        if (currentImageElementId) {
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

        // Если удаляем файл из временно выбранных (предпросмотр), синхронизируем и элементы
        if (currentImageElementId === elementId && selectedFiles.length > 0) {
            const updatedSelectedFiles = selectedFiles.filter((_, index) => index !== fileIndex);
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
            const nextImages = images.filter((_, index) => index !== fileIndex);
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
                        <input
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full text-foreground px-3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        <label htmlFor="title" className="block text-foreground text-sm font-medium mb-1">
                            Описание *
                        </label>
                        <input
                            id="description"
                            type="text"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full text-foreground px-3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                        )}
                    </div>
                    
                    {elements.map((element, index) => (
                    <div key={index} className="mb-4 p-4 border rounded">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="font-medium">{componentName(element.component_type)}</h2>
                            {/* <button className="cursor-pointer text-red-500 hover:text-red-700" onClick={(e) => handleRemoveElement(e, element.id)}>
                                <TrashIcon className="size-4"/>
                            </button> */}
                        </div>
                    
                    {element.component_type === 'text' && (
                        <input 
                            id={`text-input-${element.id}`}
                            value={element.data?.[0] || ''}
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
                                                <div className="relative">
                                                    <button
                                                        key={`remove-${index}`}
                                                        className="absolute top-1 right-1 cursor-pointer text-red-500 hover:text-red-700"
                                                        onClick={(e) => handleRemoveFile(e, element.id, index)}>
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                    <img  
                                                    key={`selected-${index}`}
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
                                    const images = element.data;
                                    if (Array.isArray(images) && images.length > 0) {
                                        return (
                                            <div className="flex flex-wrap gap-2 mt-2 mb-2">
                                                {images.map((image: string, index: number) => (
                                                    <div key={`image-${index}`} className="relative">
                                                        <button className="absolute top-1 right-1 cursor-pointer text-red-500 hover:text-red-700"
                                                        key={`remove-${index}`}
                                                        onClick={(e) => handleRemoveFile(e, element.id, index)}>
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>   
                                                    <img 
                                                        key={`preview-${index}`}
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
                            className="bg-blue-600 text-white cursor-pointer px-4 p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
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
