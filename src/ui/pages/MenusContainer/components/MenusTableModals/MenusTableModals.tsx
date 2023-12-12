import { useSelector } from 'react-redux';
import { Box, Modal, Text } from '@mantine/core';

import { useBlockingDispatch } from '@/hooks/useBlockingDispatch';

import ModalConfirm from '@/ui/organisms/ModalConfirm/ModalConfirm';

import FormNewMenu from '../FormNewMenu/FormNewMenu';

import { selectConfigurationsOffset } from '@/store/slices/configuration/configurations';
import {
  fetchDelMenuAction,
  selectDelMenuModal,
  selectEditMenuModal,
  setDelMenuModalOpen,
  setEditMenuModalOpen,
} from '@/store/slices/menu/menu';
import { fetchMenusAction, selectCurrentMenu } from '@/store/slices/menu/menus';

const MenusTableModals = () => {
  const { dispatch, blocked } = useBlockingDispatch();
  const currentMenu = useSelector(selectCurrentMenu);
  const menuModalDel = useSelector(selectDelMenuModal);
  const menusModalEdit = useSelector(selectEditMenuModal);
  const selectMenusOffset = useSelector(selectConfigurationsOffset);

  const delConfirmHandler = async () => {
    if (currentMenu) {
      await dispatch(fetchDelMenuAction({ id: currentMenu.id }));
    }
    await dispatch(
      fetchMenusAction({
        params: {
          offset: selectMenusOffset,
          limit: '100',
        },
      })
    );
  };

  return (
    <>
      <ModalConfirm
        title="Вы уверены?"
        text="Восстановить данные после удаления не получится"
        opened={menuModalDel}
        onClose={() => dispatch(setDelMenuModalOpen(false))}
        confirmHandler={delConfirmHandler}
        blocked={blocked}
        closeOnClickOutside={!blocked}
        closeOnEscape={!blocked}
      />

      <Modal
        centered
        size={'lg'}
        opened={menusModalEdit}
        onClose={() => dispatch(setEditMenuModalOpen(false))}
        title={
          <Box>
            <Text fz={22} fw={700}>
              Изменение меню
            </Text>
            <Text
              sx={(theme) => ({ fontWeight: 700, color: theme.colors.gray[6] })}
            >{`ID ${currentMenu?.id}`}</Text>
          </Box>
        }
      >
        <FormNewMenu type="edit" element={currentMenu} />
      </Modal>
    </>
  );
};

export default MenusTableModals;
