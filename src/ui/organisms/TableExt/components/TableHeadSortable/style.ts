import { createStyles } from '@mantine/core';

export const useStyles = createStyles((theme) => ({
  th: {
    padding: '0 !important',
  },

  control: {
    width: '100%',
    padding: `${theme.spacing.xs}px ${theme.spacing.xs}px`,
  },

  icon: {
    width: 20,
    height: 20,
    borderRadius: 20,
  },
}));
