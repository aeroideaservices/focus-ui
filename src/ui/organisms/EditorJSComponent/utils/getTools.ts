import Image from '@editorjs/image';

import notify from '@/utils/notify';

import { fetching } from '../../SearchableSelectV2/utils/fetching';
import ArticleWithImage from '../components/ArticleWithImage';
import BannerEJS from '../components/BannerEJS';
import ProductEJS from '../components/ProductEJS';

import searchCategoriesEJS from './searchCategoriesEJS';
import searchProductEJS from './searchProductEJS';
import { EDITOR_JS_TOOLS } from './tools';
import uploaderFile from './uploaderFile';

export const getTools = (opts: Record<string, any>, model_v: 'v1' | 'v2') => {
  let tools = {};

  if (!opts) return tools;

  const { mediaUpload, productsHints } = opts;

  tools = {
    ...EDITOR_JS_TOOLS,
    image: {
      class: Image,
      config: {
        captionPlaceholder: 'Вставьте подпись',
        uploader: {
          uploadByFile(file: File) {
            return uploaderFile(file, opts.mediaUpload.byFile)
              .then((res) => {
                return res;
              })
              .catch((error) => {
                notify({ message: error.response.data.message, type: 'error' });
              });
          },
        },
      },
    },
    articleImageLeft: {
      class: ArticleWithImage,
      inlineToolbar: true,
      toolbox: {
        title: 'Изображение и текст слева',
      },
      config: {
        position: 'left',
        uploader: async (file: File) => uploaderFile(file, mediaUpload.byFile),
      },
    },
    articleImageRight: {
      class: ArticleWithImage,
      inlineToolbar: true,
      toolbox: {
        title: 'Изображение и текст справа',
      },
      config: {
        position: 'right',
        uploader: async (file: File) => uploaderFile(file, mediaUpload.byFile),
      },
    },
    product: {
      class: ProductEJS,
      config: {
        withSwitcher: true,
        request: async (value: string) =>
          model_v === 'v1'
            ? searchProductEJS(value, opts.productsList)
            : fetching(productsHints.request, value),
      },
    },
    productShelf: {
      class: ProductEJS,
      toolbox: {
        title: 'Полка с товарами',
      },
      config: {
        multiple: true,
        request: async (value: string) =>
          model_v === 'v1'
            ? searchProductEJS(value, opts.productsList)
            : fetching(productsHints.request, value),
      },
    },
    banner: {
      class: BannerEJS,
      toolbox: {
        title: 'Баннер',
      },
      config: {
        uploader: async (file: File) => uploaderFile(file, mediaUpload.byFile),
      },
    },
    banners: {
      class: BannerEJS,
      toolbox: {
        title: 'Баннеры с категориями',
      },
      config: {
        multiple: true,
        uploader: async (file: File) => uploaderFile(file, mediaUpload.byFile),
        request: async (value: string) => searchCategoriesEJS(value, opts.categoriesList),
      },
    },
  };

  const { snippetsConfig } = opts;

  if (snippetsConfig) {
    switch (snippetsConfig) {
      case 'brands':
        tools = {
          product: {
            class: ProductEJS,
            config: {
              withSwitcher: true,
              request: async (value: string) =>
                model_v === 'v1'
                  ? searchProductEJS(value, opts.productsList)
                  : fetching(productsHints.request, value),
            },
          },
          productShelf: {
            class: ProductEJS,
            toolbox: {
              title: 'Полка с товарами',
            },
            config: {
              multiple: true,
              automatic: true,
              request: async (value: string) =>
                model_v === 'v1'
                  ? searchProductEJS(value, opts.productsList)
                  : fetching(productsHints.request, value),
            },
          },
          banner: {
            class: BannerEJS,
            toolbox: {
              title: 'Баннер',
            },
            config: {
              uploader: async (file: File) => uploaderFile(file, mediaUpload.byFile),
            },
          },
          banners: {
            class: BannerEJS,
            toolbox: {
              title: 'Баннеры с категориями',
            },
            config: {
              multiple: true,
              uploader: async (file: File) => uploaderFile(file, mediaUpload.byFile),
              request: async (value: string) => searchCategoriesEJS(value, opts.categoriesList),
            },
          },
        };
        return tools;
      default:
        return tools;
    }
  } else {
    return tools;
  }
};
