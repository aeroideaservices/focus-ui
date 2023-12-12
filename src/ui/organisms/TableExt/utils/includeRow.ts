import { isEqual } from 'lodash';

export const includeRow = (
  rows: Record<string, string>[],
  row: Record<string, string>
): boolean => {
  let has = false;

  rows.forEach((el) => {
    if (isEqual(el, row)) {
      has = true;
    }
  });

  return has;
};
