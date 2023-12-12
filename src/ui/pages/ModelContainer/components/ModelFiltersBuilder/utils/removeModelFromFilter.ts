import { isArray } from 'lodash';

export const removeModelFromFilter = (
  model: Record<string, string>,
  filter: Record<string, unknown>
) => {
  for (const key in model) {
    if (isArray(filter[key])) {
      filter[key] = (filter[key] as string[]).filter(
        (filterValue: string) => String(filterValue) !== model[key]
      );
    }
  }

  return filter;
};
