import { AxiosError } from 'axios';

import notify from './notify';

export const errorHandler = (
  error: Partial<AxiosError<{ message: string; error_description: string }>>,
  message?: string
) => {
  console.error(error);

  if (message)
    notify({
      type: 'error',
      message:
        message === 'Invalid user credentials' ? 'Неверный логин или пароль' : message.trim(),
    });
};
