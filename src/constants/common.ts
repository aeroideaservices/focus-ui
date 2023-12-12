export const LIMIT = 10;
export const OFFSET = 0;
export const PAGE = 1;
export const SEARCH_LIMIT = 50;

export const CONFIGURATION_OPTIONS_LIMIT = 50;

export const MEDIA_LIMIT = 50;
export const MEDIA_OFFSET = 0;
export const MEDIA_PAGE = 1;

export const PAGE_ELEMENTS = [
  { value: '10', label: '10' },
  { value: '16', label: '16' },
  { value: '32', label: '32' },
  { value: '64', label: '64' },
];

export const PUBLIC_API_URL = process.env.PUBLIC_API_URL;
export const DEFAULT_DATE_FORMAT = 'dd.MM.yyyy HH:mm:ss';
export const DEFAULT_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  month: '2-digit',
  day: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  hour12: false,
  minute: '2-digit',
  second: '2-digit',
};
