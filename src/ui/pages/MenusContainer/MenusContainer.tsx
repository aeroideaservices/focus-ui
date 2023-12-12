import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Box, Button, Group, Modal, Text } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';

import { getOffsetInURL } from '@/utils/getOffsetInURL';

import { TABLE_MENUS } from '@/constants/tableHeaders';

import TableExt from '@/ui/organisms/TableExt/TableExt';
import PageBody from '@/ui/templates/Page/components/PageBody/PageBody';
import PageHeader from '@/ui/templates/Page/components/PageHeader/PageHeader';
import PageLoader from '@/ui/templates/Page/components/PageLoader/PageLoader';
import Page from '@/ui/templates/Page/Page';

import { getSortableKeys } from '../ModelContainer/utils/getSortableKeys';

import AddDomainModal from './components/AddDomainModal/AddDomainModal';
import FormNewMenu from './components/FormNewMenu/FormNewMenu';
import MenusTableButtons from './components/MenusTableButtons/MenusTableButtons';
import MenusTableModals from './components/MenusTableModals/MenusTableModals';

import { AppDispatch } from '@/store';
import {
  fetchMenusAction,
  selectFetchingGetMenus,
  selectMenus,
  selectModalNewMenus,
  setAddDomainModalOpen,
} from '@/store/slices/menu/menus';
import { setModalNewMenusOpened } from '@/store/slices/menu/menus';

const MenusContainer: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const fetchingMenus = useSelector(selectFetchingGetMenus);
  const menus = useSelector(selectMenus);
  const menusModalNew = useSelector(selectModalNewMenus);
  const [, setReloadPage] = useState<boolean>(false);
  const [service] = useLocalStorage({ key: 'service' });

  const params = {
    offset: getOffsetInURL(searchParams),
    limit: '100',
  };

  useEffect(() => {
    if (service) dispatch(fetchMenusAction({ params }));
  }, [searchParams, service]);

  useEffect(() => {
    if (menus) setReloadPage(true);
  }, [menus]);

  return (
    <Page>
      <PageHeader
        title={`Меню`}
        rightButton={
          <Group>
            <Button onClick={() => dispatch(setAddDomainModalOpen(true))}>Добавить домен</Button>
            <Button onClick={() => dispatch(setModalNewMenusOpened(true))}>Новый тип</Button>
          </Group>
        }
      />

      <PageBody>
        <>
          {(!menus || menus.length === 0) && (
            <PageLoader zIndex={100} loading={fetchingMenus} text="У вас пока нет меню" />
          )}

          {menus && menus.length > 0 && (
            <Box h={0} sx={{ flex: '1 0 0' }}>
              <TableExt
                config={TABLE_MENUS}
                rows={menus}
                buttons={MenusTableButtons}
                sortableKeys={getSortableKeys([
                  { code: 'name', name: 'Название', sortable: false, isTime: false },
                ])}
              />
            </Box>
          )}
        </>
      </PageBody>

      <Modal
        centered
        size={'lg'}
        opened={menusModalNew}
        onClose={() => dispatch(setModalNewMenusOpened(false))}
        title={
          <Text fz={22} fw={700}>
            Добавление меню
          </Text>
        }
      >
        <FormNewMenu type="new" />
      </Modal>

      <MenusTableModals />
      <AddDomainModal />
    </Page>
  );
};

export default MenusContainer;
