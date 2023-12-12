import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Box, Flex, ScrollArea } from '@mantine/core';

import { isFileType } from '@/utils/isFileType';

import { MEDIA_LIMIT, MEDIA_OFFSET } from '@/constants/common';
import { STATIC_PARAMS } from '@/constants/media';
import { PLUGIN_PATHS, PluginCode } from '@/constants/plugins';

import { LoaderOverlay } from '@/ui/organisms/LoaderOverlay/LoaderOverlay';
import PageBody from '@/ui/templates/Page/components/PageBody/PageBody';
import PageHeader from '@/ui/templates/Page/components/PageHeader/PageHeader';
import Page from '@/ui/templates/Page/Page';

import MediaButtons from './components/MediaButtons/MediaButtons';
import MediaGroup from './components/MediaGroup/MediaGroup';
import MediaSummary from './components/MediaSummary/MediaSummary';
import { MediaContext } from './utils/mediaContext';

import { AppDispatch } from '@/store';
import {
  fetchGetFolders,
  fetchGetMedia,
  fetchGetMediaMore,
  selectBreadcrumbs,
  selectFetchingGetMedia,
  selectFolders,
  selectMedia,
  selectMediaTotal,
  selectSelectedId,
  setSelectedId,
} from '@/store/slices/media/media';
import { selectFetchingAddFile, setCurrentFile } from '@/store/slices/media/mediaFiles';
import {
  fetchGetRootFolderInfo,
  setCurrentFolder,
  setRootFolder,
} from '@/store/slices/media/mediaFolders';

const MediaContainer: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { folderId } = useParams();
  const viewport = useRef<HTMLDivElement>(null);
  const [scrollPosition, onScrollPositionChange] = useState({ x: 0, y: 0 });
  const mediaFetching = useSelector(selectFetchingGetMedia);
  const filesAddFetching = useSelector(selectFetchingAddFile);
  const mediaItems = useSelector(selectMedia);
  const mediaTotal = useSelector(selectMediaTotal);
  const breadcrumbs = useSelector(selectBreadcrumbs);
  const foldersTree = useSelector(selectFolders);
  const selectedItemId = useSelector(selectSelectedId);
  const [offset, setOffset] = useState(MEDIA_OFFSET);

  const rootFolder = useMemo(
    () => foldersTree?.find((folder) => folder.folderFields.id === folderId),
    [folderId, foldersTree]
  );

  const displayFiles = useMemo(() => mediaItems?.filter(isFileType) || [], [mediaItems]);
  const displayFolders = useMemo(
    () =>
      foldersTree?.filter(({ folderFields: { parentFolderId } }) =>
        folderId ? parentFolderId === folderId : parentFolderId === null
      ) || [],
    [foldersTree]
  );

  const displayItems = useMemo(
    () => [...displayFolders, ...displayFiles],
    [displayFiles, displayFolders, mediaItems]
  );

  const getMoreMedia = () => {
    dispatch(
      fetchGetMediaMore({
        params: {
          limit: MEDIA_LIMIT,
          offset: offset + MEDIA_LIMIT,
          parentFolderId: folderId,
          ...STATIC_PARAMS,
        },
      })
    ).then(() => {
      setOffset((currentOfset) => currentOfset + MEDIA_LIMIT);
    });
  };

  const handleReload = () => {
    if (viewport.current) viewport.current.scrollTop = 0;

    dispatch(setCurrentFile(null));
    dispatch(setCurrentFolder(null));
    dispatch(setSelectedId(null));
    if (folderId) {
      dispatch(fetchGetRootFolderInfo({ id: folderId }));
    } else dispatch(setRootFolder(null));

    dispatch(fetchGetFolders());
    dispatch(
      fetchGetMedia({
        params: {
          limit: MEDIA_LIMIT,
          offset: MEDIA_OFFSET,
          parentFolderId: folderId,
          ...STATIC_PARAMS,
        },
      })
    );

    setOffset(0);
  };

  const handlerScroll = () => {
    const viewportScrollHeight = viewport?.current?.scrollHeight ?? 0;
    const viewportClientHeight = viewport?.current?.clientHeight ?? 0;
    const viewportHeight = viewportScrollHeight - viewportClientHeight;
    const scrollPositionHeight = scrollPosition.y;

    if (
      viewportHeight - scrollPositionHeight < 100 &&
      mediaItems &&
      mediaItems.length < mediaTotal &&
      !mediaFetching
    ) {
      getMoreMedia();
    }
  };

  useEffect(() => {
    handlerScroll();
  }, [viewport, scrollPosition]);

  useEffect(handleReload, [folderId]);

  return (
    <Page>
      <MediaContext.Provider value={{ onReload: handleReload }}>
        <PageHeader
          title={rootFolder?.folderFields.name || 'Медиа библиотека'}
          backLink={
            Boolean(rootFolder)
              ? `${PLUGIN_PATHS[PluginCode.MEDIA]}/${rootFolder?.folderFields.parentFolderId || ''}`
              : undefined
          }
          breadcrumbs={breadcrumbs}
        />

        <PageBody>
          <Flex
            gap="sm"
            sx={{ height: 'calc(100% + 16px)', maxHeight: 'calc(100% + 16px)', overflow: 'hidden' }}
          >
            <Box miw={420} sx={{ flexGrow: 1 }}>
              <Box
                sx={(theme) => ({
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  border:
                    theme.colorScheme === 'dark'
                      ? `1px solid ${theme.colors.dark[5]}`
                      : `1px solid ${theme.colors.gray[1]}`,
                  borderRadius: 6,
                })}
              >
                <MediaButtons />

                <Box h={0} sx={{ flexGrow: 1 }}>
                  <ScrollArea
                    offsetScrollbars
                    h="100%"
                    viewportRef={viewport}
                    onScrollPositionChange={onScrollPositionChange}
                    pos="relative"
                  >
                    <LoaderOverlay visible={mediaFetching || filesAddFetching} />

                    {displayItems.length > 0 && <MediaGroup height={'100%'} items={displayItems} />}
                  </ScrollArea>
                </Box>
              </Box>
            </Box>

            <Box miw={240} sx={{ whiteSpace: 'break-spaces', flexBasis: '25%', flexShrink: 0 }}>
              {selectedItemId && <MediaSummary />}
            </Box>
          </Flex>
        </PageBody>
      </MediaContext.Provider>
    </Page>
  );
};

export default MediaContainer;
