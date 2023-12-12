import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Box, Modal, Text } from '@mantine/core';

import { useBlockingDispatch } from '@/hooks/useBlockingDispatch';

import ModalConfirm from '@/ui/organisms/ModalConfirm/ModalConfirm';

import FormNewItems from '../FormNewItems/FormNewItems';

import {
  fetchDelMenuItemAction,
  fetchGetMenuItemsAction,
  fetchGetMenuItemsChildrenAction,
  selectCurrentPath,
  selectDelMenuItemsModal,
  selectEditMenuItemModal,
  selectMenuItem,
  selectParentId,
  selectTreeData,
  setDelMenuItemModalOpened,
  setEditMenuItemModalOpened,
  setFullMenuItem,
} from '@/store/slices/menu/menuItems';
import { selectCurrentService } from '@/store/slices/service/service';

const MenuDropdownModals = () => {
  const { dispatch, blocked } = useBlockingDispatch();
  const params = useParams();
  const menuItem = useSelector(selectMenuItem);
  const editMenuItemModal = useSelector(selectEditMenuItemModal);
  const delMenuItemModal = useSelector(selectDelMenuItemsModal);
  const service = useSelector(selectCurrentService);
  const parentId = useSelector(selectParentId);
  const treeData = useSelector(selectTreeData);
  const currentPath = useSelector(selectCurrentPath);

  const delConfirmHandler = async () => {
    const { menuId } = params;
    const menuItemId = menuItem?.id;

    if (menuId && menuItemId && service) {
      await dispatch(fetchDelMenuItemAction({ menuId, menuItemId }));

      if (parentId) {
        await dispatch(
          fetchGetMenuItemsChildrenAction({
            id: menuId,
            oldTreeData: treeData,
            path: currentPath,
            params: { parentMenuItemId: parentId },
            itemId: parentId,
          })
        );
      } else await dispatch(fetchGetMenuItemsAction({ id: menuId }));
    }
  };

  return (
    <>
      <ModalConfirm
        title="Вы уверены?"
        text="Восстановить данные после удаления не получится"
        opened={delMenuItemModal}
        onClose={() => dispatch(setDelMenuItemModalOpened(false))}
        confirmHandler={() => delConfirmHandler()}
        blocked={blocked}
        closeOnClickOutside={!blocked}
        closeOnEscape={!blocked}
      />

      <Modal
        centered
        size={'lg'}
        opened={editMenuItemModal}
        onClose={() => {
          dispatch(setEditMenuItemModalOpened(false));
          dispatch(setFullMenuItem({}));
        }}
        closeOnClickOutside={!blocked}
        closeOnEscape={!blocked}
        title={
          <Box>
            <Text fz={22} fw={700}>
              Изменение настройки
            </Text>
            <Text
              sx={(theme) => ({ fontWeight: 700, color: theme.colors.gray[6] })}
            >{`ID ${menuItem?.id}`}</Text>
          </Box>
        }
      >
        <FormNewItems type="edit" element={menuItem} />
      </Modal>
    </>
  );
};

export default MenuDropdownModals;
