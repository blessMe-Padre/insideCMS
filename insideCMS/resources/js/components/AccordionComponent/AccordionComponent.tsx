
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon } from "lucide-react";
import { Input } from "../ui/input";
import TextEditor from "../editor/TextEditor";

interface AccordionItemProps {
    value: string;
    title: string;
	content: string;
}

export default function AccordionComponent({ content = '[]', onChange }: { content?: unknown, onChange: (value: string) => void }) {
    let initialItems: AccordionItemProps[] = [];
    if (typeof content === 'string') {
        try {
            const parsed = JSON.parse(content as string);
            if (Array.isArray(parsed)) {
                initialItems = parsed as AccordionItemProps[];
            }
        } catch {
            initialItems = [];
        }
    } else if (Array.isArray(content)) {
        initialItems = content as AccordionItemProps[];
    }
    const [accordionItems, setAccordionItems] = useState<AccordionItemProps[]>(initialItems);

    const handleAddAccordionItem = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
		const nextItems: AccordionItemProps[] = [
			...accordionItems,
			{ value: `item-${accordionItems.length + 1}`, title: `Item ${accordionItems.length + 1}`, content: `Content ${accordionItems.length + 1}` }
		];
		setAccordionItems(nextItems);
		onChange(JSON.stringify(nextItems));
    };

    const handleUpdateTitle = (value: string, title: string) => {
		const nextItems = accordionItems.map((item) => item.value === value ? { ...item, title } : item);
		setAccordionItems(nextItems);
		onChange(JSON.stringify(nextItems));
    };

    const handleUpdateContent = (value: string, content: string) => {
		const nextItems = accordionItems.map((item) => item.value === value ? { ...item, content } : item);
		setAccordionItems(nextItems);
		onChange(JSON.stringify(nextItems));
    };

    const handleRemoveAccordionItem = (index: number) => {
		const nextItems = accordionItems.filter((_, i) => i !== index);
		setAccordionItems(nextItems);
		onChange(JSON.stringify(nextItems));
    };

    return (
        <Accordion
        type="single"
        collapsible
        className="w-full max-w-2xl"
      >
        {accordionItems.map((item, index) => (
          <div key={index} className="flex justify-between gap-2">
            <AccordionItem key={index} value={String(index)}>
              <AccordionTrigger>
                  <Input value={item.title}
                      onChange={(e) => handleUpdateTitle(item.value, e.target.value)}
                      placeholder="Заголовок" />
              </AccordionTrigger>
              <AccordionContent>
                  <TextEditor 
                  value={item.content} 
                  onChange={(value) => handleUpdateContent(item.value, value)} 
                  />
              </AccordionContent>
            </AccordionItem>
            <Button title="Удалить элемент аккордиона" variant="outline" className="flex items-center gap-2 cursor-pointer transition-all" onClick={() => handleRemoveAccordionItem(index)}>
                <TrashIcon className="size-4 text-red-500"/>
            </Button>
          </div>
        ))}

        <Button  variant="outline" className="flex items-center gap-2 cursor-pointer transition-all" onClick={handleAddAccordionItem}>
            <PlusIcon className="size-4 text-gray-500"/>
            <span>Добавить элемент аккордиона</span>
        </Button>
      </Accordion>
    )
}