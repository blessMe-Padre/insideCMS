import { useState, useEffect, useCallback } from 'react';
import { useForm } from '@inertiajs/react';
import { FileManagerFile } from '@cubone/react-file-manager';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { LoaderCircle, PlusIcon, SaveIcon, TrashIcon } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TextEditor from '../editor/TextEditor';
import FileManagerComponent from '../editor/fileManager/FileManagerComponent';
import Popup from '../popup/Popup';

interface ServicesFormData {
    title: string;
    description: string;
    slug: string;
    content?: string[];
    images?: string[];
    parentId?: number;
    personaIds?: number[];
    elements?: Element[];
}

interface Component {
    id: string;
    name: string;
    description: string;
    content?: string;
    type: string;
}

interface Service {
    id: number;
    title: string;
    slug: string;
    description: string;
    parentId: number;
}

interface Persona {
    id: number;
    name: string;
}

interface Element {
    id: string;
    type: string;
    description: string;
    content: string;
    component_id: string;
}

export default function ServicesBuilderForm({ components, services, personas }: { components: Component[], services: Service[], personas: Persona[] }) {
       const { data, setData, post, processing, reset, transform } = useForm<ServicesFormData>({
        title: '',
        description: '',
        slug: '',
        content: [],
        images: [],
        parentId: 0,
        personaIds: [],
        elements: [],
    });

    const [elements, setElements] = useState<Element[]>([]);
    const [selectedElement, setSelectedElement] = useState<string>('');
    const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

    // File manager
    const [activePopup, setActivePopup] = useState<boolean>(false);
    const [selectedFiles, setSelectedFiles] = useState<FileManagerFile[]>([]);
    const [selectedImage, setSelectedImage] = useState<FileManagerFile[]>([]);
    const [currentImageElementId, setCurrentImageElementId] = useState<string>('');
 
    const handleUpdateContent = useCallback((id: string, content: string) => {
        const updatedElements = elements.map(element => 
            element.id === id ? { ...element, content: content } : element);
        
        setElements(updatedElements);
        setData('elements', updatedElements);
    }, [elements, setData]);

    useEffect(() => {
        if (selectedFiles.length > 0 && currentImageElementId) {
            const imageUrls = selectedFiles.map((file) => file.path);
            handleUpdateContent(currentImageElementId, JSON.stringify(imageUrls));
            setSelectedFiles([]); // Очищаем выбранные файлы после обработки
        }
    }, [selectedFiles, currentImageElementId, handleUpdateContent]);

    const handleAddElement = () => {
        if (!selectedElement) return;
        
        let newElement;

        switch (selectedElement) {
            case 'text-block':
                newElement = {
                    id: `element-${Date.now()}`,
                    type: 'text-block',
                    description: 'Текстовый блок',
                    content: '',
                    component_id: components.find((component) => component.name === 'text-block')?.id || '',
                };
                break;
            case 'image-block':
                newElement = {
                    id: `element-${Date.now()}`,
                    type: 'image-block',
                    description: 'Файл / Изображение',
                    content: '',
                    component_id: components.find((component) => component.name === 'image-block')?.id || '',
                };
                break;
            case 'text-editor-block':
                newElement = {
                    id: `element-${Date.now()}`,
                    type: 'text-editor-block',
                    description: 'Текстовый редактор',
                    content: '',
                    component_id: components.find((component) => component.name === 'text-editor-block')?.id || '',
                };
                break;
            default:
                return;
        }

        const next = [...elements, newElement];
        setElements(next);
        setData('elements', next);
        setSelectedElement('');
        setIsPopoverOpen(false);
      }

    const handleRemoveElement = (id: string) => {
        const next = elements.filter((element) => element.id !== id);
        setElements(next);
        setData('elements', next);
    }

    const handleSelectElement = (value: string) => {
        setSelectedElement(value);
    }

    useEffect(() => {
        if (selectedImage.length > 0) {
            setData('images', selectedImage.map((image) => image.path));
        }
    }, [selectedImage, setData]);

    const handleRemoveFile = (e: React.MouseEvent, elementId: string, fileIndex: number) => {
        e.preventDefault();

        const updatedElements = elements.map((element) => {
            if (element.id !== elementId) return element;
            const existingUrls: string[] = element.content ? JSON.parse(element.content) : [];
            const nextUrls = existingUrls.filter((_, index) => index !== fileIndex);
            return { ...element, content: JSON.stringify(nextUrls) };
        });

        setElements(updatedElements);
        setData('elements', updatedElements);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        transform((form) => ({
            ...form,
            parentId: form.parentId && form.parentId > 0 ? form.parentId : undefined,
            personaIds: form.personaIds && form.personaIds.length > 0 ? form.personaIds : undefined,
        }));

        post('services', {
            onSuccess: () => {
                reset();
                toast.success('Услуга создана успешно');
            },
            onError: () => {
                toast.error('Ошибка при создании услуги');
            },
        });
    }

    const handleSelectParent = (value: string) => {
        setData('parentId', parseInt(value));
    }

    const handleAddPersona = (value: string) => {
        const id = parseInt(value);
        const current = Array.isArray(data.personaIds) ? data.personaIds : [];
        if (!current.includes(id)) {
            setData('personaIds', [...current, id]);
        }
    }

    const handleRemovePersona = (id: number) => {
        const current = Array.isArray(data.personaIds) ? data.personaIds : [];
        const next = current.filter((x) => x !== id);
        setData('personaIds', next);
    }

    return (
        <>
           <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Название
                </label>
                <input 
                    onChange={(e) => setData('title', e.target.value)}
                    placeholder="Введите название..."
                    className="w-full p-2 border rounded"
                />
           </div>
           <div className="mb-4">
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                    Slug
                </label>
                <input 
                    onChange={(e) => setData('slug', e.target.value)}
                    placeholder="Введите slug..."
                    className="w-full p-2 border rounded"
                />
           </div>
           <div className="mb-4">
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                    Описание
                </label>
                <input 
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="Введите описание..."
                    className="w-full p-2 border rounded"
                />
           </div>
           <div className="mb-4">
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                    Родительская услуга
                </label>
 
                <Select onValueChange={handleSelectParent}>
                    <SelectTrigger className="w-[320px]">
                        <SelectValue placeholder="Выберите родителя" />
                    </SelectTrigger>
                    <SelectContent>
                        {services.map((service) => (
                            <SelectItem key={service.id} value={service.id.toString()}>{service.title}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
           </div>
           <div className="mb-4">
                <label htmlFor="persona" className="block text-sm font-medium text-gray-700 mb-1">
                    Персона
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                    {(data.personaIds ?? []).map((id) => {
                        const p = personas.find((pp) => pp.id === id);
                        return (
                            <div key={id} className="flex items-center gap-2 border rounded px-2 py-1">
                                <span>{p?.name ?? id}</span>
                                <button onClick={(e) => { e.preventDefault(); handleRemovePersona(id); }}>
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        );
                    })}
                </div>
                <Select onValueChange={handleAddPersona}>
                    <SelectTrigger className="w-[320px]">
                        <SelectValue placeholder="Добавить персону" />
                    </SelectTrigger>
                    <SelectContent>
                        {personas.map((p) => (
                            <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 mt-2" />
           </div>
           <div className="mb-4">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                   Изображения
                </label>

                {selectedImage.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 mb-2">
                        {selectedImage.map((image, index) => (
                            <img key={index} src={image.path} alt={image.name} className="w-20 h-20 object-cover rounded-md border" />
                        ))}
                    </div>
                )}

                <Button 
                    variant="outline" 
                    onClick={(e) => {
                        e.preventDefault();
                        setActivePopup(true);
                    }}>Выбрать файл</Button>
                <Popup activePopup={activePopup} setActivePopup={setActivePopup}>
                    <FileManagerComponent initialFiles={[]} setActivePopup={setActivePopup} setSelectedFiles={setSelectedImage} />
                </Popup>
             </div>

            {elements.map((element) => (
                <div key={element.id} className="mb-4 p-4 border rounded">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="font-medium">{element.description}</h2>
                        <button className="cursor-pointer text-red-500 hover:text-red-700" onClick={() => handleRemoveElement(element.id)}>
                            <TrashIcon className="size-4"/>
                        </button>
                    </div>
                    
                    {element.type === 'text-block' && (
                        <input 
                            value={element.content || ''}
                            onChange={(e) => handleUpdateContent(element.id, e.target.value)}
                            placeholder="Введите текст..."
                            className="w-full p-2 border rounded"
                         />
                    )}
                    
                    {element.type === 'text-editor-block' && (
                        <TextEditor value={element.content || ''} onChange={(value) => handleUpdateContent(element.id, value)} />
                    )}

                    {element.type === 'image-block' && (
                        <>
                            {(() => {
                                const imageUrls: string[] = element.content ? JSON.parse(element.content) : [];
                                return imageUrls.length > 0 ? (
                                    <div className="flex flex-wrap gap-2 mt-2 mb-2">
                                        {imageUrls.map((url, index) => (
                                            <div key={`selected-${index}`} className="relative">
                                                <button
                                                    className="absolute top-1 right-1 cursor-pointer text-red-500 hover:text-red-700 z-10"
                                                    onClick={(e) => handleRemoveFile(e, element.id, index)}>
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                                <img
                                                    src={url}
                                                    alt={`Selected ${index + 1}`}
                                                    className={`w-20 h-20 object-cover rounded-md border ${currentImageElementId === element.id ? 'border-blue-500' : ''}`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ) : null;
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
                                    setSelectedFiles={setSelectedFiles}
                                />
                            </Popup>
                        </>
                    )}
                </div>
            ))}
         

            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger className="flex items-center w-full justify-center gap-2 cursor-pointer transition-all mb-2">
                    <PlusIcon className="size-4 text-gray-500"/>
                    <span>Добавить элемент</span>
                </PopoverTrigger>

                <PopoverContent>
                    <Select onValueChange={handleSelectElement}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Выберите элемент" />
                        </SelectTrigger>
                        <SelectContent>
                            {components.map((element, index) => (
                                <SelectItem 
                                    key={index} 
                                    value={element.name}>
                                    {element.description}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button 
                        variant="outline" 
                        className="flex items-center justify-center gap-2 cursor-pointer transition-all"
                        onClick={handleAddElement}
                        disabled={!selectedElement}
                        >
                        <PlusIcon className="size-4 text-gray-500"/>
                        <span>Сохранить</span>
                    </Button>
                </PopoverContent>
            </Popover>

            <Button 
                className="bg-blue-600 flex items-center gap-2 cursor-pointer text-white px-4 py-2 rounded-sm hover:bg-blue-700 transition-colors"
                onClick={handleSubmit}
                disabled={processing}
            >
                {processing ? <LoaderCircle className="size-4 text-gray-500 animate-spin" /> : <SaveIcon className="size-4 text-gray-500"/>}
                <span>Сохранить</span>
            </Button>
        </>
    );
}