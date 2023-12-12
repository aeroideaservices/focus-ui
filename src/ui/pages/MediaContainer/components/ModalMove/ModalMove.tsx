import React, { FC, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Button, Divider, Group, Modal, ModalProps, ScrollArea, Text } from '@mantine/core';

import AccordionTree from '@/ui/organisms/AccordionTree/AccordionTree';

import { MediaContext } from '../../utils/mediaContext';

import { AppDispatch } from '@/store';
import { selectFolders, selectMoveInFolder } from '@/store/slices/media/media';
import { fetchMoveFile, selectCurrentFile } from '@/store/slices/media/mediaFiles';
import { fetchMoveFolder } from '@/store/slices/media/mediaFolders';
import { selectCurrentFolder } from '@/store/slices/media/mediaFolders';
import { selectCurrentService } from '@/store/slices/service/service';

const ModalMove: FC<ModalProps> = (props) => {
  const { onReload } = useContext(MediaContext);
  const dispatch: AppDispatch = useDispatch();
  const currentFolder = useSelector(selectCurrentFolder);
  const currentFile = useSelector(selectCurrentFile);
  const folders = useSelector(selectFolders);
  const moveFolder = useSelector(selectMoveInFolder);
  const service = useSelector(selectCurrentService);

  const confirmHandler = async () => {
    if (
      currentFile?.id &&
      typeof moveFolder !== 'string' &&
      moveFolder?.folderFields.id &&
      service
    ) {
      await dispatch(fetchMoveFile({ id: currentFile.id, folderId: moveFolder.folderFields.id }));
    } else if (currentFile?.id && service) {
      await dispatch(fetchMoveFile({ id: currentFile.id, folderId: null }));
    }

    if (
      currentFolder?.id &&
      typeof moveFolder !== 'string' &&
      moveFolder?.folderFields.id &&
      service
    ) {
      await dispatch(
        fetchMoveFolder({ id: currentFolder.id, parentFolderId: moveFolder.folderFields.id })
      );
    } else if (currentFolder?.id && service) {
      await dispatch(fetchMoveFolder({ id: currentFolder.id, parentFolderId: null }));
    }

    onReload();
    props.onClose();
  };

  return (
    <Modal
      {...props}
      centered
      opened={props.opened}
      onClose={props.onClose}
      title={
        <Text fz={22} fw={700}>
          {'Переместить'}
          {moveFolder && typeof moveFolder !== 'string' && (
            <>{` в ${moveFolder.folderFields.name}`}</>
          )}
          {typeof moveFolder === 'string' && <>{' в Корневую папку'}</>}
        </Text>
      }
    >
      <ScrollArea.Autosize h={420}>
        <AccordionTree folders={folders} />
      </ScrollArea.Autosize>

      <Divider my="sm" />

      <Group grow>
        <Button variant="outline" color={'red'} onClick={props.onClose}>
          Отмена
        </Button>
        <Button onClick={confirmHandler} disabled={!moveFolder && typeof moveFolder !== 'string'}>
          Переместить
        </Button>
      </Group>
    </Modal>
  );
};

export default React.memo(ModalMove);
