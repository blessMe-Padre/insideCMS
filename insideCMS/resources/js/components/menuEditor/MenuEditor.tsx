import React from "react";
import {useState} from "react";
import {DragDropContext, Droppable, Draggable, DropResult} from '@hello-pangea/dnd';

interface FlatMenuItem {
    id: number;
    name: string;
    href: string;
    menuId: number | null;
    menuName: string | null;
    isMenu?: boolean;
}

const menuList = [
    {
        id: 1,
        name: 'Menu-1',
        href: '/menu1',
        items: [
            {id: 1, name: 'Menu-1 Item 1', href: '/item1'},
            {id: 2, name: 'Menu-1 Item 2', href: '/item2'},

        ]
    },
    {
        id: 2,
        name: 'Menu-2',
        href: '/menu2',
        items: [
            {id: 2, name: 'Menu-2 Item 1', href: '/item2'},
        ]
    },
    {
        id: 3,
        name: 'Menu-3',
        href: '/menu3',
        items: [
            {id: 3, name: 'Menu-3 Item 1', href: '/item3'},
        ]
    }
]

// Преобразуем вложенную структуру в плоский список
const flattenMenuList = (menus: typeof menuList): FlatMenuItem[] => {
    const flatList: FlatMenuItem[] = [];
    let itemId = 1;
    
    menus.forEach(menu => {
        // Добавляем само меню
        flatList.push({
            id: itemId++,
            name: menu.name,
            href: menu.href,
            menuId: null,
            menuName: null,
            isMenu: true
        });
        
        // Добавляем элементы меню
        menu.items.forEach(item => {
            flatList.push({
                id: itemId++,
                name: item.name,
                href: item.href,
                menuId: menu.id,
                menuName: menu.name,
                isMenu: false
            });
        });
    });
    
    return flatList;
};

export default function MenuEditor() {
    const [data, setData] = useState(flattenMenuList(menuList));

    console.log('data', data);

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const items = Array.from(data);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
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
                                            ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} 
                                            className="bg-gray-200 text-black mb-2 p-2 rounded-md">
                                            <div>
                                                <div className="font-bold">{item.name}</div>
                                                {!item.isMenu && item.menuName && (
                                                    <div className="text-xs text-gray-600">{item.menuName}</div>
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