'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Image as ImageIcon,
  Link as LinkIcon,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { compressImage } from '@/lib/compressImage';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string)=> void;
  placeholder?: string;
  error?: boolean;
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  children,
  title,
}: {
  onClick: ()=> void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      type={'button'}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'p-1.5 rounded-md transition-colors cursor-pointer',
        active ? 'bg-accent1/15 text-accent1' : 'text-sub hover:bg-gray8 hover:text-main',
        disabled && 'opacity-30 cursor-not-allowed',
      )}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className={'w-px h-5 bg-gray7 mx-1'} />;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder,
  error,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-accent1 underline' } }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none px-4 py-3 min-h-[200px] text-main focus:outline-none',
      },
    },
  });

  if (!editor) return null;

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = async () => {
      const files = input.files;
      if (!files) return;
      for (const file of Array.from(files)) {
        const dataUrl = await compressImage(file);
        editor.chain().focus().setImage({ src: dataUrl }).run();
      }
    };
    input.click();
  };

  const handleLink = () => {
    const prev = editor.getAttributes('link').href ?? '';
    const url = window.prompt('URL을 입력하세요', prev);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  const iconSize = 'size-4';

  return (
    <div className={cn('rounded-lg border overflow-hidden', error ? 'border-error' : 'border-gray7')}>
      {/* 툴바 */}
      <div className={'flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-gray7 bg-gray9/30'}>
        <ToolbarButton
          onClick={handleImageUpload}
          title={'이미지 삽입'}
        >
          <ImageIcon className={iconSize} />
        </ToolbarButton>

        <ToolbarButton
          onClick={handleLink}
          active={editor.isActive('link')}
          title={'하이퍼링크'}
        >
          <LinkIcon className={iconSize} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title={'굵게'}
        >
          <Bold className={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title={'기울임'}
        >
          <Italic className={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
          title={'밑줄'}
        >
          <UnderlineIcon className={iconSize} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          active={editor.isActive({ textAlign: 'left' })}
          title={'왼쪽 정렬'}
        >
          <AlignLeft className={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          active={editor.isActive({ textAlign: 'center' })}
          title={'가운데 정렬'}
        >
          <AlignCenter className={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          active={editor.isActive({ textAlign: 'right' })}
          title={'오른쪽 정렬'}
        >
          <AlignRight className={iconSize} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title={'글머리 기호'}
        >
          <List className={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title={'번호 매기기'}
        >
          <ListOrdered className={iconSize} />
        </ToolbarButton>

        {/* <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title={'실행 취소'}
        >
          <Undo className={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title={'다시 실행'}
        >
          <Redo className={iconSize} />
        </ToolbarButton> */}
      </div>

      {/* 에디터 */}
      <EditorContent editor={editor} rows={20} />
    </div>
  );
}
