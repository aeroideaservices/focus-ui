import { IFile, IFolder, ResourceType } from '@/types';

import { FC } from 'react';
import { Box, createStyles, Image, Text, UnstyledButton, useMantineTheme } from '@mantine/core';
import { IconFile, IconFolder, IconPhoto } from '@tabler/icons-react';

import { isFile } from '@/utils/isFile';

import { isImage } from '../../utils/isImage';

const useStyles = createStyles((theme, { selected = false }: { selected?: boolean }) => ({
  mediaItemWrapper: {
    background: 'transparent',
    border: `4px solid ${
      selected
        ? theme.colorScheme === 'dark'
          ? theme.colors['jungle-mist'][7]
          : theme.colors.blue[5]
        : 'transparent'
    }`,
    margin: '-4px',
    borderRadius: theme.radius.md,
  },
  mediaItem: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    border:
      theme.colorScheme === 'dark'
        ? `1px solid ${theme.colors.gray[8]}`
        : `1px solid ${theme.colors.gray[2]}`,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.xs,
    background: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
    boxSizing: 'border-box',
    overflow: 'hidden',
    [`@media (max-width: ${theme.breakpoints.lg}px)`]: {
      flexDirection: 'column',
    },
  },
  mediaIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: '96px',
    height: '64px',
    color: theme.colorScheme === 'dark' ? theme.colors.gray[4] : theme.colors.gray[5],
    overflow: 'hidden',
    borderRadius: 8,
  },
  mediaBody: {
    marginLeft: '8px',
    flex: 1,
    [`@media (max-width: ${theme.breakpoints.lg}px)`]: {
      marginLeft: 0,
      marginTop: '8px',
    },
  },
  mediaInfo: {
    textAlign: 'left',
    [`@media (max-width: ${theme.breakpoints.lg}px)`]: {
      textAlign: 'center',
    },
  },
}));

interface IMediaItem {
  type: ResourceType;
  item: IFile | IFolder;
  onSelect?: (id: string, type: ResourceType) => void;
  onSubmit?: (id: string, type: ResourceType) => void;
  selected?: boolean;
}

const MediaItem: FC<
  IMediaItem & Omit<React.ComponentPropsWithoutRef<'button'>, keyof IMediaItem>
> = ({ type, item, onSelect, onSubmit, selected = false, ...props }) => {
  const theme = useMantineTheme();

  const { classes, cx } = useStyles({ selected });

  const handleClick = async () => {
    if (onSelect) onSelect(item.id, type);
  };

  const handleDoubleClick = async () => {
    if (onSubmit) onSubmit(item.id, type);
  };

  return (
    <UnstyledButton
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className={cx(classes.mediaItemWrapper)}
      {...props}
    >
      <Box className={classes.mediaItem}>
        <div className={classes.mediaIcon}>
          {type === ResourceType.FOLDER && <IconFolder size={64} />}
          {type === ResourceType.FILE && isFile(item) && !isImage(item.ext) && (
            <IconFile size={64} />
          )}
          {type === ResourceType.FILE && isFile(item) && isImage(item.ext) && (
            <Image
              src={item.url}
              alt={item.alt || item.name}
              withPlaceholder
              placeholder={<IconPhoto size={64} color={theme.colors.gray[5]} />}
              styles={{
                placeholder: {
                  backgroundColor:
                    theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
                },
              }}
            />
          )}
        </div>
        <div className={classes.mediaBody}>
          <Text
            lineClamp={1}
            sx={{ wordBreak: 'break-all' }}
            color={theme.colorScheme === 'dark' ? theme.colors.gray[4] : theme.colors.dark[8]}
            weight={400}
            className={classes.mediaInfo}
          >
            {item.name}
          </Text>
          {type !== ResourceType.FOLDER && <Text color="dimmed">{item.size}</Text>}
        </div>
      </Box>
    </UnstyledButton>
  );
};

export default MediaItem;
