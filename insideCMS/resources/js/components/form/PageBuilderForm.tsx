import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';


const elementsList = [
    { name: 'text-block', type: 'text' },
    { name: 'image-block', type: 'file' },
    { name: 'text-editor-block', type: 'text-editor'},
]

export default function PageBuilderForm() {
    const [elements, setElements] = useState<Array<{ id: string; type: string }>>([]);

    console.log(elementsList);


    const handleAddElement = () => {
        const newElement = {
            id: `element-${Date.now()}`,
            type: 'text-block'
        };
        setElements([...elements, newElement]);
    }


    return (
        <div>
            <h1 className="font-bold mb-4">Создайте страницу</h1>

            {elements.map((element) => (
                <div key={element.id} className="mb-4 p-4 border rounded">
                    <h2>{element.type}</h2>
                </div>
            ))}

            <Button 
                variant="outline" 
                className="flex items-center justify-center w-full h-full gap-2 cursor-pointer transition-all"
                onClick={handleAddElement}
                >
                <PlusIcon className="size-4 text-gray-500"/>
                <span>Добавить элемент</span>
            </Button>

            {/* Сделать вместо кнопки селект с элементами */}
        </div>
    );
}