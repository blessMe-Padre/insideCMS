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

export default function ListBlock({ content, onChange }: { content?: unknown, onChange: (value: string) => void }) {
    let initialItems: ListBlockItem[] = [];
    if (typeof content === 'string') {
        try {
            const parsed = JSON.parse(content as string);
            if (Array.isArray(parsed)) {
                initialItems = parsed as ListBlockItem[];
            }
        } catch {
            initialItems = [];
        }
    } else if (Array.isArray(content)) {
        initialItems = content as ListBlockItem[];
    }
    const [listItems, setListItems] = useState<ListBlockItem[]>(initialItems);

    // File manager
    const [activePopup, setActivePopup] = useState<boolean>(false);
    const [currentImageElementId, setCurrentImageElementId] = useState<number | null>(null);

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
        onChange(JSON.stringify(nextItems));
    };

    const handleRemoveListBlockItem = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
        e.preventDefault();
        const nextItems = listItems.filter((_, i) => i !== index);
        setListItems(nextItems);
        onChange(JSON.stringify(nextItems));
    }

    const handleUpdateTitle = (index: number, title: string) => {
        const nextItems = listItems.map((item, i) => i === index ? { ...item, title } : item);
        setListItems(nextItems);
        onChange(JSON.stringify(nextItems));
    }

    const handleUpdateLink = (index: number, link: string) => {
        const nextItems = listItems.map((item, i) => i === index ? { ...item, link } : item);
        setListItems(nextItems);
        onChange(JSON.stringify(nextItems));
    }

    const handleUpdateContent = (index: number, content: string) => {
        const nextItems = listItems.map((item, i) => i === index ? { ...item, content } : item);
        setListItems(nextItems);
        onChange(JSON.stringify(nextItems));
    }

    const handleRemoveFile = (e: React.MouseEvent, elementIndex: number, fileIndex: number) => {
        e.preventDefault();
        const nextItems = listItems.map((item, i) =>
            i === elementIndex
                ? { ...item, images: (item.images || []).filter((_, index) => index !== fileIndex) }
                : item
        );
        setListItems(nextItems);
        onChange(JSON.stringify(nextItems));
    };

	const handleFilesSelected = (files: FileManagerFile[]) => {
		if (currentImageElementId === null) {
			setActivePopup(false);
			return;
		}

		const newPaths = files.map((f) => f.path).filter(Boolean) as string[];

        const nextItems = listItems.map((item, i) => {
            if (i !== currentImageElementId) return item;
            const existing = item.images || [];
            const merged = Array.from(new Set([...existing, ...newPaths]));
            return { ...item, images: merged };
        });
		setListItems(nextItems);
        onChange(JSON.stringify(nextItems));

		setActivePopup(false);
		setCurrentImageElementId(null);
	};

    return (
        <>
        <Accordion
            type="single"
            collapsible
            className="w-full max-w-2xl"
        >   
            {listItems.map((item, index) => (
                <div key={index} className="flex justify-between gap-2">
                    <AccordionItem key={index} value={String(index)}>
                        <AccordionTrigger>
                            <Input
                                placeholder="Заголовок"
                                value={item.title}
                                onChange={(e) => handleUpdateTitle(index, e.target.value)}
                            />
                        </AccordionTrigger>
                        <AccordionContent>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Ссылка
                            </label>
                            <Input
                                placeholder="Введите ссылку"
                                value={item.link} 
                                onChange={(e) => handleUpdateLink(index, e.target.value)}
                                className="mb-2" 
                            />
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Контент
                            </label>
                            <TextEditor
                                value={item.content}
                                onChange={(value) => handleUpdateContent(index, value)}
                            />

   
					<div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                            Изображения
                        </label>
                        
						{(item.images && item.images.length > 0) && (
							<div className="flex flex-wrap gap-2 mt-2 mb-2">
								{item.images.map((src, imgIndex) => (
									<div key={`img-${imgIndex}`} className="relative">
										<button
											className="absolute top-1 right-1 cursor-pointer text-red-500 hover:text-red-700 z-10"
											onClick={(e) => handleRemoveFile(e, index, imgIndex)}>
											<TrashIcon className="w-4 h-4" />
										</button>
										<img
											src={src}
											alt={`Image ${imgIndex + 1}`}
											className="w-20 h-20 object-cover rounded-md border"
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
                                setCurrentImageElementId(index);
                                setActivePopup(true);
                            }}>
                                <ImageIcon className="size-4 text-gray-500"/>
                                <span>Выбрать файл</span>
                        </Button>
                        
                        <Popup activePopup={activePopup} setActivePopup={setActivePopup}>
                            <FileManagerComponent 
                                initialFiles={[]}
                                setActivePopup={setActivePopup}
								setSelectedFiles={handleFilesSelected}
                            />
                        </Popup>
                    </div>
                         </AccordionContent>
                    </AccordionItem>
                    <Button 
                    variant="outline" 
                    onClick={(e) => handleRemoveListBlockItem(e, index)}
                    className="cursor-pointer"
                    title="Удалить элемент списка"
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