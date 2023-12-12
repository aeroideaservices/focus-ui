import { AxiosError } from 'axios';

import { errorHandler } from './errorHandler';

export const axiosErrorHandler = (
  error: Partial<AxiosError<{ message: string; error_description: string }>>,
  fallbackMsg?: string
) => {
  const message =
    error?.response?.data?.message ||
    (error?.response?.data?.error_description && 'Неверный логин или пароль') ||
    fallbackMsg ||
    'Неизвестная ошибка';

  if (message) errorHandler(error, `${message}`);
};
