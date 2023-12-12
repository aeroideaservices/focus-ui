import { TTableConfig } from '@/types';

export const TABLE_MODELS: TTableConfig[] = [
  {
    code: 'code',
    name: 'Код',
  },
  {
    code: 'name',
    name: 'Название',
  },
];

export const TABLE_CONFIGURATIONS: TTableConfig[] = [
  {
    code: 'code',
    name: 'Код',
  },
  {
    code: 'name',
    name: 'Название',
  },
];

export const TABLE_CONFIGURATION: TTableConfig[] = [
  {
    code: 'code',
    name: 'Код',
  },
  {
    code: 'name',
    name: 'Название',
  },
  {
    code: 'type',
    name: 'Тип',
  },
];

export const TABLE_MENUS: TTableConfig[] = [
  {
    code: 'name',
    name: 'Название',
  },
  {
    code: 'code',
    name: 'Код',
  },
];

export const TABLE_REVIEWS: TTableConfig[] = [
  {
    code: 'id',
    name: 'ID отзыва',
  },
  {
    code: 'productExternalId',
    name: 'Артикул',
  },
  {
    code: 'photo',
    name: 'Фото',
    align: 'center',
  },
  {
    code: 'video',
    name: 'Видео',
    align: 'center',
  },
  {
    code: 'rating',
    name: 'Оценка',
    align: 'center',
  },
  {
    code: 'status',
    name: 'Статус',
    trimming: false,
  },
  {
    code: 'inactivationReason',
    name: 'Причина отклонения',
    minWidth: 300,
  },
  {
    code: 'usefulness',
    name: 'Полезность',
    align: 'center',
  },
  {
    code: 'userName',
    name: 'Имя покупателя',
    trimming: false,
  },
  {
    code: 'userId',
    name: 'ID покупателя',
    align: 'center',
  },
  {
    code: 'response',
    name: 'Ответ',
    minWidth: 360,
  },
  {
    code: 'responseDate',
    name: 'Дата ответа',
    trimming: false,
  },
  {
    code: 'createdDate',
    name: 'Дата создания',
    trimming: false,
  },
  {
    code: 'editingDate',
    name: 'Дата изменения',
    trimming: false,
  },
  {
    code: 'activationDate',
    name: 'Дата активации',
    trimming: false,
  },
  {
    code: 'moderatorId',
    name: 'ID модератора',
  },
];

export const TABLE_REVIEWS_SORTABLE_COLUMNS = [
  'id',
  'productExternalId',
  'photo',
  'video',
  'rating',
  'status',
  'usefulness',
  'response',
  'responseDate',
  'createdDate',
  'editingDate',
  'activationDate',
  'userId',
];
