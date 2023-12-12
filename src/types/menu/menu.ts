export type TMenu = {
  id: string;
  code: string;
  name: string;
};

export type TMenuItem = {
  name: string;
  url: string;
  additionalFields?: {
    code: string;
    name: string;
  }[];
};

export type TAddMenuItems = {
  id: string;
  data: TMenuItem;
  params?: any;
};

export type TGetMenuItems = {
  id: string;
  params?: {
    parentMenuItemId?: string;
  };
  itemId?: string;
};

export type TPutMenuItems = {
  params: {
    menuId: string;
    menuItemId: string;
  };
  data: TMenuItem;
};

export type TMoveMenuItems = {
  params: {
    menuId: string;
    menuItemId: string;
  };
  data: {
    name?: string;
    url?: string;
    parentMenuItemId?: string;
    position?: number;
  };
};

export type TDelMenuItem = {
  menuId: string;
  menuItemId: string;
};
