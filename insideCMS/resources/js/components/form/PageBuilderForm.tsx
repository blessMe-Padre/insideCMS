import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { PlusIcon, TrashIcon } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TextEditor from '../editor/TextEditor';


const elementsList = [
    { name: 'text-block', type: 'text', description: 'Текстовый блок' },
    { name: 'image-block', type: 'file', description: 'Файл / Изображение' },
    { name: 'text-editor-block', type: 'text-editor', description: 'Текстовый редактор' },
]

export default function PageBuilderForm() {
    const [elements, setElements] = useState<Array<{ id: string; type: string; description?: string }>>([]);
    const [selectedElement, setSelectedElement] = useState<string>('');
    const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

    console.log(elements);

    const handleAddElement = () => {
        if (!selectedElement) return;
        
        let newElement;

        switch (selectedElement) {
            case 'text-block':
                newElement = {
                    id: `element-${Date.now()}`,
                    type: 'text-block',
                    description: 'Текстовый блок',
                };
                break;
            case 'image-block':
                newElement = {
                    id: `element-${Date.now()}`,
                    type: 'image-block',
                    description: 'Файл / Изображение',
                };
                break;
            case 'text-editor-block':
                newElement = {
                    id: `element-${Date.now()}`,
                    type: 'text-editor-block',
                    description: 'Текстовый редактор',
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

    const handleUpdateContent = (id: string, content: string) => {
        setElements(elements.map(element => 
            element.id === id ? { ...element, content } : element
        ));
    }

    return (
        <div>
            <h1 className="font-bold mb-4">Создайте страницу</h1>

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
                            onChange={(e) => handleUpdateContent(element.id, e.target.value)}
                            placeholder="Введите текст..."
                            className="w-full p-2 border rounded"
                         />
                    )}
                    
                    {element.type === 'text-editor-block' && (
                        <TextEditor />
                    )}

                    {element.type === 'image-block' && (
                        <p>файловый менеджер</p>
                    )}
                </div>
            ))}
         

            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger className="flex items-center justify-center w-full h-full gap-2 cursor-pointer transition-all">
                    <PlusIcon className="size-4 text-gray-500"/>
                    <span>Добавить элемент</span>
                </PopoverTrigger>

                <PopoverContent>
                    <Select onValueChange={handleSelectElement}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Выберите элемент" />
                        </SelectTrigger>
                        <SelectContent>
                            {elementsList.map((element, index) => (
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
                        className="flex items-center justify-center w-full h-full gap-2 cursor-pointer transition-all"
                        onClick={handleAddElement}
                        disabled={!selectedElement}
                        >
                        <PlusIcon className="size-4 text-gray-500"/>
                        <span>Добавить элемент</span>
                    </Button>
                </PopoverContent>
            </Popover>

        </div>
    );
}