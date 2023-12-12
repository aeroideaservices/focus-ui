import { ResourceType } from '@/types';

import {
  ChangeEvent,
  Dispatch,
  DragEvent,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActionIcon,
  AspectRatio,
  Box,
  createStyles,
  Flex,
  Grid,
  Group,
  Input,
  InputWrapperProps,
  LoadingOverlay,
  Modal,
  Paper,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { IconPhoto, IconTrash } from '@tabler/icons-react';
import { nanoid } from 'nanoid';

import { ServiceCode } from '@/constants/services';
import { useServices } from '@/hooks/useServices';

import FileInputLibraryExplorer from './components/FileInputLibraryExplorer/FileInputLibraryExplorer';
import FileInputMediaElement from './components/FileInputMediaElement/FileInputMediaElement';
import FileInputMenuButton from './components/FileInputMenuButton/FileInputMenuButton';
import { savefile } from './utils/mediaRequests';

enum FileInputModals {
  EXPLORER,
}

type TLoadingQueue = {
  id: string;
  file: File;
  controller: AbortController;
}[];

type FileInputValue<M extends boolean> = (M extends true ? string[] : string) | null;

const useStyles = createStyles((theme) => ({
  bordersTop: {
    border:
      theme.colorScheme === 'dark'
        ? `1px solid ${theme.colors.gray[8]}`
        : `1px solid ${theme.colors.gray[4]}`,
    borderWidth: '1px 1px 0 1px',
    borderRadius: '4px 4px 0 0',
  },
  bordersBottom: {
    border:
      theme.colorScheme === 'dark'
        ? `1px solid ${theme.colors.gray[8]}`
        : `1px solid ${theme.colors.gray[4]}`,
    borderWidth: '0 1px 1px 1px',
    borderRadius: '0 0 4px 4px',
  },
}));

interface IFileInputProps<M extends boolean = false>
  extends Omit<InputWrapperProps, 'children' | 'onChange'> {
  serviceCode?: ServiceCode;
  value?: (M extends true ? string[] : string) | null;
  onChange?: (value: (M extends true ? string[] : string) | null) => void;
  rootFolderId?: string;
  folderId?: string;
  multiple?: M;
  maxFiles?: number;
}

export function FileInput<M extends boolean = false>({
  value,
  rootFolderId,
  folderId,
  serviceCode,
  onChange,
  multiple,
  maxFiles = 100,
  ...props
}: IFileInputProps<M>) {
  const { classes } = useStyles();
  const [currentValue, setCurrentValue] = useState<FileInputValue<M>>(value || null);
  const [currentModal, setCurrentModal] = useState<FileInputModals | null>(null);
  const [loadingQueue, setLoadingQueue] = useState<TLoadingQueue>([]);
  const [showDropMessage, setShowDropMessage] = useState(false);
  const [maxFilesError, setMaxFilesError] = useState<string | null>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const theme = useMantineTheme();
  const { currentService } = useServices();
  const service = useMemo(
    () => serviceCode || currentService?.code || ServiceCode.CONTENT,
    [serviceCode, currentService]
  );

  const setSingleValue = setCurrentValue as Dispatch<SetStateAction<FileInputValue<false>>>;
  const setMultipleValues = setCurrentValue as Dispatch<SetStateAction<FileInputValue<true>>>;

  const showList = useMemo(() => {
    if (currentValue && multiple) return currentValue.length > 0 || loadingQueue.length > 0;
    else return Boolean(currentValue) || loadingQueue.length > 0;
  }, [currentValue]);

  const filesList: string[] = useMemo(() => {
    if (currentValue instanceof Array) return currentValue as string[];
    if (currentValue) return [currentValue] as string[];
    return [];
  }, [currentValue]);

  const handleAddFiles = (newValue: string[]) => {
    if (multiple) setMultipleValues((values) => (values ? [...values, ...newValue] : newValue));
    else setSingleValue(newValue[0] || null);
    setCurrentModal(null);
  };

  const handleRemoveFile = (fileId: string) => {
    if (currentValue && multiple)
      setMultipleValues((values) => values?.filter((id) => id !== fileId) || null);
    else setCurrentValue(null);
  };

  const handleRemoveQueueItem = (id: string) => {
    const itemToDelete = loadingQueue.find((item) => item.id === id);
    if (itemToDelete) itemToDelete.controller.abort();
    setLoadingQueue((queue) => queue.filter((item) => item.id !== id));
  };

  const handleAddQueueItem = (file: File) => {
    const fileId = nanoid();
    const extension = file.name.split('.').slice(-1)[0] || '';
    const controller = new AbortController();
    const fileToSend = new File([file], `${nanoid()}.${extension}`);

    setLoadingQueue((queue) => [...queue, { id: fileId, file, controller }]);

    if (!multiple) setCurrentValue(null);

    savefile(fileToSend, service, controller, folderId).then((response) => {
      if (response) {
        handleRemoveQueueItem(fileId);
        handleAddFiles([response.id]);
      }
    });
  };

  const handleAddfromDevice = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = [...e.target.files];

    if (multiple) {
      if (maxFiles - filesList.length >= newFiles.length) {
        newFiles.forEach((file) => handleAddQueueItem(file));
      } else {
        setMaxFilesError(`Максимальное число файлов ${maxFiles}`);

        setTimeout(() => {
          setMaxFilesError(null);
        }, 2500);
      }
    } else {
      handleAddQueueItem(newFiles[0]);
    }
  };

  const handleFileDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setShowDropMessage(false);

    if (!e.dataTransfer.files.length) return;

    if (e.dataTransfer.files.length > maxFiles - filesList.length) {
      setMaxFilesError(`Максимальное число файлов ${maxFiles}`);

      setTimeout(() => {
        setMaxFilesError(null);
      }, 2500);

      return;
    }

    if (multiple) {
      [...e.dataTransfer.files].forEach(handleAddQueueItem);
    } else {
      handleAddQueueItem(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDropMessage(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (paperRef.current?.contains(e.relatedTarget as Node)) return;
    setShowDropMessage(false);
  };

  const handleRemoveAll = () => {
    setCurrentValue(null);
  };

  useEffect(() => {
    if (currentValue === value || !onChange) return;
    onChange(currentValue);
  }, [currentValue]);

  useEffect(() => () => loadingQueue.forEach((item) => item.controller.abort()), []);

  return (
    <Input.Wrapper {...props} label={undefined} error={props.error || maxFilesError}>
      <Group position="apart">
        <Input.Label required={props.required}>{props.label}</Input.Label>
        <FileInputMenuButton
          onChooseFromLibrary={() => setCurrentModal(FileInputModals.EXPLORER)}
          onChooseFromdevice={() => fileInputRef.current?.click()}
          onRemoveAll={handleRemoveAll}
          disabled={filesList.length >= maxFiles}
        />
      </Group>

      <Paper
        id={props.id}
        mt={10}
        mb={5}
        p="md"
        pos="relative"
        c={theme.colors.gray[7]}
        sx={{
          width: '100%',
          border: `2px dashed ${
            theme.colorScheme === 'dark'
              ? props.error
                ? theme.colors.red[6]
                : showDropMessage
                ? theme.colors['jungle-mist'][7]
                : theme.colors.gray[8]
              : props.error
              ? theme.colors.red[6]
              : showDropMessage
              ? theme.colors.blue[5]
              : theme.colors.gray[4]
          }`,
          transition: '0.2s',
        }}
        radius="md"
        onDropCapture={handleFileDrop}
        onDragOverCapture={handleDragOver}
        onDragLeaveCapture={handleDragLeave}
        ref={paperRef}
      >
        <Flex mih={268} align="center" justify="center">
          {showList ? (
            <Grid w="100%" sx={{ alignSelf: 'flex-start' }}>
              {filesList.map((file) => (
                <Grid.Col span={4} key={file}>
                  <FileInputMediaElement
                    resourceType={ResourceType.FILE}
                    id={file}
                    service={service}
                    showInfo={false}
                    withBorder={false}
                    className={classes.bordersTop}
                    aspect={1.05}
                  />
                  <Box py={4} px={12} className={classes.bordersBottom} bg={theme.colors.gray[1]}>
                    <ActionIcon
                      p={0}
                      ml="auto"
                      onClick={() => handleRemoveFile(file)}
                      title="Удалить файл"
                    >
                      <IconTrash size="1rem" color={theme.colors.gray[6]} />
                    </ActionIcon>
                  </Box>
                </Grid.Col>
              ))}
              {loadingQueue.length > 0 &&
                loadingQueue.map(({ id }) => (
                  <Grid.Col span={4} key={id}>
                    <Paper bg={theme.colors.gray[2]} withBorder pos="relative">
                      <AspectRatio ratio={1.05}>
                        <LoadingOverlay visible />
                      </AspectRatio>
                    </Paper>
                  </Grid.Col>
                ))}
            </Grid>
          ) : (
            <Flex direction="column" gap="md" align="center">
              <IconPhoto size="4rem" color={theme.colors.gray[5]} />
              <Text color={theme.colors.gray[6]}>Перетащите файлы в эту область</Text>
            </Flex>
          )}
        </Flex>
      </Paper>

      <Modal
        opened={currentModal === FileInputModals.EXPLORER}
        onClose={() => setCurrentModal(null)}
        size="lg"
        centered
        overlayProps={{
          blur: 2,
        }}
      >
        <FileInputLibraryExplorer
          onFileSelected={handleAddFiles}
          serviceCode={service}
          {...{ rootFolderId, multiple }}
          maxFiles={maxFiles - filesList.length}
        />
      </Modal>

      <input
        type="file"
        hidden
        multiple={multiple}
        ref={fileInputRef}
        onChange={handleAddfromDevice}
      />
    </Input.Wrapper>
  );
}
