import { TBreadcrumbsExtItem } from '@/types';

import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Anchor, AnchorProps, Flex, Text } from '@mantine/core';

interface IBreadcrumbsExtItem extends AnchorProps {
  item: TBreadcrumbsExtItem;
}

const ItemContents: FC<TBreadcrumbsExtItem> = ({ icon, name }) => (
  <Flex align="center" gap={4}>
    {icon}
    <Text>{name}</Text>
  </Flex>
);

const BreadcrumbsExtItem: FC<IBreadcrumbsExtItem> = ({ item, ...props }) => {
  return (
    <>
      {item.url && (
        <Anchor color={'dimmed'} {...props} component={Link} to={item.url}>
          <ItemContents {...item} />
        </Anchor>
      )}
      {!item.url && (
        <Anchor color={'dimmed'} {...props} sx={{ pointerEvents: 'none' }}>
          <ItemContents {...item} />
        </Anchor>
      )}
    </>
  );
};

export default BreadcrumbsExtItem;
