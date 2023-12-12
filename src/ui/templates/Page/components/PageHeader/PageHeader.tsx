import { TBreadcrumbsExtItem } from '@/types';

import { FC, ReactNode } from 'react';
import { BoxProps, Container, Flex } from '@mantine/core';

import BreadcrumbsExt from '@/ui/organisms/BreadcrumbsExt/BreadcrumbsExt';

import PageHeaderBackLink from './components/PageHeaderBackLink/PageHeaderBackLink';
import PageHeaderTitle from './components/PageHeaderTitle/PageHeaderTitle';

interface IPageHeader extends BoxProps {
  title: string;
  subTitle?: string;
  backLink?: string;
  rightButton?: ReactNode;
  breadcrumbs?: TBreadcrumbsExtItem[];
}

const PageHeader: FC<IPageHeader> = ({ title, subTitle, backLink, rightButton, breadcrumbs }) => {
  return (
    <Container fluid mb={16} sx={{ width: '100%' }}>
      {breadcrumbs && <BreadcrumbsExt items={breadcrumbs} />}

      <Flex gap="md" justify="space-between" align="center">
        <Flex gap="md" sx={{ alignItems: 'baseline' }}>
          {backLink && <PageHeaderBackLink url={backLink} />}

          <PageHeaderTitle title={title} subTitle={subTitle} />
        </Flex>

        {rightButton}
      </Flex>
    </Container>
  );
};

export default PageHeader;
