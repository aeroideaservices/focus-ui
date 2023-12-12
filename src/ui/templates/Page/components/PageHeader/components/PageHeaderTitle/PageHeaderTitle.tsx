import { FC } from 'react';
import { Text, Title } from '@mantine/core';

interface IPageHeaderTitle {
  title: string;
  subTitle?: string;
}

const PageHeaderTitle: FC<IPageHeaderTitle> = ({ title, subTitle }) => {
  return (
    <Title order={1}>
      <Text lineClamp={1}>{title}</Text>
      {subTitle && (
        <Text
          sx={(theme) => ({
            display: 'block',
            color: theme.colors.gray[6],
            fontSize: '18px',
            whiteSpace: 'nowrap',
          })}
        >
          {subTitle}
        </Text>
      )}
    </Title>
  );
};

export default PageHeaderTitle;
