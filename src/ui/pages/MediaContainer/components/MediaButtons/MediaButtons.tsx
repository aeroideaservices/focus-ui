import { FileSizeEnum } from '@/types';

import { FC, useContext, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Box, Button, FileButton, Flex, Group } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconCloudDownload, IconFolder } from '@tabler/icons-react';

import { getFileSize } from '@/utils/getFileSize';
import { getFilesSize } from '@/utils/getFilesSize';
import notify from '@/utils/notify';

import { validationTexts } from '@/constants/validationTexts';

import ModalConfirm from '@/ui/organisms/ModalConfirm/ModalConfirm';

import { MediaContext } from '../../utils/mediaContext';
import ModalAddFolder from '../ModalAddFolder/ModalAddFolder';
import ModalMove from '../ModalMove/ModalMove';
import ModalRenameFile from '../ModalRenameFile/ModalRenameFile';
import ModalRenameFolder from '../ModalRenameFolder/ModalRenameFolder';

import { AppDispatch } from '@/store';
import { fetchGetFolders, setMoveInFolder } from '@/store/slices/media/media';
import {
  fetchAddFiles,
  fetchDelFile,
  selectCurrentFile,
  selectDelFileModal,
  selectMoveFoleModal,
  setDelFileModalOpened,
  setMoveFileModalOpened,
  setRenameFileModalOpened,
} from '@/store/slices/media/mediaFiles';
import {
  fetchDelFolder,
  selectCurrentFolder,
  selectDelFolderModal,
  setAddFolderModalOpened,
  setDelFolderModalOpened,
  setRenameFodlerModalOpened,
} from '@/store/slices/media/mediaFolders';
import { selectCurrentService } from '@/store/slices/service/service';

const MediaButtons: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { onReload } = useContext(MediaContext);
  const resetRef = useRef<() => void>(null);
  const mqMatch = useMediaQuery('(min-width: 1445px)');

  const { folderId } = useParams();
  const currentFolder = useSelector(selectCurrentFolder);
  const currentFile = useSelector(selectCurrentFile);
  const delFolderModal = useSelector(selectDelFolderModal);
  const delFileModal = useSelector(selectDelFileModal);
  const moveFileModal = useSelector(selectMoveFoleModal);
  const service = useSelector(selectCurrentService);

  const clearFile = () => {
    resetRef.current?.();
  };

  const addFilesHandler = async (files: File[]) => {
    const filteredFiles = files.filter((file) => getFileSize(file.size, FileSizeEnum.MB) < 10);
    const firstTenFiles = filteredFiles.slice(0, 10);

    if (getFilesSize(firstTenFiles, FileSizeEnum.MB) < 100 && service) {
      await dispatch(fetchAddFiles({ files: firstTenFiles, folderId: folderId }));
      onReload();
      clearFile();
    } else {
      notify({ message: validationTexts.MAX_SIZE(100), type: 'error' });
    }
  };

  const renameHandler = () => {
    if (currentFolder) dispatch(setRenameFodlerModalOpened(true));
    if (currentFile) dispatch(setRenameFileModalOpened(true));
  };

  const delClickHandler = () => {
    if (currentFolder) dispatch(setDelFolderModalOpened(true));
    if (currentFile) dispatch(setDelFileModalOpened(true));
  };

  const delConfirmHandler = async () => {
    if (currentFile?.id && service) await dispatch(fetchDelFile({ id: currentFile.id }));
    if (currentFolder?.id && service) await dispatch(fetchDelFolder({ id: currentFolder?.id }));
    onReload();
  };

  const moveClickHandler = async () => {
    await dispatch(fetchGetFolders());
    dispatch(setMoveFileModalOpened(true));
  };

  return (
    <Box
      sx={(theme) => ({
        background: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2],
        borderRadius: 6,
        padding: 16,
      })}
    >
      <Flex justify="space-between" wrap="wrap" mb={-8}>
        <Group spacing={mqMatch ? 8 : 5} mb={8}>
          <FileButton resetRef={resetRef} onChange={addFilesHandler} name="files" multiple>
            {(props) => (
              <Button
                title="Загрузить"
                leftIcon={mqMatch ? <IconCloudDownload size={20} /> : null}
                miw={168}
                {...props}
              >
                Загрузить
              </Button>
            )}
          </FileButton>
          <Button
            title="Создать папку"
            leftIcon={mqMatch ? <IconFolder size={20} /> : null}
            onClick={() => dispatch(setAddFolderModalOpened(true))}
            miw={168}
          >
            Создать папку
          </Button>
        </Group>

        <Group
          sx={{ visibility: currentFolder || currentFile ? 'initial' : 'hidden' }}
          spacing={mqMatch ? 'sm' : 5}
          mb={8}
        >
          <Button
            title="Переместить"
            variant={'white'}
            color={'dark'}
            onClick={moveClickHandler}
            miw={144}
          >
            Переместить
          </Button>
          <Button
            title="Переименовать"
            variant={'white'}
            color={'dark'}
            onClick={renameHandler}
            miw={144}
          >
            Переименовать
          </Button>
          <Button
            title="Удалить"
            variant={'white'}
            color={'dark'}
            onClick={delClickHandler}
            miw={144}
          >
            Удалить
          </Button>
        </Group>
      </Flex>

      <ModalConfirm
        title="Вы уверены?"
        text="Восстановить данные после удаления не получится"
        opened={delFolderModal || delFileModal}
        onClose={() => {
          dispatch(setDelFolderModalOpened(false));
          dispatch(setDelFileModalOpened(false));
        }}
        confirmHandler={delConfirmHandler}
      />

      <ModalAddFolder />
      <ModalRenameFolder />
      <ModalRenameFile />
      <ModalMove
        opened={moveFileModal}
        onClose={() => {
          dispatch(setMoveFileModalOpened(false));
          dispatch(setMoveInFolder(null));
        }}
      />
    </Box>
  );
};

export default MediaButtons;
