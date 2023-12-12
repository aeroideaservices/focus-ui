import { createStyles } from '@mantine/core';

export const useStyles = createStyles((theme) => ({
  root: {
    paddingBottom: '12px',
    paddingRight: '12px',
  },
  header: {
    position: 'sticky',
    top: 0,
    color: theme.colorScheme === 'dark' ? theme.colors.gray[1] : theme.colors.gray[2],
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[2],
    transition: 'box-shadow 150ms ease',
    zIndex: 1,

    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `1px solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]
      }`,
    },
    th: {
      fontSize: '14px !important',
      lineHeight: 1.55,
      fontWeight: 700,
      color: 'black !important',
    },
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));
