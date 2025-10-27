import React from "react";
import {useState} from "react";
import {DragDropContext, Droppable, Draggable, DropResult} from '@hello-pangea/dnd';

const menuList = [
    {
        id: 1,
        name: 'Menu-1',
        items: [
            {id: 1, name: 'Item 1', href: '/item1'},
            {id: 2, name: 'Item 2', href: '/item2'},
            {id: 3, name: 'Item 3', href: '/item3'},
        ]
    },
    {
        id: 2,
        name: 'Menu-2',
        items: [
            {id: 2, name: 'Item 2', href: '/item2'},
        ]
    },
    {
        id: 3,
        name: 'Menu-3',
        items: [
            {id: 3, name: 'Item 3', href: '/item3'},
        ]
    }
]

export default function MenuEditor() {
    const [data, setData] = useState(menuList);

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
                                            {item.name}
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