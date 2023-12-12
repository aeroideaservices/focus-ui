import { FC } from 'react';
import { DraggableProvided } from '@hello-pangea/dnd';
import { ActionIcon, Box, createStyles } from '@mantine/core';
import { IconGripVertical, IconX } from '@tabler/icons-react';

import { MultiSelectDataProps } from '@/ui/organisms/SearchableSelect/utils/getSearchData';

const useStyles = createStyles(() => ({
  item: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 8,
  },
  text: {
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 14,
    padding: '0 10px',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  code: {
    width: '20%',
  },
  name: {
    width: '80%',
  },
  icon: {
    flexShrink: 0,
  },
}));

interface DraggableItemProps {
  provided: DraggableProvided;
  item: MultiSelectDataProps;
  deleteCallback: (key: string) => void;
}

const DraggableItem: FC<DraggableItemProps> = ({ provided, item, deleteCallback }) => {
  const { classes, cx } = useStyles();

  const handleDeleteItem = () => {
    deleteCallback(item.value);
  };

  return (
    <Box
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={classes.item}
    >
      <IconGripVertical size={18} color={'gray'} className={classes.icon} />

      <span className={cx(classes.text, classes.code)}>{item.code}</span>
      <span className={cx(classes.text, classes.name)}>{item.label}</span>

      <ActionIcon onClick={handleDeleteItem} size={18}>
        <IconX size={18} />
      </ActionIcon>
    </Box>
  );
};

export default DraggableItem;
