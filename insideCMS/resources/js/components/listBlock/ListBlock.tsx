import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ImageIcon, PlusIcon, TrashIcon } from "lucide-react";
import { Input } from "../ui/input";
import TextEditor from "../editor/TextEditor";
import FileManagerComponent from "../editor/fileManager/FileManagerComponent";
import Popup from "../popup/Popup";
import { FileManagerFile } from "@cubone/react-file-manager";

interface ListBlockItem {
    title: string;
    link: string;
    content: string;
    images: string[];
}

export default function ListBlock() {
    const [listItems, setListItems] = useState<ListBlockItem[]>([]);

    // File manager
    const [activePopup, setActivePopup] = useState<boolean>(false);
    const [selectedFiles, setSelectedFiles] = useState<FileManagerFile[]>([]);
    const [currentImageElementId, setCurrentImageElementId] = useState<string>('');

    const handleAddListBlockItem = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
		const nextItems: ListBlockItem[] = [
			...listItems,
			{
                title: `Item ${listItems.length + 1}`,
                link: `https://www.google.com`,
                images: [],
                content: `Content ${listItems.length + 1}`,
            }
        ];
        setListItems(nextItems);
    };

    const handleRemoveListBlockItem = (e: React.MouseEvent<HTMLButtonElement>, value: string) => {
        e.preventDefault();
        const nextItems = listItems.filter((item) => item.title !== value);
        setListItems(nextItems);
    }

    const handleUpdateTitle = (value: string, title: string) => {
        const nextItems = listItems.map((item) => item.title === value ? { ...item, title } : item);
        setListItems(nextItems);
    }

    const handleUpdateLink = (value: string, link: string) => {
        const nextItems = listItems.map((item) => item.link === value ? { ...item, link } : item);
        setListItems(nextItems);
    }

    const handleUpdateContent = (value: string, content: string) => {
        console.log(value, content);
    }

    const handleRemoveFile = (e: React.MouseEvent, elementId: string, fileIndex: number) => {
        e.preventDefault();

        // Если удаляем файл из временно выбранных (предпросмотр) для активного элемента
        if (currentImageElementId === elementId && selectedFiles.length > 0) {
            const fileToRemove = selectedFiles[fileIndex];
            const updatedSelectedFiles = selectedFiles.filter((_, index) => index !== fileIndex);
            setSelectedFiles(updatedSelectedFiles);

            // Синхронизируем изображения у соответствующего элемента списка
            setListItems((prev) =>
                prev.map((item) => {
                    if (item.title !== elementId) return item;
                    const pathToRemove = fileToRemove?.path || '';
                    if (pathToRemove) {
                        return { ...item, images: (item.images || []).filter((p) => p !== pathToRemove) };
                    }
                    return { ...item, images: (item.images || []).filter((_, i) => i !== fileIndex) };
                })
            );
            return;
        }

        // Иначе удаляем по индексу из сохранённых изображений элемента
        setListItems((prev) =>
            prev.map((item) =>
                item.title === elementId
                    ? { ...item, images: (item.images || []).filter((_, index) => index !== fileIndex) }
                    : item
            )
        );
    };

    return (
        <>
        <Accordion
            type="single"
            collapsible
            className="w-full max-w-2xl"
        >   
            {listItems.map((item) => (
                <div key={item.title} className="flex justify-between gap-2">
                    <AccordionItem key={item.title} value={item.title}>
                        <AccordionTrigger>
                            <Input
                                placeholder="Заголовок"
                                value={item.title}
                                onChange={(e) => handleUpdateTitle(item.title, e.target.value)}
                            />
                        </AccordionTrigger>
                        <AccordionContent>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Ссылка
                            </label>
                            <Input
                                placeholder="Введите ссылку"
                                value={item.link} 
                                onChange={(e) => handleUpdateLink(item.title, e.target.value)}
                                className="mb-2" 
                            />
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Контент
                            </label>
                            <TextEditor
                                value={item.content}
                                onChange={(value) => handleUpdateContent(item.title, value)}
                            />

   
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                            Изображения
                        </label>
                        
                        {selectedFiles.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2 mb-2">
                                {selectedFiles.map((file, index) => (
                                    <div key={`selected-${index}`} className="relative">
                                        <button
                                            className="absolute top-1 right-1 cursor-pointer text-red-500 hover:text-red-700 z-10"
                                            onClick={(e) => handleRemoveFile(e, item.title, index)}>
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                        <img  
                                            src={file.path} 
                                            alt={`Selected ${index + 1}`} 
                                            className={`w-20 h-20 object-cover rounded-md border ${
                                                currentImageElementId === item.title ? 'border-blue-500' : ''
                                            }`}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        <Button 
                            type="button"
                            variant="outline" 
                            onClick={(e) => {
                                e.preventDefault();
                                setCurrentImageElementId(item.title);
                                setActivePopup(true);
                            }}>
                                <ImageIcon className="size-4 text-gray-500"/>
                                <span>Выбрать файл</span>
                        </Button>
                        
                        <Popup activePopup={activePopup} setActivePopup={setActivePopup}>
                            <FileManagerComponent 
                                initialFiles={[]}
                                setActivePopup={setActivePopup}
                                setSelectedFiles={setSelectedFiles}
                            />
                        </Popup>
                    </div>

                            
                         </AccordionContent>
                    </AccordionItem>
                    <Button 
                    variant="outline" 
                    onClick={(e) => handleRemoveListBlockItem(e, item.title)}
                    className="cursor-pointer"
                    >
                        <TrashIcon className="size-4 text-red-500"/>
                    </Button>
                </div>
            ))}
            <Button  variant="outline" className="flex items-center gap-2 cursor-pointer transition-all" onClick={handleAddListBlockItem}>
                <PlusIcon className="size-4 text-gray-500"/>
                <span>Добавить элемент списка</span>
            </Button>
        </Accordion>
        </>
    )
}