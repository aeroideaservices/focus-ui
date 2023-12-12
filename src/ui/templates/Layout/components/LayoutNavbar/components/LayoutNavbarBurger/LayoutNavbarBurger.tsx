import { FC } from 'react';
import { Burger, createStyles, Group, Text, UnstyledButton, useMantineTheme } from '@mantine/core';
import { useHover } from '@mantine/hooks';

const useStyles = createStyles((theme) => ({
  root: {
    width: '100%',
    fill: theme.colorScheme === 'dark' ? theme.colors['jungle-mist'][7] : '#bfcedb',
    overflow: 'hidden',
    borderRight: theme.colorScheme === 'dark' ? theme.colors['jungle-mist'][7] : '4px solid white',
  },

  label: {
    color: theme.colorScheme === 'dark' ? theme.colors['jungle-mist'][7] : '#121212',
    paddingBottom: 2,
    transition: 'color 0.25s ease-in-out',

    '&:hover': {
      color:
        theme.colorScheme === 'dark'
          ? theme.colors['jungle-mist'][7]
          : `${theme.colors['science-blue'][9]}`,
    },
  },
}));

interface ILayoutNavbarBurger {
  collapse: boolean;
  onClick?: () => void;
}

const LayoutNavbarBurger: FC<ILayoutNavbarBurger> = ({ collapse, onClick }) => {
  const title = collapse ? 'Свернуть' : 'Развернуть';
  const theme = useMantineTheme();
  const { hovered, ref } = useHover();
  const { classes } = useStyles();

  return (
    <div ref={ref}>
      <Group spacing={0} noWrap pl={22} sx={{ alignItems: 'center' }} className={classes.root}>
        <Burger
          color={
            theme.colorScheme === 'dark'
              ? hovered
                ? theme.colors['jungle-mist'][7]
                : theme.colors.gray[5]
              : hovered
              ? theme.colors['science-blue'][9]
              : '#bfcedb'
          }
          opened={collapse}
          title={title}
          size={'sm'}
          onClick={onClick}
        />
        <UnstyledButton pl={20} title={title} onClick={onClick} className={classes.label}>
          <Text lineClamp={1} truncate>
            {title}
          </Text>
        </UnstyledButton>
      </Group>
    </div>
  );
};

export default LayoutNavbarBurger;
