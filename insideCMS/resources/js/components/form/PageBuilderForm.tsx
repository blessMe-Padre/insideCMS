import { useState, useEffect } from 'react';
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

interface ArticleFormData {
    name: string;
    description: string;
    slug: string;
    images?: File[];
    images_urls?: string[];
}

interface Element {
    id: string;
    type: string;
    description: string;
    content?: string;
}

// const elementsList = [
//     { name: 'text-block', type: 'text', description: 'Текстовый блок' },
//     { name: 'image-block', type: 'file', description: 'Файл / Изображение' },
//     { name: 'text-editor-block', type: 'text-editor', description: 'Текстовый редактор' },
// ]

export default function PageBuilderForm({ components }: { components: Component[] }) {

    console.log(components);
    
    const { setData, post, processing, reset } = useForm<ArticleFormData>({
        name: '',
        description: '',
        slug: '',
        images: [],
    });

    const [elements, setElements] = useState<Element[]>([]);
    const [selectedElement, setSelectedElement] = useState<string>('');
    const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

    // File manager
    const [activePopup, setActivePopup] = useState<boolean>(false);
    const [selectedFiles, setSelectedFiles] = useState<FileManagerFile[]>([]);
    const [preview, setPreview] = useState<string[]>([]);

    useEffect(() => {
        setPreview(selectedFiles.map((file) => file.path));
        // setData('images_urls', selectedFiles.map((file) => file.path));
    }, [selectedFiles, setData]);

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
                };
                break;
            case 'image-block':
                newElement = {
                    id: `element-${Date.now()}`,
                    type: 'image-block',
                    description: 'Файл / Изображение',
                    content: '',
                };
                break;
            case 'text-editor-block':
                newElement = {
                    id: `element-${Date.now()}`,
                    type: 'text-editor-block',
                    description: 'Текстовый редактор',
                    content: '',
                };
                break;
            default:
                return;
        }

        setElements([...elements, newElement]);
        setSelectedElement('');
        setIsPopoverOpen(false);
      }

    const handleRemoveElement = (id: string) => {
        setElements(elements.filter((element) => element.id !== id));
    }

    const handleSelectElement = (value: string) => {
        setSelectedElement(value);
    }

    console.log(elements);
    const handleUpdateContent = (id: string, content: string) => {
        setElements(elements.map(element => 
            element.id === id ? { ...element, content } : element));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('pages', {
                onSuccess: () => {
                    reset();
                    toast.success('Страница создана успешно');
            },
            onError: () => {
                toast.error('Ошибка при создании страницы');
            },
        });
    }

    return (
        <>
           <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Название страницы
                </label>
                <input 
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Введите название страницы..."
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
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Описание
                </label>
                <input 
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="Введите описание..."
                    className="w-full p-2 border rounded"
                />
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
                           {preview.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2 mb-2">
                                    {preview.map((image, index) => (
                                        <img 
                                            key={`preview-${index}`}
                                            src={image} 
                                            alt={`Preview ${index + 1}`} 
                                            className="w-20 h-20 object-cover rounded-md border" 
                                        />
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
                className="bg-blue-600 flex items-center gap-2 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={handleSubmit}
                disabled={processing}
            >
                {processing ? <LoaderCircle className="size-4 text-gray-500 animate-spin" /> : <SaveIcon className="size-4 text-gray-500"/>}
                <span>Сохранить</span>
            </Button>
        </>
    );
}