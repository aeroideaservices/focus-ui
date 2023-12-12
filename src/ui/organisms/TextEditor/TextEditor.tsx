import { FC, useCallback } from 'react';
import { createStyles, Input, InputWrapperProps } from '@mantine/core';
import {
  Link,
  RichTextEditor,
  RichTextEditorLabels,
  useRichTextEditorContext,
} from '@mantine/tiptap';
import { IconPhoto } from '@tabler/icons-react';
import Image from '@tiptap/extension-image';
import SubScript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { now } from 'lodash';

import { apiUploadFile } from '@/api';

const labels: RichTextEditorLabels = {
  linkControlLabel: 'Ссылка',
  colorPickerControlLabel: 'Цвет текста',
  highlightControlLabel: 'Выделите текст',
  colorControlLabel: (color) => `Установить цвет текста ${color}`,
  boldControlLabel: 'Жирный',
  italicControlLabel: 'Курсив',
  underlineControlLabel: 'Подчеркнутый',
  strikeControlLabel: 'Зачеркнутый',
  clearFormattingControlLabel: 'Очистить форматирование',
  unlinkControlLabel: 'Убрать ссылку',
  bulletListControlLabel: 'Маркированный список',
  orderedListControlLabel: 'Нумерованный список',
  h1ControlLabel: 'Заголовок 1',
  h2ControlLabel: 'Заголовок 2',
  h3ControlLabel: 'Заголовок 3',
  h4ControlLabel: 'Заголовок 4',
  h5ControlLabel: 'Заголовок 5',
  h6ControlLabel: 'Заголовок 6',
  blockquoteControlLabel: 'Цитата',
  alignLeftControlLabel: 'По левому краю',
  alignCenterControlLabel: 'По центру',
  alignRightControlLabel: 'По правому краю',
  alignJustifyControlLabel: 'По ширине',
  codeControlLabel: 'Код',
  codeBlockControlLabel: 'Блок кода',
  subscriptControlLabel: 'Индекс',
  superscriptControlLabel: 'Верхний индекс',
  unsetColorControlLabel: 'Сбросить цвет',
  hrControlLabel: 'Горизонтальная линия',

  linkEditorInputLabel: 'Введите URL',
  linkEditorInputPlaceholder: 'https://example.com/',
  linkEditorExternalLink: 'Открыть ссылку в новой вкладке',
  linkEditorInternalLink: 'Открыть ссылку в той же вкладке',
  linkEditorSave: 'Сохранить',

  colorPickerCancel: 'Отмена',
  colorPickerClear: 'Очистить цвет',
  colorPickerColorPicker: 'Выбор цвета',
  colorPickerPalette: 'Цветовая палитра',
  colorPickerSave: 'Сохранить',
  colorPickerColorLabel: (color) => `Установить цвет текста ${color}`,
};

interface TextEditorProps extends Omit<InputWrapperProps, 'children' | 'onChange'> {
  content?: string;
  onChange?: (value: string) => void;
}

const useStyles = createStyles(() => ({
  image: {
    display: 'block',
    width: '100%',
    maxWidth: '100%',
    padding: '10px 0',
    marginBottom: '15px',
  },

  rewrite: {
    ['.ProseMirror']: {
      whiteSpace: 'pre-wrap',
    },
  },
}));

function TextEditorImage() {
  const { editor } = useRichTextEditorContext();

  const addImage = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';

    input.onchange = (e) => {
      const el = e.target as HTMLInputElement;

      if (el && el.files) {
        const name = el.files[0].name;
        const file = new File([el.files[0]], `${now()}_${name}`);

        apiUploadFile({ file })
          .then((res) => {
            const { data } = res;
            editor
              .chain()
              .focus()
              .setImage({ src: data.file.url, title: `${name}` })
              .run();
          })
          .catch((err) => {
            console.error(err);
          });
      }
    };

    input.click();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <RichTextEditor.Control aria-label="Изображение" title="Изображение" onClick={addImage}>
      <IconPhoto stroke={1.5} size="1rem" />
    </RichTextEditor.Control>
  );
}

const TextEditor: FC<TextEditorProps> = ({ content, onChange, ...props }) => {
  const { classes } = useStyles();

  const changeHandler = (conf: any) => {
    const htmlValue = conf.editor.getHTML();

    if (onChange && htmlValue.length > 0) {
      onChange(htmlValue);
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Image.configure({
        HTMLAttributes: {
          class: classes.image,
          allowBase64: true,
        },
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content,
    onUpdate: (conf) => changeHandler(conf),
  });

  return (
    <Input.Wrapper {...props}>
      <RichTextEditor editor={editor} labels={labels}>
        <RichTextEditor.Toolbar sticky stickyOffset={60}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <TextEditorImage />
            <RichTextEditor.ClearFormatting />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
            <RichTextEditor.H4 />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Hr />
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
            <RichTextEditor.Subscript />
            <RichTextEditor.Superscript />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.AlignLeft />
            <RichTextEditor.AlignCenter />
            <RichTextEditor.AlignJustify />
            <RichTextEditor.AlignRight />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>

        <RichTextEditor.Content />
      </RichTextEditor>
    </Input.Wrapper>
  );
};

export default TextEditor;
