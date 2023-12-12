export type TAddMenusReq = {
  code: string;
  name: string;
};

export type TPutMenuReq = {
  id: string;
  data: TAddMenusReq;
};
