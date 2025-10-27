import React from "react";
import {useState} from "react";
import {DragDropContext, Droppable, Draggable, DropResult} from '@hello-pangea/dnd';

interface FlatMenuItem {
    id: number;
    name: string;
    href: string;
    parentId: number | null;
    isParent?: boolean;
}

const menuList = [
    {
        id: 1,
        name: 'Menu-1',
        href: '/menu1',
        parentId: null,
        isParent: true
    },
    {
        id: 2,
        name: 'Menu-2',
        href: '/menu2',
        parentId: null,
        isParent: true
    },
    {
        id: 3,
        name: 'Menu-3',
        href: '/menu3',
        parentId: null,
        isParent: true
    },
    {
        id: 4,
        name: 'Menu-4',
        href: '/menu4',
        parentId: null,
        isParent: true
    },
    {
        id: 5,
        name: 'Menu-5',
        href: '/menu5',
        parentId: null,
        isParent: true
    },
]

export default function MenuEditor() {
    const [data, setData] = useState<FlatMenuItem[]>(menuList);

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
        
        setData(items);
    }

    const handlePromoteItem = (itemId: number) => {
        setData(prevData => 
            prevData.map(item => 
                item.id === itemId ? { ...item, parentId: null, isParent: true } : item
            )
        );
    }

    const handleMakeChild = (itemId: number) => {
        setData(prevData => {
            const itemIndex = prevData.findIndex(item => item.id === itemId);
            if (itemIndex === -1 || itemIndex === 0) return prevData;
            
            // Ищем ближайшее меню выше
            let parentIndex = itemIndex - 1;
            while (parentIndex >= 0) {
                if (prevData[parentIndex].isParent && prevData[parentIndex].parentId === null) {
                    break;
                }
                parentIndex--;
            }
            
            if (parentIndex >= 0) {
                // Нашли родительское меню
                return prevData.map(item => 
                    item.id === itemId ? { ...item, parentId: prevData[parentIndex].id, isParent: false } : item
                );
            }
            
            return prevData;
        });
    }

    return (
        <div className="max-w-2xl">
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="menu">
                    {(provided) => (
                        <div 
                            ref={provided.innerRef} 
                            {...provided.droppableProps}
                            className={`min-h-[200px]`}>
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
                                                    item.isParent ? 'bg-blue-100 font-bold border-blue-300' : 
                                                    item.parentId ? 'bg-green-100 ml-6 border-green-300' : 
                                                    'bg-gray-200 border-gray-300'
                                                } text-black`}>
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <div className="font-bold">{item.name}</div>
                                                        {!item.isParent && item.parentId && (
                                                            <div className="text-xs text-gray-600">Родитель: {getParentName(item.parentId)}</div>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-1">
                                                        {item.parentId !== null && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handlePromoteItem(item.id);
                                                                }}
                                                                className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded transition-colors"
                                                                title="Убрать дочерность"
                                                            >
                                                                ↑
                                                            </button>
                                                        )}
                                                        {item.parentId === null && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleMakeChild(item.id);
                                                                }}
                                                                className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded transition-colors"
                                                                title="Сделать дочерним"
                                                            >
                                                                ↓
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
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