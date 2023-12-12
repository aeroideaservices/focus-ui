import { FC } from 'react';
import { Box, createStyles } from '@mantine/core';

import { ReactComponent as Focus } from '@/assets/icons/focus.svg';
import { ReactComponent as IconFocusF } from '@/assets/icons/icon-focus-f.svg';

interface ILayoutNavbarLogo {
  collapse?: boolean;
}

const useStyles = createStyles(() => ({
  logo: {
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    top: 24,
    left: 24,
    opacity: 0,
    transition: 'opacity 0.25s ease',
  },
}));

const LayoutNavbarLogo: FC<ILayoutNavbarLogo> = ({ collapse = true }) => {
  const { classes } = useStyles();

  return (
    <Box h={72} w={219}>
      <Focus height={24} className={classes.icon} style={{ opacity: collapse ? 1 : 0 }} />
      <IconFocusF
        width={24}
        height={24}
        className={classes.icon}
        style={{ opacity: !collapse ? 1 : 0 }}
      />
    </Box>
  );
};

export default LayoutNavbarLogo;
