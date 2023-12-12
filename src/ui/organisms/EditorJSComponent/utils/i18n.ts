/**
 * Internationalzation config
 */
export const I18nDictionary = {
  /**
   * @type {I18nDictionary}
   */
  messages: {
    /**
     * Other below: translation of different UI components of the editor.js core
     */
    ui: {
      blockTunes: {
        toggler: {
          'Click to tune': 'Нажмите, чтобы настроить',
          'or drag to move': 'или перетащите',
        },
      },
      inlineToolbar: {
        converter: {
          'Convert to': 'Конвертировать в',
        },
      },
      toolbar: {
        toolbox: {
          Add: 'Добавить',
        },
      },
      popover: {
        Filter: 'Фильтр',
        'Nothing found': 'Не найдено',
      },
    },

    /**
     * Section for translation Tool Names: both block and inline tools
     */
    toolNames: {
      Text: 'Параграф',
      Heading: 'Заголовок',
      List: 'Список',
      Warning: 'Примечание',
      Checklist: 'Чеклист',
      Quote: 'Цитата',
      Code: 'Код',
      Delimiter: 'Разделитель',
      'Raw HTML': 'HTML-фрагмент',
      Table: 'Таблица',
      Link: 'Ссылка',
      Marker: 'Маркер',
      Bold: 'Полужирный',
      Italic: 'Курсив',
      InlineCode: 'Моноширинный',
      SimpleImage: 'Простое Изображение',
      Image: 'Изображение',
      ArticleWithImage: 'Изображение с текстом',
      ProductEJS: 'Продукт',
    },

    /**
     * Section for passing translations to the external tools classes
     */
    tools: {
      /**
       * Each subsection is the i18n dictionary that will be passed to the corresponded plugin
       * The name of a plugin should be equal the name you specify in the 'tool' section for that plugin
       */
      warning: {
        // <-- 'Warning' tool will accept this dictionary section
        Title: 'Название',
        Message: 'Сообщение',
      },

      /**
       * Link is the internal Inline Tool
       */
      link: {
        'Add a link': 'Вставьте ссылку',
      },
      /**
       * The "stub" is an internal block tool, used to fit blocks that does not have the corresponded plugin
       */
      stub: {
        'The block can not be displayed correctly.': 'Блок не может быть отображен',
      },

      image: {
        'With background': 'Добавить фон',
        'With border': 'Добавить рамку',
        'Stretch image': 'Растянуть',
        'Select an Image': 'Выберите изображение',
        'Couldn’t upload image. Please try another.':
          'Не получилось загрузить картинку. Попробуйте другую.',
      },
      articleImageLeft: {
        'Switch Position': 'Сменить позицию',
      },
      articleImageRight: {
        'Switch Position': 'Сменить позицию',
      },
      quote: {
        'Align Left': 'По левому краю',
        'Align Center': 'По центру',
      },
      list: {
        Unordered: 'Не нумерованный',
        Ordered: 'Нумерованный',
      },
      header: {
        'Heading 1': 'Заголовок 1',
        'Heading 2': 'Заголовок 2',
        'Heading 3': 'Заголовок 3',
        'Heading 4': 'Заголовок 4',
        'Heading 5': 'Заголовок 5',
        'Heading 6': 'Заголовок 6',
      },
      embed: {
        'Enter a caption': 'Введите подпись',
      },
      product: {
        'Set multiple': 'Сделать полкой',
        'Switch Position': 'Сменить позицию',
      },
    },

    /**
     * Section allows to translate Block Tunes
     */
    blockTunes: {
      /**
       * Each subsection is the i18n dictionary that will be passed to the corresponded Block Tune plugin
       * The name of a plugin should be equal the name you specify in the 'tunes' section for that plugin
       *
       * Also, there are few internal block tunes: "delete", "moveUp" and "moveDown"
       */
      delete: {
        Delete: 'Удалить',
        'Click to delete': 'Удаление',
      },
      moveUp: {
        'Move up': 'Переместить вверх',
      },
      moveDown: {
        'Move down': 'Переместить вниз',
      },
    },
  },
};
