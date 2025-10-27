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
        <div>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="menu">
                    {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                            {data.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                                    {(provided) => (
                                        <div 
                                            ref={provided.innerRef} {...provided.draggableProps}
                                            className="mb-2">
                                            <div 
                                                {...provided.dragHandleProps}
                                                className={`p-2 rounded-md ${
                                                    item.isMenu ? 'bg-blue-100 font-bold' : 
                                                    item.parentId ? 'bg-green-100 ml-6' : 
                                                    'bg-gray-200'
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