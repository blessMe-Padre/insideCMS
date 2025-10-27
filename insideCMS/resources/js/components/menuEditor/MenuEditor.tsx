import React from "react";
import {useState} from "react";
import {DragDropContext, Droppable, Draggable, DropResult} from '@hello-pangea/dnd';

interface FlatMenuItem {
    id: number;
    name: string;
    href: string;
    parentId: number | null;
    isMenu?: boolean;
}

const menuList = [
    {
        id: 1,
        name: 'Menu-1',
        href: '/menu1',
        parentId: null,
        isMenu: true
    },
    {
        id: 2,
        name: 'Menu-2',
        href: '/menu2',
        parentId: null,
        isMenu: true
    },
    {
        id: 3,
        name: 'Menu-3',
        href: '/menu3',
        parentId: null,
        isMenu: true
    },
    {
        id: 4,
        name: 'Menu-4',
        href: '/menu4',
        parentId: null,
        isMenu: true
    },
    {
        id: 5,
        name: 'Menu-5',
        href: '/menu5',
        parentId: null,
        isMenu: true
    },
]

export default function MenuEditor() {
    const [data, setData] = useState<FlatMenuItem[]>(menuList);

    console.log('data', data);

    const getParentName = (parentId: number | null): string | undefined => {
        const parent = data.find(item => item.id === parentId);
        return parent?.name;
    }

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        
        const sourceIndex = result.source.index;
        const destIndex = result.destination.index;
        
        // Если элементы на одном месте, ничего не делаем
        if (sourceIndex === destIndex) return;
        
        const items = Array.from(data);
        const [reorderedItem] = items.splice(sourceIndex, 1);
        items.splice(destIndex, 0, reorderedItem);
        
        // Определяем новую вложенность для элемента
        // Находим ближайшее меню выше (это может быть как меню, так и обычный элемент с меню-родителем)
        let menuIndex = destIndex - 1;
        while (menuIndex >= 0) {
            // Если это меню (родитель) или элемент с родителем
            if (items[menuIndex].isMenu || items[menuIndex].parentId !== null) {
                break;
            }
            menuIndex--;
        }
        
        if (menuIndex >= 0 && items[menuIndex].isMenu) {
            // Элемент стал дочерним меню
            reorderedItem.parentId = items[menuIndex].id;
            reorderedItem.isMenu = false;
        } else {
            // Элемент стал независимым
            reorderedItem.parentId = null;
            if (!reorderedItem.isMenu && destIndex === 0) {
                reorderedItem.isMenu = true;
            }
        }
        
        items[destIndex] = reorderedItem;
        
        setData(items);
    }

    return (
        <div className="max-w-2xl">
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-gray-700">
                    <strong>Как использовать:</strong> Перетащите элемент под меню, чтобы сделать его дочерним. 
                    Синие элементы - родительские меню, зеленые - дочерние элементы.
                </p>
            </div>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="menu">
                    {(provided, snapshot) => (
                        <div 
                            ref={provided.innerRef} 
                            {...provided.droppableProps}
                            className={`min-h-[200px] ${snapshot.isDraggingOver ? 'bg-blue-50 border-2 border-blue-300 rounded-md p-2' : ''}`}>
                            {data.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                                    {(provided, snapshot) => (
                                        <div 
                                            ref={provided.innerRef} 
                                            {...provided.draggableProps}
                                            className={`mb-2 ${snapshot.isDragging ? 'opacity-50' : ''}`}>
                                            <div 
                                                {...provided.dragHandleProps}
                                                className={`p-2 rounded-md border-2 transition-all cursor-move hover:shadow-md ${
                                                    item.isMenu ? 'bg-blue-100 font-bold border-blue-300' : 
                                                    item.parentId ? 'bg-green-100 ml-6 border-green-300' : 
                                                    'bg-gray-200 border-gray-300'
                                                } text-black`}>
                                                <div className="font-bold">{item.name}</div>
                                                {!item.isMenu && item.parentId && (
                                                    <div className="text-xs text-gray-600">{getParentName(item.parentId)}</div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
             </DragDropContext>
        </div>
    );
}