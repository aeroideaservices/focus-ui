/* eslint-disable import/no-extraneous-dependencies */
import Embed from '@editorjs/embed';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import SimpleImage from '@editorjs/simple-image';
import Underline from '@editorjs/underline';
import AlignmentTuneTool from 'editorjs-text-alignment-blocktune';

import { embedConfigs } from './embedConfigs';

export const EDITOR_JS_TOOLS = {
  paragraph: {
    tunes: ['alignment'],
  },
  header: {
    class: Header,
    tunes: ['alignment'],
    config: {
      placeholder: 'Введите заголовок',
    },
  },
  list: List,
  underline: Underline,
  simpleImage: SimpleImage,
  embed: {
    class: Embed,
    inlineToolbar: true,
    config: {
      services: {
        ...embedConfigs,
      },
    },
  },
  alignment: {
    class: AlignmentTuneTool,
    config: {
      default: 'left',
    },
  },
};
