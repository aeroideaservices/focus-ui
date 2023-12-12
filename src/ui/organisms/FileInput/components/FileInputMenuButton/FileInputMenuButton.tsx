import { FC, useState } from 'react';
import { Button, Flex, Menu, useMantineTheme } from '@mantine/core';
import {
  IconChevronDown,
  IconChevronUp,
  IconFolder,
  IconMenu2,
  IconTrash,
  IconUpload,
} from '@tabler/icons-react';

interface FileInputMenuButtonProps {
  onChooseFromLibrary: () => void;
  onChooseFromdevice: () => void;
  onRemoveAll: () => void;
  className?: string;
  disabled?: boolean;
}

const FileInputMenuButton: FC<FileInputMenuButtonProps> = ({
  onChooseFromLibrary,
  onChooseFromdevice,
  onRemoveAll,
  className,
  disabled = false,
}) => {
  const [opened, setOpened] = useState(false);
  const { colors, shadows } = useMantineTheme();

  return (
    <Menu opened={opened} onChange={setOpened} shadow={shadows.xs} withinPortal={true}>
      <Menu.Target>
        <Button size="xs" className={className}>
          <Flex gap="0.5rem" align="center">
            <IconMenu2 color="#fff" size="1.25rem" />
            {opened ? <IconChevronUp size="1rem" /> : <IconChevronDown size="1rem" />}
          </Flex>
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          icon={<IconFolder size="1rem" color={colors['jungle-mist'][3] || 'white'} />}
          onClick={onChooseFromLibrary}
          closeMenuOnClick
          disabled={disabled}
        >
          Выбрать из медиабиблиотеки
        </Menu.Item>
        <Menu.Item
          icon={<IconUpload size="1rem" color={colors['jungle-mist'][3] || 'white'} />}
          onClick={onChooseFromdevice}
          closeMenuOnClick
          disabled={disabled}
        >
          Загрузить с устройства
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          icon={<IconTrash size="1rem" color={colors['jungle-mist'][3] || 'white'} />}
          onClick={onRemoveAll}
          closeMenuOnClick
        >
          Удалить все
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default FileInputMenuButton;
