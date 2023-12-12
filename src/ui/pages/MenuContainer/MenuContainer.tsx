import { FC, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Box, Button, Modal, ScrollArea, Text } from '@mantine/core';

import { PluginCode } from '@/constants/plugins';
import { useServices } from '@/hooks/useServices';

import PageBody from '@/ui/templates/Page/components/PageBody/PageBody';
import PageHeader from '@/ui/templates/Page/components/PageHeader/PageHeader';
import PageLoader from '@/ui/templates/Page/components/PageLoader/PageLoader';
import Page from '@/ui/templates/Page/Page';

import DroppableDropDown from './components/DroppableDropDown/DroppableDropDown';
import FormNewItems from './components/FormNewItems/FormNewItems';
import MenuDropdownModals from './components/MenuDropdownModals/MenuDropdownModals';

import { AppDispatch } from '@/store';
import { fetchGetMenuAction, selectMenu } from '@/store/slices/menu/menu';
import {
  fetchGetMenuItemsAction,
  fetchMoveMenuItemsAction,
  selectAddMenuItemsModal,
  selectDropAccept,
  selectFetchingGetMenuItems,
  selectMenuItems,
  selectTreeData,
  setAddMenuItemsModalOpened,
  setDropAccept,
  setParentId,
  setTreeData,
} from '@/store/slices/menu/menuItems';
import { selectCurrentService } from '@/store/slices/service/service';

const MenuContainer: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const service = useSelector(selectCurrentService);
  const params = useParams();
  const menu = useSelector(selectMenu);
  const menuItems = useSelector(selectMenuItems);
  const menuAddItemsModal = useSelector(selectAddMenuItemsModal);
  const treeData = useSelector(selectTreeData);
  const dropAccept = useSelector(selectDropAccept);
  const fetchingMenuItems = useSelector(selectFetchingGetMenuItems);

  const { availablePlugins } = useServices();
  const isMenuAvailable = useMemo(
    () => availablePlugins.includes(PluginCode.MENUS),
    [availablePlugins]
  );

  useEffect(() => {
    if (params.menuId && service && isMenuAvailable) {
      dispatch(fetchGetMenuAction(params.menuId));
      dispatch(fetchGetMenuItemsAction({ id: params.menuId }));
    }

    return () => {
      dispatch(setTreeData([]));
    };
  }, [params, service]);

  const breadcrumbs = [
    {
      name: 'Меню',
      url: '/menus',
    },
    {
      name: `${menu?.name}`,
    },
  ];

  const onDragEndHandler = (item: any, index: any, fromWhere: any, prevIndex: any, isNew: any) => {
    const splittedType = item?.type.split('.');
    const splittedFromWhere = fromWhere.split('.');

    if (!item?.type.includes('.') && !fromWhere.includes('.')) {
      const items = Array.from(treeData);
      const [reorderedItem] = items.splice(item.dragIndex, 1);

      items.splice(prevIndex, 0, reorderedItem);

      dispatch(setTreeData(items));

      if (params.menuId)
        dispatch(
          fetchMoveMenuItemsAction({
            params: { menuId: params.menuId, menuItemId: item.id },
            data: { position: prevIndex + 1 },
          })
        );
    } else if (
      item?.type.length === fromWhere.length &&
      splittedType[splittedType.length - 2] &&
      splittedFromWhere[splittedType.length - 2]
    ) {
      const changedBranchTraice: any = [];
      const changedBranchTraiceIds: any = [];

      splittedFromWhere.reduce((acc: any, innerItem: any, innerIndex: any) => {
        const newTreeData = [...treeData];

        if (!innerIndex) {
          acc = newTreeData.find((el: any) => el.id === innerItem);
          changedBranchTraice.push(acc);
          changedBranchTraiceIds.push(acc.id);
        } else if (innerIndex === splittedFromWhere.length - 1) {
          const items = Array.from(acc[acc.id]);
          const [reorderedItem] = items.splice(item.dragIndex, 1);

          items.splice(prevIndex, 0, reorderedItem);
          acc = { ...acc, [acc.id]: items };

          const fullChangedBranch = changedBranchTraice
            .reverse()
            .reduce((branchAcc: any, branchItem: any, branchIndex: any) => {
              if (!branchIndex) {
                branchAcc = { ...branchItem, [branchItem.id]: items };
              } else {
                const temp = branchItem[branchItem.id].map((accItem: any) => {
                  if (accItem.id === branchAcc.id) return branchAcc;
                  else return accItem;
                });
                branchAcc = { ...branchItem, [branchItem.id]: temp };
              }

              return branchAcc;
            }, {});

          const test = newTreeData.map((inner: any) => {
            if (inner.id === fullChangedBranch.id) {
              return fullChangedBranch;
            } else {
              return inner;
            }
          });

          dispatch(setTreeData(test));

          if (params.menuId)
            dispatch(
              fetchMoveMenuItemsAction({
                params: { menuId: params.menuId, menuItemId: item.id },
                data: {
                  position: prevIndex + 1,
                  parentMenuItemId: splittedType[splittedType.length - 2],
                },
              })
            );
        } else {
          acc = acc[acc.id].find((el: any) => el.id === innerItem);
          changedBranchTraice.push(acc);
        }
        return acc;
      }, []);
    } else {
      const changedBranchTraice: any = [];
      let addedElem: any = {};
      let newTreeData: any = [];

      splittedType.reduce((acc: any, itemType: any, indexType: any) => {
        if (splittedType.length === 1) {
          const test = treeData.filter((el: any) => {
            if (el.id !== itemType) return el;
            else addedElem = el;
          });

          newTreeData = test;
        } else if (!indexType) {
          acc = treeData.find((el: any) => el.id === itemType);
          changedBranchTraice.push(acc);
        } else if (indexType === splittedType.length - 1 && indexType) {
          const filteredArray = acc[acc.id].filter((el: any) => {
            if (el.id !== itemType) return el;
            else addedElem = el;
          });
          const newBranch = changedBranchTraice
            .reverse()
            .reduce((traiceAcc: any, traiceItem: any, traiceIndex: any) => {
              if (!traiceIndex) {
                return (traiceAcc = { ...traiceItem, [traiceItem.id]: filteredArray });
              } else {
                const temp = traiceItem[traiceItem.id].map((accItem: any) => {
                  if (accItem.id === traiceAcc.id) return traiceAcc;
                  else return accItem;
                });
                return { ...traiceItem, [traiceItem.id]: temp };
              }
            }, {});
          const test = treeData.map((inner: any) => {
            if (inner.id === newBranch.id) {
              return newBranch;
            } else {
              return inner;
            }
          });

          newTreeData = test;
        } else {
          acc = acc[acc.id].find((el: any) => el.id === itemType);
          changedBranchTraice.push(acc);
        }

        return acc;
      }, {});

      const changedBranchTraiceAdd: any = [];
      let parentIdToSend = '';

      splittedFromWhere.reduce((acc: any, innerItem: any, innerIndex: any) => {
        if (splittedFromWhere.length === 1) {
          newTreeData.splice(prevIndex, 0, addedElem);

          if (params.menuId)
            dispatch(
              fetchMoveMenuItemsAction({
                params: { menuId: params.menuId, menuItemId: item.id },
                data: { position: isNew ? 1 : prevIndex + 1 },
              })
            );
          dispatch(setTreeData(newTreeData));
          dispatch(setDropAccept([...dropAccept, item.id]));
        } else if (!innerIndex) {
          acc = newTreeData.find((el: any) => el.id === innerItem);
          changedBranchTraiceAdd.push(acc);
        } else if (innerIndex === splittedFromWhere.length - 1) {
          const items = acc[acc.id] ? [...acc[acc.id]] : [];
          items.splice(prevIndex, 0, addedElem);
          acc = { ...acc, [acc.id]: items };
          parentIdToSend = acc.id;
          const newDropAccept = changedBranchTraiceAdd.reduce(
            (dropAcc: any, dropItem: any, dropIndex: any) => {
              if (!dropIndex) dropAcc = dropItem.id;
              else dropAcc = `${dropAcc}.${dropItem.id}`;

              return dropAcc;
            },
            ''
          );

          dispatch(setDropAccept([...dropAccept, `${newDropAccept}.${item.id}`]));

          const fullChangedBranch = changedBranchTraiceAdd
            .reverse()
            .reduce((branchAcc: any, branchItem: any, branchIndex: any) => {
              if (!branchIndex) {
                branchAcc = { ...branchItem, [branchItem.id]: items };
              } else {
                const newArr = branchItem[branchItem.id].map((accItem: any) => {
                  if (accItem.id === branchAcc.id) return branchAcc;
                  else return accItem;
                });
                return (acc = { ...branchItem, [branchItem.id]: newArr });
              }

              return branchAcc;
            }, {});

          const test = newTreeData.map((inner: any) => {
            if (inner.id === fullChangedBranch.id) {
              return acc;
            } else {
              return inner;
            }
          });
          if (changedBranchTraiceAdd.length < 5) dispatch(setTreeData(test));
          if (params.menuId)
            dispatch(
              fetchMoveMenuItemsAction({
                params: { menuId: params.menuId, menuItemId: item.id },
                data: { position: isNew ? 1 : prevIndex + 1, parentMenuItemId: parentIdToSend },
              })
            );
        } else {
          acc = acc[acc.id].find((el: any) => el.id === innerItem);
          changedBranchTraiceAdd.push(acc);
        }
        return acc;
      }, []);
    }
  };

  return (
    <Page>
      {menu && (
        <PageHeader
          title={!fetchingMenuItems && menu ? `${menu?.name}` : ''}
          subTitle={!fetchingMenuItems && menu ? `ID ${menu?.id}` : undefined}
          backLink="/menus"
          breadcrumbs={breadcrumbs}
          rightButton={
            <Button
              onClick={() => {
                dispatch(setParentId(''));
                dispatch(setAddMenuItemsModalOpened(true));
              }}
            >
              Новый пункт
            </Button>
          }
        />
      )}

      <PageBody>
        <Box mih={26}>
          <Text color="dimmed">Перетащите элементы меню, чтобы изменить их порядок</Text>
        </Box>
        <Box h={0} sx={{ flex: '1 0 0' }}>
          <ScrollArea offsetScrollbars h="100%">
            {Array.isArray(treeData) &&
              treeData?.map((item: any, index: number) => (
                <DroppableDropDown
                  item={item}
                  key={item.id}
                  itemPath={`${menuItems?.length}-${index}`}
                  index={index}
                  onDragEndHandler={onDragEndHandler}
                />
              ))}
          </ScrollArea>
        </Box>

        {!treeData?.length && (
          <PageLoader zIndex={100} loading={fetchingMenuItems} text="У вас пока нет пунктов меню" />
        )}
      </PageBody>

      <Modal
        centered
        size={'lg'}
        opened={menuAddItemsModal}
        onClose={() => dispatch(setAddMenuItemsModalOpened(false))}
        title={
          <Text fz={22} fw={700}>
            Новый пункт меню
          </Text>
        }
      >
        <FormNewItems type="new" />
      </Modal>

      <MenuDropdownModals />
    </Page>
  );
};

export default MenuContainer;
