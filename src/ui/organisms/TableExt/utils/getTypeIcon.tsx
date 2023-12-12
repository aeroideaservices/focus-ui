import { TypeEnum } from '@/types';

import { ReactNode } from 'react';
import { ThemeIcon } from '@mantine/core';
import {
  IconArticle,
  IconCalendar,
  IconCalendarTime,
  IconCheckbox,
  IconFile,
  IconLetterS,
  IconNumbers,
  IconPhoto,
} from '@tabler/icons-react';

export const getTypeIcon = (type: TypeEnum): ReactNode => {
  switch (type) {
    case TypeEnum.INTEGER:
      return (
        <ThemeIcon color={'gray'} size={20}>
          <IconNumbers size={16} />
        </ThemeIcon>
      );
    case TypeEnum.STRING:
      return (
        <ThemeIcon color={'gray'} size={20}>
          <IconLetterS size={16} />
        </ThemeIcon>
      );
    case TypeEnum.TEXT:
      return (
        <ThemeIcon color={'gray'} size={20}>
          <IconArticle size={16} />
        </ThemeIcon>
      );
    case TypeEnum.CHECKBOX:
      return (
        <ThemeIcon color={'gray'} size={20}>
          <IconCheckbox size={16} />
        </ThemeIcon>
      );
    case TypeEnum.FILE:
      return (
        <ThemeIcon color={'gray'} size={20}>
          <IconFile size={16} />
        </ThemeIcon>
      );
    case TypeEnum.IMAGE:
      return (
        <ThemeIcon color={'gray'} size={20}>
          <IconPhoto size={16} />
        </ThemeIcon>
      );
    case TypeEnum.DATETIME:
      return (
        <ThemeIcon color={'gray'} size={20}>
          <IconCalendarTime size={16} />
        </ThemeIcon>
      );
    case TypeEnum.DATE:
      return (
        <ThemeIcon color={'gray'} size={20}>
          <IconCalendar size={16} />
        </ThemeIcon>
      );
    default:
      return <></>;
  }
};
