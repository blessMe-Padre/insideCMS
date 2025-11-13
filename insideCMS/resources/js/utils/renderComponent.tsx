
type EditorText = { text: string; bold?: boolean; italic?: boolean; underline?: boolean; code?: boolean; link?: boolean };
interface ParagraphNode { type: 'paragraph'; children: EditorText[] }
interface HeadingOneNode { type: 'heading-one'; children: EditorText[] }
interface HeadingTwoNode { type: 'heading-two'; children: EditorText[] }
interface ListItemNode { type: 'list-item'; children: EditorText[] }
interface BulletedListNode { type: 'bulleted-list'; children: ListItemNode[] }
interface NumberedListNode { type: 'numbered-list'; children: ListItemNode[] }
type EditorChildNode =
  | ParagraphNode
  | HeadingOneNode
  | HeadingTwoNode
  | BulletedListNode
  | NumberedListNode
  | ListItemNode;

interface AccordionItem {
  title: string;
  value?: string;
  content: EditorChildNode[];
}

export interface Component {
  id: number;
  type: string;
  title: string;
  description: string;
  content: string;
  pivot: {
      data: string;
  };
  component_data?: EditorChildNode[];
}

/**
 * @param component принимает элемент из массива components
 * @description Функция для рендера контента из текстового редактора
 * работает с компонентами text-editor, accordion-block, list-block
 * @returns Возвращает html разметку для компонента
 */

export function renderComponent(component: Component) {
    console.log(component);
 
    const data = component.component_data ?? [];

    const renderLeaf = (leaf: EditorText, key: string | number) => {
        let content: React.ReactNode = leaf.text ?? '';

        if (leaf.link && typeof leaf.text === 'string') {
            const match = leaf.text.match(/<a[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/i);
            if (match) {
                const [, href, inner] = match;
                content = (
                    <a href={href} target="_blank" rel="noopener noreferrer">
                        {inner}
                    </a>
                );
            }
        }

        if (leaf.code) {
            content = <code>{content}</code>;
        }
        if (leaf.bold) {
            content = <strong>{content}</strong>;
        }
        if (leaf.italic) {
            content = <em>{content}</em>;
        }
        if (leaf.underline) {
            content = <u>{content}</u>;
        }

        return <span key={key}>{content}</span>;
    };

    const renderChildren = (children: EditorText[] = []) => {
        return children.map((leaf, idx) => renderLeaf(leaf, idx));
    };
    switch (component.type) {
        case 'text-editor':
            return data.map((child, childIndex) => {
                switch (child.type) {
                    case 'heading-one':
                        return <h1 key={`comp-${component.id}-h1-${childIndex}`}>{renderChildren(child.children)}</h1>;
                    case 'heading-two':
                        return <h2 className="text-2xl font-bold my-3" key={`comp-${component.id}-h2-${childIndex}`}>{renderChildren(child.children)}</h2>;
                    case 'paragraph':
                        return <p className="my-2" key={`comp-${component.id}-p-${childIndex}`}>{renderChildren(child.children)}</p>;
                    case 'bulleted-list':
                        return (
                            <ul className="list-disc list-inside" key={`comp-${component.id}-ul-${childIndex}`}>
                                {child.children.map((li, liIndex) => (
                                    <li key={`comp-${component.id}-bul-${childIndex}-${liIndex}`}>{renderChildren(li.children)}</li>
                                ))}
                            </ul>
                        );
                    case 'numbered-list':
                        return (
                            <ol className="list-decimal list-inside" key={`comp-${component.id}-ol-${childIndex}`}>
                                {child.children.map((li, liIndex) => (
                                    <li key={`comp-${component.id}-num-${childIndex}-${liIndex}`}>{renderChildren(li.children)}</li>
                                ))}
                            </ol>
                        );

                    default:
                        return null;
                }
            });

        case 'accordion-block':
            return (
               ((data as unknown as AccordionItem[]) ?? []).flatMap((item: AccordionItem, itemIndex: number) =>
                    item.content.map((child: EditorChildNode, childIndex: number) => {
                        switch (child.type) {
                            case 'heading-one':
                                return <h1 key={`comp-${component.id}-acc-${itemIndex}-h1-${childIndex}`}>{renderChildren(child.children)}</h1>;
                            case 'heading-two':
                                return <h2 key={`comp-${component.id}-acc-${itemIndex}-h2-${childIndex}`}>{renderChildren(child.children)}</h2>;
                            case 'paragraph':
                                return <p key={`comp-${component.id}-acc-${itemIndex}-p-${childIndex}`}>{renderChildren(child.children)}</p>;
                            case 'bulleted-list':
                                return (
                                    <ul key={`comp-${component.id}-acc-${itemIndex}-ul-${childIndex}`}>
                                        {(child as BulletedListNode).children.map((li: ListItemNode, liIndex: number) => (
                                            <li key={`comp-${component.id}-acc-${itemIndex}-bul-${childIndex}-${liIndex}`}>{renderChildren(li.children)}</li>
                                        ))}
                                    </ul>
                                );
                            case 'numbered-list':
                                return (
                                    <ol key={`comp-${component.id}-acc-${itemIndex}-ol-${childIndex}`}>
                                        {(child as NumberedListNode).children.map((li: ListItemNode, liIndex: number) => (
                                            <li key={`comp-${component.id}-acc-${itemIndex}-num-${childIndex}-${liIndex}`}>{renderChildren(li.children)}</li>
                                        ))}
                                    </ol>
                                );
                            default:
                                return null;
                        }
                    })
                )
            );

        case 'list-block':
            return (
                ((data as unknown as AccordionItem[]) ?? []).flatMap((item: AccordionItem, itemIndex: number) =>
                    item.content.map((child: EditorChildNode, childIndex: number) => {
                        switch (child.type) {
                            case 'heading-one':
                                return <h1 key={`comp-${component.id}-acc-${itemIndex}-h1-${childIndex}`}>{renderChildren(child.children)}</h1>;
                            case 'heading-two':
                                return <h2 key={`comp-${component.id}-acc-${itemIndex}-h2-${childIndex}`}>{renderChildren(child.children)}</h2>;
                            case 'paragraph':
                                return <p key={`comp-${component.id}-acc-${itemIndex}-p-${childIndex}`}>{renderChildren(child.children)}</p>;
                            case 'bulleted-list':
                                return (
                                    <ul key={`comp-${component.id}-acc-${itemIndex}-ul-${childIndex}`}>
                                        {(child as BulletedListNode).children.map((li: ListItemNode, liIndex: number) => (
                                            <li key={`comp-${component.id}-acc-${itemIndex}-bul-${childIndex}-${liIndex}`}>{renderChildren(li.children)}</li>
                                        ))}
                                    </ul>
                                );
                            case 'numbered-list':
                                return (
                                    <ol key={`comp-${component.id}-acc-${itemIndex}-ol-${childIndex}`}>
                                        {(child as NumberedListNode).children.map((li: ListItemNode, liIndex: number) => (
                                            <li key={`comp-${component.id}-acc-${itemIndex}-num-${childIndex}-${liIndex}`}>{renderChildren(li.children)}</li>
                                        ))}
                                    </ol>
                                );
                            default:
                                return null;
                        }
                    })
                )
            );  

        default:
            return null;
    }
}