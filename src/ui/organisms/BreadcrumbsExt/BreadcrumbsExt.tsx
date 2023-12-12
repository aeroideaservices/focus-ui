import { TBreadcrumbsExtItem } from '@/types';

import { FC } from 'react';
import { BoxProps, Breadcrumbs } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';

import BreadcrumbsExtItem from './components/BreadcrumbsExtItem/BreadcrumbsExtItem';

interface IBreadcrumbsExt extends BoxProps {
  items: TBreadcrumbsExtItem[];
}

const BreadcrumbsExt: FC<IBreadcrumbsExt> = ({ items, ...props }) => {
  return (
    <Breadcrumbs separator={<IconChevronRight size={12} />} mt={20} mb={15} {...props}>
      {items.map((item, index) => (
        <BreadcrumbsExtItem item={item} key={`${item.name}${index}`} />
      ))}
    </Breadcrumbs>
  );
};

export default BreadcrumbsExt;
