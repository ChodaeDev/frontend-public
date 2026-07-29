import Image from '@tiptap/extension-image';
import { ReactNodeViewRenderer } from '@tiptap/react';
import ImageWithCaption from '@/components/ui/ImageWithCaption';

export const captionImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      caption: {
        default: '',
        parseHTML: (element) => {
          const figure = element.closest('figure');
          return figure?.querySelector('figcaption')?.textContent || '';
        },
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    const { caption, ...imgAttrs } = HTMLAttributes;
    if (caption) {
      return [
        'figure',
        { class: 'tiptap-image-wrapper' },
        ['img', imgAttrs],
        ['figcaption', { class: 'tiptap-caption' }, caption],
      ];
    }
    return ['figure', { class: 'tiptap-image-wrapper' }, ['img', imgAttrs]];
  },

  parseHTML() {
    return [
      {
        tag: 'figure',
        getAttrs: (node) => {
          const element = node as HTMLElement;
          const img = element.querySelector('img');
          if (!img) return false;
          return {
            src: img.getAttribute('src'),
            alt: img.getAttribute('alt'),
            title: img.getAttribute('title'),
            caption: element.querySelector('figcaption')?.textContent || '',
          };
        },
      },
      {
        tag: 'img[src]',
      },
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageWithCaption);
  },
});
