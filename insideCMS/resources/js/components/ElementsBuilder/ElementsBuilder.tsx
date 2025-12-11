
import { useState, useCallback } from 'react';
import { FileManagerFile } from '@cubone/react-file-manager';

import { PlusIcon, SaveIcon, TrashIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TextEditor from '../editor/TextEditor';
import FileManagerComponent from '../editor/fileManager/FileManagerComponent';
import Popup from '../popup/Popup';
import AccordionComponent from '../AccordionComponent/AccordionComponent';
import ListBlock from '../listBlock/ListBlock';

interface Element {
    id: string;
    type?: string;
    description?: string;
    content?: string;
    component_id?: string;
}

interface Component {
    id: string;
    name: string;
    description: string;
    content?: string;
    type: string;
}

interface ElementsBuilderProps {
    components: Component[];
    elements: Element[];
    onChangeElements: (elements: Element[]) => void;
}

export default function ElementsBuilder({ components, elements, onChangeElements }: ElementsBuilderProps) {

    const [selectedElement, setSelectedElement] = useState<string>('');
    const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

    const [activePopup, setActivePopup] = useState<boolean>(false);
    const [selectedFiles, setSelectedFiles] = useState<FileManagerFile[]>([]);
    const [currentImageElementId, setCurrentImageElementId] = useState<string>('');


    const handleUpdateContent = useCallback((id: string, content: string) => {
        const updatedElements = elements.map(element =>
            element.id === id ? { ...element, content } : element
        );

        onChangeElements(updatedElements);
    }, [elements, onChangeElements]);

    const handleFileSelection = (files: FileManagerFile[]) => {
        setSelectedFiles(files);

        if (currentImageElementId) {
            const imageUrls = files.map((file) => file.path);
            const updatedElements = elements.map((element) =>
                element.id === currentImageElementId
                    ? { ...element, content: JSON.stringify(imageUrls) }
                    : element
            );

            onChangeElements(updatedElements);
        }
    };

    const handleRemoveFile = (e: React.FormEvent, elementId: string, fileIndex: number) => {
        e.preventDefault();

        if (currentImageElementId === elementId && selectedFiles.length > 0) {
            const updatedSelectedFiles = selectedFiles.filter((_, index) => index !== fileIndex);
            setSelectedFiles(updatedSelectedFiles);

            const imageUrls = updatedSelectedFiles.map((file) => file.path);
            const updatedElements = elements.map((element) =>
                element.id === elementId
                    ? { ...element, content: JSON.stringify(imageUrls) }
                    : element
            );

            onChangeElements(updatedElements);
            return;
        }

        const updatedElements = elements.map((element) => {
            if (element.id !== elementId) return element;

            try {
                const images = element.content ? JSON.parse(element.content) : [];
                const nextImages = Array.isArray(images)
                    ? images.filter((_, index) => index !== fileIndex)
                    : [];

                return { ...element, content: JSON.stringify(nextImages) };
            } catch {
                return { ...element, content: '[]' };
            }
        });

        onChangeElements(updatedElements);
    };

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
            case 'accordion-block':
                newElement = {
                    id: `element-${Date.now()}`,
                    type: 'accordion-block',
                    description: 'Аккордион',
                    content: '[]',
                    component_id: components.find((component) => component.name === 'accordion-block')?.id || '',
                };
                break;
            case 'list-block':
                newElement = {
                    id: `element-${Date.now()}`,
                    type: 'list-block',
                    description: 'Список',
                    content: '[]',
                    component_id: components.find((component) => component.name === 'list-block')?.id || '',
                };
                break;
            default:
                return;
        }

        const nextElements = [...elements, newElement];
        onChangeElements(nextElements);
        setSelectedElement('');
        setIsPopoverOpen(false);
      }

    const handleRemoveElement = (id: string) => {
        const nextElements = elements.filter((element) => element.id !== id);
        onChangeElements(nextElements);
    }

    const handleSelectElement = (value: string) => {
        setSelectedElement(value);
    }

    
    return (
        <>
            {elements.map((element) => (
                <div key={element.id} className="mb-4 p-4 border rounded">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="font-medium">{element.description}</h2>
                        <button className="cursor-pointer text-red-500 hover:text-red-700" onClick={() => handleRemoveElement(element.id)}>
                            <TrashIcon className="size-4"/>
                        </button>
                    </div>
                    
                    {element.type === 'text-block' && (
                        <Input 
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
                                if (currentImageElementId === element.id && selectedFiles.length > 0) {
                                    return (
                                        <div className="flex flex-wrap gap-2 mt-2 mb-2">
                                            {selectedFiles.map((file, index) => (
                                                <div className="relative" key={`selected-wrapper-${index}`}>
                                                    <button
                                                        key={`remove-${index}`}
                                                        className="absolute top-1 right-1 cursor-pointer text-red-500 hover:text-red-700"
                                                        onClick={(e) => handleRemoveFile(e, element.id, index)}
                                                    >
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

                                if (element.content) {
                                    try {
                                        const images = JSON.parse(element.content);
                                        if (Array.isArray(images) && images.length > 0) {
                                            return (
                                                <div className="flex flex-wrap gap-2 mt-2 mb-2">
                                                    {images.map((image: string, index: number) => (
                                                        <div key={`image-${index}`} className="relative">
                                                            <button
                                                                className="absolute top-1 right-1 cursor-pointer text-red-500 hover:text-red-700"
                                                                key={`remove-${index}`}
                                                                onClick={(e) => handleRemoveFile(e, element.id, index)}
                                                            >
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
                                    } catch {
                                        return null;
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
                                }}
                            >
                                Выбрать файл
                            </Button>

                            <Popup activePopup={activePopup} setActivePopup={setActivePopup}>
                                <FileManagerComponent
                                    initialFiles={[]}
                                    setActivePopup={setActivePopup}
                                    setSelectedFiles={handleFileSelection}
                                />
                            </Popup>
                        </>
                    )}

                    {element.type === 'accordion-block' && (
                        <AccordionComponent content={element.content || ''} onChange={(value) => handleUpdateContent(element.id, value)} />
                    )}

                    {element.type === 'list-block' && (
                        <ListBlock onChange={(value) => handleUpdateContent(element.id, value)} />
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
                        <SaveIcon className="size-4 text-gray-500"/>
                        <span>Сохранить</span>
                    </Button>
                </PopoverContent>
            </Popover>        </>
    )
}