import { IFolderTree, IFolderType } from '@/types';

import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { Accordion, AccordionControlProps, Box, Group, Text, UnstyledButton } from '@mantine/core';
import { IconChevronRight, IconCornerDownRight } from '@tabler/icons-react';

import { getFolderTree } from '@/ui/pages/MediaContainer/utils/getFolderTree';

import { AppDispatch } from '@/store';
import { setMoveInFolder } from '@/store/slices/media/media';

interface IAccordionTree {
  folders: IFolderType[] | null;
}

interface IAccordionControl extends AccordionControlProps {
  folder: IFolderTree | null;
}

const AccordionTree: FC<IAccordionTree> = ({ folders }) => {
  const dispatch: AppDispatch = useDispatch();

  if (!folders) return null;
  const foldersTree = getFolderTree(folders);

  const AccordionControl: FC<IAccordionControl> = ({ folder }) => {
    return (
      <Group spacing="xs" maw={'100%'} noWrap>
        <UnstyledButton
          py={15}
          onClick={() =>
            folder ? dispatch(setMoveInFolder(folder)) : dispatch(setMoveInFolder(''))
          }
        >
          <Group spacing={'xs'} noWrap sx={{ flexShrink: 1 }}>
            <IconCornerDownRight size={16} />
            {folder && <Text truncate>{folder.folderFields.name}</Text>}
            {!folder && <Text>Корневая папка</Text>}
          </Group>
        </UnstyledButton>

        {folder && folder.children && (
          <Group spacing={2} noWrap>
            <Box sx={{ flexShrink: 0 }}>
              <Text color={'dimmed'}>({folder.children.length})</Text>
            </Box>
            <Box>
              <Accordion.Control w={30} p={0} pl={3} />
            </Box>
          </Group>
        )}
      </Group>
    );
  };

  const buildTree = (tree: IFolderTree[], root?: boolean) => {
    return (
      <Accordion
        chevronPosition="left"
        chevron={<IconChevronRight size={16} />}
        styles={{
          chevron: {
            marginRight: 0,
            '&[data-rotate]': {
              transform: 'rotate(90deg)',
            },
          },
        }}
      >
        {root && (
          <Accordion.Item value={''}>
            <AccordionControl folder={null} />
          </Accordion.Item>
        )}

        {tree.map((folder) => {
          return (
            <Accordion.Item key={folder.folderFields.id} value={folder.folderFields.id}>
              <AccordionControl folder={folder} />
              {folder.children && <Accordion.Panel>{buildTree(folder.children)}</Accordion.Panel>}
            </Accordion.Item>
          );
        })}
      </Accordion>
    );
  };

  return foldersTree && buildTree(foldersTree, true);
};

export default React.memo(AccordionTree);
