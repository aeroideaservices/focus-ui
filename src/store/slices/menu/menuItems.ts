import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  apiAddMenuItems,
  apiDelMenuItem,
  apiGetMenuItem,
  apiGetMenuItems,
  apiMoveMenuItem,
  apiPutMenuItem,
} from '@/api/menu/menuItem';

import { createAxiosThunk, createThunkRequest } from '@/utils/asyncRequest';
import notify from '@/utils/notify';

interface IMenuItemState {
  status: {
    fetchingGetMenuItems: boolean;
  };
  modals: {
    addMenuItemsModal: boolean;
    delMenuItemModal: boolean;
    editMenuItemOpenModal: boolean;
  };
  menuItems: any | null;
  currMenuItem: any | null;
  fullMenuItem: any | null;
  secondLevel: any | null;
  thirdLevel: any | null;
  parentId: any;
  addedId: any;
  treeData: any;
  treeIds: any;
  dropAccept: any;
  currentPath: any;
}

const initialState: IMenuItemState = {
  status: {
    fetchingGetMenuItems: false,
  },
  modals: {
    addMenuItemsModal: false,
    delMenuItemModal: false,
    editMenuItemOpenModal: false,
  },
  menuItems: null,
  currMenuItem: null,
  fullMenuItem: null,
  secondLevel: null,
  thirdLevel: null,
  parentId: null,
  addedId: null,
  treeData: null,
  treeIds: [],
  dropAccept: [],
  currentPath: [],
};

export const fetchGetMenuItemsAction = createAxiosThunk('GetMenuItems', apiGetMenuItems);
export const fetchAddMenuItemsAction = createAxiosThunk('AddMenuItems', apiAddMenuItems);
export const fetchPutMenuItemsAction = createAxiosThunk('PutMenuItem', apiPutMenuItem);
export const fetchDelMenuItemAction = createAxiosThunk('DelMenuItem', apiDelMenuItem);
export const fetchGetMenuItemAction = createAxiosThunk('GetMenuItem', apiGetMenuItem);
export const fetchMoveMenuItemsAction = createAxiosThunk('MoveMenuItem', apiMoveMenuItem);

export const fetchGetMenuItemsChildrenAction = createThunkRequest(
  'GetMenuItemsChildren',
  apiGetMenuItems,
  ({ data }, params) => ({
    result: data,
    oldTreeData: params.oldTreeData,
    id: params.itemId ? params.itemId : params.menuId,
    path: params.path.length ? params.path : params.params.parentMenuItemId,
  })
);

export const fetchGetThirdLevelAction = createAxiosThunk('GetThirdLevel', apiGetMenuItems);

export const menuItemsSlice = createSlice({
  name: 'menuItems',
  initialState,
  reducers: {
    setAddMenuItemsModalOpened: (state, action) => {
      state.modals.addMenuItemsModal = action.payload;
    },
    setEditMenuItemModalOpened: (state, action: PayloadAction<boolean>) => {
      state.modals.editMenuItemOpenModal = action.payload;
    },
    setDelMenuItemModalOpened: (state, action: PayloadAction<boolean>) => {
      state.modals.delMenuItemModal = action.payload;
    },
    setMenuItem: (state, action) => {
      state.currMenuItem = action.payload;
    },
    setSecondLevel: (state, action) => {
      state.secondLevel = action.payload;
    },
    setMenuItems: (state, action) => {
      state.menuItems = action.payload;
    },
    setParentId: (state, action) => {
      state.parentId = action.payload;
    },
    setTreeIds: (state, action) => {
      state.treeIds = action.payload;
    },
    setTreeData: (state, action) => {
      state.treeData = action.payload;
    },
    setCurrentPath: (state, action) => {
      state.currentPath = action.payload;
    },
    setDropAccept: (state, action) => {
      state.dropAccept = action.payload;
    },
    setFullMenuItem: (state, action) => {
      state.fullMenuItem = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGetMenuItemsAction.pending, (state) => {
        state.status.fetchingGetMenuItems = true;
      })
      .addCase(fetchGetMenuItemsAction.fulfilled, (state, action) => {
        state.status.fetchingGetMenuItems = false;
        state.menuItems = action.payload;
        state.dropAccept = action.payload ? action.payload.map((item: any) => item.id) : null;
        state.treeData = action.payload
          ? action.payload?.map((item: any) => ({
              level: 1,
              data: item,
              [item.id]: null,
              id: item.id,
            }))
          : null;
      })
      .addCase(fetchGetMenuItemsAction.rejected, (state) => {
        state.status.fetchingGetMenuItems = false;
      });
    builder.addCase(fetchAddMenuItemsAction.fulfilled, (state, action) => {
      state.modals.addMenuItemsModal = false;
      state.addedId = action.payload.id;

      notify({ message: 'Пункт меню добавлен', type: 'success' });
    });
    builder.addCase(fetchPutMenuItemsAction.fulfilled, (state) => {
      state.modals.editMenuItemOpenModal = false;

      notify({ message: 'Пункт меню изменен', type: 'success' });
    });
    builder.addCase(fetchDelMenuItemAction.fulfilled, (state) => {
      state.modals.delMenuItemModal = false;

      notify({ message: 'Пункт меню удален', type: 'success' });
    });
    builder.addCase(fetchGetMenuItemAction.fulfilled, (state, action) => {
      state.fullMenuItem = action.payload;
    });
    builder.addCase(fetchGetMenuItemsChildrenAction.fulfilled, (state, action) => {
      const childrenData = action.payload?.result?.map((item: any) => ({
        level: 2,
        data: item,
        [item.id]: null,
        id: item.id,
      }));

      const splittedTreeIds = action.payload.path.length ? action.payload.path.split('.') : [];
      let newTreeData: any = [];
      const changedBranchTrace: any = [];

      splittedTreeIds.reduce((acc: any, item: any, index: any) => {
        if (splittedTreeIds.length === 1) {
          let neededTree = state.treeData.find((finded: any) => finded.id === item);
          neededTree = { ...neededTree, [neededTree.id]: childrenData };
          changedBranchTrace.push(neededTree);
        } else if (!index) {
          acc = state.treeData.find((finded: any) => finded.id === item);
          changedBranchTrace.push(acc);
        } else if (index === splittedTreeIds.length - 1) {
          let neededTree = acc[acc.id].find((finded: any) => finded.id === item);
          neededTree = { ...neededTree, [neededTree.id]: childrenData };
          changedBranchTrace.push(neededTree);
        } else {
          acc = acc[acc.id].find((finded: any) => finded.id === item);
          changedBranchTrace.push(acc);
        }
        return acc;
      }, {});

      const fullChangedBranch = changedBranchTrace
        .reverse()
        .reduce((acc: any, item: any, index: any) => {
          if (!index) {
            return (acc = item);
          } else {
            const newArr = item[item.id].map((inner: any) => {
              if (inner.id === acc.id) {
                return acc;
              } else return inner;
            });
            return (acc = { ...item, [item.id]: newArr });
          }
        }, {});

      newTreeData = state.treeData.map((treeItem: any) => {
        if (treeItem?.id === fullChangedBranch?.id) return fullChangedBranch;
        else return treeItem;
      });

      state.treeData = newTreeData;

      const dropChildrenAccept = action.payload.result
        ? action.payload.result.map((item: any) => `${action.payload.path}.${item.id}`)
        : [];
      state.dropAccept = [...state.dropAccept, ...dropChildrenAccept];

      const test = state.treeIds.find((el: any) => el.includes(action?.payload?.id));

      test.split('.').reduce((acc: any, item: any, index: any) => {
        if (!index) {
          acc = state?.treeData?.find((el: any) => el[item])
            ? state?.treeData?.find((el: any) => el[item])[item]
            : {};
        } else if (index === test.split('.').length) {
          acc.find((el: any) => el[item] === null)[item] = childrenData;
        } else {
          if (acc.find((el: any) => el[item])) acc = acc.find((el: any) => el[item])[item];
        }

        return acc;
      }, {});

      state.secondLevel = {
        [action.payload?.id ? action.payload?.id : '']: action.payload?.result,
      };
    });
    builder.addCase(fetchGetThirdLevelAction.fulfilled, (state, action) => {
      state.thirdLevel = action.payload;
    });
  },
});

type TSelectorState = { menuItems: IMenuItemState };

export const selectEditMenuItemModal = (state: TSelectorState) =>
  state.menuItems.modals.editMenuItemOpenModal;
export const selectAddMenuItemsModal = (state: TSelectorState) =>
  state.menuItems.modals.addMenuItemsModal;
export const selectDelMenuItemsModal = (state: TSelectorState) =>
  state.menuItems.modals.delMenuItemModal;

export const selectFetchingGetMenuItems = (state: TSelectorState) =>
  state.menuItems.status.fetchingGetMenuItems;

export const selectMenuItem = (state: TSelectorState) => state.menuItems.currMenuItem;
export const selectMenuItems = (state: TSelectorState) => state.menuItems.menuItems;
export const selectFullMenuItem = (state: TSelectorState) => state.menuItems.fullMenuItem;
export const selectSecondLevel = (state: TSelectorState) => state.menuItems.secondLevel;
export const selectParentId = (state: TSelectorState) => state.menuItems.parentId;
export const selectAddedId = (state: TSelectorState) => state.menuItems.addedId;
export const selectThirdLevel = (state: TSelectorState) => state.menuItems.thirdLevel;
export const selectTreeData = (state: TSelectorState) => state.menuItems.treeData;
export const selectTreeIds = (state: TSelectorState) => state.menuItems.treeIds;
export const selectDropAccept = (state: TSelectorState) => state.menuItems.dropAccept;
export const selectCurrentPath = (state: TSelectorState) => state.menuItems.currentPath;

export const {
  setEditMenuItemModalOpened,
  setAddMenuItemsModalOpened,
  setDelMenuItemModalOpened,
  setMenuItem,
  setSecondLevel,
  setMenuItems,
  setParentId,
  setTreeIds,
  setTreeData,
  setCurrentPath,
  setDropAccept,
  setFullMenuItem,
} = menuItemsSlice.actions;

export default menuItemsSlice.reducer;
