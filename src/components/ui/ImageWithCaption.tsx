'use client';

import { useCallback, useRef, useState } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';

export default function ImageWithCaption({ node, updateAttributes, selected }: NodeViewProps) {
  const { src, alt, caption } = node.attrs as { src: string; alt: string; caption: string };
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = useCallback(() => {
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  const handleBlur = useCallback(() => {
    setEditing(false);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setEditing(false);
    }
  }, []);

  return (
    <NodeViewWrapper className={'tiptap-image-wrapper'}>
      <figure contentEditable={false}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt || caption || ''}
          className={selected ? 'ring-2 ring-accent1' : ''}
        />
        {editing ? (
          <input
            ref={inputRef}
            type={'text'}
            value={caption || ''}
            onChange={(e) => updateAttributes({ caption: e.target.value })}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={'캡션을 입력하세요'}
            className={'tiptap-caption-input'}
          />
        ) : (
          <figcaption
            onClick={handleClick}
            className={'tiptap-caption'}
          >
            {caption || '캡션을 입력하세요'}
          </figcaption>
        )}
      </figure>
    </NodeViewWrapper>
  );
}
