import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { PlusIcon, TrashIcon } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


// const elementsList = [
//     { name: 'text-block', type: 'text', description: 'Текстовый блок' },
//     { name: 'image-block', type: 'file', description: 'Изображение' },
//     { name: 'text-editor-block', type: 'text-editor', description: 'Текстовый редактор' },
// ]

export default function PageBuilderForm() {
    const [elements, setElements] = useState<Array<{ id: string; type: string }>>([]);
    const [selectedElement, setSelectedElement] = useState<string>('');
    const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

    const handleAddElement = () => {
        if (!selectedElement) return;
        
        const newElement = {
          id: `element-${Date.now()}`,
          type: selectedElement
        };
        
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


    return (
        <div>
            <h1 className="font-bold mb-4">Создайте страницу</h1>

            {elements.map((element) => (
                <div key={element.id} className="mb-4 p-4 border rounded flex items-center justify-between">
                    <h2>{element.type}</h2>
                    <button className="cursor-pointer" onClick={() => handleRemoveElement(element.id)}><TrashIcon/></button>
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
                            <SelectItem value="text-block">Текстовый блок</SelectItem>
                            <SelectItem value="image-block">Изображение</SelectItem>
                            <SelectItem value="text-editor-block">Текстовый редактор</SelectItem>
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