import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mantine/core';
import { IconChevronLeft } from '@tabler/icons-react';

interface IPageHeaderBackLink {
  url: string;
}

const PageHeaderBackLink: FC<IPageHeaderBackLink> = ({ url }) => {
  return (
    <Button title="Вернуться" size={'xs'} p={0} variant={'subtle'} component={Link} to={url}>
      <IconChevronLeft size={24} />
    </Button>
  );
};

export default PageHeaderBackLink;
