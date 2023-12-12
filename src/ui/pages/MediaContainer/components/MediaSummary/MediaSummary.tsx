import { FC, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  AspectRatio,
  Box,
  CopyButton,
  createStyles,
  Image,
  ScrollArea,
  Skeleton,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { IconFile, IconFolder, IconPhoto } from '@tabler/icons-react';

import { isFile } from '@/utils/isFile';

import { fileDateFormat } from '../../utils/fileDateFormat';
import { isImage } from '../../utils/isImage';

import MediaSummaryItem from './components/MediaSummaryItem/MediaSummaryItem';

import { selectSelectedId } from '@/store/slices/media/media';
import { selectCurrentFile, selectFetchingGetFileInfo } from '@/store/slices/media/mediaFiles';
import {
  selectCurrentFolder,
  selectFetchingGetFolderInfo,
} from '@/store/slices/media/mediaFolders';

const useStyles = createStyles((theme) => ({
  mediaSummary: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxHeight: '100%',
    border:
      theme.colorScheme === 'dark'
        ? `1px solid ${theme.colors.gray[8]}`
        : `1px solid ${theme.colors.gray[3]}`,
    borderRadius: theme.radius.md,
    background: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
    boxSizing: 'border-box',
    overflow: 'hidden',
  },
  mediaImage: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    justifyContent: 'center',
    width: '100%',
    color: theme.colorScheme === 'dark' ? theme.colors.gray[4] : theme.colors.gray[5],
  },
  mediaBody: {
    padding: '28px 12px 28px 24px',
  },
  mediaLink: {
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors['jungle-mist'][7] : theme.colors.blue,
    transition: 'color .25s ease-in-out',
    '&:hover': {
      color: theme.colorScheme === 'dark' ? theme.colors['jungle-mist'][5] : theme.colors.blue[7],
    },
  },
}));

const MediaSummary: FC = () => {
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const currentFolder = useSelector(selectCurrentFolder);
  const fetchingFolderInfo = useSelector(selectFetchingGetFolderInfo);
  const currentFile = useSelector(selectCurrentFile);
  const fetchingFileInfo = useSelector(selectFetchingGetFileInfo);
  const selectedItemId = useSelector(selectSelectedId);

  const currentItem = useMemo(
    () => [currentFile, currentFolder].find((item) => item?.id === selectedItemId),
    [currentFile, currentFolder, selectedItemId]
  );
  const isCurrentItemFile = currentItem && isFile(currentItem);

  return (
    <Box className={classes.mediaSummary}>
      <AspectRatio ratio={16 / 9}>
        <Box className={classes.mediaImage}>
          {!currentItem && <Skeleton height={100} width={100} />}

          {!isCurrentItemFile && currentItem && !fetchingFolderInfo && !fetchingFileInfo && (
            <IconFolder size={100} />
          )}
          {currentFile &&
            !isImage(currentFile.contentType) &&
            !fetchingFileInfo &&
            !fetchingFolderInfo && <IconFile size={100} />}
          {currentFile &&
            isImage(currentFile.contentType) &&
            !fetchingFileInfo &&
            !fetchingFolderInfo && (
              <Image
                src={currentFile.url}
                alt={currentFile.alt || currentFile.name}
                withPlaceholder
                placeholder={<IconPhoto size={100} color={theme.colors.gray[5]} />}
                styles={{
                  placeholder: {
                    backgroundColor:
                      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[5],
                  },
                }}
              />
            )}
        </Box>
      </AspectRatio>

      <Box className={classes.mediaBody}>
        <ScrollArea offsetScrollbars>
          {currentItem && !isCurrentItemFile && !fetchingFolderInfo && (
            <>
              <MediaSummaryItem name="Название" value={currentItem.name} mb={24} />
              <MediaSummaryItem name="Тип" value={'Папка'} mb={24} />
              <MediaSummaryItem name="Размер" value={currentItem.size} mb={24} />
            </>
          )}

          {currentItem && isCurrentItemFile && !fetchingFileInfo && (
            <>
              <MediaSummaryItem name="Название" value={currentItem.name} mb={24} />
              <MediaSummaryItem name="Тип" value={currentItem.ext} mb={24} />
              <MediaSummaryItem name="Размер" value={currentItem.size} mb={24} />
              <MediaSummaryItem
                name="ID"
                value={
                  <CopyButton value={currentItem.id}>
                    {({ copied, copy }) => (
                      <UnstyledButton className={classes.mediaLink} onClick={copy}>
                        {copied ? 'Скопировано' : 'Скопировать ID'}
                      </UnstyledButton>
                    )}
                  </CopyButton>
                }
                mb={24}
              />
              <MediaSummaryItem
                name="URL"
                value={
                  <a className={classes.mediaLink} href={currentItem.url} target="_blank" download>
                    Скачать файл
                  </a>
                }
                mb={24}
              />
              <MediaSummaryItem
                name="Последнее редактирование"
                value={fileDateFormat(currentItem.updatedAt)}
              />
            </>
          )}

          {!currentItem && (
            <>
              <Skeleton height={24} mb={24} />
              <Skeleton height={24} mb={24} />
              <Skeleton height={24} mb={24} />
              <Skeleton height={24} mb={24} />
              <Skeleton height={24} />
            </>
          )}
        </ScrollArea>
      </Box>
    </Box>
  );
};

export default MediaSummary;
