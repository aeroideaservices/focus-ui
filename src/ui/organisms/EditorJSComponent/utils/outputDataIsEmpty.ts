import { OutputData } from '@editorjs/editorjs';

enum EditorJSTypesEnum {
  HEADER = 'header',
  PARAGRAPH = 'paragraph',
  LIST = 'list',
  IMAGE = 'image',
  QUOTE = 'quote',
  EMBED = 'embed',
  LINKTOOL = 'linkTool',
  ARTICLEIMAGE = 'articleImage',
  ARTICLEIMAGELEFT = 'articleImageLeft',
  ARTICLEIMAGERIGHT = 'articleImageRight',
  PRODUCT = 'product',
  PRODUCTSHELF = 'productShelf',
  BANNER = 'banner',
  BANNERS = 'banners',
}

enum EmbedTypesEnum {
  FACEBOOK = 'facebook',
  INSTAGRAM = 'instagram',
  YOUTUBE = 'youtube',
  TWITTER = 'twitter',
  TWITCHVIDEO = 'twitch-video',
  TWITCHCHANNEL = 'twitch-channel',
  MIRO = 'miro',
  VIMEO = 'vimeo',
  GFYCAT = 'gfycat',
  IMGUR = 'imgur',
  VINE = 'vine',
  APARAT = 'aparat',
  YANDEXMUSICTRACK = 'yandex-music-track',
  YANDEXMUSICALBUM = 'yandex-music-album',
  YANDEXMUSICPLAYLIST = 'yandex-music-playlist',
  COUB = 'coub',
  CODEPEN = 'codepen',
  PINTEREST = 'pinterest',
  RUTUBE = 'rutube',
  OK = 'ok',
}

type FileType = {
  url: string;
};

type HeaderType = {
  text: string;
  level: number;
};

type ParagraphType = {
  text: string;
};

type ListType = {
  items: string[];
  style: 'ordered' | 'unordered';
};

type ImageType = {
  caption: string;
  file: FileType;
  stretched: boolean;
  withBackground: boolean;
  withBorder: boolean;
};

type QuoteType = {
  alignment: 'left' | 'right';
  caption: string;
  text: string;
};

type EmbedType = {
  caption: string;
  embed: string;
  service: EmbedTypesEnum;
  source: string;
  height: number;
  width: number;
};

type LinkToolType = {
  link: string;
};

type ArticleImageType = {
  caption: string;
  text: string;
  position: 'left' | 'right';
  file: FileType;
};

type ProductType = {
  multiple: boolean;
  position: boolean;
  automatic: boolean;
  title: string;
  products: Record<string, string>[];
};

type BanenrFileType = {
  x1?: string;
  x2?: string;
};

type BannerItemType = {
  desktop: BanenrFileType;
  mobile: BanenrFileType;
  url?: string;
  sort?: number;
  categoryId?: string;
  categoryName?: string;
  categoryPath?: string;
  categoryURL?: string;
};

type BannerType = {
  multiple: boolean;
  banners: BannerItemType[];
};

const checkTextBlock = (data: HeaderType | ParagraphType | QuoteType): boolean => {
  return data.text.length > 0;
};

const checkListBlock = (data: ListType): boolean => {
  return data.items.length > 0;
};

const checkImageBlock = (data: ImageType): boolean => {
  return data.file.url.length > 0;
};

const checkEmbedBlock = (data: EmbedType): boolean => {
  return data.source.length > 0;
};

const checkLinkBlock = (data: LinkToolType): boolean => {
  return data.link.length > 0;
};

const checkArticleImageBlock = (data: ArticleImageType): boolean => {
  if (data.caption.length > 0 || data.text.length > 0 || (data.file && data.file.url.length > 0))
    return true;

  return false;
};

const checkProductBlock = (data: ProductType): boolean => {
  return data.products.length > 0;
};

const checkBannerBlock = (data: BannerType): boolean => {
  return data.banners && data.banners.length > 0;
};

export const outputDataIsEmpty = (outputData: OutputData): boolean => {
  const { blocks } = outputData;
  let notEmptyBlock = 0;

  blocks.map((block) => {
    switch (block.type) {
      case EditorJSTypesEnum.HEADER:
      case EditorJSTypesEnum.PARAGRAPH:
      case EditorJSTypesEnum.QUOTE:
        if (checkTextBlock(block.data)) notEmptyBlock++;
        break;
      case EditorJSTypesEnum.LIST:
        if (checkListBlock(block.data)) notEmptyBlock++;
        break;
      case EditorJSTypesEnum.IMAGE:
        if (checkImageBlock(block.data)) notEmptyBlock++;
        break;
      case EditorJSTypesEnum.EMBED:
        if (checkEmbedBlock(block.data)) notEmptyBlock++;
        break;
      case EditorJSTypesEnum.LINKTOOL:
        if (checkLinkBlock(block.data)) notEmptyBlock++;
        break;
      case EditorJSTypesEnum.ARTICLEIMAGE:
      case EditorJSTypesEnum.ARTICLEIMAGELEFT:
      case EditorJSTypesEnum.ARTICLEIMAGERIGHT:
        if (checkArticleImageBlock(block.data)) notEmptyBlock++;
        break;
      case EditorJSTypesEnum.PRODUCT:
      case EditorJSTypesEnum.PRODUCTSHELF:
        if (checkProductBlock(block.data)) notEmptyBlock++;
        break;
      case EditorJSTypesEnum.BANNER:
      case EditorJSTypesEnum.BANNERS:
        if (checkBannerBlock(block.data)) notEmptyBlock++;
        break;
      default:
        break;
    }
  });

  return notEmptyBlock > 0 ? false : true;
};
