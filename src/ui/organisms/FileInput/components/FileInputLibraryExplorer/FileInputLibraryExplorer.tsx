import { IBreadcrumb, IFileType, IFolderType, ResourceType } from '@/types';

import { FC, useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Grid,
  Overlay,
  ScrollArea,
  Text,
  Title,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { IconChevronLeft, IconRefresh } from '@tabler/icons-react';

import { ServiceCode } from '@/constants/services';

import { LoaderOverlay } from '@/ui/organisms/LoaderOverlay/LoaderOverlay';

import { getAllFolders, getFolder } from '../../utils/mediaRequests';
import FileInputMediaElement from '../FileInputMediaElement/FileInputMediaElement';

const LIBRARY_EXPLORER_DEFAULT_TITLE = 'Выгрузка из медиабиблиотеки';

type TFileExplorerValue = string;

interface FileInputLibraryExplorerProps {
  serviceCode: ServiceCode;
  rootFolderId?: string;
  multiple?: boolean;
  maxFiles?: number;
  onFileSelected: (value: TFileExplorerValue[]) => any;
}

const FileInputLibraryExplorer: FC<FileInputLibraryExplorerProps> = ({
  rootFolderId = null,
  serviceCode,
  onFileSelected,
  multiple = false,
  maxFiles = 100,
}) => {
  const [allFolders, setFolders] = useState<IFolderType[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentFolder, setCurrentFolder] = useState(rootFolderId);
  const [folderName, setFolderName] = useState<string>(LIBRARY_EXPLORER_DEFAULT_TITLE);
  const [breadcrumbs, setBreadcrumbs] = useState<IBreadcrumb[]>([]);
  const [contents, setContents] = useState<(IFileType | IFolderType)[]>([]);
  const [loading, setLoading] = useState(false);
  const [preselect, setPreselect] = useState<string[]>([]);
  const [atBottom, setAtBottom] = useState(false);
  const theme = useMantineTheme();
  const listRef = useRef<HTMLDivElement>(null);

  const fetchContents = async (offset = 0) => {
    setLoading(true);

    const folderData = await getFolder(serviceCode, currentFolder, offset);

    if (folderData) {
      setBreadcrumbs(folderData.breadcrumbs);
      setTotalItems(folderData.total);
      setContents((currentContents) => {
        return [...currentContents, ...folderData.items];
      });
      if (folderData.breadcrumbs.length) setFolderName(folderData.breadcrumbs.slice(-1)[0].name);
      else setFolderName(LIBRARY_EXPLORER_DEFAULT_TITLE);
    }
    setLoading(false);
  };

  const fetchFoldersStructure = async () => {
    setLoading(true);

    const folders = await getAllFolders(serviceCode);

    if (folders && folders.length)
      setFolders(
        folders.map((folder) => ({ resourceType: ResourceType.FOLDER, folderFields: folder }))
      );
    setLoading(false);
  };

  const handleSelect = (id: string, type: ResourceType) => {
    if (type === ResourceType.FOLDER) setCurrentFolder(id);
    if (type === ResourceType.FILE) onFileSelected([id]);
  };

  const handlePreselect = (id: string) => {
    if (preselect.includes(id)) {
      setPreselect(preselect.filter((item) => item !== id));
      return;
    }

    if (maxFiles > preselect.length) {
      if (multiple) {
        setPreselect([...preselect, id]);
      } else {
        setPreselect([id]);
      }
    }
  };

  const handleBack = () => {
    if (breadcrumbs.length < 2) setCurrentFolder(null);
    else setCurrentFolder(breadcrumbs.slice(-2)[0].folderId);
  };

  const currentFolderTree = useMemo(
    () => allFolders.filter((folder) => folder.folderFields.parentFolderId === currentFolder),
    [currentFolder, allFolders]
  );

  const displayItems = useMemo(() => {
    const files = contents.filter((item) => item.resourceType === ResourceType.FILE);

    return [...currentFolderTree, ...files];
  }, [contents]);

  const scrollHandler = (e: { x: number; y: number }) => {
    if (!listRef.current) return;

    const contentsHeight = listRef.current.children[0].clientHeight;
    const viewportHeight = listRef.current.clientHeight;

    if (contentsHeight - e.y < viewportHeight) setAtBottom(true);
    else setAtBottom(false);
  };

  useEffect(() => {
    setContents([]);
    setPreselect([]);
    fetchContents(0);
  }, [currentFolder]);

  useEffect(() => {
    if (!atBottom || loading || totalItems <= contents.length) return;

    fetchContents(contents.length);
  }, [atBottom]);

  useEffect(() => {
    fetchFoldersStructure();
  }, []);

  return (
    <Box pos="relative">
      <Flex align="flex-end" gap="sm" mb="sm">
        {breadcrumbs.length > 0 && (
          <UnstyledButton onClick={handleBack}>
            <IconChevronLeft
              color={
                theme.colorScheme === 'dark'
                  ? theme.colors['jungle-mist'][7]
                  : theme.colors['science-blue'][9]
              }
            />
          </UnstyledButton>
        )}
        <Title size="1.5rem" mb="sm" my={0}>
          {breadcrumbs.length ? folderName : 'Выгрузка из медиабиблиотеки'}
        </Title>
      </Flex>
      <ScrollArea
        h={600}
        offsetScrollbars
        onScrollPositionChange={scrollHandler}
        viewportRef={listRef}
        pos="relative"
      >
        <Grid gutter={10} w="100%">
          {displayItems.map((item) => (
            <Grid.Col
              span={4}
              key={
                item.resourceType === ResourceType.FILE ? item.fileFields.id : item.folderFields.id
              }
            >
              {item.resourceType === ResourceType.FILE ? (
                <FileInputMediaElement
                  resourceType={item.resourceType}
                  id={item.fileFields.id}
                  name={item.fileFields.name}
                  service={serviceCode}
                  onSelect={handleSelect}
                  onPreselect={handlePreselect}
                  selected={preselect.includes(item.fileFields.id)}
                  bg={theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1]}
                  selectable
                />
              ) : (
                <FileInputMediaElement
                  resourceType={item.resourceType}
                  id={item.folderFields.id}
                  name={item.folderFields.name}
                  service={serviceCode}
                  onSelect={handleSelect}
                  bg={theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1]}
                  selectable
                />
              )}
            </Grid.Col>
          ))}
          {!displayItems.length && (
            <Overlay sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Эта папка пуста
            </Overlay>
          )}
        </Grid>
      </ScrollArea>
      <Flex
        pt="xl"
        gap="sm"
        sx={{
          borderTop: `1px solid ${
            theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[2]
          }`,
        }}
        align="center"
      >
        {preselect.length > 0 && (
          <>
            <Box>
              <Text display="inline" color={theme.colors.gray[5]}>
                Выбрано:{' '}
              </Text>
              <Text display="inline">{preselect.length}</Text>
            </Box>
            <Button variant="subtle" onClick={() => setPreselect([])}>
              <Text>Сбросить</Text>
              <Box ml="sm">
                <IconRefresh />
              </Box>
            </Button>
          </>
        )}
        <Button
          disabled={!preselect.length}
          onClick={() => onFileSelected(preselect)}
          ml="auto"
          px="xl"
        >
          Загрузить
        </Button>
      </Flex>

      <LoaderOverlay visible={loading} />
    </Box>
  );
};

export default FileInputLibraryExplorer;
