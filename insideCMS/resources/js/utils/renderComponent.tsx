
type EditorText = { text: string };
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

export function renderComponent(component: Component) {
    console.log(component);
    
    const data = component.component_data ?? [];
    switch (component.type) {
        case 'text-editor':
            return data.map((child, childIndex) => {
                switch (child.type) {
                    case 'heading-one':
                        return <h1 key={`comp-${component.id}-h1-${childIndex}`}>{child.children[0]?.text ?? ''}</h1>;
                    case 'heading-two':
                        return <h2 className="text-2xl font-bold my-3" key={`comp-${component.id}-h2-${childIndex}`}>{child.children[0]?.text ?? ''}</h2>;
                    case 'paragraph':
                        return <p className="my-2" key={`comp-${component.id}-p-${childIndex}`}>{child.children[0]?.text ?? ''}</p>;
                    case 'bulleted-list':
                        return (
                            <ul className="list-disc list-inside" key={`comp-${component.id}-ul-${childIndex}`}>
                                {child.children.map((li, liIndex) => (
                                    <li key={`comp-${component.id}-bul-${childIndex}-${liIndex}`}>{li.children[0]?.text ?? ''}</li>
                                ))}
                            </ul>
                        );
                    case 'numbered-list':
                        return (
                            <ol className="list-decimal list-inside" key={`comp-${component.id}-ol-${childIndex}`}>
                                {child.children.map((li, liIndex) => (
                                    <li key={`comp-${component.id}-num-${childIndex}-${liIndex}`}>{li.children[0]?.text ?? ''}</li>
                                ))}
                            </ol>
                        );

                    default:
                        return null;
                }
            });

        case 'accordion-block':
            return <div>Accordion</div>;

        default:
            return null;
    }
}