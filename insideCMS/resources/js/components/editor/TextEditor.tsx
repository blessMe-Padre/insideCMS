import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { createEditor, Descendant, Editor, Element as SlateElement, Transforms } from 'slate'
import { Slate, Editable, withReact, useSlate, RenderLeafProps, RenderElementProps } from 'slate-react'
import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'
import { 
  Bold, Italic, Underline, Code, Heading1, Heading2, 
  List, ListOrdered, Quote, AlignLeft, AlignCenter, 
  AlignRight,
  Link
} from 'lucide-react'

type ParagraphElement = { type: 'paragraph'; align?: string; children: CustomText[] }
type HeadingElement = { type: 'heading-one' | 'heading-two'; align?: string; children: CustomText[] }
type BlockQuoteElement = { type: 'block-quote'; align?: string; children: CustomText[] }
type ListElement = { type: 'numbered-list' | 'bulleted-list'; align?: string; children: ListItemElement[] }
type ListItemElement = { type: 'list-item'; children: CustomText[] }
type LinkElement = { type: 'link'; url: string; children: CustomText[] }

type CustomElement = ParagraphElement | HeadingElement | BlockQuoteElement | ListElement | ListItemElement | LinkElement
type CustomText = { 
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  code?: boolean
  link?: boolean
}

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}

const HOTKEYS: Record<string, string> = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right']

interface TextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
}

export default function TextEditor({ value = '', onChange }: TextEditorProps) {
  const [editor] = useState(() => withReact(createEditor()))
  
  const getInitialValue = (val: string): Descendant[] => {
    if (!val) {
      return [
        {
          type: 'paragraph',
          children: [{ text: '' }],
        },
      ] as Descendant[]
    }
    try {
      const parsed = JSON.parse(val)
      return Array.isArray(parsed) ? parsed : [
        {
          type: 'paragraph',
          children: [{ text: val }],
        },
      ]
    } catch {
      return [
        {
          type: 'paragraph',
          children: [{ text: val }],
        },
      ]
    }
  }
  
  const initialValue = useMemo(() => getInitialValue(value), [value])
  
  const [editorValue, setEditorValue] = useState<Descendant[]>(initialValue)

  useEffect(() => {
    const newValue = getInitialValue(value)
    const isEditorEmpty = editor.children.length === 1 && 
      Editor.string(editor, []) === ''
    
    const firstElement = newValue[0]
    const isNewValueEmpty = newValue.length === 1 && 
      SlateElement.isElement(firstElement) &&
      firstElement.children.length === 1 &&
      'text' in firstElement.children[0] && 
      firstElement.children[0].text === ''
    
    if (!value && isEditorEmpty) {
      return
    }
    
    if (value && !isNewValueEmpty) {
      const currentContent = JSON.stringify(editor.children)
      const newContent = JSON.stringify(newValue)
      
      if (currentContent !== newContent) {
        editor.children = newValue
        editor.onChange()
      }
    } else if (!value && !isEditorEmpty) {
      Transforms.delete(editor, {
        at: {
          anchor: Editor.start(editor, []),
          focus: Editor.end(editor, []),
        },
      })
      Transforms.removeNodes(editor, { at: [0] })
      Transforms.insertNodes(editor, newValue)
      setEditorValue(newValue)
    }
  }, [value, editor])

  const handleChange = (newValue: Descendant[]) => {
    setEditorValue(newValue)
    if (onChange) {
      const isAstChange = editor.operations.some(
        op => 'set_selection' !== op.type
      )
      if (isAstChange) {
        const content = JSON.stringify(newValue)
        onChange(content)
      }
    }
  }

  const renderElement = useCallback((props: RenderElementProps) => <Element {...props} />, [])
  const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, [])

  return (
    <div className="border border-border rounded-sm overflow-hidden bg-background">
      <Slate editor={editor} initialValue={editorValue} onChange={handleChange}>
        <Toolbar />
        <div className="p-4 min-h-[100px] overflow-y-auto">
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder="Введите текст..."
            spellCheck
            autoFocus
            onKeyDown={event => {
              for (const hotkey in HOTKEYS) {
                if (isHotkey(hotkey, event.nativeEvent)) {
                  event.preventDefault()
                  const mark = HOTKEYS[hotkey]
                  toggleMark(editor, mark)
                }
              }
            }}
          />
        </div>
      </Slate>
    </div>
  )
}

const toggleBlock = (editor: Editor, format: string) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
  )
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes((n as SlateElement).type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  })

  let newProperties: Partial<SlateElement>
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    } as Partial<SlateElement>
  } else {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    } as Partial<SlateElement>
  }
  
  Transforms.setNodes<SlateElement>(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format as 'numbered-list' | 'bulleted-list', children: [] } as CustomElement
    Transforms.wrapNodes(editor, block)
  }
}

const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isBlockActive = (editor: Editor, format: string, blockType: 'type' | 'align' = 'type') => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n => {
        if (!Editor.isEditor(n) && SlateElement.isElement(n)) {
          if (blockType === 'align') {
            return (n as CustomElement & { align?: string }).align === format
          }
          return n.type === format
        }
        return false
      },
    })
  )

  return !!match
}

const isMarkActive = (editor: Editor, format: string) => {
  const marks = Editor.marks(editor)
  return marks ? (marks as Record<string, boolean>)[format] === true : false
}

const Element = ({ attributes, children, element }: RenderElementProps) => {
  const style = { textAlign: (element as CustomElement & { align?: string }).align as 'left' | 'center' | 'right' | undefined }
  
  switch (element.type) {
    case 'block-quote':
      return (
        <blockquote style={style} {...attributes} className="border-l-4 border-border pl-4 italic my-4">
          {children}
        </blockquote>
      )
    case 'bulleted-list':
      return (
        <ul style={style} {...attributes} className="list-disc list-inside my-2">
          {children}
        </ul>
      )
    case 'heading-one':
      return (
        <h1 style={style} {...attributes} className="text-3xl font-bold my-4">
          {children}
        </h1>
      )
    case 'heading-two':
      return (
        <h2 style={style} {...attributes} className="text-2xl font-bold my-3">
          {children}
        </h2>
      )
    case 'list-item':
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      )
    case 'numbered-list':
      return (
        <ol style={style} {...attributes} className="list-decimal list-inside my-2">
          {children}
        </ol>
      )
    case 'link':
      return (
        <a 
          {...attributes} 
          href={(element as LinkElement).url} 
          className="text-primary underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      )
    default:
      return (
        <p style={style} {...attributes} className="my-2">
          {children}
        </p>
      )
  }
}

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  const tleaf = leaf as unknown as CustomText

  if (tleaf.link && typeof tleaf.text === 'string') {
    const text = tleaf.text
    const match = text.match(/<a[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/i)
    if (match) {
      const [, href, inner] = match
      children = <a href={href} target="_blank" rel="noopener noreferrer">{inner}</a>
    }
  }

  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  if (leaf.code) {
    children = <code className="bg-muted px-1 py-0.5 rounded font-mono text-sm">{children}</code>
  }

  return <span {...attributes}>{children}</span>
}

const Toolbar = () => {
  return (
    <div className="border-b border-border p-2 flex flex-wrap gap-1 bg-muted/50">
      <MarkButton format="bold" icon={<Bold size={18} />} />
      <MarkButton format="italic" icon={<Italic size={18} />} />
      <MarkButton format="underline" icon={<Underline size={18} />} />
      <MarkButton format="code" icon={<Code size={18} />} />
      <MarkButton format="link" icon={<Link size={18} />} />
      
      <div className="w-px h-6 bg-border mx-1" />
      
      <BlockButton format="heading-one" icon={<Heading1 size={18} />} />
      <BlockButton format="heading-two" icon={<Heading2 size={18} />} />
      <BlockButton format="block-quote" icon={<Quote size={18} />} />
      
      <div className="w-px h-6 bg-border mx-1" />
      
      <BlockButton format="numbered-list" icon={<ListOrdered size={18} />} />
      <BlockButton format="bulleted-list" icon={<List size={18} />} />
      
      <div className="w-px h-6 bg-border mx-1" />
      
      <BlockButton format="left" icon={<AlignLeft size={18} />} />
      <BlockButton format="center" icon={<AlignCenter size={18} />} />
      <BlockButton format="right" icon={<AlignRight size={18} />} />
    </div>
  )
}

const BlockButton = ({ format, icon }: { format: string; icon: React.ReactNode }) => {
  const editor = useSlate()
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
  )

  return (
    <button
      className={`p-2 rounded hover:bg-accent transition-colors ${
        isActive ? 'bg-accent' : ''
      }`}
      onMouseDown={event => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
    >
      {icon}
    </button>
  )
}

const MarkButton = ({ format, icon }: { format: string; icon: React.ReactNode }) => {
  const editor = useSlate()
  const isActive = isMarkActive(editor, format)

  return (
    <button
      className={`p-2 rounded hover:bg-accent transition-colors ${
        isActive ? 'bg-accent' : ''
      }`}
      onMouseDown={event => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
    >
      {icon}
    </button>
  )
}

const isHotkey = (hotkey: string, event: KeyboardEvent) => {
  const keys = hotkey.split('+')
  const isModKey = keys.includes('mod')
  const isMod = event.ctrlKey || event.metaKey
  
  if (isModKey && !isMod) return false
  
  const key = keys[keys.length - 1]
  return event.key.toLowerCase() === key.toLowerCase()
}