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
        onChange(JSON.stringify(nextItems));
    };

    const handleRemoveListBlockItem = (e: React.MouseEvent<HTMLButtonElement>, value: string) => {
        e.preventDefault();
        const nextItems = listItems.filter((item) => item.title !== value);
        setListItems(nextItems);
        onChange(JSON.stringify(nextItems));
    }

    const handleUpdateTitle = (value: string, title: string) => {
        const nextItems = listItems.map((item) => item.title === value ? { ...item, title } : item);
        setListItems(nextItems);
        onChange(JSON.stringify(nextItems));
    }

    const handleUpdateLink = (value: string, link: string) => {
        const nextItems = listItems.map((item) => item.link === value ? { ...item, link } : item);
        setListItems(nextItems);
        onChange(JSON.stringify(nextItems));
    }

    const handleUpdateContent = (value: string, content: string) => {
        const nextItems = listItems.map((item) => item.title === value ? { ...item, content } : item);
        setListItems(nextItems);
        onChange(JSON.stringify(nextItems));
    }

    const handleRemoveFile = (e: React.MouseEvent, elementId: string, fileIndex: number) => {
        e.preventDefault();
        const nextItems = listItems.map((item) =>
            item.title === elementId
                ? { ...item, images: (item.images || []).filter((_, index) => index !== fileIndex) }
                : item
        );
        setListItems(nextItems);
        onChange(JSON.stringify(nextItems));
    };

	const handleFilesSelected = (files: FileManagerFile[]) => {
		if (!currentImageElementId) {
			setActivePopup(false);
			return;
		}

		const newPaths = files.map((f) => f.path).filter(Boolean) as string[];

        const nextItems = listItems.map((item) => {
            if (item.title !== currentImageElementId) return item;
            const existing = item.images || [];
            const merged = Array.from(new Set([...existing, ...newPaths]));
            return { ...item, images: merged };
        });
		setListItems(nextItems);
        onChange(JSON.stringify(nextItems));

		setActivePopup(false);
		setCurrentImageElementId('');
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
                                defaultValue={item.link} 
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
                        
						{(item.images && item.images.length > 0) && (
							<div className="flex flex-wrap gap-2 mt-2 mb-2">
								{item.images.map((src, index) => (
									<div key={`img-${index}`} className="relative">
										<button
											className="absolute top-1 right-1 cursor-pointer text-red-500 hover:text-red-700 z-10"
											onClick={(e) => handleRemoveFile(e, item.title, index)}>
											<TrashIcon className="w-4 h-4" />
										</button>
										<img
											src={src}
											alt={`Image ${index + 1}`}
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
								setSelectedFiles={handleFilesSelected}
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